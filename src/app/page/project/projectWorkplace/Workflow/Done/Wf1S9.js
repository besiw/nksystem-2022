import * as React from 'react';
import Typography from '@mui/material/Typography';
import allRequests, { requestNBK } from 'api/allRequests';
import Email from './Email';

const Step1Email = props => {
	const { projectId, closeDialog } = props;
	const email = props.context.info;
	const [contactId, setContactId] = React.useState(null);
	const getProjectLeader = () => {
		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s8getProjectLeader,
			body: { ProjectID: projectId }
		}).then(res => {
			setContactId(res.projectLeader.projectLeaderID);
			return res.projectLeader;
		});
	};
	return (
		<div>
			<Email {...email} />
		</div>
	);
};

export default Step1Email;
