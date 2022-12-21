import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import allRequests, { requestNBK } from 'api/allRequests';
import SelectContact from 'app/shared-components/SelectContact';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { DateTimePicker } from '@mui/x-date-pickers';
import Typography from '@mui/material/Typography';

const Step1Email = props => {
	const { projectId } = props;
	const [date, setDate] = useState(null);
	useEffect(() => {
		getReminderDate();
	}, []);
	const getReminderDate = () => {
		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s8getReminder,
			body: { ProjectID: projectId }
		}).then(res => {
			const newDate = new Date(res.contactCustomer.contactCustomerDate);
			setDate(newDate.toDateString());
			// setContactId(res.projectLeader.projectLeaderID);
			// return res.projectLeader;
		});
	};
	return (
		<div>
			<Typography
				component="button"
				className="text-12 mr-12 cursor-pointer bg-grey-300 rounded p-12 my-12"
				color="inherit"
			>
				{date}
			</Typography>
		</div>
	);
};

export default Step1Email;
