import { createContext } from 'react';

export interface ISettingContext {
	maxHp: number;
	setMaxHp: (value: number) => void;
	armor: number;
	setArmor: (value: number) => void;
	nowHp: number;
	setNowHp: (value: number) => void;
	finalAttackList: {"key": string, "val": number}[];
	setFinalAttackList: (value: {"key": string, "val": number}[]) => void;
	criticalPer: number;
	setCriticalPer: (value: number) => void;
}

export const SettingContext = createContext<ISettingContext>({} as ISettingContext);
