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
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
/* import FormControlLabel from '@material-ui/core/FormControlLabel' */
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import appStrings from 'app/strings';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import ContactForm from 'app/shared-components/SelectContact';
import InputGroup from 'app/shared-components/InputGroup';

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
	const profileId = useSelector(({ auth }) => auth.user.data.id);

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
									Mitt Profil
								</Typography>
							</FuseAnimate>
						</div>
					</div>
				</div>
			}
			content={
				<div>
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
			ref={pageLayout}
			innerScroll
			sidebarInner
		/>
	);
}

export default UserProfile;
