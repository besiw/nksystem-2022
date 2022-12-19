import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import allRequests, { requestNBK } from 'api/allRequests';
import { showMessage } from 'app/store/fuse/messageSlice';

const name = 'user';

const getEntities = createAsyncThunk(
	`${name}App/${name}/getAll${name}`,
	async (routeParams, { getState, dispatch }) => {
		routeParams = routeParams || getState()[`${name}App`][`${name}`].routeParams;
		const response = await requestNBK({ requestConfig: allRequests.userProfile.all }).then(res => {
			console.log(res);
			return res;
		});
		const data = response.multiUserProfiles;

		return { data, routeParams };
	}
);

const addEntity = createAsyncThunk(`${name}App/${name}/add${name}`, async (data, { dispatch, getState }) => {
	const state = getState();
	const { companyId } = state.auth.user.data;
	// /checklistTempId
	const toSend = {
		userProfile: { ...data, companyId }
	};
	const response = await requestNBK({
		requestConfig: allRequests.userProfile.create,
		body: toSend,
		dispatch
	})
		.then(res => {
			dispatch(showMessage({ message: res.message }));
			dispatch(getEntities());
			return res;
		})
		.catch(error => {
			console.log(error);
			dispatch(showMessage({ message: error.message }));
		});
	return data;
});
const updateEntity = createAsyncThunk(`${name}App/${name}/update${name}`, async (data, { dispatch, getState }) => {
	const toSend = {
		userProfile: data
	};

	const response = await requestNBK({
		requestConfig: allRequests.userProfile.update,
		body: toSend,
		dispatch
	})
		.then(res => {
			dispatch(showMessage({ message: res.message }));
			dispatch(getEntities());
			return res;
		})
		.catch(error => {
			console.log(error);
			dispatch(showMessage({ message: error.message }));
		});
	return response.userProfile;
});

const removeEntity = createAsyncThunk(`${name}App/${name}/remove${name}`, async (data, { dispatch, getState }) => {
	await requestNBK({
		requestConfig: allRequests.userProfile.delete,
		body: {
			UserProfileID: data
		},
		dispatch
	}).then(res => {
		dispatch(getEntities());
		return res;
	});
	return data;
});

export const openEditDialog = createAsyncThunk(
	`${name}App/${name}/get${name}`,
	async (data, { dispatch, getState }) => {
		dispatch(initiateEditDialog(data));
	}
);

const UserEntityAdapter = createEntityAdapter({});
const { selectAll, selectById } = UserEntityAdapter.getSelectors(state => {
	return state[`${name}App`];
});

const UserAppSlice = createSlice({
	name: `${name}App/${name}`,
	initialState: UserEntityAdapter.getInitialState({
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
		[addEntity.fulfilled]: UserEntityAdapter.addOne,
		[openEditDialog.pending]: (state, action) => {
			state.entityDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.meta.arg
			};
		},

		/* 			[[`remove${name}s`].fulfilled]: (state, action) => UserEntityAdapter.removeMany(state, action.payload) */
		[removeEntity.fulfilled]: (state, action) => {
			UserEntityAdapter.removeOne(state, action.payload);

			state.searchText = '';
		},
		[getEntities.fulfilled]: (state, action) => {
			const { data, routeParams } = action.payload;
			UserEntityAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.searchText = '';
		}
	}
});

const { [`openEdit${name}Dialog`]: initiateEditDialog } = UserAppSlice.actions;

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
	slice: UserAppSlice
};
