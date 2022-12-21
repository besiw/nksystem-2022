import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useState, useRef, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import Paper from '@mui/material/Paper';
import slugs from 'app/strings';
import LeftSidebar from './ProjectWorkplaceSidenav';
import StepDialog from './StepDialog';
import Steps from './Steps';

import Header from './ProjectWorkplaceHeader';
import { updateSingleProjectWorkflow } from '../store/projectSlice';

import reducer from '../store';

const stepDialogMap = {
	w1s1: lazy(() => import('./Workflow/Wf1S1-takk-for-bestillingen')),
	w1s3: lazy(() => import('./Workflow/Wf1S3-IG')),
	w1s5: lazy(() => import('./Workflow/Wf1S5-godkjent-byggesokned')),
	w1s8: lazy(() => import('./Workflow/Wf1S8-send-paamindelse')),
	w1s9: lazy(() => import('./Workflow/Wf1S9-id9-epost-kommende-kontroll')),
	w1s11: lazy(() => import('./Workflow/Wf1S11-kontroll-dato')),
	w1s13: lazy(() => import('./Workflow/Wf1S13-send-faktura')),
	'w1s1-done': lazy(() => import('./Workflow/Done/Wf1S1')),
	'w1s2-done': lazy(() => import('./Workflow/Done/Wf1S2')),
	'w1s3-done': lazy(() => import('./Workflow/Done/Wf1S3')),
	'w1s5-done': lazy(() => import('./Workflow/Done/Wf1S5')),
	'w1s6-done': lazy(() => import('./Workflow/Done/Wf1S6')),
	'w1s7-done': lazy(() => import('./Workflow/Done/Wf1S7')),
	'w1s8-done': lazy(() => import('./Workflow/Done/Wf1S8')),
	'w1s9-done': lazy(() => import('./Workflow/Done/Wf1S9')),
	'w1s10-done': lazy(() => import('./Workflow/Done/Wf1S10')),
	'w1s11-done': lazy(() => import('./Workflow/Done/Wf1S11')),
	'w1s12-done': lazy(() => import('./Workflow/Done/Wf1S12')),
	'w1s13-done': lazy(() => import('./Workflow/Done/Wf1S13')),
	'w1s14-done': lazy(() => import('./Workflow/Done/Wf1S14')),
	'w1s15-done': lazy(() => import('./Workflow/Done/Wf1S15'))
};

const stepNonDialogMap = {
	w1s2: lazy(() => import('./Workflow/Wf1S2-ansvarsrett')),
	w1s6: lazy(() => import('./Workflow/Wf1S6-opprett-sjekklister')),
	w1s7: lazy(() => import('./Workflow/Wf1S7-la-til-foretak')),
	w1s10: lazy(() => import('./Workflow/Wf1S10-epost-innhenting-av-dokumentasjon')),
	w1s12: lazy(() => import('./Workflow/Wf1S12-gjennomgaa-rapport')),
	w1s14: lazy(() => import('./Workflow/Wf1S14-kontrollerklæring')),
	w1s15: lazy(() => import('./Workflow/Wf1S15-sluttrapport')),
	w1s16: lazy(() => import('./Workflow/Wf1S16-utfort')),
	w2s1: lazy(() => import('./Workflow/Wf2S1'))
};

