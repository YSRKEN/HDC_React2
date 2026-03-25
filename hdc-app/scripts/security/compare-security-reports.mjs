import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const reportDir = path.resolve(process.cwd(), 'security-reports');
const dependabotPath = path.join(reportDir, 'dependabot-alerts-open.json');
const auditPath = path.join(reportDir, 'npm-audit-prod.json');
const outputPath = path.join(reportDir, 'security-report-diff.json');

mkdirSync(reportDir, { recursive: true });

const readJson = filePath => JSON.parse(readFileSync(filePath, 'utf8'));

if (!existsSync(auditPath)) {
  throw new Error('[security] npm-audit-prod.json が見つかりません。先に security:audit:prod を実行してください。');
}

const dependabotReport = existsSync(dependabotPath)
  ? readJson(dependabotPath)
  : { generatedAt: null, skipped: true, alerts: [] };
const auditReport = readJson(auditPath);

const dependabotAlerts = Array.isArray(dependabotReport.alerts) ? dependabotReport.alerts : [];
const dependabotMap = new Map(
  dependabotAlerts.map(alert => [
    `${alert.ecosystem ?? 'unknown'}:${alert.package ?? 'unknown'}`,
    {
      severity: alert.severity ?? 'unknown',
      fixed_in: alert.fixed_in ?? null,
      url: alert.html_url ?? null
    }
  ])
);

const vulnerabilities = auditReport.vulnerabilities ?? {};
const auditMap = new Map(
  Object.entries(vulnerabilities).map(([pkgName, vulnerability]) => [
    `npm:${pkgName}`,
    {
      severity: vulnerability.severity ?? 'unknown',
      fixAvailable: vulnerability.fixAvailable ?? false
    }
  ])
);

const onlyInDependabot = [...dependabotMap.entries()]
  .filter(([key]) => !auditMap.has(key))
  .map(([key, value]) => ({ key, ...value }));

const onlyInAudit = [...auditMap.entries()]
  .filter(([key]) => !dependabotMap.has(key))
  .map(([key, value]) => ({ key, ...value }));

const overlap = [...dependabotMap.entries()]
  .filter(([key]) => auditMap.has(key))
  .map(([key, value]) => ({
    key,
    dependabotSeverity: value.severity,
    auditSeverity: auditMap.get(key)?.severity ?? 'unknown',
    fixed_in: value.fixed_in
  }));

const report = {
  generatedAt: new Date().toISOString(),
  dependabot: {
    generatedAt: dependabotReport.generatedAt ?? null,
    skipped: Boolean(dependabotReport.skipped),
    count: dependabotAlerts.length
  },
  npmAudit: {
    generatedAt: auditReport.metadata?.generatedAt ?? null,
    count: Object.keys(vulnerabilities).length
  },
  onlyInDependabot,
  onlyInAudit,
  overlap
};

writeFileSync(outputPath, JSON.stringify(report, null, 2));

console.log(
  `[security] compare completed: overlap=${overlap.length}, onlyInDependabot=${onlyInDependabot.length}, onlyInAudit=${onlyInAudit.length}`
);
