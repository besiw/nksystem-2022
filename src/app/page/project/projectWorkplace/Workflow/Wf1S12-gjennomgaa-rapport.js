import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import allRequests, { requestNBK } from 'api/allRequests';
import { forEach } from 'lodash';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FuseLoading from '@fuse/core/FuseLoading';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import shortId from 'shortid';
import { showMessage } from 'app/store/fuse/messageSlice';
import DialogChecklist from './Wf1S12-dialog-checklist';
import DialogSendEmail from './Wf1S12-dialog-send-email';

const Workflow = props => {
	const dispatch = useDispatch();
	const { projectId, backToSteps, selectedWorkflowId } = props;
	const [checklists, setChecklists] = useState([]);
	const [deviations, setDeviatons] = useState([]);
	const [devToSend, setDevToSend] = useState({});
	const [devSelectAll, setDevSelectAll] = useState(false);
	const [dialogEditData, setDialogEditData] = useState(null);
	const [openEmailDialog, setOpenEmailDialog] = useState(false);
	const [tabValue, setTabValue] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		getChecklistData();
	}, [projectId]);

	const getChecklistData = () => {
		setIsLoading(true);
		requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s12getAllChecklistsData,
			body: { ProjectID: projectId }
		}).then(res => {
			const devList = [];
			const lists = res.multiProjectChecklistInspData;
			lists.forEach(list => {
				list.projectChecklistItemsInspData.forEach(li => {
					if (li.status === 'Dev') {
						devList.push({
							...li,
							checklistName: list.checklistName
						});
					}
				});
			});
			setIsLoading(false);
			setDeviatons(devList);
			setChecklists(res.multiProjectChecklistInspData);
		});
	};

	const handleOpenDialog = item => {
		setDialogEditData(item);
	};

	const handleCloseDialog = () => {
		setDialogEditData(null);
	};

	const handleSelectOne = (e, index) => {
		const value = devToSend[index] ? null : deviations[index].id;
		const toAdd = { ...devToSend, [index]: value };
		setDevToSend(toAdd);
	};
	const handleSelectAll = e => {
		const toAdd = {};
		const value = !devSelectAll;
		if (value === true) {
			deviations.forEach((item, index) => {
				toAdd[index] = item.id;
			});
		}
		setDevSelectAll(value);
		setDevToSend(toAdd);
	};
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	const handleDone = () => {
		const body = {
			ProjectWorkflow: {
				ProjectId: projectId,
				WorkflowId: '1',
				WorkflowStepId: '11',
				IsTransfer: 'False',
				IsApprovedInspReport: 'True',
				ServiceWorkflowCategoryID: selectedWorkflowId
			}
		};
		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s12done,
			body,
			dispatch
		}).then(res => {
			dispatch(
				showMessage({
					message: res.message,
					options: {
						variant: 'error'
					}
				})
			);
			backToSteps();
		});
	};

	return (
		<div>
			<DialogSendEmail
				projectId={projectId}
				isDialogOpen={openEmailDialog}
				closeDialog={() => {
					setOpenEmailDialog(false);
				}}
				openEmailDialog={openEmailDialog}
				devToSend={devToSend}
			/>
			<DialogChecklist
				defaultValues={dialogEditData}
				isDialogOpen={dialogEditData !== null}
				closeDialog={() => {
					setDialogEditData(null);
				}}
				updateChecklist={getChecklistData}
			/>
			<Tabs
				value={tabValue}
				onChange={handleTabChange}
				indicatorColor="primary"
				textColor="primary"
				variant="scrollable"
				scrollButtons="auto"
				classes={{ root: 'w-full h-64' }}
			>
				<Tab className="h-64" label="Deviation" />
				<Tab className="h-64" label="Checklists" />
			</Tabs>
			{isLoading ? (
				<FuseLoading />
			) : (
				<div className="py-24">
					{tabValue === 0 && (
						<div>
							{deviations.length > 0 ? (
								<ul className="border rounded-lg mb-24">
									<div className="flex justify-between p-12 ">
										<FormControlLabel
											aria-label="Select All"
											control={
												<Checkbox
													checked={devSelectAll}
													onChange={handleSelectAll}
													name="Select All"
												/>
											}
											label="Select All"
										/>
										<Button
											variant="contained"
											color="primary"
											type="submit"
											onClick={() => {
												setOpenEmailDialog(true);
											}}
											disabled={devToSend.length === 0}
										>
											Send Selected
										</Button>
									</div>
									{deviations.map((item, i) => {
										return (
											<ChecklistItem
												checklistValue={!!devToSend[i]}
												{...item}
												key={item.id}
												handleOpenDialog={handleOpenDialog}
												handleSelectOne={value => handleSelectOne(value, i)}
											/>
										);
									})}
								</ul>
							) : (
								<div className="px-12 py-24 ">
									<Typography className="mb-24">No deviations found</Typography>
									<Button variant="contained" color="primary" type="submit" onClick={handleDone}>
										Approve
									</Button>
								</div>
							)}
						</div>
					)}
					{tabValue === 1 && (
						<div>
							{checklists.map(cl => {
								return (
									<ul className="border my-16">
										<Accordion>
											<AccordionSummary expandIcon={<ExpandMoreIcon />}>
												<h3>{cl.checklistName}</h3>
											</AccordionSummary>
											<AccordionDetails className="flex flex-col">
												{cl.projectChecklistItemsInspData.map((item, i) => {
													return (
														<ChecklistItem
															checklistName={cl.checklistName}
															{...item}
															key={i}
															handleOpenDialog={handleOpenDialog}
														/>
													);
												})}
											</AccordionDetails>
										</Accordion>
									</ul>
								);
							})}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Workflow;

export const boxColor = {
	OK: 'text-green-500',
	Dev: 'text-red-600',
	NA: 'text-gray-500',
	OKSelected: 'bg-green-500',
	DevSelected: 'bg-red-600',
	NASelected: 'bg-gray-500'
};

const ChecklistItem = item => {
	const {
		title,
		checklistName,
		status,
		comment,
		projectChecklistItemImageInspData,
		handleOpenDialog,
		showClName,
		imageURL,
		imageName,
		handleSelectOne,
		checklistValue
	} = item;

	return (
		<li key={shortId()} className={`w-full px-12 py-24 border-b ${status === 'Dev' ? 'bg-red-100' : ''}`}>
			{handleSelectOne && (
				<FormControlLabel
					control={
						<Checkbox
							key={shortId()}
							checked={checklistValue}
							onChange={handleSelectOne}
							name="Add to email"
						/>
					}
					label="Add to email"
				/>
			)}
			<h3 className="mb-12">{title}</h3>
			{showClName && <h6 className="mb-12">{checklistName}</h6>}
			<div className="pb-12 grid gap-2 grid-cols-2">
				<span className={boxColor[status]}>Status: {status}</span>
				<span>Comment: {comment}</span>
			</div>
			<div className="grid grid-cols-5 gap-4">
				{projectChecklistItemImageInspData.map(img => {
					return <img key={img.imageName} src={img.imageURL} alt={img.imageName} />;
				})}
			</div>
			<button
				type="button"
				className="text-blue-300 pt-24"
				onClick={() => {
					handleOpenDialog({ ...item, checklistName });
				}}
			>
				Edit
			</button>
		</li>
	);
};
