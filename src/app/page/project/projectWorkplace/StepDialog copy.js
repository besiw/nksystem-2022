/* import { useForm } from '@fuse/hooks'; */
import { useForm, Controller } from 'react-hook-form';
import { lazy } from 'react';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
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
