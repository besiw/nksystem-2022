import { useState, useEffect, useRef } from 'react';
import allRequests, { requestNBK } from 'api/allRequests';
import ContactCard from 'app/shared-components/ContactCard';
import Typography from '@mui/material/Typography';
import Wf1S12 from './Wf1S6';

const Step1Email = props => {
	const { projectId } = props;
	const [inspectionInfo, setInspectionInfo] = useState(null);
	useEffect(() => {
		getInspectors().then(res => {
			return getSavedData(res).then(data => {
				if (data.find) {
					return getInspectorContact(data);
				}
				setInspectionInfo({
					contact: null,
					details: data
				});
				return null;
			});
		});
	}, []);

	const getSavedData = inspectorsList => {
		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s11getInspection,
			body: {
				ProjectID: projectId,
				WorkflowId: '1',
				WorkflowStepId: '10'
			}
		}).then(res => {
			const details = res.projectWFTenSavedDetails;
			const find = inspectorsList.find(item => item.id === details.inspectorId);
			if (find) {
				return { details, find };
			}
			return null;
		});
	};

	const getInspectorContact = data => {
		return requestNBK({
			requestConfig: allRequests.contact.get,
			body: { contactId: data.find.contactId }
		}).then(contactRes => {
			setInspectionInfo({
				contact: contactRes.contact,
				details: data.details
			});
		});
	};

	const getInspectors = () => {
		// all

		return requestNBK({ requestConfig: allRequests.project.getInspectors }).then(res => {
			if (res.multiUserInspectors) {
				const list = res.multiUserInspectors.filter(item => item.contactId);
				return list;
			}
			return [];
		});
	};

	return (
		<div>
			<div className="grid grid-cols-2 gap-12">
				{inspectionInfo && inspectionInfo.contact && <ContactCard {...inspectionInfo.contact} />}
				{inspectionInfo && inspectionInfo.details && (
					<div>
						<Typography>{inspectionInfo.details.inspectionDate}</Typography>
						<Typography>{inspectionInfo.details.inspectionEventComment}</Typography>
					</div>
				)}
			</div>
			{inspectionInfo && <Wf1S12 {...props} />}
		</div>
	);
};

export default Step1Email;
