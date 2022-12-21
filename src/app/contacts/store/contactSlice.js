import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';
import allRequests, { requestNBK } from 'api/allRequests';
import appStrings from 'app/strings';
import { showMessage } from 'app/store/fuse/messageSlice';

const title = 'Contact';
const name = 'contact';

export const contactTableConfig = {
	// "name", "contactNo", "email", "companyName"
	inputKeys: [
		{
			id: 'name',
			required: true,
			type: 'text',
			label: appStrings.name
		},
		{
			id: 'contactNo',
			required: true,
			type: 'mobile',
			label: appStrings.mobile
		},
		{
			id: 'email',
			required: true,
			type: 'email',
			label: appStrings.email
		},
		{
			id: 'companyName',
			required: false,
			type: 'text',
			label: appStrings.company_name
		}
	],
	tableHead: [
		{
			Header: appStrings.name,
			accessor: 'name'
		},
		{
			Header: appStrings.company_name,
			accessor: 'companyName'
		},
		{
			Header: appStrings.mobile,
			accessor: 'contactNo'
		},
		{
			Header: appStrings.email,
			accessor: 'email'
		}
	],
	defaultSorted: {
		id: 'name',
		desc: false
	}
};

export const setContactsLoading = () => ({ type: 'contact/contactsLoading' });
export const setContactsReceived = () => ({ type: 'contact/contactsReceived' });

export const getContacts = createAsyncThunk(`${name}/get${name}`, async (routeParams, { getState, dispatch }) => {
	routeParams = routeParams || getState()[`${name}`].routeParams;
	const { loading } = getState()[`${name}`];
	if (loading === 'idle') {
		dispatch(setContactsLoading());
		const response = await requestNBK({ requestConfig: allRequests.contact.all }).then(res => {
			dispatch(setContactsReceived());
			const contactList = res.multiContact.map(c => {
				return {
					...c,
					longName: `${c.name} ${c.companyName ? `(${c.companyName})` : ''}`
				};
			});
			return contactList;
		});

		return { data: response, routeParams };
	}
	return null;
});

export const addContact = createAsyncThunk(`${name}/add${name}`, async (dataToSend, { dispatch, getState }) => {
	const response = await requestNBK({
		requestConfig: allRequests.contact.create,
		body: { Contact: dataToSend },
		dispatch
	});

	const data = response;
	dispatch(
		showMessage({
			message: 'Successfully Added Contact'
		})
	);
	dispatch(getContacts());
	return data;
});
export const updateContact = createAsyncThunk(`${name}/update${name}`, async (dataToSend, { dispatch, getState }) => {
	const response = await requestNBK({
		requestConfig: allRequests.contact.update,
		body: { Contact: dataToSend },
		dispatch
	});
	dispatch(getContacts());
	return response;
});

export const removeContact = createAsyncThunk(`${name}/remove${name}`, async (dataToSend, { dispatch, getState }) => {
	await requestNBK({
		requestConfig: allRequests.contact.delete,
		body: { contactId: dataToSend },
		dispatch
	});
	dispatch(getContacts());
});



const contactAdapter = createEntityAdapter({});

export const { selectAll: selectAllContacts, selectById } = contactAdapter.getSelectors(state => state[`${name}`]);

const contactSlice = createSlice({
	name: `${name}`,
	initialState: contactAdapter.getInitialState({ loading: 'idle' }),
	reducers: {
		contactsLoading(state, action) {
			if (state.loading === 'idle') {
				state.loading = 'pending';
			}
		},
		contactsReceived(state, pending) {
			if (state.loading === 'pending') {
				state.loading = 'idle';
			}
		}
	},
	extraReducers: {
		[updateContact.fulfilled]: contactAdapter.upsertOne,
		[addContact.fulfilled]: contactAdapter.addOne,
		[removeContact.fulfilled]: (state, action) => {
			contactAdapter.removeOne(state, action.payload);
		},
		[getContacts.fulfilled]: (state, action) => {
			if (state && action.payload) {
				const { data } = action.payload;
				contactAdapter.setAll(state, data);
			}
		}
	}
});

export const { contactsLoading, contactsReceived } = contactSlice.actions;

export default contactSlice.reducer;
