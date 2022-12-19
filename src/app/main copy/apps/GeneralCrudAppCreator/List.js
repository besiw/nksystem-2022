import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseUtils from '@fuse/utils';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import appStrings from 'app/strings';
import MultiSelectMenu from './MultiSelectMenu';
import Table from './Table';

function List(props) {
	const { openEditDialog, removeEntity, selectEntities, tableConfig } = props;
	const dispatch = useDispatch();
	const { setSearchText, title, name } = props;
	const results = useSelector(selectEntities);
	const searchText = useSelector(state => state[`${name}App`].searchText);

	const [filteredData, setFilteredData] = useState(null);

	const columns = React.useMemo(
		() => [
			{
				Header: ({ selectedFlatRows }) => {
					const selectedRowIds = selectedFlatRows.map(row => row.original.id);

					return (
						selectedFlatRows.length > 0 && (
							<MultiSelectMenu removeEntity={removeEntity} selectedEntityIds={selectedRowIds} />
						)
					);
				},
				accessor: 'avatar',
				Cell: ({ row }) => {
					return null;
				},
				className: 'justify-center',
				width: 64,
				sortable: false
			},
			...tableConfig.tableHead,
			{
				id: 'action',
				width: 128,
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						<IconButton
							onClick={ev => {
								ev.stopPropagation();
								dispatch(removeEntity(row.original.id));
							}}
						>
							<Icon>delete</Icon>
						</IconButton>
					</div>
				)
			}
		],
		[dispatch]
	);

	useEffect(() => {
		function getFilteredArray(entities, _searchText) {
			if (_searchText.length === 0) {
				return results;
			}
			return FuseUtils.filterArrayByString(results, _searchText);
		}
		if (results && Array.isArray(results)) {
			setFilteredData(getFilteredArray(results, searchText));
		}
	}, [results, searchText]);

	if (!filteredData) {
		return null;
	}

	if (filteredData.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					There are no entities!
				</Typography>
			</div>
		);
	}

	return (
		<FuseAnimate animation="transition.slideUpIn" delay={300}>
			<Table
				columns={columns}
				data={filteredData}
				onRowClick={(ev, row) => {
					if (row) {
						dispatch(openEditDialog(row.original));
					}
				}}
			/>
		</FuseAnimate>
	);
}

export default List;
