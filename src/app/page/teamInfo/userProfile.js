/* import { useForm } from '@fuse/hooks'; */
import { useForm, Controller } from 'react-hook-form';
import allRequests, { requestNBK } from 'api/allRequests';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React, {  useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import ContactForm from 'app/shared-components/SelectContact';
import InputGroup from 'app/shared-components/InputGroup';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { motion } from 'framer-motion';

export const inputKeys = [
	{
		id: 'designation',
		required: true,
		type: 'text',
		label: 'Tittel'
	},
	{
		id: 'userName',
		required: false,
		type: 'text',
		label: 'Brukernavn'
	},
	{
		id: 'password',
		required: false,
		type: 'password',
		label: 'Passord'
	}
];

export const radioInputKeys = [
	{
		id: 'isActive',
		required: false,
		type: 'radio',
		label: ' Aktiv',
		options: [
			{
				name: 'Ja',
				value: true
			},
			{
				name: 'Nei',
				value: false
			}
		]
	},
	{
		id: 'isAdmin',
		required: false,
		type: 'radio',
		label: 'Admin',
		options: [
			{
				name: 'Ja',
				value: true
			},
			{
				name: 'Nei',
				value: false
			}
		]
	},
	{
		id: 'userTypeId',
		required: false,
		type: 'radio',
		label: 'Brukertype',
		options: [
			{
				name: 'Mobil kontroll app',
				value: 1
			},
			{
				name: 'Desktop kontroll system',
				value: 2
			},
			{
				name: 'Begge',
				value: 3
			}
		]
	}
];
const defaultValues = {};
inputKeys.forEach(item => {
	defaultValues[item.id] = '';
});

function UserProfile(props) {
	const dispatch = useDispatch();
	const profileId = useSelector(({ user }) => user.data.id);

	useEffect(() => {
		getData();
	}, []);

	const getData = () => {
		console.log('getting data');
		return requestNBK({
			requestConfig: allRequests.userProfile.get,
			body: {
				UserProfileID: profileId
			}
		}).then(res => {
			if (res.userProfile) {
				console.log(res);
				reset({
					...defaultValues,
					...res.userProfile
				});
			}
		});
	};
	const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
		mode: 'onChange',
		defaultValues
	});
	const id = watch('id');
	const { isValid, dirtyFields, errors } = formState;

	function onSubmit(data) {
		console.log(data);
		requestNBK({
			requestConfig: allRequests.userProfile.update,
			body: {
				UserProfile: data
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
	const pageLayout = useRef(null);
	console.log(profileId);
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
						Min Profil
					</Typography>
					</div>
			}
			content={
				<div className='p-12'>
					<form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
						{/* <Typography className="text-14 mb-24">Selvskapinstilling</Typography> */}
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
						<div className="mb-24">
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
					</form>
			</div>
			} 
			
			/>
			</div>

	);
}

export default UserProfile;
