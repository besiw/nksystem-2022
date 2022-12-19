import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import allRequests, { requestNBK } from 'api/allRequests';
import MailCompose from 'app/shared-components/MailCompose';
import PDFViewer from 'app/shared-components/PDFViewer';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';

const urlExpression = 'https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)';
const urlRegex = new RegExp(urlExpression);
const Email = props => {
	const dispatch = useDispatch();
	const { projectId, backToSteps, selectedWorkflowId } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [defaultEmail, setDefaultEmail] = useState({});
	const [pdfPath, setPdfPath] = useState(null);
	const [pdfFile, setFile] = useState(null);
	const getEmailTemplate = () => {
		setIsLoading(true);
		const body = {
			ProjectWorkflow: {
				ProjectId: `${projectId}`,
				WorkflowId: '1',
				WorkflowStepId: '14',
				IsTransfer: 'False'
			}
		};

		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s15getReport,
			body,
			dispatch
		})
			.then(res => {
				if (res.success === false) {
					dispatch(showMessage({ message: res.message }));
				} else {
					const { projectWorkflow } = res;
					console.log(projectWorkflow);
					setDefaultEmail(projectWorkflow);
					// setPdfPath(projectWorkflow.attachmentURL)
					const pdfUrl = projectWorkflow.attachmentURL;
					setPdfPath(pdfUrl);
					setIsLoading(false);
					if (urlRegex) {
						return fetch(pdfUrl)
							.then(response => response.blob())
							.then(response => {
								setFile(response);
								const url = window.URL.createObjectURL(response);
								setPdfPath(url);
								/* download(response.data, file.file_name, content) */
							})
							.catch(error => console.log(error));
					}
				}

				return null;

				/* setFields(res) */
			})
			.catch(error => {
				dispatch(showMessage({ message: error.message }));
				/*                 setIsLoading(false)
                const msg = generateErrorMessage({ action: 'getEmailTemplate', errorMessage: error.message })
                dispatch(addError(msg)) */
			});
	};

	useEffect(() => {
		/*         getFields() */
		getEmailTemplate();

		return () => window.URL.revokeObjectURL(pdfPath);
	}, [projectId]);

	const submitWf1S13 = email => {
		const toSend = {
			ProjectWorkflow: {
				ProjectId: `${projectId}`,
				WorkflowId: '1',
				WorkflowStepId: '14',
				IsTransfer: 'False',
				emailContent: email.message,
				emailSubject: email.subject,
				emailTo: email.to,
				emailFrom: defaultEmail.emailFrom,
				attachmentURL: pdfPath,
				ServiceWorkflowCategoryID: selectedWorkflowId
			}
		};
		setIsLoading(true);
		// toSend

		const formData = new FormData();

		formData.append('file', pdfFile);
		formData.append('request', JSON.stringify(toSend));

		return axios
			.post(allRequests.projectWorkflow.w1s15sendReport.url, formData)
			.then(response => {
				backToSteps();
				dispatch(showMessage({ message: response.data.message }));
				setIsLoading(false);
				return response;
			})
			.catch(error => {
				/*            const msg = generateErrorMessage({ action: 'updating template', errorMessage: error.message })
                dispatch(addError(msg)) */
			});
	};
	return (
		<>
			<MailCompose
				defaultEmail={{
					from: defaultEmail.emailFrom || '',
					to: defaultEmail.emailTo || '',
					cc: '',
					bcc: '',
					subject: defaultEmail.emailSubject || '',
					message: defaultEmail.emailContent || ''
				}}
				submitEmail={submitWf1S13}
			/>
			{pdfPath && <PDFViewer url={pdfPath} />}
		</>
	);
};

export default Email;
