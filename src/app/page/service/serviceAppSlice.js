import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import allRequests, { requestNBK } from 'api/allRequests';

const name = 'service';

const getEntities = createAsyncThunk(
	`${name}App/${name}/getAll${name}`,
	async (routeParams, { getState, dispatch }) => {
		routeParams = routeParams || getState()[`${name}App`][`${name}`].routeParams;
		const response = await requestNBK({ requestConfig: allRequests.service.all });
		const data = response.multiService;
		const updated = data.map(item => {
			let price = item.rate;
			if (item.serviceChargedAs === 2) {
				price = `?`;
			}

			return {
				...item,
				rate: price,
				longName: `${item.name} (${item.description})`
			};
		});
		return { data: updated, routeParams };
	}
);

const addEntity = createAsyncThunk(`${name}App/${name}/add${name}`, async (data, { dispatch, getState }) => {
	const state = getState();
	// /checklistTempId
	const toSend = {
		service: {
			name: data.name,
			description: data.description,
			serviceTypeId: data.serviceTypeId || 2,
			serviceChargedAs: data.serviceChargedAs || 1,
			rate: data.rate || 0,
			servicePerSlabList: data.servicePerSlabList || [],
			checklistTempId: data.checklistTempId && data.checklistTempId.value,
			serviceWorkflowCategory: data.serviceWorkflowCategory.map(i => ({ workflowCategoryId: i.value }))
		}
	};
	const response = await requestNBK({
		requestConfig: allRequests.service.create,
		body: toSend,
		dispatch
	});
	return data;
});
const updateEntity = createAsyncThunk(`${name}App/${name}/update${name}`, async (data, { dispatch, getState }) => {
	const toSend = {
		service: {
			id: data.id,
			name: data.name,
			description: data.description,
			serviceTypeId: data.serviceTypeId || 2,
			serviceChargedAs: data.serviceChargedAs || 1,
			rate: data.rate,
			servicePerSlabList: data.servicePerSlabList || [],
			checklistTempId: data.checklistTempId && data.checklistTempId.value,
			serviceWorkflowCategory: data.serviceWorkflowCategory.map(i => ({
				workflowCategoryId: i.value,
				serviceId: data.id
			}))
		}
	};

	const response = await requestNBK({
		requestConfig: allRequests.service.update,
		body: toSend,
		dispatch
	});
	return response.service;
});

const removeEntity = createAsyncThunk(`${name}App/${name}/remove${name}`, async (data, { dispatch, getState }) => {
	await requestNBK({
		requestConfig: allRequests.service.delete,
		body: {
			ServiceID: data
		},
		dispatch
	});
	return data;
});

export const openEditDialog = createAsyncThunk(
	`${name}App/${name}/get${name}`,
	async (data, { dispatch, getState }) => {
		/* 		dispatch(initiateEditDialog(data)) */
		const response = await requestNBK({
			requestConfig: allRequests.service.get,
			body: { ServiceID: data.id },
			dispatch
		});
		return response.service;
	}
);

const ServiceEntityAdapter = createEntityAdapter({});
const { selectAll, selectById } = ServiceEntityAdapter.getSelectors(state => {
	return state[`${name}App`];
});

const ChecklistAppSlice = createSlice({
	name: `${name}App/${name}`,
	initialState: ServiceEntityAdapter.getInitialState({
		searchText: '',
		routeParams: {},
		checklist: [],
		entityDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		[`set${name}SearchText`]: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		[`openNew${name}Dialog`]: (state, action) => {
			state.entityDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		[`closeNew${name}Dialog`]: (state, action) => {
			state.entityDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		[`closeEdit${name}Dialog`]: (state, action) => {
			state.entityDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
		[`updateChecklistItem`]: (state, action) => {
			const updatedItem = action.payload;
			const index = state.checklist.findIndex(item => updatedItem.id === item.id);
			const updatedChecklist = [...state.checklist(0, index - 1), updatedItem, ...state.checklist(index)];
			state.checklist = updatedChecklist;
		}
	},
	extraReducers: {
		[updateEntity.fulfilled]: ServiceEntityAdapter.upsertOne,
		[addEntity.fulfilled]: ServiceEntityAdapter.addOne,
		[openEditDialog.pending]: (state, action) => {
			state.entityDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.meta.arg
			};
		},
		[openEditDialog.fulfilled]: (state, action) => {
			const res = action.payload;
			state.entityDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: res
			};
		},
		/* 			[[`remove${name}s`].fulfilled]: (state, action) => ServiceEntityAdapter.removeMany(state, action.payload) */
		[removeEntity.fulfilled]: (state, action) => {
			ServiceEntityAdapter.removeOne(state, action.payload);

			state.searchText = '';
		},
		[getEntities.fulfilled]: (state, action) => {
			const { data, routeParams } = action.payload;
			ServiceEntityAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.searchText = '';
		}
	}
});

const { [`openEdit${name}Dialog`]: initiateEditDialog } = ChecklistAppSlice.actions;

export default {
	thunkActions: {
		getEntities,
		addEntity,
		updateEntity,
		removeEntity,
		openEditDialog
	},
	selectors: {
		[`selectAll${name}s`]: selectAll,
		[`select${name}byId`]: selectById
	},
	slice: ChecklistAppSlice
};
