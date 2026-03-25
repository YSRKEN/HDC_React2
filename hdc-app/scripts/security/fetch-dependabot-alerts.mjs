import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const REPOSITORY = 'YSRKEN/HDC_React2';
const reportDir = path.resolve(process.cwd(), 'security-reports');
const outputPath = path.join(reportDir, 'dependabot-alerts-open.json');
const preferredGhPath = process.env.GH_EXE ?? 'C:\\Program Files\\GitHub CLI\\gh.exe';
const ghBin = existsSync(preferredGhPath) ? preferredGhPath : 'gh';
const ghConfigDir = process.env.GH_CONFIG_DIR ?? path.join(reportDir, '.gh-config');
const MAX_BUFFER_BYTES = 50 * 1024 * 1024;

mkdirSync(reportDir, { recursive: true });
mkdirSync(ghConfigDir, { recursive: true });

const writeSkippedReport = reason => {
  writeFileSync(
    outputPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        repository: REPOSITORY,
        skipped: true,
        reason,
        alerts: []
      },
      null,
      2
    )
  );
};

let token = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;
if (!token) {
  try {
    token = execFileSync(ghBin, ['auth', 'token'], {
      encoding: 'utf8',
      env: { ...process.env },
      maxBuffer: MAX_BUFFER_BYTES
    }).trim();
  } catch (_error) {
    token = '';
  }
}

if (!token) {
  writeSkippedReport('GH_TOKEN もしくは GITHUB_TOKEN が未設定のため取得をスキップしました。');
  console.warn('[security] GH token が未設定のため Dependabot alerts 取得をスキップしました。');
  process.exit(0);
}

const env = {
  ...process.env,
  GH_CONFIG_DIR: ghConfigDir,
  GH_TOKEN: token
};

let rawResponse = '';
try {
  rawResponse = execFileSync(
    ghBin,
    ['api', `repos/${REPOSITORY}/dependabot/alerts`, '--paginate', '--slurp'],
    { encoding: 'utf8', env, maxBuffer: MAX_BUFFER_BYTES }
  );
} catch (error) {
  const stderr = String(error?.stderr ?? '');
  const stdout = String(error?.stdout ?? '');
  const responseText = `${stdout}\n${stderr}`;
  const isPermissionError =
    responseText.includes('Resource not accessible by integration') ||
    responseText.includes('HTTP 403');

  if (isPermissionError) {
    writeSkippedReport(
      'トークン権限不足（HTTP 403）のため Dependabot alerts 取得をスキップしました。security-events: read 権限付きトークンで再実行してください。'
    );
    console.warn('[security] Dependabot alerts の取得権限が不足しているため、比較対象なしで続行します。');
    process.exit(0);
  }

  throw error;
}

const pages = JSON.parse(rawResponse);
const allAlerts = Array.isArray(pages) ? pages.flat() : [];
const openAlerts = allAlerts.filter(alert => alert?.state === 'open');

const normalizedAlerts = openAlerts.map(alert => ({
  number: alert.number,
  state: alert.state,
  created_at: alert.created_at,
  updated_at: alert.updated_at,
  html_url: alert.html_url,
  manifest_path: alert.dependency?.manifest_path ?? null,
  dependency_scope: alert.dependency?.scope ?? null,
  dependency_relationship: alert.dependency?.relationship ?? null,
  ecosystem:
    alert.dependency?.package?.ecosystem ??
    alert.security_vulnerability?.package?.ecosystem ??
    null,
  package:
    alert.dependency?.package?.name ??
    alert.security_vulnerability?.package?.name ??
    null,
  severity: alert.security_vulnerability?.severity ?? null,
  summary: alert.security_advisory?.summary ?? null,
  fixed_in: alert.security_vulnerability?.first_patched_version?.identifier ?? null
}));

const summaryBySeverity = normalizedAlerts.reduce((acc, alert) => {
  const severity = alert.severity ?? 'unknown';
  acc[severity] = (acc[severity] ?? 0) + 1;
  return acc;
}, {});

const report = {
  generatedAt: new Date().toISOString(),
  repository: REPOSITORY,
  count: normalizedAlerts.length,
  summaryBySeverity,
  alerts: normalizedAlerts
};

writeFileSync(outputPath, JSON.stringify(report, null, 2));
console.log(`[security] Dependabot open alerts: ${normalizedAlerts.length}`);
