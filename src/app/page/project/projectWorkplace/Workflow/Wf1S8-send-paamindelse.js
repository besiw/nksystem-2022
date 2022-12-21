import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import allRequests, { requestNBK } from 'api/allRequests';
import SelectContact from 'app/shared-components/SelectContact';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { DateTimePicker } from '@mui/x-date-pickers';
import Typography from '@mui/material/Typography';

const Workflow = props => {
	const dispatch = useDispatch();
	const { projectId, closeDialog, selectedWorkflowId } = props;
	const [contactId, setContactId] = useState(null);
	const [date, setDate] = useState(new Date());
	useEffect(() => {
		Promise.all([getProjectLeader(), getReminderDate()]);
	}, [projectId]);

	const getProjectLeader = () => {
		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s8getProjectLeader,
			body: { ProjectID: projectId }
		}).then(res => {
			setContactId(res.projectLeader.projectLeaderID);
			return res.projectLeader;
		});
	};

	const getReminderDate = () => {
		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s8getReminder,
			body: { ProjectID: projectId }
		}).then(res => {
			const currentDate = new Date(res.contactCustomer.contactCustomerDate);
			const todayDate = new Date();
			if (currentDate < todayDate) {
				setDate(todayDate);
			} else {
				setDate(currentDate);
			}

			// setContactId(res.projectLeader.projectLeaderID);
			// return res.projectLeader;
		});
	};
	const handleSubmit = () => {
		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s8postProjectLeader,
			body: {
				projectLeader: {
					projectId,
					projectLeaderID: contactId
				}
			}
		}).then(res => {
			closeDialog();
			/* setContactId(res.projectLeader.projectLeaderID) */
			return res.projectLeader;
		});
	};
	const updateDate = nr => {
		const currentDate = new Date();
		if (typeof nr === 'number') {
			const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + nr));
			setDate(newDate);
		} else {
			setDate(currentDate);
		}
	};

	const submitDate = () => {
		const toSendDate = date.toISOString();
		const data = {
			ProjectWorkflow: {
				ProjectId: projectId,
				WorkflowId: '1',
				WorkflowStepId: '7',
				IsTransfer: 'False',
				ContactCustomerDate: toSendDate,
				ServiceWorkflowCategoryID: selectedWorkflowId
			}
		};
		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s8postReminder,
			body: data,
			dispatch
		}).then(res => {
			closeDialog();
			/* setContactId(res.projectLeader.projectLeaderID) */
			return res;
		});
	};
	// http://nksystem-dev.eu-north-1.elasticbeanstalk.com/api/ProjectWorkflow/ProjectWFSeven
	console.log(date);
	return (
		<div className="">
			<SelectContact onChange={setContactId} value={contactId} />
			<Button className="my-24" variant="contained" color="primary" onClick={handleSubmit} disabled={!contactId}>
				Add
			</Button>
			<Divider className="mb-24" />
			<Typography className="text-14 font-medium cursor-pointer" color="inherit">
				Kontak tiltakshaver om ... månder
			</Typography>
			{['Today', 3, 6, 9].map(nr => {
				return (
					<Typography
						onClick={() => updateDate(nr)}
						component="button"
						className="text-12 mr-12 cursor-pointer bg-grey-300 rounded p-12 my-12"
						color="inherit"
					>
						{nr}
					</Typography>
				);
			})}
			<DateTimePicker
				label="Dato"
				ampm={false}
				inputVariant="outlined"
				value={date}
				onChange={setDate}
				className="mt-8 mb-16 w-full"
				minDate={new Date()}
			/>
			<div className="flex">
				<Button
					className="my-24"
					variant="contained"
					color="primary"
					onClick={submitDate}
					disabled={date === null}
				>
					Add
				</Button>
				<Button className="my-24 ml-12" variant="contained" onClick={() => setDate(new Date())}>
					Cancel
				</Button>
			</div>
		</div>
	);
};

export default Workflow;
