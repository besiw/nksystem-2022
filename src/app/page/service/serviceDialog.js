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
import InputGroup from 'app/shared-components/InputGroup';
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
import EditSlabService from '../../shared-components/EditSlabService';

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

	const { inputKeys, radioInputKeys, tableHead } = tableConfig;

	const defaultValues = {
		serviceTypeId: 1,
		serviceChargedAs: 1,
		servicePerSlabList: [],
		rate: '0'
	};
	inputKeys.forEach(item => {
		defaultValues[item.id] = '';
	});
	const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
		mode: 'onChange',
		defaultValues
	});
	const id = watch('id');
	const serviceTypeId = watch('serviceTypeId');
	const serviceChargedAs = watch('serviceChargedAs');
	const { isValid, dirtyFields, errors } = formState;
	const resToFormData = res => {
		const formData = {};
		inputKeys.forEach(item => {
			if (item.convertor) {
				formData[item.id] = item.convertor(res[item.id]);
			} else {
				formData[item.id] = res[item.id];
			}
		});
		['serviceTypeId', 'serviceChargedAs', 'servicePerSlabList', 'rate'].forEach(item => {
			formData[item] = res[item];
		});

		return formData;
	};

	const handleActive = row => {
		setActiveRow(row);
	};
	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */

		if (dialogState.type === 'edit' && dialogState.data) {
			const data = resToFormData(dialogState.data);
			reset({ ...data });
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
		const updatedData = { ...dialogState.data, ...data };
		const updatedSlabList = data.servicePerSlabList.map(item => {
			if (item.id === 'isNew') {
				const { id: removeId, ...rest } = item;
				return rest;
			}
			return item;
		});

		updatedData.servicePerSlabList = updatedSlabList;
		// eslint-disable-next-line no-use-before-define
		updatedData.serviceChargedAs = Number(data.serviceChargedAs);
		if (!updatedData.servicePerSlabList) {
			updatedData.servicePerSlabList = [];
		}

		if (dialogState.type === 'new') {
			dispatch(addEntity(updatedData));
		} else {
			dispatch(updateEntity(updatedData));
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
				<DialogContent classes={{ root: 'p-24 ' }}>
					<div className="grid grid-cols-2 gap-24">
						<InputGroup sectionInputKeys={inputKeys} control={control} />
					</div>
					<div className="flex flex-col">
						<InputGroup sectionInputKeys={radioInputKeys} control={control} />
					</div>
					<div>
						{`${serviceChargedAs}` === `1` && (
							<Controller
								control={control}
								name="rate"
								render={({ field }) => {
									return (
										<div>
											<FormLabel component="legend" className="text-14 mb-4">
												Rate
											</FormLabel>
											<TextField variant="outlined" {...field} />
										</div>
									);
								}}
							/>
						)}
						{`${serviceChargedAs}` === `2` && (
							<Controller
								control={control}
								name="servicePerSlabList"
								render={({ field }) => {
									const update = ({ index, data, isNew }) => {
										if (isNew) {
											const list = [...field.value, data];
											field.onChange(list);
										} else {
											const list = [
												...field.value.slice(0, index),
												data,
												...field.value.slice(index + 1)
											];
											field.onChange(list);
											setActiveRow({});
										}
									};
									return (
										<TableContainer>
											<Table sx={{ minWidth: 650 }} aria-label="simple table">
												<TableHead>
													<TableRow>
														<TableCell ialign="left">Antall enheter (Fra)</TableCell>
														<TableCell ialign="left">Antall enheter (Til)</TableCell>
														<TableCell ialign="left">Pris</TableCell>
														<TableCell ialign="left"> </TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{field.value &&
														field.value.map((row, index) => {
															return activeRow.id && activeRow.id === row.id ? (
																<EditSlabService
																	key={shortid()}
																	handleUpdate={data => {
																		update({ data, index });
																	}}
																	handleCancel={() => {
																		setActiveRow({});
																	}}
																	row={row}
																/>
															) : (
																<TableRow
																	key={row.id}
																	sx={{
																		'&:last-child td, &:last-child th': {
																			border: 0
																		}
																	}}
																>
																	<TableCell ialign="left">{row.rangeFrom}</TableCell>
																	<TableCell ialign="left">{row.rangeTo}</TableCell>
																	<TableCell ialign="left">{row.rate}</TableCell>
																	<TableCell
																		ialign="left"
																		onKeyDown={() => {
																			handleActive(row);
																		}}
																		onClick={() => {
																			handleActive(row);
																		}}
																	>
																		Update
																	</TableCell>
																</TableRow>
															);
														})}
													<EditSlabService
														key="add"
														handleUpdate={data => {
															const dummyId = 'isNew';
															data.id = dummyId;
															update({ data, isNew: true });
														}}
													/>
												</TableBody>
											</Table>
										</TableContainer>
									);
								}}
							/>
						)}
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
