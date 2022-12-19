import { useForm, Controller } from 'react-hook-form';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputGroup from 'app/shared-components/InputGroup';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ContactForm from 'app/shared-components/SelectContact';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import allRequests, { requestNBK } from 'api/allRequests';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';

const inputKeys = [
	{
		id: 'folderName',
		required: true,
		type: 'text',
		label: 'Navn'
	}
];
const defaultValues = {};
inputKeys.forEach(item => {
	defaultValues[item.id] = '';
});

const FolderDialog = ({ companyId, closeDialog }) => {
	const dispatch = useDispatch();
	const [isNew, setIsNew] = useState(companyId === 'new');

	useEffect(() => {
		getData();
	}, []);

	const getData = () => {
		return requestNBK({
			requestConfig: allRequests.company.getFolderName,
			body: {
				CompanyID: companyId
			}
		}).then(res => {
			if (res.folderName) {
				reset({
					...defaultValues,
					...res
				});
				setIsNew(false);
			} else {
				setIsNew(true);
			}
		});
	};
	const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
		mode: 'onChange',
		defaultValues
	});

	function onSubmit(data) {
		console.log(isNew);
		if (isNew) {
			requestNBK({
				requestConfig: allRequests.company.addFolderName,
				body: {
					companyId,
					folderName: data.folderName,
					folderPath: `/${data.folderName}`,
					createDate: new Date(),
					isActive: true
				}
			})
				.then(res => {
					dispatch(showMessage({ message: 'Successful!' }));
					getData();
					closeDialog();
				})
				.catch(error => {
					console.log(error);
					dispatch(showMessage({ message: 'Something went wrong' }));
				});
		} else {
			requestNBK({
				requestConfig: allRequests.company.updateFolderName,
				body: {
					...data,
					folderName: data.folderName
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
	}
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<InputGroup control={control} sectionInputKeys={inputKeys} />
			<div className="">
				<Button variant="contained" color="primary" type="submit">
					{isNew ? 'Add' : 'Update'}
				</Button>
			</div>
		</form>
	);
};

export default FolderDialog;
