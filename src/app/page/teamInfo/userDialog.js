/* import { useForm } from '@fuse/hooks'; */
import { useForm, Controller } from 'react-hook-form';

import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Checkbox from '@mui/material/Checkbox';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getInputFields from 'app/shared-components/InputGroup/getInputFields';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useDeepCompareEffect } from '@fuse/hooks';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { ListItem } from '@mui/material/';

import Table from '@mui/material//Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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
