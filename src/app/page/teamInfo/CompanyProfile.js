/* import { useForm } from '@fuse/hooks'; */
import { useForm } from 'react-hook-form';
import allRequests, { requestNBK } from 'api/allRequests';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputGroup from 'app/shared-components/InputGroup';
import appStrings from 'app/strings';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import DialogWrapper from 'app/page/project/projectWorkplace/StepDialog';
import EmailDialogContent from './EmailDialog';
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
	const theme = useTheme();
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
	const companyId = useSelector(({user}) => user.data.companyId);

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
							Selvskap Instilling
						</Typography>
						</div>
				}
				content={
					<div className='p-12'>
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
			/>

		</div>
	);
}

export default CompanyProfile;
