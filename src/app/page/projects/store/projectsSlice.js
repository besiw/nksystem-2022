import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import allRequests, { requestNBK } from 'api/allRequests';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';

const rowPerPage = 20;

const getToFrom = page => {
	const pageNr = page || 0;

	const from = pageNr * rowPerPage + 1;
	const to = (pageNr + 1) * rowPerPage;
	const body = { EntriesFrom: from, EntriesTill: to };
	return body;
};

export const getTotalProjects = type => {
	return requestNBK({
		requestConfig: allRequests.project.projectsCount
	}).then(response => {
		if (['notArchivedOrDeleted', 'archived', 'deleted'].includes(type)) {
			return response[type];
		}
		return response.notArchivedOrDeleted;
	});
};
export const getProjects = createAsyncThunk('projectsApp/projects/getProjects', async () => {
	try {
		const response = await getTotalProjects('notArchivedOrDeleted').then(countRes => {
			return requestNBK({
				requestConfig: allRequests.project.allActive,
				body: { EntriesFrom: 1, EntriesTill: countRes > 1 ? countRes : 1 }
			});
		});

		return response.multiProject;
	} catch (error) {
		console.log(error);
		return [];
	}
});

export const getArchivedProjects = createAsyncThunk('projectsApp/projects/getArchivedProjects', async () => {
	const response = await getTotalProjects('archived').then(countRes => {
		return requestNBK({
			requestConfig: allRequests.project.allArchived,
			body: { EntriesFrom: 1, EntriesTill: countRes > 1 ? countRes : 1 }
		});
	});

	return response.multiProject;
});

export const getDeletedProjects = createAsyncThunk('projectsApp/projects/getDeletedProjects', async props => {
	const response = await getTotalProjects('deleted').then(countRes => {
		return requestNBK({
			requestConfig: allRequests.project.allDeleted,
			body: { EntriesFrom: 1, EntriesTill: countRes > 1 ? countRes : 1 }
		});
	});

	return response.multiProject;
});

export const removeProject = createAsyncThunk(
	'projectsApp/projects/removeProject',
	async (projectId, { dispatch, getState }) => {
		const response = await requestNBK({
			requestConfig: allRequests.project.delete,
			body: { ProjectID: projectId }
		}).then(res => {
			dispatch(showMessage({ message: res.message }));
			dispatch(getProjects());
		});

		return response;
	}
);

export const removeProjects = createAsyncThunk(
	'projectsApp/projects/removeProjects',
	async (projectIds, { dispatch, getState }) => {
		const response = await Promise.all(
			projectIds.map(id => requestNBK({ requestConfig: allRequests.project.delete, body: { ProjectID: id } }))
		).then(res => {
			dispatch(showMessage({ message: res.message }));
			dispatch(getProjects());
		});

		return response;
	}
);

export const archiveProject = createAsyncThunk(
	'projectsApp/projects/archiveProject',
	async (projectId, { dispatch, getState }) => {
		const response = await requestNBK({
			requestConfig: allRequests.project.archive,
			body: { ProjectID: projectId, body: { projectID: projectId, isArchive: 'true' } }
		}).then(res => {
			dispatch(showMessage({ message: res.message }));
			dispatch(getProjects());
		});

		return response;
	}
);

export const archiveProjects = createAsyncThunk(
	'projectsApp/projects/archiveProjects',
	async (projectIds, { dispatch, getState }) => {
		const response = await Promise.all(
			projectIds.map(projectId =>
				requestNBK({
					requestConfig: allRequests.project.archive,
					body: { ProjectID: projectId, body: { projectID: projectId, isArchive: 'true' } }
				})
			)
		).then(res => {
			dispatch(showMessage({ message: res.message }));
			dispatch(getProjects());
		});

		return response;
	}
);

const ProjectsAdapter = createEntityAdapter({});

export const { selectAll: selectProjects, selectById: selectProjectById } = ProjectsAdapter.getSelectors(state => {
	return state.projectsApp.projects;
});

const ProjectsSlice = createSlice({
	name: 'projectsApp/projects',
	initialState: ProjectsAdapter.getInitialState({
		searchText: '',
		page: 0,
		count: 0
	}),
	reducers: {
		setProjectsSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		}
	},
	extraReducers: {
		[getProjects.fulfilled]: ProjectsAdapter.setAll,
		[removeProjects.fulfilled]: (state, action) => ProjectsAdapter.removeMany(state, action.payload),
		[getArchivedProjects.fulfilled]: ProjectsAdapter.setAll,
		[getDeletedProjects.fulfilled]: ProjectsAdapter.setAll,
		[getTotalProjects.fulfilled]: (state, action) => {
			state.count = action.payload;
		}
	}
});

export const { setProjectsSearchText } = ProjectsSlice.actions;

export default ProjectsSlice.reducer;
