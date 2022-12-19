import { useForm, Controller } from 'react-hook-form';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputGroup from 'app/shared-components/InputGroup';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ContactForm from 'app/shared-components/SelectContact';
import { inputKeys, radioInputKeys } from 'app/page/teamInfo/userProfile';
import allRequests, { requestNBK } from 'api/allRequests';
import Button from '@material-ui/core/Button';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch, useSelector } from 'react-redux';

const defaultValues = {};
inputKeys.forEach(item => {
	defaultValues[item.id] = '';
});

const NewUser = ({ companyId, closeDialog }) => {
	const dispatch = useDispatch();
	useEffect(() => {
		getData();
	}, []);

	const getData = () => {
		return requestNBK({
			requestConfig: allRequests.userProfile.all,
			body: {
				companyId
			}
		}).then(res => {
			console.log(res);
		});
	};
	function onSubmit(data) {
		const dataToSend = {
			...data,
			isActive: true,
			picture: 'NoImage.jpg',
			contactId: 3365,
			IsSystemOwner: false,
			CompanyId: companyId,
			IsAdmin: true,
			userTypeId: 3
		};
		return requestNBK({
			requestConfig: allRequests.userProfile.create,
			body: { userProfile: dataToSend }
		})
			.then(res => {
				closeDialog();
				dispatch(showMessage({ message: 'Successful!' }));
			})
			.catch(error => {
				console.log(error);
				dispatch(showMessage({ message: 'Something went wrong' }));
			});
	}

	const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
		mode: 'onChange',
		defaultValues
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="grid grid-cols-2 gap-12 border-b py-12">
				<div>
					<InputGroup control={control} sectionInputKeys={inputKeys} />
				</div>
				{/* <Controller name="contactId" control={control} render={({ field }) => <ContactForm {...field} />} /> */}
			</div>

			<Button variant="contained" color="primary" type="submit">
				Create
			</Button>
		</form>
	);
};

export default NewUser;
