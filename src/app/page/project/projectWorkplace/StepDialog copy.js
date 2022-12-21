/* import { useForm } from '@fuse/hooks'; */
import { useForm, Controller } from 'react-hook-form';
import { lazy } from 'react';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Redirect } from 'react-router-dom';

function AppDialog(props) {
	const { title, closeDialog, isDialogOpen, content } = props;

	function closeComposeDialog() {
		closeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			open={isDialogOpen}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="md"
		>
			{isDialogOpen && (
				<>
					<AppBar position="static" className="shadow-md">
						<Toolbar className="flex w-full">
							<Typography variant="subtitle1" color="inherit">
								{title}
							</Typography>
						</Toolbar>
					</AppBar>
					<DialogContent>{content}</DialogContent>
				</>
			)}
		</Dialog>
	);
}

export default AppDialog;
