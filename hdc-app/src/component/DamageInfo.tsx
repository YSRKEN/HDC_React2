import React from 'react';

const DamageInfo: React.FC<{
	damageInfo: string
}> = ({damageInfo}) => (
	<div className='border p-3'>
		{damageInfo}
	</div>
);

export {DamageInfo};
