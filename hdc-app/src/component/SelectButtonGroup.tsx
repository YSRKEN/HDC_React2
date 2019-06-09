import * as React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const SelectButtonGroup: React.FC<{
	className?: string,
	nameList: string[],
	selectName: string,
	selectedColorType?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark',
	onClickFunc: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}> = ({className, nameList, selectName, selectedColorType, onClickFunc}) => (
	<ButtonGroup className={className} role='group'>
		{nameList.map((name, i) => {
			if (name === selectName) {
				return (
					<Button className={`btn-${selectedColorType}`} key={i}
						onClick={onClickFunc}>
						{name}
					</Button>
				);
			} else {
				return (
					<Button className="page-link text-dark d-inline-block" key={i}
						onClick={onClickFunc}>
						{name}
					</Button>
				);
			}
		})}
	</ButtonGroup>
);

export {SelectButtonGroup};
