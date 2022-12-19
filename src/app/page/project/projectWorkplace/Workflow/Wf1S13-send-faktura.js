import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import allRequests, { requestNBK } from 'api/allRequests';
import MailCompose from 'app/shared-components/MailCompose';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const Email = props => {
	const dispatch = useDispatch();
	const project = useSelector(({ projectApp }) => projectApp.project);
	const { projectId, closeDialog, selectedWorkflowId } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [defaultEmail, setDefaultEmail] = useState({});

	const getEmailTemplate = () => {
		setIsLoading(true);
		const body = {
			ProjectWorkflow: {
				ProjectId: `${projectId}`,
				WorkflowId: '1',
				WorkflowStepId: '12',
				IsTransfer: 'False'
			}
		};

		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s13getInvoiceDetails,
			body
		})
			.then(res => {
				const { projectWorkflow } = res;
				setDefaultEmail(projectWorkflow);
				setIsLoading(false);
				/* setFields(res) */
			})
			.catch(error => {
				/*                 setIsLoading(false)
                const msg = generateErrorMessage({ action: 'getEmailTemplate', errorMessage: error.message })
                dispatch(addError(msg)) */
			});
	};

	useEffect(() => {
		/*         getFields() */
		getEmailTemplate();
	}, [projectId]);

	const submitInvoiceSend = () => {
		const tosend = {
			ProjectId: `${projectId}`,
			WorkflowId: '1',
			WorkflowStepId: '15',
			IsTransfer: 'False',
			ServiceWorkflowCategoryID: selectedWorkflowId
		};

		setIsLoading(true);
		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s13sendInvoice,
			body: {
				ProjectWorkflow: tosend
			},
			dispatch
		}).then(res => {
			console.log(res);
			dispatch(showMessage({ message: res.message }));
			closeDialog();
		});
	};
	if (project) {
		const { info, customeContact } = project;
		console.log(project);
		const { companyName, contactNo, email } = info.customer;
		return (
			<div className="px-12 pb-12">
				<div className="grid grid-cols-2 grid-24 pb-12">
					<div className="py-12">
						<Typography className="mb-24 text-lg border-b">Contact</Typography>
						<Typography>{project.name}</Typography>
						<Typography>{companyName}</Typography>
						<Typography>{contactNo}</Typography>
						<Typography>{email}</Typography>
					</div>
					<div className="py-12">
						<Typography className="mb-24 text-lg border-b">Address</Typography>
						<Typography>
							{info.address} {info.postNo} {info.poststed}
						</Typography>
					</div>
					<div className="py-12">
						<Typography className="mb-24 text-lg border-b">Service</Typography>
						{info.projectService.map(item => {
							return (
								<Typography className="">
									{item.service.name} NOK{item.price}
								</Typography>
							);
						})}
					</div>
				</div>

				<Button variant="contained" color="primary" type="submit" onClick={submitInvoiceSend}>
					Send Invoice
				</Button>
			</div>
		);
	}
	return null;
};

export default Email;
