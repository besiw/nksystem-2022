import { useForm, Controller } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputGroup from 'app/shared-components/InputGroup';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ContactForm from 'app/shared-components/SelectContact';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import allRequests, { requestNBK } from 'api/allRequests';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';

const inputKeys = [
	{
		id: 'emailAddress',
		required: true,
		type: 'text',
		label: 'Email Address'
	},
	{
		id: 'compEmailHost',
		required: true,
		type: 'text',
		label: 'Host'
	},
	{
		id: 'compEmailPort',
		required: true,
		type: 'text',
		label: 'Port'
	}
];

const inputKeysTwo = [
	{
		id: 'compEmailDisplayName',
		required: true,
		type: 'text',
		label: 'Display name'
	},
	{
		id: 'compEmailUserName',
		required: true,
		type: 'text',
		label: 'username'
	},
	{
		id: 'compEmailPassword',
		required: true,
		type: 'password',
		label: 'password'
	}
];
const defaultValues = {};
inputKeys.forEach(item => {
	defaultValues[item.id] = '';
});

inputKeysTwo.forEach(item => {
	defaultValues[item.id] = '';
});

const FolderDialog = ({ companyId, closeDialog }) => {
	/* 	useEffect(() => {
		getData();
	}, []); */

	/* const getData = () => {
		return requestNBK({
			requestConfig: allRequests.userProfile.get,
			body: {
				UserProfileID: profileId
			}
		}).then(res => {
			if (res.userProfile) {
				reset({
					...defaultValues,
					...res.userProfile
				});
			}
		});
	}; */
	const dispatch = useDispatch();
	const originalResRef = useRef(null);
	const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
		mode: 'onChange',
		defaultValues
	});
	useEffect(() => {
		getData();
	}, []);
	const getData = () => {
		return requestNBK({ requestConfig: allRequests.company.get, body: { CompanyID: companyId } }).then(res => {
			if (res.companyProfile) {
				reset({
					...defaultValues,
					...res.companyProfile
				});
				originalResRef.current = res.companyProfile;
			}
		});
	};
	const onSubmit = data => {
		if (originalResRef.current) {
			return requestNBK({
				requestConfig: allRequests.company.update,
				body: {
					companyProfile: {
						...originalResRef.current,
						...data
					}
				}
			})
				.then(res => {
					dispatch(showMessage({ message: 'Successful!' }));
					closeDialog();
					getData();
				})
				.catch(error => {
					console.log(error);
					dispatch(showMessage({ message: 'Something went wrong' }));
				});
		}
		return null;
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="grid grid-cols-2 gap-12 border-b py-12">
				<div>
					<InputGroup control={control} sectionInputKeys={inputKeys} />
				</div>
				<div>
					<InputGroup control={control} sectionInputKeys={inputKeysTwo} />
				</div>
			</div>
			{/* <Controller name="contactId" control={control} render={({ field }) => <ContactForm {...field} />} /> */}
			<Button variant="contained" color="primary" type="submit">
				Update
			</Button>
		</form>
	);
};

export default FolderDialog;
