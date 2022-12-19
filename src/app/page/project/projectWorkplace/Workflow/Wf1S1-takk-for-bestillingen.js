import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import allRequests, { requestNBK } from 'api/allRequests';
import MailCompose from 'app/shared-components/MailCompose';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';

const Email = props => {
	const dispatch = useDispatch();
	const { projectId, closeDialog, updateprojectState, selectedWorkflowId } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [defaultEmail, setDefaultEmail] = useState({});

	const getEmailTemplate = () => {
		setIsLoading(true);
		const body = {
			ProjectWorkflow: {
				ProjectId: `${projectId}`,
				WorkflowId: '1',
				WorkflowStepId: '1',
				IsTransfer: 'False',
				ServiceWorkflowCategoryID: selectedWorkflowId
			}
		};

		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s1get,
			body,
			dispatch
		}).then(res => {
			const { projectWorkflow } = res;
			setDefaultEmail(projectWorkflow);
			setIsLoading(false);
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
			WorkflowStepId: '1',
			IsTransfer: 'False',
			emailContent: email.message,
			emailSubject: email.subject,
			emailTo: email.to,
			emailFrom: defaultEmail.emailFrom,
			ServiceWorkflowCategoryID: selectedWorkflowId
		};
		console.log(tosend);
		setIsLoading(true);
		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s1post,
			body: {
				ProjectWorkflow: tosend
			},
			dispatch
		})
			.then(res => {
				console.log(res);
				setDefaultEmail(tosend);
				closeDialog();
				dispatch(showMessage({ message: res.message }));

				/*             setIsLoading(false)
                const msg = generateInfoMessage('Updated template successfully')
                dispatch(addInfo(msg))
                return getEmailTemplate() */
			})
			.catch(error => {
				console.log(error);
				dispatch(showMessage({ message: error.message }));
				/*                 setIsLoading(false)
			const msg = generateErrorMessage({ action: 'getEmailTemplate', errorMessage: error.message })
			dispatch(addError(msg)) */
			});
	};
	return (
		<MailCompose
			defaultEmail={{
				from: defaultEmail.emailFrom,
				to: defaultEmail.emailTo,
				cc: '',
				bcc: '',
				subject: defaultEmail.emailSubject,
				message: defaultEmail.emailContent
			}}
			submitEmail={submitWf1S1}
		/>
	);
};

export default Email;
