import { useForm, Controller } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputGroup from 'app/shared-components/InputGroup';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ContactForm from 'app/shared-components/SelectContact';
import { inputKeys, radioInputKeys } from 'app/page/teamInfo/userProfile';
import allRequests, { requestNBK } from 'api/allRequests';
import Button from '@mui/material/Button';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const defaultValues = {};
inputKeys.forEach(item => {
	defaultValues[item.id] = '';
});

const NewUser = ({ companyId, closeDialog }) => {
	const dispatch = useDispatch();
	const [allUsers,setAllUsers]=useState()
	useEffect(() => {
		getData();
	}, []);

	const getData = () => {
		console.log(companyId)
		return requestNBK({
			requestConfig: allRequests.userProfile.all,
			body: {
				companyId
			}
		}).then(res => {
			setAllUsers(res.multiUserProfiles)
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
		<div className='grid grid-cols-2 gap-8'>
			<form onSubmit={handleSubmit(onSubmit)}>
					<div>
						<InputGroup control={control} sectionInputKeys={inputKeys} />
					</div>

				<Button variant="contained" color="primary" type="submit">
					Create
				</Button>
			</form>
			{/*<div>
				<TableBody>

				{allUsers && allUsers.map(({userName, fullName, isAdmin})=>{
					return (
						<TableRow key={userName}>
							<TableCell
								className="p-4 md:p-16"
								component="th"
								scope="row"
								onClick={event => handleClick(n)}
							>
								{userName}
							</TableCell>
							<TableCell
								className="p-4 md:p-16"
								component="th"
								scope="row"
								onClick={event => handleClick(n)}
							>
								{fullName}
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
				
			</div> */}
		</div>
	);
};

export default NewUser;
