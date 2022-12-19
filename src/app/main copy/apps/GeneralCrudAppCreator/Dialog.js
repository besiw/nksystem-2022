/* import { useForm } from '@fuse/hooks'; */
import { useForm, Controller } from 'react-hook-form';

import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
/* import FormControlLabel from '@material-ui/core/FormControlLabel' */
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputGroup from 'app/shared-components/InputGroup';

function AppDialog(props) {
	const { tableConfig, title, name, actions, thunkActions } = props;
	const { closeEditDialog, closeNewDialog } = actions;
	const { addEntity, removeEntity, updateEntity } = thunkActions;

	const dispatch = useDispatch();
	const dialogState = useSelector(state => {
		return state[`${name}App`].entityDialog;
	});

	const { inputKeys, tableHead } = tableConfig;
	const defaultValues = {};
	inputKeys.forEach(item => {
		defaultValues[item.id] = '';
	});
	const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
		mode: 'onChange',
		defaultValues
	});
	const id = watch('id');
	console.log(id);
	const { isValid, dirtyFields, errors } = formState;

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (dialogState.type === 'edit' && dialogState.data) {
			reset({ ...dialogState.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (dialogState.type === 'new') {
			reset({
				...defaultValues,
				...dialogState.data
				/* 				id: FuseUtils.generateGUID() */
			});
		}
	}, [dialogState.data, dialogState.type, reset]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (dialogState.props.open) {
			initDialog();
		}
	}, [dialogState.props.open, initDialog]);

	function closeComposeDialog() {
		return dialogState.type === 'edit' ? dispatch(closeEditDialog()) : dispatch(closeNewDialog());
	}

	function onSubmit(data) {
		if (dialogState.type === 'new') {
			dispatch(addEntity(data));
		} else {
			dispatch(updateEntity({ ...dialogState.data, ...data }));
		}
		closeComposeDialog();
	}

	function handleRemove() {
		/* dispatch(removeEntity(watchInput.id)); */
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...dialogState.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{dialogState.type === 'new' ? `New ${title}` : `Edit ${title}`}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<InputGroup sectionInputKeys={inputKeys} control={control} defaultValues={dialogState.data} />

					{dialogState.type === 'new' ? (
						<DialogActions className="justify-between p-8">
							<div className="">
								<Button
									variant="contained"
									color="primary"
									onClick={handleSubmit}
									type="submit"
									disabled={!isValid}
								>
									Add
								</Button>
							</div>
						</DialogActions>
					) : (
						<DialogActions className="justify-between p-8">
							<div className="">
								<Button
									variant="contained"
									color="primary"
									type="submit"
									onClick={handleSubmit}
									disabled={!isValid}
								>
									Save
								</Button>
							</div>
							<IconButton onClick={handleRemove}>
								<Icon>delete</Icon>
							</IconButton>
						</DialogActions>
					)}
				</DialogContent>
			</form>
		</Dialog>
	);
}

export default AppDialog;
