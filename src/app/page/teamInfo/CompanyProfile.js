/* import { useForm } from '@fuse/hooks'; */
import { useForm, Controller } from 'react-hook-form';
import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageSimple from '@fuse/core/FusePageSimple';
import allRequests, { requestNBK } from 'api/allRequests';
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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
/* import FormControlLabel from '@material-ui/core/FormControlLabel' */
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputGroup from 'app/shared-components/InputGroup';
import appStrings from 'app/strings';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import DialogWrapper from 'app/page/project/projectWorkplace/StepDialog';
import EmailDialogContent from './EmailDialog';

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
		label: appStrings.company_name
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

function CompanyProfile(props) {
	const defaultValues = {};
	inputKeys.forEach(item => {
		defaultValues[item.id] = '';
	});

	addressInputKeys.forEach(item => {
		defaultValues[item.id] = '';
	});

	contractInputKeys.forEach(item => {
		defaultValues[item.id] = '';
	});

	const dispatch = useDispatch();
	const companyId = useSelector(({ auth }) => auth.user.data.companyId);

	const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
		mode: 'onChange',
		defaultValues
	});
	const id = watch('id');
	const { isValid, dirtyFields, errors } = formState;
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	useEffect(() => {
		getData();
	}, [companyId]);

	const getData = () => {
		return requestNBK({
			requestConfig: allRequests.company.get,
			body: {
				companyId
			}
		})
			.then(res => {
				console.log(res.companyProfile);
				if (res.companyProfile) {
					reset({
						...defaultValues,
						...res.companyProfile
					});
				}
			})
			.catch(error => {
				dispatch(showMessage({ message: error.message }));
			});
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
	};

	function onSubmit(data) {
		return requestNBK({
			requestConfig: allRequests.company.update,
			body: {
				companyProfile: data
			}
		})
			.then(res => {
				handleCloseDialog();
				dispatch(showMessage({ message: 'Successful!' }));
				getData();
			})
			.catch(error => {
				console.log(error);
				dispatch(showMessage({ message: 'Something went wrong' }));
			});
	}

	const handleOpenDialog = key => {
		setIsDialogOpen(true);
	};

	const pageLayout = useRef(null);

	return (
		<div>
			<FusePageSimple
				classes={{
					contentWrapper: 'p-0 sm:p-24 h-full',
					content: 'flex flex-col h-full',
					leftSidebar: 'w-256 border-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
					wrapper: 'min-h-0'
				}}
				header={
					<div className="flex flex-1 items-center justify-between p-4 sm:p-24 relative">
						<div className="flex flex-shrink items-center sm:w-224">
							<div className="flex items-center">
								<FuseAnimate animation="transition.expandIn" delay={300}>
									<Icon className="text-32">account_box</Icon>
								</FuseAnimate>
								<FuseAnimate animation="transition.slideLeftIn" delay={300}>
									<Typography variant="h6" className="mx-12 hidden sm:flex">
										Selvskap Instilling
									</Typography>
								</FuseAnimate>
							</div>
						</div>
					</div>
				}
				content={
					<div>
						<form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
							<Typography className="text-14 mb-24">Selvskapinstilling</Typography>

							<div className="grid grid-cols-2 gap-12 border-b">
								<InputGroup control={control} sectionInputKeys={inputKeys} />
							</div>
							<div className="grid grid-cols-2 gap-12">
								<div>
									<Typography className="text-14 my-24">Address</Typography>
									<InputGroup control={control} sectionInputKeys={addressInputKeys} />
								</div>
								<div>
									<Typography className="text-14 my-24">Kontaktperson</Typography>
									<InputGroup control={control} sectionInputKeys={contractInputKeys} />
								</div>
							</div>
							{/* 						<Typography className="text-14 my-24">E-postinnstilling</Typography>
						<div className="grid grid-cols-2 gap-12">
							<InputGroup control={control} sectionInputKeys={emailInputKeys} />
						</div> */}
							<div className="mb-24 flex">
								<Button
									variant="contained"
									color="primary"
									type="submit"
									onClick={handleSubmit}
									disabled={!isValid}
								>
									Save
								</Button>
								<Button
									variant="outlined"
									className="ml-4"
									color="primary"
									onClick={() => handleOpenDialog(true)}
								>
									E-postinnstilling
								</Button>
							</div>
							{/* <EmailDialog /> */}
							<DialogWrapper
								isDialogOpen={isDialogOpen}
								closeDialog={handleCloseDialog}
								title="E-postinnstilling"
								content={
									<EmailDialogContent
										companyId={companyId}
										closeDialog={handleCloseDialog}
										control={control}
									/>
								}
							/>
						</form>
					</div>
				}
				ref={pageLayout}
				innerScroll
				sidebarInner
			/>
		</div>
	);
}

export default CompanyProfile;
