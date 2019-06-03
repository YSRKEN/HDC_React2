import React from 'react';
import { DamageInfo as DI } from '../component/DamageInfo';

const DamageInfo: React.FC = () => {
	const [damageInfo] = React.useState('大破率：X%');

	return (<DI damageInfo={damageInfo}/>);
}

export default DamageInfo;
