import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import allRequests, { requestNBK } from 'api/allRequests';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';
import Email from './Email';

const Step3Email = props => {
	const dispatch = useDispatch();
	const { projectId } = props;
	const [pdfUrl, setPdfUrl] = React.useState(null);
	const [isLoading, setIsLoading] = React.useState(false);
	const [message, setMessage] = React.useState(null);
	const getEmailTemplate = () => {
		setIsLoading(true);
		const body = {
			ProjectWorkflow: {
				ProjectId: `${projectId}`,
				WorkflowId: '1',
				WorkflowStepId: '3',
				IsTransfer: 'False'
			}
		};

		const formData = new FormData();
		formData.append('request', JSON.stringify(body));
		return axios
			.post(allRequests.projectWorkflow.w1s3get.url, formData, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then(response => {
				console.log(response);
				const { data } = response;
				if (data && data.projectWorkflow && data.projectWorkflow.attachmentURL) {
					const { attachmentURL } = data.projectWorkflow;
					if (typeof attachmentURL === 'string' && attachmentURL.startsWith('http')) {
						setPdfUrl(attachmentURL);
					} else {
						setMessage(attachmentURL);
					}
				}
				dispatch(showMessage({ message: response.data.message }));
				setIsLoading(false);

				return response;
			});
	};

	React.useEffect(() => {
		getEmailTemplate();
	}, []);

	const { info } = props.context;
	return (
		<div>
			{pdfUrl && (
				<div style={{ height: '80vh' }}>
					<embed src={pdfUrl} width="100%" height="100%" className="overflow-scroll" />
				</div>
			)}
			{message && <div>{message}</div>}
		</div>
	);
};

export default Step3Email;
