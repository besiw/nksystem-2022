import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import allRequests, { requestNBK } from 'api/allRequests';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import Typography from '@material-ui/core/Typography';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Button from '@material-ui/core/Button';
import Close from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import MailCompose from './Wf1S10-email-compose';

const schema = yup.object().shape({
	to: yup.string().required('You must enter an e-mail').email('You must enter a valid e-mail.')
});

const Email = props => {
	const dispatch = useDispatch();
	const { projectId, backToSteps, selectedWorkflowId } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [defaultEmails, setDefaultEmails] = useState({
		emails: {},
		toSendIds: []
	});

	const [doNotSend, setDoNotSend] = useState([]);
	const [tabValue, setTabValue] = useState(0);
	const [toAdd, setToAdd] = useState([]);

	const { watch, handleSubmit, formState, control, setValue, getValues } = useForm({
		mode: 'onChange',
		defaultValues: {}
		/* 		resolver: yupResolver(schema) */
	});

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
						setValue(`${partyTypeID}-to`, item.emailTo);
						setValue(`${partyTypeID}-subject`, item.title);
						setValue(`${partyTypeID}-message`, item.content);
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

	const closeTab = index => {
		const partyId = defaultEmails.toSendIds[index];
		const currentValue = defaultEmails.toSendIds;
		const newValue = [...currentValue.slice(0, index), ...currentValue.slice(index + 1)];
		setDoNotSend([...doNotSend, partyId]);
		setTabValue(newValue[0]);
		setDefaultEmails({ ...defaultEmails, toSendIds: newValue });
	};

	const handleReadyToAdd = (id, index) => {
		const newValue = [...doNotSend.slice(0, index), ...doNotSend.slice(index + 1)];
		setTabValue(id);
		setDoNotSend(newValue);
		setDefaultEmails({ ...defaultEmails, toSendIds: [...defaultEmails.toSendIds, id] });
	};

	function handleTabChange(event, value) {
		setTabValue(value);
	}
	useEffect(() => {
		/*         getFields() */
		getEmailTemplate();
	}, [projectId]);

	const submitWf1S10 = emails => {
		const toSendEmails = defaultEmails.toSendIds.map(id => {
			const origianlEmail = defaultEmails.emails[id];
			return {
				...origianlEmail,
				content: emails[`${id}-message`],
				emailTo: emails[`${id}-to`],
				title: emails[`${id}-subject`],
				sendEmail: true
			};
		});

		const toSend = {
			ProjectWorkflow: {
				ProjectId: `${projectId}`,
				WorkflowId: '1',
				WorkflowStepId: '9',
				IsTransfer: 'False',
				emailContent: '',
				emailSubject: '',
				emailTo: '',
				emailFrom: '',
				emailProjectParties: {
					emailProjectPartiesWorkflowList: toSendEmails
				},
				ServiceWorkflowCategoryID: selectedWorkflowId,
				BaseURLSite: `${process.env.REACT_APP_SITE_URL}/external/UploadDocument`
			}
		};
		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s10postEmail,
			body: toSend
		})
			.then(res => {
				dispatch(showMessage({ message: res.message }));
				backToSteps();
			})
			.catch(error => {});
	};
	return (
		<form>
			<div className="flex justify-end w-full">
				{doNotSend.length > 0 && (
					<div className="flex items-center px-12 flex-1">
						<Typography className="text-14 font-medium mr-24 cursor-pointer" color="inherit">
							Add
						</Typography>
						<div className="flex flex-wrap">
							{doNotSend.map((id, index) => {
								const email = defaultEmails.emails[id];
								return (
									<Typography
										onClick={() => handleReadyToAdd(id, index)}
										/* component="button" */
										className="text-12 mr-12 cursor-pointer bg-grey-300 rounded p-12"
										color="inherit"
									>
										{email.partyTypeName}
									</Typography>
								);
							})}
						</div>
					</div>
				)}
				<Button className="mt-24" variant="contained" color="primary" onClick={handleSubmit(submitWf1S10)}>
					Send
				</Button>
			</div>

			<Divider className="my-24" />
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
								<div className="flex bg-">
									<span>{item.partyTypeName}</span>
									<button
										type="button"
										className="px-12"
										onClick={ev => {
											ev.preventDefault();
											ev.stopPropagation();
											closeTab(index);
										}}
									>
										<Close style={{ fontSize: 14 }} />
									</button>
								</div>
							}
						/>
					);
				})}
			</Tabs>
			<div className="py-16 sm:py-24 max-w-2xl">
				{defaultEmails.toSendIds.map((partyTypeID, index) => {
					return (
						<div className={tabValue !== partyTypeID ? 'hidden' : ''} key={index}>
							<MailCompose partyTypeId={partyTypeID} control={control} />
						</div>
					);
				})}
			</div>
		</form>
	);
};

export default Email;
