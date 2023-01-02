import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import FuseUtils from '@fuse/utils';
import allRequests, { requestNBK } from 'api/allRequests';
import appStrings from 'app/strings';
import { showMessage } from 'app/store/fuse/messageSlice';

const initialProjectInfo = {
	title: '',
	description: '',
	projectServiceWorkflowList: [],
	projectService: [],
	postNo: '',
	poststed: '',
	kommune: '',
	address: '',
	buildingSupplierId: '',
	contactPersonId: '',
	customerId: '',
	gardsNo: '',
	bruksnmmer: ''
};

const checklistOnly = {
	1: true,
	6: true,
	9: true,
	11: true,
	12: true,
	15: true,
};

const docsOnly = {
	1: true,
	7: true,
	10: true
};


export const getProject = createAsyncThunk('projectApp/project/getProject', async (params, { dispatch, getState }) => {
	const res = await requestNBK({ requestConfig: allRequests.project.get, body: params });

	return res.projectRes;
});

export const removeProject = createAsyncThunk(
	'projectApp/project/removeProject',
	async (val, { dispatch, getState }) => {
		await requestNBK({ requestConfig: allRequests.project.delete, body: { projectID: val } }).then(res => {
			dispatch(showMessage({ message: res.message }));
		});

		return val;
	}
);

export const archiveProject = createAsyncThunk('projectApp/project/archive', async (val, { dispatch, getState }) => {
	await requestNBK({ requestConfig: allRequests.project.archive, body: { projectID: val, isArchive: 'true' } }).then(
		res => {
			dispatch(showMessage({ message: res.message }));
		}
	);

	return val;
});

export const createProject = createAsyncThunk(
	'projectApp/project/createProject',
	async ({ data, navigate }, { dispatch, getState }) => {
		const { id, ...rest } = data;
		const response = await requestNBK({ requestConfig: allRequests.project.create, body: { project: rest } }).then(
			res => {
				navigate(`/${appStrings.slug_project}/${res.project.id}/workplace`);//`/${appStrings.slug_project}/${projectId}/workplace`
				return res;
			}
		);
		return data;
	}
);
export const saveProject = createAsyncThunk(
	'projectApp/project/saveProject',
	async ({ data, navigate }, { dispatch, getState }) => {
		const { project } = getState().projectApp;
		try {
			const response = await requestNBK({
				requestConfig: allRequests.project.update,
				body: { project: { ...project.info, ...data } }
			}).then(res => {
				if (res.project) {
					dispatch(getProjectWithWorkflow({ ProjectID: project.id }));
					navigate(`/${appStrings.slug_project}/${res.project.id}`);
					return res;
				}
				throw Error('cannot find project');
			});
			return response.project;
		} catch (error) {
			console.log(error);
			return error.message;
		}
	}
);

export const getProjectWithWorkflow = createAsyncThunk(
	'projectApp/project/getProjectWithWorkflow',
	async (params, { dispatch, getState }) => {
		const projectWithWorkflow = await requestNBK({ requestConfig: allRequests.project.get, body: params }).then(
			res => {
				const { project } = res;
				if (project) {
					return getServiceWorkflow(project);
				}
				throw Error('cannot find project');
			}
		);
		return projectWithWorkflow;
	}
);

const getServiceWorkflow = project => {
	const filtered = {};
	if (typeof project === 'object') {
		Object.keys(project).forEach(k => {
			if (project[k]) {
				filtered[k] = project[k];
			}
		});
	}

	const workflowList = project.projectServiceWorkflowList
		? project.projectServiceWorkflowList.map(p => {
				const { projectService } = project;

				const service = projectService.find(ps => ps.serviceId === p.serviceId);

				return {
					...p,
					serviceInfo: service
				};
		  })
		: [];

	return getWorkflow({ workflowList, projectId: project.id }).then(promiseRes => {
		return {
			info: filtered,
			id: filtered.id,
			workflows: promiseRes
		};
	});
};
export const updateSingleProjectWorkflow = createAsyncThunk(
	'projectApp/project/updateSingleProjectWorkflow',
	async (props, { dispatch, getState }) => {
		const { workflowId, projectId, workflowCategoryId } = props;
		const response = await Promise.all([
			requestNBK({
				requestConfig: allRequests.workflow.getSteps,
				body: { WorkflowCategoryID: workflowCategoryId }
			}),
			requestNBK({
				requestConfig: allRequests.projectWorkflow.getCompletedSteps,
				body: { WorkflowID: workflowCategoryId, ProjectID: projectId }
			})
		]).then(res => {
			const workflowSteps = res[0];
			const projectNotCompletedStepsRes = res[1];
			const allStepsList = workflowSteps.multiWorkflowCategorySteps;
			const projectCompletedHistory = projectNotCompletedStepsRes.multiProjectWorkflow;
			return processWorkflowStepAndHistory({
				allStepsList,
				projectCompletedHistory,
				workflowCategoryId
			});
		});
		return {
			id: workflowId,
			...response
		};
	}
);

