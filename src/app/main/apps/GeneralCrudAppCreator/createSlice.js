import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import allRequests, { requestNBK } from 'api/allRequests';

const createGeneralCrudSlice = ({
	name,
	allRequest,
	allRequestConvertor,
	createRequest,
	updateRequest,
	getCreateData,
	deleteRequest,
	getDeleteData,
	getUpdateData
}) => {
	const getEntities = createAsyncThunk(`${name}App/${name}/get${name}`, async () => {
		const response = await requestNBK({
			requestConfig: allRequest
		});
		const data = allRequestConvertor(response);
		return { data };
	});

	const addEntity = createAsyncThunk(`${name}App/${name}/add${name}`, async (dataToSend, { dispatch, getState }) => {
		const response = await requestNBK({
			requestConfig: createRequest,
			body: getCreateData(dataToSend),
			dispatch
		});
		const data = response;

		dispatch(getEntities());

		return data;
	});
	const updateEntity = createAsyncThunk(
		`${name}App/${name}/update${name}`,
		async (dataToSend, { dispatch, getState }) => {
			const response = await requestNBK({
				requestConfig: updateRequest,
				body: getUpdateData(dataToSend),
				dispatch
			});
			const data = response;
			dispatch(getEntities()).then(() => {
				console.log('get entities');
			});
			return dataToSend;
		}
	);

	const removeEntity = createAsyncThunk(
		`${name}App/${name}/remove${name}`,
		async (dataToSend, { dispatch, getState }) => {
			await requestNBK({
				requestConfig: deleteRequest,
				body: getDeleteData(dataToSend),
				dispatch
			});
			dispatch(getEntities()).then(() => {
				console.log('get entities');
			});
		}
	);
	const generalCrudEntityAdapter = createEntityAdapter({});
	const { selectAll, selectById } = generalCrudEntityAdapter.getSelectors(state => state[`${name}App`]);

	const generalCrudSlice = createSlice({
		name: `${name}App/${name}`,
		initialState: generalCrudEntityAdapter.getInitialState({
			searchText: '',
			routeParams: {},
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
			}
		},
		extraReducers: {
			[updateEntity.fulfilled]: generalCrudEntityAdapter.upsertOne,
			[addEntity.fulfilled]: generalCrudEntityAdapter.addOne,
			/* 			[[`remove${name}s`].fulfilled]: (state, action) => generalCrudEntityAdapter.removeMany(state, action.payload) */
			[removeEntity.fulfilled]: (state, action) => {
				generalCrudEntityAdapter.removeOne(state, action.payload);

				state.searchText = '';
			},
			[getEntities.fulfilled]: (state, action) => {
				if (action && action.payload) {
					const { data, routeParams } = action.payload;
					generalCrudEntityAdapter.setAll(state, data);
					state.routeParams = routeParams;
					state.searchText = '';
				}
			}
		}
	});
	return {
		thunkActions: {
			getEntities,
			addEntity,
			updateEntity,
			removeEntity
		},
		selectors: {
			[`selectAll${name}s`]: selectAll,
			[`select${name}byId`]: selectById
		},
		slice: generalCrudSlice
	};
};

export default createGeneralCrudSlice;
