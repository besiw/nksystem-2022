import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import allRequests, { requestNBK } from 'api/allRequests';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MailCompose from 'app/shared-components/MailCompose';
import SelectContact from 'app/shared-components/SelectContact';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';

const Email = props => {
	const dispatch = useDispatch();
	const { projectId, closeDialog, selectedWorkflowId } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [ccProjectLeader, setCCProjectLeader] = useState(false);
	const [defaultEmail, setDefaultEmail] = useState({});
	const [contactId, setContactId] = useState(null);
	const getEmailTemplate = () => {
		setIsLoading(true);
		const body = {
			ProjectWorkflow: {
				ProjectId: `${projectId}`,
				WorkflowId: '1',
				WorkflowStepId: '8',
				IsTransfer: 'False'
			}
		};

		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s9getEmail,
			body
		})
			.then(res => {
				const { projectWorkflow } = res;
				setDefaultEmail(projectWorkflow);
				setIsLoading(false);

				/* setFields(res) */
			})
			.catch(error => {
				/*                 setIsLoading(false)
                const msg = generateErrorMessage({ action: 'getEmailTemplate', errorMessage: error.message })
                dispatch(addError(msg)) */
			});
	};

	useEffect(() => {
		/*         getFields() */
		getEmailTemplate();
	}, [projectId]);

	const submitWf1S1 = email => {
		const tosend = {
			ProjectId: `${projectId}`,
			WorkflowId: '1',
			WorkflowStepId: '8',
			IsTransfer: 'False',
			emailContent: email.message,
			emailSubject: email.subject,
			emailTo: email.to,
			emailFrom: defaultEmail.emailFrom,
			ServiceWorkflowCategoryID: selectedWorkflowId
		};
		if (ccProjectLeader === true) {
			tosend.projectLeaderEmailTo = defaultEmail.projectLeaderEmailTo;
		}
		setIsLoading(true);
		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s9postEmail,
			body: {
				ProjectWorkflow: tosend
			}
		})
			.then(res => {
				dispatch(showMessage({ message: res.message }));
				closeDialog();
			})
			.catch(error => {
				dispatch(showMessage({ message: error.message }));
			});
	};

	const handleAddProjectLeaderCheckbox = () => {
		setCCProjectLeader(!ccProjectLeader);
	};

	const getProjectLeader = () => {
		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s8getProjectLeader,
			body: { ProjectID: projectId }
		}).then(res => {
			setContactId(res.projectLeader.projectLeaderID);
			return res.projectLeader;
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

	return (
		<div>
			<SelectContact onChange={setContactId} value={contactId} />
			<Button className="my-24" variant="contained" color="primary" onClick={handleSubmit} disabled={!contactId}>
				Add
			</Button>
			<Divider className="mb-24" />
			<div className="flex w-full justify-end">
				<FormControlLabel
					aria-label="Kopier til prosjektleder"
					onChange={handleAddProjectLeaderCheckbox}
					value={ccProjectLeader}
					control={<Checkbox />}
					label="Kopier til prosjektleder"
				/>
			</div>
			<MailCompose
				defaultEmail={{
					from: defaultEmail.emailFrom || '',
					to: defaultEmail.emailTo || '',
					bcc: '',
					subject: defaultEmail.emailSubject || '',
					message: defaultEmail.emailContent || ''
				}}
				submitEmail={submitWf1S1}
			/>
		</div>
	);
};

export default Email;
