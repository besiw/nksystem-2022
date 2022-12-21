import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import allRequests, { requestNBK } from 'api/allRequests';
import MailCompose from 'app/shared-components/MailCompose';
import PDFViewer from 'app/shared-components/PDFViewer';
import { MyDropzone } from 'app/shared-components/UploadFile/Popup';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';

const urlExpression = 'https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)';
const urlRegex = new RegExp(urlExpression);
const Email = props => {
	const dispatch = useDispatch();
	const { projectId, backToSteps, selectedWorkflowId } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [defaultEmail, setDefaultEmail] = useState({});
	const [pdfPath, setPdfPath] = useState(null);
	const [pdfFile, setFile] = useState(null);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [tabValue, setTabValue] = useState(0);
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	const onDrop = acceptedFiles => {
		setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
		// Do something with the files
	};
	const removeFile = () => {
		setUploadedFiles([]);
	};

	const onSubmitUploadedFile = () => {
		const email = {
			emailContent: '',
			emailSubject: '',
			emailTo: '',
			attachments: uploadedFiles
		};
		return submitWf1S2(email);
	};
	const getEmailTemplate = () => {
		setIsLoading(true);
		const body = {
			ProjectWorkflow: {
				ProjectId: `${projectId}`,
				WorkflowId: '1',
				WorkflowStepId: '2',
				IsTransfer: 'False'
			}
		};

		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s2get,
			body,
			dispatch
		})
			.then(res => {
				const { projectWorkflow } = res;
				console.log(projectWorkflow);
				setDefaultEmail(projectWorkflow);
				// setPdfPath(projectWorkflow.attachmentURL)
				const pdfUrl = projectWorkflow.attachmentURL;
				setPdfPath(pdfUrl);
				setIsLoading(false);
				if (urlRegex) {
					fetch(pdfUrl, { mode: 'cors' })
						.then(response => {
							return response.blob();
						})
						.then(response => {
							setFile(response);
							const url = window.URL.createObjectURL(response);

							setPdfPath(url);
						});
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

	const submitWf1S2 = email => {
		const toSend = {
			ProjectWorkflow: {
				ProjectId: `${projectId}`,
				WorkflowId: '1',
				WorkflowStepId: '2',
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

		if (email.attachments && email.attachments.length > 0) {
			email.attachments.forEach((item, i) => {
				formData.append(`file${i}`, item);
			});
		} else {
			formData.append('file', pdfFile);
		}

		formData.append('request', JSON.stringify(toSend));

		return axios
			.post(allRequests.projectWorkflow.w1s2post.url, formData)
			.then(response => {
				backToSteps();
				dispatch(showMessage({ message: response.data.message }));
				setIsLoading(false);
				return response;
			})
			.catch(error => {
				dispatch(showMessage({ message: error.message }));
			});
	};

	return (
		<div>
			<Tabs
				value={tabValue}
				onChange={handleTabChange}
				indicatorColor="primary"
				textColor="primary"
				variant="scrollable"
				scrollButtons="auto"
				classes={{ root: 'w-full h-64' }}
			>
				{[
					{
						label: 'Upload File',
						value: 0
					},
					{
						label: 'Email',
						value: 1
					}
				].map(item => {
					return <Tab className="h-64" {...item} />;
				})}
			</Tabs>
			<div className="py-12">
				{tabValue === 0 && (
					<div>
						<MyDropzone removeFile={removeFile} onDrop={onDrop} files={uploadedFiles} />
						<Button onClick={onSubmitUploadedFile} variant="contained" color="primary" type="submit">
							Send
						</Button>
					</div>
				)}
				{tabValue === 1 && (
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
							submitEmail={submitWf1S2}
							hasAttachment
						/>
						{pdfPath && <PDFViewer url={pdfPath} />}
					</>
				)}
			</div>
		</div>
	);
};

export default Email;
