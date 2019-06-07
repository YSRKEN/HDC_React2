import * as React from 'react';
import {SelectButtonGroup as SBG} from '../component/SelectButtonGroup';

const SelectButtonGroup: React.FC<{
	nameList: string[],			// 表示名一覧
	firstSelectName: string,	// 最初に選択する名前
	className?: string,			// ButtonGroupに設定するclass
	// 選択されている方のボタン色
	selectedColorType?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark',
	// 切り替えた際のコールバック
	callback: (value: string) => void
}> = ({
	nameList,
	firstSelectName,
	className,
	selectedColorType = 'primary',
	callback
}) => {
	// 関数を定義する
	const onClickFunc = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		// ボタンの名前を読み取る
		const buttonName = e.currentTarget.textContent;
		if (buttonName === null) {
			return;
		}

		// 場合によって選択肢を切り替える
		if (selectName !== buttonName) {
			setSelectName(buttonName);
			callback(buttonName);
		}
	}

	// Hooksを設定する
	const [selectName, setSelectName] = React.useState(firstSelectName);

	// レンダリングする
	return (<SBG className={className} nameList={nameList}
		selectName={selectName} selectedColorType={selectedColorType}
		onClickFunc={onClickFunc}/>);
}

export default SelectButtonGroup;