function ProjectWorkflows(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const location = useLocation();
	const pageLayout = useRef(null);
	const project = useSelector(({ projectApp }) => projectApp.project);
	const [selectedWorkflowId, setSelectedWorkflowId] = useState(0);
	const [showToDoSteps, setShowToDoSteps] = useState(true);
	const [contentId, setContentId] = useState(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogContentId, setDialogContentId] = useState(null);
	const [dialogContext, setDialogContext] = useState(null);
	const [title, setTitle] = useState('');
	const { projectId, wIdsId } = routeParams;

	const navigate=useNavigate()

	useEffect(() => {
		if (project && project.workflows) {
			const keys = Object.keys(project.workflows);
			const found = keys.find(item => {
				return project.workflows[item].workflowCategoryId === 1;
			});
			if (found) {
				setSelectedWorkflowId(found);
			} else {
				setSelectedWorkflowId(keys[0]);
			}
		}
	}, [project && project.id]);

	useEffect(() => {
		if (typeof wIdsId === 'string') {
			handleStepChange({ stepPath: wIdsId });
		} else {
			setContentId(null);
			setDialogContentId(null);
		}
	}, [wIdsId]);

	const updateprojectState = () => {
		const workflow = project.workflows[selectedWorkflowId];
		dispatch(
			updateSingleProjectWorkflow({
				workflowId: workflow.id,
				workflowCategoryId: workflow.workflowCategoryId,
				projectId: project.id
			})
		);
	};
	const backToSteps = () => {
		updateprojectState();
		navigate(`/${slugs.slug_project}/${projectId}/workplace`);
	};

	const getdialogContext = stepPath => {
		const workflow = project.workflows[selectedWorkflowId];
		if (workflow) {
			const steps = [...workflow.processedSteps, ...workflow.toDoSteps];
			console.log(steps);
			const findStep = steps.find(s => {
				return `${s.path}` === stepPath;
			});
			if (findStep) {
				setDialogContext(findStep.step.stepName);
			}
		}
	};
	const handleStepChange = ({ stepPath, ...rest }) => {
		if (stepPath.includes('done')) {
			const path = stepPath.split('-')[0];
			/* getdialogContext(path); */
			setIsDialogOpen(true);
			setDialogContentId(stepPath);
			setDialogContext(rest);
		} else if (stepDialogMap[stepPath]) {
			/* getdialogContext(stepPath); */
			setIsDialogOpen(true);
			setDialogContentId(stepPath);
			setDialogContext(rest);
		} else if (stepNonDialogMap[stepPath]) {
			setContentId(stepPath);
			if (wIdsId !== stepPath) {
				navigate(`/${slugs.slug_project}/${projectId}/workplace/${stepPath}`);
			}
		} else {
			setContentId(null);
			setDialogContentId(null);
		}
	};
	const closeDialog = () => {
		setIsDialogOpen(false);
	};
	const closeDialogAndUpdate = () => {
		setIsDialogOpen(false);
		updateprojectState();
	};
	const handleWorkflowChange = ev => {
		const targetValue = ev.target.value;
		setSelectedWorkflowId(targetValue);
		if (project && project.workflows && project.workflows[selectedWorkflowId]) {
			const { workflows } = project;

			if (workflows[targetValue].workflowCategoryId === 2) {
				navigate(`/${slugs.slug_project}/${projectId}/workplace/w2s1`);
			} else {
				setContentId(null);
				setDialogContentId(null);
			}
		}
	};

	if (project && project.info && project.info.title) {
		const { info, workflows } = project;
		const foundWorkflows = workflows || {};
		const workflow = foundWorkflows[selectedWorkflowId];
		const workflowsArray = Object.keys(foundWorkflows).map(id => {
			const w = workflows[id];
			return { value: w.id, name: w.name };
		});
		const ContentComponent = stepNonDialogMap[contentId];
		const StepComponent = stepDialogMap[dialogContentId];
		console.log('project workplace app')
		return (
			<>
				<FusePageSimple
					classes={{
						contentWrapper: 'p-16 sm:p-24 pb-80',
						content: 'flex min-h-full',
						leftSidebar: 'w-256 border-0',
						header: 'min-h-96 h-96'
					}}
					header={
						<Header
							pageLayout={pageLayout}
							id={project.id}
							title={project.info.title}
							backToSteps={backToSteps}
							value={selectedWorkflowId}
							workflowsArray={workflowsArray}
							handleWorkflowChange={handleWorkflowChange}
						/>
					}
					content={
						workflow && (
							<div className="flex md:grid md:grid-cols-12 w-full">
								<div className="md:col-start-1 md:col-end-9 px-12">
									<div className="flex flex-1 items-center justify-end">
										<Link to={`/${slugs.slug_project}/${project.id}/docs/${workflow.id}`}>
											<IconButton>
												<Icon color={true ? 'action' : 'disabled'}>folderopen</Icon>
												<Typography className="text-12 ml-4">Docs</Typography>
											</IconButton>
										</Link>
									</div>
									{ContentComponent ? (
										<Paper
											component={motion.div}
											initial={{ y: 20, opacity: 0 }}
											animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
											className="rounded-0 shadow-none lg:rounded-20 lg:shadow p-12 mb-12"
										>
											<ContentComponent
												projectId={project.info.id}
												selectedWorkflowId={selectedWorkflowId}
												backToSteps={backToSteps}
												updateprojectState={updateprojectState}
											/>
										</Paper>
									) : (
										<Steps
											projectId={projectId}
											workflow={workflow}
											updateprojectState={updateprojectState}
											handleStepChange={handleStepChange}
											selectedWorkflowId={selectedWorkflowId}
										/>
									)}
								</div>
								<LeftSidebar project={info} />
							</div>
						)
					}
					sidebarInner
					ref={pageLayout}
				/>
				{StepComponent && (
					<StepDialog
						title={dialogContext.step.stepName}
						isDialogOpen={isDialogOpen && stepDialogMap[contentId] !== null}
						closeDialog={closeDialog}
						content={
							<StepComponent
								projectId={project.info.id}
								closeDialog={closeDialogAndUpdate}
								context={dialogContext}
								selectedWorkflowId={selectedWorkflowId}
							/>
						}
					/>
				)}
			</>
		);
	}
	return null;
}

export default ProjectWorkflows;
