import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import allRequests, { requestNBK } from 'api/allRequests';
import { showMessage } from 'app/store/fuse/messageSlice';

const name = 'Checklist';

const getEntities = createAsyncThunk(`${name}App/${name}/get${name}`, async (routeParams, { getState, dispatch }) => {
	const response = await requestNBK({ requestConfig: allRequests.checklistTemplate.all });
	const data = response.multiChecklistTemplate;
	return { data };
});

const addEntity = createAsyncThunk(`${name}App/${name}/add${name}`, async (data, { dispatch, getState }) => {
	const response = await requestNBK({
		requestConfig: allRequests.checklistTemplate.create,
		body: {
			checklistTemplate: data
		},
		dispatch
	}).then(res => {
		dispatch(showMessage({ message: res.message }));
		dispatch(getEntities({}));
	});
	return data;
});
const updateEntity = createAsyncThunk(`${name}App/${name}/update${name}`, async (data, { dispatch, getState }) => {
	const response = await requestNBK({
		requestConfig: allRequests.checklistTemplate.update,
		body: data,
		dispatch
	}).then(res => {
		dispatch(showMessage({ message: res.message }));
		dispatch(getEntities({}));
	});
});

const removeEntity = createAsyncThunk(`${name}App/${name}/remove${name}`, async (data, { dispatch, getState }) => {
	await requestNBK({
		requestConfig: allRequests.checklistTemplate.delete,
		body: {
			ChecklistTemplateID: data
		},
		dispatch
	}).then(res => {
		dispatch(showMessage({ message: res.message }));
		dispatch(getEntities({}));
	});
});

const addEntityChecklistItem = createAsyncThunk(
	`${name}App/${name}/add${name}ChecklistItem`,
	async (data, { dispatch, getState }) => {
		const response = await requestNBK({
			requestConfig: allRequests.checklistTemplateItem.create,
			body: {
				ChecklistItemTemplate: data
			},
			dispatch
		});
		return data;
	}
);

const updateEntityChecklistItem = createAsyncThunk(
	`${name}App/${name}/update${name}ChecklistItem`,
	async (data, { dispatch, getState }) => {
		const response = await requestNBK({
			requestConfig: allRequests.checklistTemplateItem.update,
			body: {
				ChecklistItemTemplate: data
			},
			dispatch
		});

		/* 	dispatch(updateEntityChecklistItem(data)) */
	}
);

const removeEntityChecklistItem = createAsyncThunk(
	`${name}App/${name}/remove${name}ChecklistItem`,
	async (data, { dispatch, getState }) => {
		const response = await requestNBK({
			requestConfig: allRequests.checklistTemplateItem.delete,
			body: {
				ChecklistItemId: data
			},
			dispatch
		});
		/* 	dispatch(updateEntityChecklistItem(data)) */
	}
);

const ChecklistEntityAdapter = createEntityAdapter({});
const { selectAll, selectById } = ChecklistEntityAdapter.getSelectors(state => state[`${name}App`]);

const ChecklistAppSlice = createSlice({
	name: `${name}App/${name}`,
	initialState: ChecklistEntityAdapter.getInitialState({
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
		[`openEdit${name}Dialog`]: (state, action) => {
			state.entityDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
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
		[updateEntity.fulfilled]: ChecklistEntityAdapter.upsertOne,
		[addEntity.fulfilled]: ChecklistEntityAdapter.addOne,
		/* 			[[`remove${name}s`].fulfilled]: (state, action) => ChecklistEntityAdapter.removeMany(state, action.payload) */
		[removeEntity.fulfilled]: (state, action) => {
			ChecklistEntityAdapter.removeOne(state, action.payload);

			state.searchText = '';
		},
		[getEntities.fulfilled]: (state, action) => {
			const { data, routeParams } = action.payload;
			ChecklistEntityAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.searchText = '';
		}
	}
});

export default {
	thunkActions: {
		getEntities,
		addEntity,
		updateEntity,
		removeEntity,
		addEntityChecklistItem,
		updateEntityChecklistItem,
		removeEntityChecklistItem
	},
	selectors: {
		[`selectAll${name}s`]: selectAll,
		[`select${name}byId`]: selectById
	},
	slice: ChecklistAppSlice
};
