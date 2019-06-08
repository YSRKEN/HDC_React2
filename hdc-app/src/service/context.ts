import { createContext } from 'react';
import { IKammusuSetting } from '../constant';

export interface ISettingContext {
	maxHp: number;
	setMaxHp: (value: number) => void;
	armor: number;
	setArmor: (value: number) => void;
	nowHp: number;
	setNowHp: (value: number) => void;
	graphName: string;
	setGraphName: (value: string) => void;
	finalAttackList: {"key": string, "val": number}[];
	setFinalAttackList: (value: {"key": string, "val": number}[]) => void;
	criticalPer: number;
	setCriticalPer: (value: number) => void;
	kammusuSettingList: IKammusuSetting[];
	setKammusuSettingList: (value: IKammusuSetting[]) => void;
}

export const SettingContext = createContext<ISettingContext>({} as ISettingContext);
