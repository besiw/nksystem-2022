/* import { useForm } from '@fuse/hooks'; */
import { useForm, Controller } from 'react-hook-form';

import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getInputFields from 'app/shared-components/InputGroup/getInputFields';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useDeepCompareEffect } from '@fuse/hooks';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { ListItem } from '@material-ui/core';

import Table from '@material-ui/core//Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import shortid from 'shortid';
import ContactForm from 'app/shared-components/SelectContact';
import InputGroup from 'app/shared-components/InputGroup';
import EditSlabService from '../../shared-components/EditSlabService';
import { inputKeys, radioInputKeys } from './userProfile';

function AppDialog(props) {
	const { tableConfig, title, setSearchText, name, actions, thunkActions } = props;
	const { closeEditDialog, closeNewDialog } = actions;
	const { addEntity, removeEntity, updateEntity } = thunkActions;
	const [activeRow, setActiveRow] = React.useState({});
	const [newRow, setNewRow] = React.useState({});
	const dispatch = useDispatch();
	const dialogState = useSelector(state => {
		return state[`${name}App`].entityDialog;
	});

	const defaultValues = {};
	inputKeys.forEach(item => {
		defaultValues[item.id] = '';
	});
	radioInputKeys.forEach(item => {
		defaultValues[item.id] = '';
	});
	const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
		mode: 'onChange',
		defaultValues
	});
	const id = watch('id');

	const { isValid, dirtyFields, errors } = formState;

	const handleActive = row => {
		setActiveRow(row);
	};
	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */

		if (dialogState.type === 'edit' && dialogState.data) {
			reset(dialogState.data);
		}

		/**
		 * Dialog type: 'new'
		 */
		if (dialogState.type === 'new') {
			reset({
				...defaultValues
			});
		}
	}, [dialogState.data, dialogState.type, reset]);

	useDeepCompareEffect(() => {
		/**
		 *
		 * After Dialog Open
		 */
		if (dialogState.props.open) {
			initDialog();
		}
	}, [dialogState.data, dialogState.props, initDialog]);

	function closeComposeDialog() {
		return dialogState.type === 'edit' ? dispatch(closeEditDialog()) : dispatch(closeNewDialog());
	}

	function onSubmit(data) {
		if (dialogState.type === 'new') {
			dispatch(addEntity(data));
		} else {
			dispatch(updateEntity(data));
		}
		closeComposeDialog();
	}

	function handleRemove() {
		closeComposeDialog();
	}

	const customStyles = {
		// /.....
		menuPortal: provided => ({ ...provided, zIndex: 9999 }),
		menu: provided => ({ ...provided, zIndex: 9999 })
		// /.....
	};

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...dialogState.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="lg"
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{dialogState.type === 'new' ? `New ${title}` : `Edit ${title}`}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: '' }}>
					<div className="grid grid-cols-2 gap-12 border-b py-12">
						<div>
							<InputGroup control={control} sectionInputKeys={inputKeys} />
						</div>
						<Controller
							name="contactId"
							control={control}
							render={({ field }) => <ContactForm {...field} />}
						/>
					</div>
					<div className="grid grid-cols-2 gap-12 py-12">
						<InputGroup control={control} sectionInputKeys={radioInputKeys} />
					</div>
					<div>
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
					</div>
				</DialogContent>
			</form>
		</Dialog>
	);
}

export default AppDialog;
