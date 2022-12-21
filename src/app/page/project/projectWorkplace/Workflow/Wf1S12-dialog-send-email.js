/* import { useForm } from '@fuse/hooks'; */
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useState, useEffect, useRef, useCallback } from 'react';
import allRequests, { requestNBK } from 'api/allRequests';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import Close from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@mui/material/AppBar';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import MailCompose from './Wf1S10-email-compose';

function SendEmailDialog(props) {
	const dispatch = useDispatch();
	const { projectId, closeDialog, isDialogOpen, defaultValues, devToSend } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [defaultEmails, setDefaultEmails] = useState({
		emails: {},
		toSendIds: []
	});
	const [attachmentPDF, setAttachmentPDF] = useState(null);
	const [doNotSend, setDoNotSend] = useState([]);
	const [tabValue, setTabValue] = useState(0);
	const [toAdd, setToAdd] = useState([]);

	const { watch, handleSubmit, formState, control, setValue, getValues } = useForm({
		mode: 'onChange',
		defaultValues: {}
		/* 		resolver: yupResolver(schema) */
	});

	useEffect(() => {
		if (devToSend && Object.keys(devToSend).length > 0) {
			getEmailTemplate();
		}
	}, [devToSend]);

	const getEmailTemplate = () => {
		const toSend = {
			ProjectWorkflow: {
				ProjectId: projectId,
				WorkflowId: '1',
				WorkflowStepId: '11',
				IsTransfer: 'False',
				ChecklistItemIdCommaSeperated: Object.keys(devToSend)
					.map(item => devToSend[item])
					.join(',')
			}
		};
		console.log(toSend);
		console.log(allRequests.projectWorkflow.w1s12getFormatedEmail);
		setIsLoading(true);
		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s12getFormatedEmail,
			body: toSend
		})
			.then(res => {
				const {
					emailProjectParties: { emailProjectPartiesWorkflowList },
					attachmentURL,
					fileName
				} = res.projectWorkflow;
				const emails = {};
				const toSendIds = [];
				setAttachmentPDF({ attachmentURL, fileName });
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
				setIsLoading(false);
			})
			.catch(error => {
				dispatch(showMessage({ message: error.message }));
				setIsLoading(false);
			});

		/* 		
		const body = {
			ProjectWorkflow: {
				ProjectId: `${projectId}`,
				WorkflowId: '1',
				WorkflowStepId: '1',
				IsTransfer: 'False'
			}
		};

		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s1get,
			body
		})
			.then(res => {
				const { projectWorkflow } = res;
				setDefaultEmail(projectWorkflow);
				setIsLoading(false);
			})
			.catch(error => {

			}); */
	};
	const submitWf1S12 = async emails => {
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
				WorkflowStepId: '11',
				IsTransfer: 'False',
				fileName: attachmentPDF.fileName,
				emailContent: '',
				emailSubject: '',
				emailTo: '',
				emailFrom: '',
				BaseURLSite: `${process.env.REACT_APP_SITE_URL}/external/UpdateDeviation`,
				ChecklistItemIdCommaSeperated: Object.keys(devToSend)
					.map(item => devToSend[item])
					.join(','),
				emailProjectParties: {
					emailProjectPartiesWorkflowList: toSendEmails
				}
			}
		};

		const file = await fetch(attachmentPDF.attachmentURL).then(res => res.blob());
		const formData = new FormData();

		formData.append('file', file);
		formData.append('request', JSON.stringify(toSend));

		return axios
			.post(allRequests.projectWorkflow.w1s12sendEmail.url, formData)
			.then(response => {
				closeDialog();
				dispatch(showMessage({ message: response.data.message }));
				setIsLoading(false);
				return response;
			})
			.catch(error => {
				console.log(error.message);
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

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			open={isDialogOpen}
			onClose={closeDialog}
			fullWidth
			maxWidth="md"
		>
			<DialogContent classes={{ root: 'p-24' }}>
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
						<Button
							className="mt-24"
							variant="contained"
							color="primary"
							onClick={handleSubmit(submitWf1S12)}
						>
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
									<MailCompose
										partyTypeId={partyTypeID}
										control={control}
										attachmentPDF={attachmentPDF.attachmentURL}
									/>
								</div>
							);
						})}
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default SendEmailDialog;
