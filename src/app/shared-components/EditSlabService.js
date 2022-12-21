import React, { useCallback, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

function EditSlabService({ handleUpdate, row, handleCancel }) {
	const defaultData = {
		rangeFrom: 1,
		rangeTo: 2,
		rate: 0
	};
	const [activeRow, setActiveRow] = React.useState(row || defaultData);
	const handleActiveRowFrom = direction => {
		const plus = direction ? 1 : -1;
		const updatedRange = activeRow.rangeFrom + plus;
		if (updatedRange > 0) {
			const updatedRow = { ...activeRow };
			updatedRow.rangeFrom = updatedRange;
			if (activeRow.rangeTo <= updatedRange) {
				updatedRow.rangeTo = updatedRange + 1;
			}

			setActiveRow(updatedRow);
		}
	};

	const handleActiveRowTo = direction => {
		const plus = direction ? 1 : -1;

		const updatedRange = activeRow.rangeTo + plus;
		const updatedRow = { ...activeRow };
		if (updatedRange > updatedRow.rangeFrom) {
			updatedRow.rangeTo = updatedRange;
			setActiveRow(updatedRow);
		}
	};

	const handlePriceChange = e => {
		const { value } = e.target;
		setActiveRow({ ...activeRow, rate: value });
	};

	return (
		<TableRow
			key={activeRow.id}
			sx={{
				'&:last-child td, &:last-child th': {
					border: 0
				}
			}}
		>
			<TableCell ialign="left">
				<ButtonGroup variant="outlined" aria-label="outlined button group">
					<Button
						onClick={() => {
							handleActiveRowFrom(false);
						}}
					>
						{' '}
						-{' '}
					</Button>
					<Button>{activeRow.rangeFrom}</Button>
					<Button
						onClick={() => {
							handleActiveRowFrom(true);
						}}
					>
						{' '}
						+{' '}
					</Button>
				</ButtonGroup>
			</TableCell>
			<TableCell ialign="left">
				<ButtonGroup variant="outlined" aria-label="outlined button group">
					<Button
						onClick={() => {
							handleActiveRowTo(false);
						}}
					>
						{' '}
						-{' '}
					</Button>
					<Button>{activeRow.rangeTo}</Button>
					<Button
						onClick={() => {
							handleActiveRowTo(true);
						}}
					>
						{' '}
						+{' '}
					</Button>
				</ButtonGroup>
			</TableCell>

			<TableCell ialign="left">
				<TextField variant="outlined" onChange={handlePriceChange} value={activeRow.rate} />
			</TableCell>
			<TableCell align="left">
				<div className="flex">
					<Button
						onKeyDown={() => {
							if (!activeRow.id) {
								setActiveRow(defaultData);
							}

							handleUpdate(activeRow);
						}}
						onClick={() => {
							if (!activeRow.id) {
								setActiveRow(defaultData);
							}
							handleUpdate(activeRow);
						}}
					>
						{activeRow.id ? 'Save' : 'Add'}
					</Button>
					{activeRow.id && (
						<Button onKeyDown={handleCancel} onClick={handleCancel}>
							Cancel
						</Button>
					)}
				</div>
			</TableCell>
		</TableRow>
	);
}

export default EditSlabService;
