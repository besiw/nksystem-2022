/* import { useForm } from '@fuse/hooks'; */
import { useForm, Controller } from 'react-hook-form';

import FusePageSimple from '@fuse/core/FusePageSimple';
import allRequests, { requestNBK } from 'api/allRequests';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputGroup from 'app/shared-components/InputGroup';
import {  showMessage } from 'app/store/fuse/messageSlice';
import { useParams, Link } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import shortid from 'shortid';
import StepDialog from 'app/page/project/projectWorkplace/StepDialog';
import { useNavigate } from 'react-router-dom';
import UserDialog from './Dialog/UserDialog';
import FolderDialog from './Dialog/FolderDialog';
import EmailDialog from './Dialog/EmailDialog';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';


const inputKeys = [
	{
		id: 'companyName',
		required: true,
		type: 'text',
		label: 'Navn på selskap'
	},
	{
		id: 'organizationalNumber',
		required: false,
		type: 'text',
		label: 'Org nr.'
	},
	{
		id: 'ownerName',
		required: true,
		type: 'text',
		label: 'Owner name'
	}
];

const addressInputKeys = [
	{
		id: 'address',
		required: true,
		type: 'text',
		label: 'Adresse'
	},
	{
		id: 'postCode',
		required: false,
		type: 'text',
		label: 'Postnummer'
	},
	{
		id: 'postSted',
		required: false,
		type: 'text',
		label: 'Poststed'
	}
];

const contractInputKeys = [
	{
		id: 'telephone',
		required: true,
		type: 'text',
		label: 'Telefonnummer'
	},
	{
		id: 'mobile',
		required: false,
		type: 'text',
		label: 'Mobilnummer'
	},
	{
		id: 'senderEmailAddress',
		required: false,
		type: 'text',
		label: 'E-post'
	}
];

const emailInputKeys = [
	{
		id: 'nameOnEmailAddress',
		required: true,
		type: 'text',
		label: 'Navn på E-post avsender'
	},
	{
		id: 'senderEmailAddress',
		required: false,
		type: 'text',
		label: 'Avsenders e-postadresse'
	}
];

