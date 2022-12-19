import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
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
