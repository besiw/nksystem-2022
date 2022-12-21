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
import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
/* import FormControlLabel from '@mui/material/FormControlLabel' */
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import clsx from 'clsx';
import ChecklistItem from 'app/page/checklist/ChecklistItem';

function ChecklistDialog({
	type,
	defaultValues,
	closeDialog,
	isDialogOpen,
	addProjectChecklist,
	updateProjectChecklist,
	deleteProjectChecklist,
	createProjectChecklistItem,
	updateProjectChecklistItem,
	deleteProjectChecklistItem
}) {
	const [editChecklist, setEditChecklist] = useState(defaultValues);

	const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
		mode: 'onChange',
		defaultValues
	});

	const watchedId = watch('id');
	const checklistItemTemplateList = watch('checklistItemTemplateList');
	const { isValid, dirtyFields, errors } = formState;

	const initDialog = useCallback(() => {
		if (type === 'edit' && defaultValues) {
			reset({ ...defaultValues });
		}

		if (type === 'new') {
			reset({
				...defaultValues
			});
		}
	}, [type, defaultValues, reset]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		initDialog();
	}, [defaultValues]);

	function closeComposeDialog() {
		closeDialog();
	}

	function onSubmit(data) {
		if (type === 'new') {
			addProjectChecklist(data);
		} else if (dirtyFields.title) {
			updateProjectChecklist({ ...defaultValues, ...data });
		}
		closeComposeDialog();
	}

	function handleRemove() {
		deleteProjectChecklist(watchedId);
		closeComposeDialog();
	}
	// isDialogOpen
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
						{type === 'new' ? (
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
								<Button
									variant="contained"
									color="primary"
									type="submit"
									onClick={handleSubmit}
									disabled={!isValid}
								>
									Save
								</Button>
							</DialogActions>
						)}
					</div>
					<div>
						<Controller
							control={control}
							name="checklistItemTemplateList"
							render={props => {
								const { field } = props;
								const currentValue = field.value;

								const handleUpdate = updatedItem => {
									const index = currentValue.findIndex(i => i.id === updatedItem.id);

									const newValue = [
										...currentValue.slice(0, index),
										updatedItem,
										...currentValue.slice(index + 1)
									];

									field.onChange(newValue);
									if (type !== 'new') {
										updateProjectChecklistItem(updatedItem);
									}
								};

								const handleDelete = id => {
									const index = currentValue.findIndex(i => i.id === id);
									const newValue = [
										...currentValue.slice(0, index),
										...currentValue.slice(index + 1)
									];
									field.onChange(newValue);
									if (type !== 'new') {
										deleteProjectChecklistItem(id);
									}
								};

								const handleCreate = newItem => {
									const newValue = [...currentValue, newItem];
									field.onChange(newValue);
									if (type !== 'new') {
										createProjectChecklistItem({
											ChecklistId: defaultValues.id,
											title: newItem.title
										});
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
											checklistId={null}
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

export default ChecklistDialog;