function CompanyProfile(props) {
	const defaultValues = {};
	const routeParams = useParams();
	const navigate = useNavigate()
	const { companyId } = routeParams;
	const isNew = companyId === 'new';
	const [folderName, setFolderName] = useState('');
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogContent, setDialogContent] = useState({ title: '', component: '' });

	inputKeys.forEach(item => {
		defaultValues[item.id] = '';
	});

	addressInputKeys.forEach(item => {
		defaultValues[item.id] = '';
	});

	contractInputKeys.forEach(item => {
		defaultValues[item.id] = '';
	});

	emailInputKeys.forEach(item => {
		defaultValues[item.id] = '';
	});

	const dispatch = useDispatch();
	const profileId = useSelector(({ user }) => {
		console.log(user);
		return user.data.id;
	});

	useEffect(() => {
		if (!isNew) {
			getData();
		}
	}, []);

	const getData = () => {
		return Promise.all([
			requestNBK({ requestConfig: allRequests.company.get, body: { CompanyID: companyId } }).then(res => {
				if (res.companyProfile) {
					reset({
						...defaultValues,
						...res.companyProfile
					});
				}
			}),
			requestNBK({ requestConfig: allRequests.company.getFolderName, body: { CompanyID: companyId } }).then(
				res => {
					setFolderName(res.folderName);
				}
			)
		]);
	};
	const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
		mode: 'onChange',
		defaultValues
	});

	const id = watch('id');
	const companyName = watch('companyName');
	const { isValid, dirtyFields, errors } = formState;
	function onSubmit(data) {
		if (isNew) {
			requestNBK({
				requestConfig: allRequests.company.create,
				body: {
					companyProfile: {
						...data,
						EmailAddress: '',
						CompEmailHost: '',
						CompEmailPort: '',
						CompEmailUserName: '',
						CompEmailPassword: '',
						CompEmailDisplayName: '',
						IsActive: true
					}
				}
			})
				.then(res => {
					console.log(res);
					navigate(`/company/${res.id}`);
					dispatch(showMessage({ message: 'Successful!' }));

					/* getData({}); */
				})
				.catch(error => {
					console.log(error);
					dispatch(showMessage({ message: 'Something went wrong' }));
				});
		} else {
			requestNBK({
				requestConfig: allRequests.company.update,
				body: {
					companyProfile: data
				}
			})
				.then(res => {
					dispatch(showMessage({ message: 'Successful!' }));
					getData();
				})
				.catch(error => {
					console.log(error);
					dispatch(showMessage({ message: 'Something went wrong' }));
				});
		}
	}
	const pageLayout = useRef(null);
	const dialogContentMap = {
		'new-user': {
			title: 'New User',
			component: UserDialog
		},
		'folder-name': {
			title: 'Folder name',
			component: FolderDialog
		},
		'email-config': {
			title: 'E-mail config',
			component: EmailDialog
		}
	};
	const handleOpenDialog = key => {
		if (dialogContentMap[key]) {
			setDialogContent(dialogContentMap[key]);
			setIsDialogOpen(true);
		}
	};
	const handleCloseDialog = () => {
		setIsDialogOpen(false);
	};

	const DialogContentComponent = dialogContent.component;

	return (
		<div>
			<FusePageCarded
				header={
					<div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-32 px-24 md:px-32">
						<Typography
						component={motion.span}
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.2 } }}
						delay={300}
						className="text-24 md:text-32 font-extrabold tracking-tight"
						>
							{companyName}
						</Typography>
						</div>
				}
				content={
					<div className='p-12'>
						<form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
							<div className="flex justify-between">
								<Typography variant="h6">Selvskapinstilling</Typography>
								<Controller
									id="isActive"
									name="isActive"
									control={control}
									render={({ field }) => {
										return (
											<div className="flex items-center">
												<Typography
													className="text-14 font-medium mr-24 cursor-pointer"
													color="inherit"
												>
													Active
												</Typography>
												<Switch
													key={shortid()}
													{...field}
													checked={field.value}
													className="mt-8 mb-16"
													label="Unassign inspector"
													variant="outlined"
													fullWidth
													required
												/>
											</div>
										);
									}}
								/>
							</div>
							{!isNew && (
								<div className="flex mt-16 mb-24">
									<Button
										variant="outlined"
										color="primary"
										onClick={() => handleOpenDialog('new-user')}
									>
										Create Admin user
									</Button>
									<Button
										variant="outlined"
										className="ml-4"
										color="primary"
										onClick={() => handleOpenDialog('folder-name')}
									>
										Folder name
									</Button>
									{/* <Button
										className="ml-4"
										variant="outlined"
										color="primary"
										onClick={() => handleOpenDialog('email-config')}
									>
										Email Config
									</Button> */}
								</div>
							)}
							<div className="grid grid-cols-2 gap-12 border-b">
								<InputGroup control={control} sectionInputKeys={inputKeys} />
							</div>
							<div className="grid grid-cols-2 gap-12 border-b">
								<div>
									<Typography className="text-14 my-24">Address</Typography>
									<InputGroup control={control} sectionInputKeys={addressInputKeys} />
								</div>
								<div>
									<Typography className="text-14 my-24">Kontaktperson</Typography>
									<InputGroup control={control} sectionInputKeys={contractInputKeys} />
								</div>
							</div>
							<Typography className="text-14 my-24">E-postinnstilling</Typography>
							<div className="grid grid-cols-2 gap-12">
								<InputGroup control={control} sectionInputKeys={emailInputKeys} />
							</div>
							<div className="">
								<Button
									variant="contained"
									color="primary"
									type="submit"
									onClick={handleSubmit}
									disabled={!isValid}
								>
									{isNew ? 'Create' : 'Save'}
								</Button>
							</div>
						</form>
					</div>
				}
			/>
			<StepDialog
				isDialogOpen={isDialogOpen}
				closeDialog={handleCloseDialog}
				title={dialogContent.title}
				content={<DialogContentComponent companyId={companyId} closeDialog={handleCloseDialog} />}
			/>
		</div>
	);
}

export default CompanyProfile;
