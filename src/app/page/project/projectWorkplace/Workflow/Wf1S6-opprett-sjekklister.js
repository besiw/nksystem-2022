import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import allRequests, { requestNBK } from 'api/allRequests';
import Button from '@mui/material/Button';
import MailCompose from 'app/shared-components/MailCompose';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import ReactSelect from 'react-select';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Dialog from './Wf1S6-checklist-dialog';

const Workflow = props => {
	const dispatch = useDispatch();
	const { projectId, backToSteps, selectedWorkflowId } = props;
	const [projectChecklists, setProjectChecklists] = useState([]);
	const [allChecklistTemplates, setAllChecklistTemplates] = useState([]);
	const [checklistOption, setChecklistOption] = useState([]);
	const [dialogChecklist, setDialogChecklist] = useState({
		title: '',
		checklistItemTemplateList: []
	});

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [type, setType] = useState('edit');

	useEffect(() => {
		getAllData();
	}, [projectId]);

	const getProjectChecklists = () =>
		requestNBK({
			requestConfig: allRequests.project.getAllProjectChecklists,
			body: { ProjectID: projectId }
		}).then(res => {
			setProjectChecklists(res.multiProjectChecklist);
		});

	const getAllData = () => {
		return Promise.all([
			getProjectChecklists(),
			requestNBK({ requestConfig: allRequests.checklistTemplate.all }).then(res => {
				setAllChecklistTemplates([
					{
						checkListAttchedWithService: null,
						checklistItemTemplateList: [],
						id: 'new',
						isDefault: null,
						title: 'Add new'
					},
					...res.multiChecklistTemplate
				]);
			})
		]);
	};

	const addProjectChecklist = data => {
		const toSend = {
			ProjectChecklist: {
				ProjectId: projectId,
				ChecklistName: data.title,
				ProjectChecklistItems: data.checklistItemTemplateList.map(item => ({ title: item.title }))
			}
		};

		requestNBK({
			requestConfig: allRequests.project.createSingleProjectChecklist,
			body: toSend
		}).then(res => {
			return getProjectChecklists();
		});
	};

	const updateProjectChecklist = data => {
		const toSend = {
			ProjectChecklist: {
				id: data.id,
				ProjectId: projectId,
				ChecklistName: data.title
			}
		};

		requestNBK({
			requestConfig: allRequests.project.updateSingleProjectChecklist,
			body: toSend
		}).then(res => {
			return getProjectChecklists();
		});
	};

	const deleteProjectChecklist = id => {
		requestNBK({
			requestConfig: allRequests.project.deleteSingleProjectChecklist,
			body: { ChecklistId: id }
		}).then(res => {
			return getProjectChecklists();
		});
	};

	const selectChecklistTemplate = option => {
		const findChecklist = allChecklistTemplates.find(item => item.id === option.value);
		if (findChecklist) {
			setDialogChecklist(findChecklist);
		}
		setType('new');
		setIsDialogOpen(true);
		setChecklistOption(option);
	};
	const clickProjectChecklist = checklist => {
		setType('edit');
		return requestNBK({
			requestConfig: allRequests.project.getSingleProjectChecklist,
			body: { ChecklistID: checklist.id },
			dispatch
		}).then(res => {
			const checklistFull = res.projectChecklist;
			const toUpdate = {
				title: checklistFull.checklistName,
				id: checklistFull.id,
				checklistItemTemplateList: checklistFull.projectChecklistItems
				// projectChecklistItems
			};
			setIsDialogOpen(true);
			setDialogChecklist(toUpdate);
		});
	};

	const createProjectChecklistItem = item => {
		return requestNBK({
			requestConfig: allRequests.project.createSingleProjectChecklistItem,
			body: {
				ProjectChecklistItems: item
			},
			dispatch
		});
	};
	const updateProjectChecklistItem = item => {
		return requestNBK({
			requestConfig: allRequests.project.updateSingleProjectChecklistItem,
			body: {
				ProjectChecklistItems: item
			},
			dispatch
		});
	};

	const deleteProjectChecklistItem = id => {
		return requestNBK({
			requestConfig: allRequests.project.deleteSingleProjectChecklistItem,
			body: {
				ChecklistItemId: id
			},
			dispatch
		});
	};
	const checklistOptions = allChecklistTemplates.map(p => ({ label: p.title, value: p.id }));
	const handleUpdate = () => {
		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s5post,
			body: {
				ProjectWorkflow: {
					ProjectId: projectId,
					WorkflowId: '1',
					WorkflowStepId: '5',
					IsTransfer: 'False',
					ServiceWorkflowCategoryID: selectedWorkflowId
				}
			},
			dispatch
		}).then(res => {
			backToSteps();
		});
	};

	const handleClose = () => {
		setIsDialogOpen(false);
	};

	return (
		<div className="min-h-128">
			<List>
				{projectChecklists.map(item => (
					<ListItem
						key={item.id}
						onClick={() => clickProjectChecklist(item)}
						className="flex bg-grey-300 hover:bg-grey-100 rounded-12 mb-12 cursor-pointer"
					>
						<Typography className="todo-title truncate text-14 font-medium flex-1 " color="inherit">
							{item.checklistName}
						</Typography>
						<IconButton
							onClick={ev => {
								ev.preventDefault();
								ev.stopPropagation();
								deleteProjectChecklist(item.id);
							}}
						>
							<Icon>delete</Icon>
						</IconButton>
					</ListItem>
				))}
				<ListItem className="flex py-24">
					<Typography className="text-14 font-medium mr-24 cursor-pointer" color="inherit">
						Add new
					</Typography>
					<ReactSelect
						className="react-select z-999 flex-1"
						classNamePrefix="react-select"
						options={checklistOptions}
						onChange={selectChecklistTemplate}
						value={checklistOption}
					/>
				</ListItem>
				<div className="w-full flex justify-end">
					<Button variant="contained" color="primary" onClick={handleUpdate} type="submit">
						Update
					</Button>
				</div>
			</List>
			<Dialog
				type={type}
				defaultValues={dialogChecklist}
				isDialogOpen={isDialogOpen}
				closeDialog={() => {
					setIsDialogOpen(false);
				}}
				addProjectChecklist={addProjectChecklist}
				updateProjectChecklist={updateProjectChecklist}
				deleteProjectChecklist={deleteProjectChecklist}
				createProjectChecklistItem={createProjectChecklistItem}
				updateProjectChecklistItem={updateProjectChecklistItem}
				deleteProjectChecklistItem={deleteProjectChecklistItem}
			/>
		</div>
	);
};

export default Workflow;
