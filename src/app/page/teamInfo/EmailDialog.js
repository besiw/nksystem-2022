import { useFormContext, Controller } from 'react-hook-form';
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

const defaultValues = {};
inputKeys.forEach(item => {
	defaultValues[item.id] = '';
});

inputKeysTwo.forEach(item => {
	defaultValues[item.id] = '';
});

const EmailDialog = ({ companyId, closeDialog, onSubmit, control }) => {
	const dispatch = useDispatch();
	const originalResRef = useRef(null);

	return (
		<form className="py-12">
			<div className="grid grid-cols-2 gap-12 ">
				<div>
					<InputGroup control={control} sectionInputKeys={inputKeys} />
				</div>
				<div>
					<InputGroup control={control} sectionInputKeys={inputKeysTwo} />
				</div>
			</div>
			<div>
				<InputGroup control={control} sectionInputKeys={emailInputKeys} />
			</div>
			{/* <Controller name="contactId" control={control} render={({ field }) => <ContactForm {...field} />} /> */}
			<Button variant="contained" color="primary" type="submit">
				Update
			</Button>
		</form>
	);
};

export default EmailDialog;