export const getProjectDocs = createAsyncThunk(
	'projectApp/project/getProjectDocs',
	async (props, { dispatch, getState }) => {
		const response = await getDocsForWorkflow(props);
		return response;
	}
);

const processWorkflowStepAndHistory = ({ serviceInfo, allStepsList, projectCompletedHistory, workflowCategoryId }) => {
	const completedList = [];
	const notCompletedList = [];
	const projectCompletedObject = {};
	projectCompletedHistory.forEach(item => {
		projectCompletedObject[item.workflowStepId] = item;
	});

	const { service } = serviceInfo;
	allStepsList.forEach(step => {
		let show = false;
		if (typeof service.description ==="string"){
			const serviceTitle=service.description.toLowerCase()
			const isKontroll = serviceTitle.includes("kontroll");
			const isDoc = serviceTitle.includes("innhenting")
			const isAlt = serviceTitle.includes("alt")
			if(isKontroll|| isDoc){
				if(isKontroll){
					show = !!checklistOnly[step.id];
				}
				if(!show && isDoc){
					show = !!docsOnly[step.id];
				}
				if(isAlt){
					show = true;
				}
			} else {
				show = true;
			}
		}
		if (show) {
			const path = `w${workflowCategoryId}s${step.id}`;
			if (projectCompletedObject[step.stepSequence]) {
				completedList.push({
					step,
					path,
					info: projectCompletedObject[step.stepSequence]
				});
			} else {
				notCompletedList.push({
					step,
					path
				});
			}
		}
	});
	return { notCompletedList, completedList };
};

