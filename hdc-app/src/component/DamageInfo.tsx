import React from 'react';

const DamageInfo: React.FC<{
	damageInfo: string
}> = ({damageInfo}) => (
	<div className='border p-3'>
		<pre>{damageInfo}</pre>
	</div>
);

export {DamageInfo};
