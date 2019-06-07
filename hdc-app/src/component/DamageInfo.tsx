import React from 'react';

const DamageInfo: React.FC<{
	damageInfo: string
}> = ({damageInfo}) => (
	<ul className='border'>
		{damageInfo.split('\n').map((info, index) => <li key={index}>{info}</li>)}
	</ul>
);

export {DamageInfo};
