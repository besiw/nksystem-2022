import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import allRequests, { requestNBK } from 'api/allRequests';
import appStrings from 'app/strings';

/* const createGeneralCrudSlice = ({
	name,
	allRequest,
	allRequestConvertor,
	createRequest,
	updateRequest,
	getCreateData,
	getUpdateData
}) => {
	
	return {
		thunkActions: {
			getEntities,
			addEntity,
			updateEntity

		},
		selectors: {
			[`selectAll${name}s`]: selectAll,
			[`select${name}byId`]: selectById
		},
		slice: generalCrudSlice
	};
}; */

const title = 'Company';
const name = 'company';

export const getEntities = createAsyncThunk(`${name}App/${name}/get${name}`, async () => {
	const response = await requestNBK({
		requestConfig: allRequests.company.all
	});
	const data = response.multiCompanyProfile;
	return { data };
});

export const addEntity = createAsyncThunk(
	`${name}App/${name}/add${name}`,
	async (dataToSend, { dispatch, getState }) => {
		const getCreateData = row => ({
			companyProfile: {
				title: row.title
			}
		});
		const response = await requestNBK({
			requestConfig: allRequests.company.create,
			body: getCreateData(dataToSend),
			dispatch
		});
		const data = response;

		dispatch(getEntities());

		return data;
	}
);

export const updateEntity = createAsyncThunk(
	`${name}App/${name}/update${name}`,
	async (dataToSend, { dispatch, getState }) => {
		const getUpdateData = row => ({
			companyProfile: {
				id: row.id,
				title: row.title
			}
		});
		const response = await requestNBK({
			requestConfig: allRequests.company.update,
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

const generalCrudEntityAdapter = createEntityAdapter({});

export const { selectAll, selectById } = generalCrudEntityAdapter.getSelectors(state => state[`${name}App`]);

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
		}
	},
	extraReducers: {
		[updateEntity.fulfilled]: generalCrudEntityAdapter.upsertOne,
		[addEntity.fulfilled]: generalCrudEntityAdapter.addOne,
		/* 			[[`remove${name}s`].fulfilled]: (state, action) => generalCrudEntityAdapter.removeMany(state, action.payload) */
		/* 			[removeEntity.fulfilled]: (state, action) => {
			generalCrudEntityAdapter.removeOne(state, action.payload);

			state.searchText = '';
		}, */
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
/* const store = createGeneralCrudSlice({
	name,
	allRequest: allRequests.company.all,
	allRequestConvertor: res => res.multiCompanyProfile,
	createRequest: allRequests.company.create,
	getCreateData: row => ({
		companyProfile: {
			title: row.title
		}
	}),
	updateRequest: allRequests.company.update,
	getUpdateData: row => ({
		companyProfile: {
			id: row.id,
			title: row.title
		}
	})
	/* 	deleteRequest: allRequests.buildingSupplier.delete,
	getDeleteData: id => ({
		BuildingSupplierID: id
	}) */
export const { setcompanySearchText } = generalCrudSlice.actions;
export default generalCrudSlice.reducer;
