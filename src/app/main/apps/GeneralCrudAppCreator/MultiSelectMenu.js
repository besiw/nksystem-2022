import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';


function MultiSelectMenu(props) {
	const {removeEntity}=props
	const dispatch = useDispatch();
	const { selectedEntityIds } = props;

	const [anchorEl, setAnchorEl] = useState(null);

	function openSelectedEntityMenu(event) {
		setAnchorEl(event.currentTarget);
	}

	function closeSelectedEntityMenu() {
		setAnchorEl(null);
	}

	return (
		<>
			<IconButton
				className="p-0"
				aria-owns={anchorEl ? 'selectedEntityMenu' : null}
				aria-haspopup="true"
				onClick={openSelectedEntityMenu}
			>
				<Icon>more_horiz</Icon>
			</IconButton>
			<Menu
				id="selectedContactsMenu"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={closeSelectedEntityMenu}
			>
				<MenuList>
					<MenuItem
						onClick={() => {
							dispatch(removeEntity(selectedEntityIds));
							closeSelectedEntityMenu();
						}}
					>
						<ListItemIcon className="min-w-40">
							<Icon>delete</Icon>
						</ListItemIcon>
						<ListItemText primary="Remove" />
					</MenuItem>
				</MenuList>
			</Menu>
		</>
	);
}

export default MultiSelectMenu;
