import allRequests, { requestNBK } from 'api/allRequests';
import axios from 'axios';

export default ({ projectId, key, stepId, selectedWorkflowId }) => {
	const body = {
		ProjectWorkflow: {
			ProjectId: projectId,
			WorkflowId: '1',
			WorkflowStepId: stepId,
			IsTransfer: 'True',
			ServiceWorkflowCategoryID: selectedWorkflowId
		}
	};

	switch (key) {
		case 'w1s1': {
			return requestNBK({
				requestConfig: allRequests.projectWorkflow.w1s1post,
				body
			});
		}
		case 'w1s2': {
			// allRequests.projectWorkflow.w1s2get
			const formData = new FormData();
			formData.append('request', JSON.stringify(body));
			return axios.post(allRequests.projectWorkflow.w1s2post.url, formData, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		case 'w1s3': {
			const formData = new FormData();

			formData.append('request', JSON.stringify(body));
			return axios.post(allRequests.projectWorkflow.w1s3post.url, formData, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		case 'w1s5': {
			return requestNBK({
				requestConfig: allRequests.projectWorkflow.w1s4post,
				body
			});
		}
		case 'w1s6': {
			return requestNBK({
				requestConfig: allRequests.projectWorkflow.w1s5post,
				body
			});
		}
		case 'w1s7': {
			return requestNBK({ requestConfig: allRequests.projectWorkflow.w1s6post, body });
		}
		case 'w1s8': {
			return requestNBK({
				requestConfig: allRequests.projectWorkflow.w1s8postReminder,
				body
			});
		}
		case 'w1s9': {
			return requestNBK({
				requestConfig: allRequests.projectWorkflow.w1s9transfer,
				body
			});
		}
		case 'w1s10': {
			return requestNBK({
				requestConfig: allRequests.projectWorkflow.w1s10transfer,
				body
			});
		}
		case 'w1s11': {
			return requestNBK({
				requestConfig: allRequests.projectWorkflow.w1s11transfer,
				body
			});
		}
		case 'w1s12': {
			return requestNBK({
				requestConfig: allRequests.projectWorkflow.w1s12done,
				body
			});
		}
		case 'w1s13': {
			const tosend = {
				ProjectWorkflow: {
					ProjectId: `${projectId}`,
					WorkflowId: '1',
					WorkflowStepId: '13',
					IsTransfer: 'True'
				}
			};
			return requestNBK({
				requestConfig: allRequests.projectWorkflow.w1s13sendInvoice,
				body: tosend
			});
		}
		default:
			return Promise.resolve(null);
	}
};
