/* import { useForm } from '@fuse/hooks'; */
import { useForm, Controller } from 'react-hook-form';

import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Fab from '@mui/material/Fab';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect } from 'react';
import ReactSelect from 'react-select';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
/* import FormControlLabel from '@mui/material/FormControlLabel' */
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import clsx from 'clsx';
import ChecklistItem from './ChecklistItem';

function AppDialog(props) {
	const { tableConfig, title, setSearchText, name, actions, thunkActions } = props;
	const { closeEditDialog, closeNewDialog } = actions;

	const {
		addEntity,
		removeEntity,
		updateEntity,
		addEntityChecklistItem,
		updateEntityChecklistItem,
		removeEntityChecklistItem
	} = thunkActions;

	const dispatch = useDispatch();
	const dialogState = useSelector(state => {
		return state[`${name}App`].entityDialog;
	});

	const { inputKeys, tableHead } = tableConfig;
	const defaultValues = {
		title: '',
		checklistItemTemplateList: []
	};

	const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
		mode: 'onChange',
		defaultValues
	});
	const id = watch('id');
	const checklistItemTemplateList = watch('checklistItemTemplateList');

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
			const toAdd = {
				title: data.title,
				checklistItemTemplateList: checklistItemTemplateList.map(i => ({
					title: i.title
				}))
			};
			dispatch(addEntity(toAdd));
		} else if (dirtyFields.title) {
			dispatch(updateEntity({ ...dialogState.data, ...data }));
		}
		closeComposeDialog();
	}

	function handleRemove() {
		closeComposeDialog();
	}

	const templateOne = [
		{ title: 'Hvilket stadie er v??trommet p???' },
		{ title: 'Sjekk at hovedsluk er plassert i plan og h??yde som prosjektert. ' },
		{ title: 'Er produktene som er blitt benyttet de samme som det er mottatt produktdokumentasjon p???' },
		{
			title:
				'Foreta en visuell kontroll om produktene membran, slukmansjett og slik er benyttet korrekt i henhold til produktdokumentasjon.'
		},
		{ title: 'Er det laget avrenning fra innebygd sisterne eller benyttet godkjent bagl??sning?' },
		{ title: 'Framst??r arbeidene som er utf??rt uten ??penbare avvik?' },
		{
			title:
				'Sjekk at det er samsvar mellom produksjonsunderlaget p?? byggeplass og mottatte tegningslister. (stikkpr??ve)'
		},
		{ title: 'Godkjent fall til sluk?' },
		{ title: 'Eventuelle kommentarer?' }
	];
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...dialogState.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="md"
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{dialogState.type === 'new' ? `New ${title}` : `Edit ${title}`}
					</Typography>
					{dialogState.type === 'new' ? (
						<DialogActions className="justify-between p-8">
							<div className="">
								<Button
									variant="contained"
									onClick={handleSubmit(onSubmit)}
									type="submit"
									disabled={!isValid}
								>
									Add
								</Button>
							</div>
							<div className="">
								<Button
									variant="outlined"
									onClick={() => {
										reset({ title: 'V??trom', checklistItemTemplateList: templateOne });
									}}
									type="submit"
									disabled={!isValid}
								>
									Use template
								</Button>
							</div>
						</DialogActions>
					) : (
						<DialogActions className="justify-between p-8">
							<div className="">
								<Button
									variant="contained"
									type="submit"
									onClick={handleSubmit(onSubmit)}
									disabled={!isValid}
								>
									Save
								</Button>
							</div>
						</DialogActions>
					)}
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex items-center mb-24">
						<Controller
							control={control}
							name="title"
							render={({ field }) => {
								return (
									<TextField {...field} className="mr-20" label="name" variant="outlined" fullWidth />
								);
							}}
						/>
					</div>
					<div>
						<Controller
							control={control}
							name="checklistItemTemplateList"
							render={({ field }) => {
								const currentValue = field.value;
								const handleUpdate = updatedItem => {
									const index = currentValue.findIndex(i => i.id === updatedItem.id);

									const newValue = [
										...currentValue.slice(0, index),
										updatedItem,
										...currentValue.slice(index + 1)
									];

									field.onChange(newValue);
									if (dialogState.type !== 'new') {
										dispatch(updateEntityChecklistItem(updatedItem));
									}
								};

								const handleDelete = deleteId => {
									const index = currentValue.findIndex(i => i.id === deleteId);
									const newValue = [
										...currentValue.slice(0, index),
										...currentValue.slice(index + 1)
									];
									field.onChange(newValue);
									if (dialogState.type !== 'new') {
										dispatch(removeEntityChecklistItem(id));
									}
								};

								const handleCreate = newItem => {
									const newValue = [...currentValue, newItem];
									field.onChange(newValue);
									if (dialogState.type !== 'new') {
										dispatch(addEntityChecklistItem(newItem));
									}
								};
								return (
									<ul>
										{checklistItemTemplateList.map(item => {
											return (
												<ChecklistItem
													{...item}
													key={item.id}
													updateItem={handleUpdate}
													deleteItem={handleDelete}
												/>
											);
										})}
										<ChecklistItem
											checklistId={dialogState.data ? dialogState.data.id : null}
											id={null}
											title={null}
											key="new"
											updateItem={handleCreate}
										/>
									</ul>
								);
							}}
						/>
					</div>
				</DialogContent>
			</form>
		</Dialog>
	);
}

export default AppDialog;
