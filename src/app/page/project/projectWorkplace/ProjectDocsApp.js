import FusePageSimple from '@fuse/core/FusePageSimple';
import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';

import { useEffect, useState, useRef, lazy } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useDeepCompareEffect } from '@fuse/hooks';
import slugs from 'app/strings';
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
/* import { CustomListItemText } from 'app/page/project/projectWorkplace/Steps'; */
import ListItem from '@material-ui/core/ListItem';
import MailAttachment from 'app/shared-components/UploadFile/Popup';
import List from '@material-ui/core/List';
import shortid from 'shortid';
import allRequests, { requestNBK } from 'api/allRequests';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';
import { id } from 'date-fns/esm/locale';
import reducer, { getProjectDocs } from '../store/projectSlice';
import LeftSidebarHeader from './ProjectWorkplaceSidenavHeader';
import LeftSidebar from './ProjectWorkplaceSidenav';
import Header from './ProjectWorkplaceHeader';

export const CustomListItem = ({ children }) => (
	<ListItem dense className="py-20 px-0 sm:px-8 unded-12 mb-12 cursor-pointer">
		{children}
	</ListItem>
);

export const CustomListItemText = ({ children }) => (
	<Typography className="truncate text-14 font-medium flex-1 text-primary text-left">{children}</Typography>
);
const ProjectDocsApp = props => {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const pageLayout = useRef(null);
	const history = useHistory();
	const projectInfo = useSelector(({ projectApp }) => {
		return projectApp.project && projectApp.project.info;
	});

	const { projectId, workflowId } = routeParams;
	const [tabValue, setTabValue] = useState(0);
	const [selectedWorkflowId, setSelectedWorkflowId] = useState(workflowId);
	const [activeParty, setActiveParty] = useState(null);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	const project = useSelector(({ projectApp }) => projectApp.project);
	const { customeContact, info, workflows, docs } = project;

	useDeepCompareEffect(() => {
		if (workflows[workflowId]) {
			const workflow = workflows[workflowId];
			getAllDocs();
		}
	}, [dispatch, projectId, workflows[workflowId]]);
	const backToSteps = () => {
		history.push(`/${slugs.slug_project}/${projectId}/workplace`);
	};

	const handleWorkflowChange = ev => {
		const targetValue = ev.target.value;
		setSelectedWorkflowId(targetValue);
	};

	const getAllDocs = () => {
		const workflow = workflows[workflowId];
		dispatch(
			getProjectDocs({
				projectId,
				workflowId,
				workflowCategoryId: workflow.workflowCategoryId,
				parties: projectInfo.projectParties
			})
		);
	};
	const deleteDoc = DocumentID => {
		return requestNBK({
			requestConfig: allRequests.project.deleteUploadedDocs,
			body: {
				DocumentID,
				ProjectID: projectId
			}
		})
			.then(response => {
				dispatch(showMessage({ message: response.message }));
				getAllDocs();

				return response;
			})
			.catch(error => {
				dispatch(showMessage({ message: error.message }));
			});
	};
	const submitDoc = ({ files, params }) => {
		const workflow = workflows[workflowId];
		const toSend = {
			ProjectId: `${projectId}`,
			WorkflowId: `${workflow.workflowCategoryId}`,
			...params
		};
		// toSend
		console.log(toSend);
		return Promise.all(
			files.map((file, i) => {
				const formData = new FormData();
				formData.append(`file${i}`, file);
				formData.append('request', JSON.stringify(toSend));
				console.log(toSend);
				return axios
					.post(allRequests.project.postUploadedDocs.url, formData)
					.then(response => {
						dispatch(showMessage({ message: response.data.message }));
						return response;
					})
					.catch(error => {
						console.log(error);
						dispatch(showMessage({ message: error.message }));
					});
			})
		).then(res => {
			getAllDocs();
		});
	};
	const workflowsArray = workflows
		? Object.keys(workflows).map(wId => {
				const w = workflows[wId];
				return { value: w.id, name: w.name };
		  })
		: [];

	if (
		project &&
		project.workflows &&
		project.workflows[selectedWorkflowId] &&
		project.docs &&
		project.docs[selectedWorkflowId]
	) {
		const workflowDocs = project.docs[selectedWorkflowId];
		const { allDocsbyParties, allRequiredDocs, allSystemDocs } = workflowDocs;

		const parties = Object.keys(allDocsbyParties).map(partyKey => {
			const party = allDocsbyParties[partyKey];
			return {
				typeId: party.partyTypeId,
				name: party.partyTypeName
			};
		});

		const uploadFileNoParties = files => {
			submitDoc({
				files,
				params: {
					OtherDocs: 2
				}
			});
		};
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
						<div className="grid grid-cols-12 w-full">
							<div className="col-start-1 col-end-9 mr-8">
								<Typography variant="h5" className="ml-4 mb-4">
									Prosjektdokumenter
								</Typography>
								<div>
									<Tabs
										value={tabValue}
										onChange={handleTabChange}
										indicatorColor="primary"
										textColor="primary"
										variant="scrollable"
										scrollButtons="auto"
										classes={{ root: 'w-full h-64' }}
									>
										{[
											{
												label: 'Foretak',
												value: 0
											},
											{
												label: 'Generert',
												value: 1
											},
											{
												label: 'Andre',
												value: 2
											}
										].map(item => {
											return <Tab className="h-64" {...item} />;
										})}
									</Tabs>
								</div>
								{tabValue === 1 && (
									<table className="w-full text-left border-collapse bg-white px-12" key={shortid()}>
										{Array.isArray(allSystemDocs.projectDocumentList) &&
											allSystemDocs.projectDocumentList.map(item => {
												return (
													<>
														<thead>
															<tr className="border-b">
																<th className="p-12 text-primary w-full">
																	{item.workflowStepName
																		? item.workflowStepName
																		: 'Unknown'}
																</th>
															</tr>
														</thead>
														<tbody className="align-baseline">
															<tr className="border-b ">
																<td className="p-12 font-mono text-xs whitespace-nowrap text-sky-blue-900">
																	<a
																		rel="noreferrer"
																		target="_blank"
																		className="p-12 font-mono text-xs whitespace-nowrap "
																		href={item.imageURL}
																	>
																		{item.fileName}
																	</a>
																</td>
																<td />
															</tr>
														</tbody>
													</>
												);
											})}
									</table>
								)}
								{tabValue === 2 && (
									<div className="flex justify-between my-4 p-12 pr-0">
										<Typography key={shortid()} variant="h5" className="mt-4">
											General
										</Typography>
										<MailAttachment handleSubmit={uploadFileNoParties} />
									</div>
								)}
								{tabValue === 0 && (
									<div>
										<div>
											{parties.map((p, index) => {
												const party = allDocsbyParties[p.typeId];
												const handleSubmitGeneral = files => {
													const params = {
														partyTypeID: party.partyTypeId
													};
													submitDoc({ files, params });
												};
												return (
													<div className="mb-12">
														<div className="flex justify-between my-4 p-12 pr-0">
															<Typography key={shortid()} variant="h5" className="mt-4">
																{p.name}
															</Typography>
															<MailAttachment handleSubmit={handleSubmitGeneral} />
														</div>
														{Object.keys(party.files).map(key => {
															const fileCategory = party.files[key];
															const handleSubmitDoc = files => {
																const params = {
																	partyTypeID: party.partyTypeId,
																	documenTypeId: fileCategory.documenTypeId
																};
																submitDoc({ files, params });
															};

															return (
																<table
																	className="w-full text-left border-collapse bg-white px-12"
																	key={shortid()}
																>
																	<thead>
																		<tr className="border-b">
																			<th className="p-12 text-primary w-full">
																				{fileCategory.name}
																			</th>
																			<th className="">
																				<MailAttachment
																					handleSubmit={handleSubmitDoc}
																				/>
																			</th>
																		</tr>
																	</thead>
																	{fileCategory.files.length > 0 && (
																		<tbody className="align-baseline">
																			{fileCategory.files.map(item => {
																				const handleDelete = () => {
																					deleteDoc(item.documentID);
																				};
																				return (
																					<tr className="border-b ">
																						<td className="p-12 font-mono text-xs whitespace-nowrap text-sky-blue-900">
																							<a
																								href={item.imageURL}
																								rel="noreferrer"
																								target="_blank"
																							>
																								{item.fileName}
																							</a>
																						</td>
																						<td>
																							<button
																								type="button"
																								onClick={handleDelete}
																							>
																								{' '}
																								Delete{' '}
																							</button>
																						</td>
																					</tr>
																				);
																			})}
																		</tbody>
																	)}
																</table>
															);
														})}
													</div>
												);
											})}
										</div>
									</div>
								)}
							</div>
							<LeftSidebar project={info} contactCustomer={customeContact} />
						</div>
					}
					sidebarInner
					ref={pageLayout}
				/>
			</>
		);
	}
	return null;
};

export default withReducer('projectDocsApp', reducer)(ProjectDocsApp);
