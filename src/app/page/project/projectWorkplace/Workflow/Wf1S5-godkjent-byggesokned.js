import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import allRequests, { requestNBK } from 'api/allRequests';
import MailCompose from 'app/shared-components/MailCompose';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';

const Email = ({ projectId, closeDialog, selectedWorkflowId }) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [defaultEmail, setDefaultEmail] = useState({});

	const getEmailTemplate = () => {
		setIsLoading(true);
		const body = {
			ProjectWorkflow: {
				ProjectId: `${projectId}`,
				WorkflowId: '1',
				WorkflowStepId: '4',
				IsTransfer: 'False'
			}
		};

		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s4get,
			body,
			dispatch
		}).then(res => {
			const { projectWorkflow } = res;
			setDefaultEmail(projectWorkflow);
			setIsLoading(false);
		});
	};

	useEffect(() => {
		getEmailTemplate();
	}, [projectId]);

	const submitWf1S4 = email => {
		const tosend = {
			ProjectId: `${projectId}`,
			WorkflowId: '1',
			WorkflowStepId: '4',
			IsTransfer: 'False',
			emailContent: email.message,
			emailSubject: email.subject,
			emailTo: email.to,
			emailFrom: defaultEmail.emailFrom,
			ServiceWorkflowCategoryID: selectedWorkflowId
		};
		setIsLoading(true);
		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s4post,
			body: {
				ProjectWorkflow: tosend
			}
		})
			.then(res => {
				dispatch(showMessage({ message: res.message }));
				closeDialog();
				/*             setIsLoading(false)
                const msg = generateInfoMessage('Updated template successfully')
                dispatch(addInfo(msg))
                return getEmailTemplate() */
			})
			.catch(error => {
				/*            const msg = generateErrorMessage({ action: 'updating template', errorMessage: error.message })
                dispatch(addError(msg)) */
			});
	};
	return (
		<MailCompose
			defaultEmail={{
				from: defaultEmail.emailFrom || '',
				to: defaultEmail.emailTo || '',
				cc: '',
				bcc: '',
				subject: defaultEmail.emailSubject || '',
				message: defaultEmail.emailContent || ''
			}}
			submitEmail={submitWf1S4}
		/>
	);
};

export default Email;