export const getWorkflow = ({ workflowList, projectId }) => {
	return Promise.all(
		workflowList.map(props => {
			const { workflowCategoryId, serviceInfo, id } = props;
			return Promise.all([
				requestNBK({
					requestConfig: allRequests.workflow.get,
					body: { WorkflowCategoryID: workflowCategoryId }
				}),
				requestNBK({
					requestConfig: allRequests.workflow.getSteps,
					body: { WorkflowCategoryID: workflowCategoryId }
				}),
				requestNBK({
					requestConfig: allRequests.projectWorkflow.getCompletedSteps,
					body: { WorkflowID: workflowCategoryId, ProjectID: projectId }
				})
			]).then(res => {
				const workflowName = res[0];
				const workflowSteps = res[1];
				const projectNotCompletedStepsRes = res[2];

				const allStepsList = workflowSteps.multiWorkflowCategorySteps;
				const projectCompletedHistory = projectNotCompletedStepsRes.multiProjectWorkflow;
				const { completedList, notCompletedList } = processWorkflowStepAndHistory({
					serviceInfo,
					allStepsList,
					projectCompletedHistory,
					workflowCategoryId
				});
				const serviceName = `${serviceInfo.service.name}-${serviceInfo.service.description}`;
				const workflowFull = {
					id,
					workflowCategoryId,
					name: `${workflowName.workflowCategory.name}-${id} (${
						serviceName.length > 20 ? `${serviceName.substring(0, 20)}...` : serviceName
					}) `,
					toDoSteps: notCompletedList,
					processedSteps: completedList,
					documents: [],
					emails: []
				};

				return workflowFull;
			});
		})
	).then(res => {
		const toReturn = {};
		res.forEach(w => {
			toReturn[w.id] = w;
		});
		return toReturn;
	});
};
// getAllDocsPerParty
export const getDocsForWorkflow = async props => {
	const { parties, ...params } = props;

	const { workflowId, projectId, workflowCategoryId } = params;
	const dataToSend = {
		WorkflowID: workflowCategoryId,
		projectId
	};
	return Promise.all([
		requestNBK({
			requestConfig: allRequests.project.getAllDocsAllParties,
			body: {
				WorkflowID: workflowCategoryId,
				projectId
			}
		}),
		requestNBK({ requestConfig: allRequests.project.getSystemGeneratedDocs, body: dataToSend }),
		Promise.all(
			parties.multiProjectParty.map(item => {
				return requestNBK({
					requestConfig: allRequests.project.getAllDocsPerParty,
					body: {
						PartyID: item.partyId,
						WorkflowID: workflowCategoryId,
						projectId,
						PartyTypeID: item.partyTypeId
					}
				}).then(res => ({ ...item, ...res }));
			})
		)
	])
		.then(res => {
			const allRequiredDocs = res[0];
			const allSystemDocs = res[1];
			const allDocsbyParties = res[2];
			const requiredMap = {};

			allRequiredDocs.projectDocumentList.forEach(item => {
				requiredMap[item.documenTypeId] = item;
			});
			const partiesObjects = {};
			allDocsbyParties.forEach(party => {
				const fileCategory = {};
				const { projectDocumentList, ...partyInfo } = party;
				projectDocumentList.forEach(file => {
					if (file.documenTypeId) {
						if (fileCategory[file.documenTypeId]) {
							fileCategory[file.documenTypeId].files.push(file);
						} else {
							fileCategory[file.documenTypeId] = {
								files: file.imageURL ? [file] : [],
								name: file.documentName,
								documenTypeId: file.documenTypeId,
								isRequired: requiredMap[file.documenTypeId] !== undefined
							};
						}
					} else if (fileCategory.other) {
						fileCategory.other.files.push(file);
					} else {
						fileCategory.other = {
							files: [file],
							name: 'Other'
						};
					}
				});
				partiesObjects[party.partyTypeId] = { ...partyInfo, files: fileCategory };
				/* partiesObjects[party.] */
			});
			return {
				workflowId,
				workflowCategoryId,
				docs: {
					allRequiredDocs,
					allDocsbyParties: partiesObjects,
					allSystemDocs
				}
			};
		})
		.catch(error => {
			console.log(error);
		});
};

const ProjectSlice = createSlice({
	name: 'projectApp/project',
	initialState: {
		id: 'none',
		info: initialProjectInfo,
		workflows: {},
		docs: {},
		currentWorkflowId: 1
	},
	reducers: {
		resetProject: () => null,
		newProject: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					id: FuseUtils.generateGUID(),
					info: initialProjectInfo,
					workflows: {},
					currentWorkflowId: 1
				}
			})
		}
	},
	extraReducers: {
		[getProject.fulfilled]: (state, action) => {
			const filtered = {};
			if (typeof action.payload === 'object') {
				Object.keys(action.payload).forEach(k => {
					if (action.payload[k]) {
						filtered[k] = action.payload[k];
					}
				});
			}
			return {
				info: filtered,
				id: filtered.id
			};
		},
		[getProjectWithWorkflow.fulfilled]: (state, action) => ({ ...state, ...action.payload }),
		[removeProject.fulfilled]: (state, action) => null,
		[getWorkflow.fulfilled]: (state, action) => {
			state.workflows = action.payload;
		},
		[updateSingleProjectWorkflow.fulfilled]: (state, action) => {
			const workflow = action.payload;
			state.workflows[workflow.id].toDoSteps = workflow.notCompletedList;
			state.workflows[workflow.id].processedSteps = workflow.completedList;
		},
		[getProjectDocs.fulfilled]: (state, action) => {
			if (state.docs) {
				state.docs[action.payload.workflowId] = action.payload.docs;
			} else {
				state.docs = { [action.payload.workflowId]: action.payload.docs };
			}
		},
		[getWorkflow.rejected]: (state, action) => {}
	}
});

export const { newProject, resetProject } = ProjectSlice.actions;

export default ProjectSlice.reducer;
