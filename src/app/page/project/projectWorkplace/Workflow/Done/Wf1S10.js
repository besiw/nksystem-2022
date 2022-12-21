import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import allRequests, { requestNBK } from 'api/allRequests';
import Email from './Email';

const Step1Email = props => {
	const { projectId, context } = props;
	const { info } = context;
	const [isLoading, setIsLoading] = useState(false);
	const [defaultEmails, setDefaultEmails] = useState({
		emails: {},
		toSendIds: []
	});

	const [doNotSend, setDoNotSend] = useState([]);
	const [tabValue, setTabValue] = useState(0);

	useEffect(() => {
		/*         getFields() */
		getEmailTemplate();
	}, [projectId]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	const getEmailTemplate = () => {
		setIsLoading(true);
		const body = {
			ProjectWorkflow: {
				ProjectId: `${projectId}`,
				WorkflowId: '1',
				WorkflowStepId: '10',
				IsTransfer: 'False'
			}
		};

		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s10getEmail,
			body
		})
			.then(res => {
				const { projectWorkflow } = res;
				const {
					emailProjectParties: { emailProjectPartiesWorkflowList }
				} = projectWorkflow;
				const emails = {};
				const toSendIds = [];
				emailProjectPartiesWorkflowList.forEach(item => {
					const { partyTypeID } = item;
					if (partyTypeID && !emails[partyTypeID]) {
						toSendIds.push(partyTypeID);
						emails[partyTypeID] = item;
					}
				});
				setTabValue(toSendIds[0]);
				setDefaultEmails({
					emails,
					toSendIds
				});
			})
			.catch(error => {
				/*                 setIsLoading(false)
                const msg = generateErrorMessage({ action: 'getEmailTemplate', errorMessage: error.message })
                dispatch(addError(msg)) */
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
				classes={{ root: 'w-full' }}
			>
				{defaultEmails.toSendIds.map((partyID, index) => {
					const item = defaultEmails.emails[partyID];
					return (
						<Tab
							key={partyID}
							value={partyID}
							label={
								<div className="flex">
									<span>{item.partyTypeName}</span>
									<span className="pl-4">({item.partyName})</span>
								</div>
							}
						/>
					);
				})}
			</Tabs>
			<div className="py-16 sm:py-24 max-w-2xl">
				{defaultEmails.toSendIds.map((partyTypeID, index) => {
					const sentEmail = defaultEmails.emails[partyTypeID];
					return (
						<div className={tabValue !== partyTypeID ? 'hidden' : ''} key={index}>
							<Email
								emailSubject={sentEmail.title}
								emailTo={sentEmail.emailTo}
								emailContent={sentEmail.content}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Step1Email;
