import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const name = 'contactPage';
const ContactAppSlice = createSlice({
	name: `${name}App/${name}`,
	initialState: {
		searchText: '',
		routeParams: {},
		entityDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	},
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
	}
});

export default ContactAppSlice;
