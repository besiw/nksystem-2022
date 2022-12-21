import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import withReducer from 'app/store/withReducer';

import {
	selectAllContacts,
	getContacts,
	removeContact,
	updateContact,
	contactTableConfig,
	addContact
} from 'app/contacts/store/contactSlice';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Header from 'app/main/apps/GeneralCrudAppCreator/Header';
import List from 'app/main/apps/GeneralCrudAppCreator/List';
import Dialog from 'app/main/apps/GeneralCrudAppCreator/Dialog';
import ContactAppSlice from './ContactAppSlice';

const title = 'Contacts';
const name = 'contactPage';
const { reducer } = ContactAppSlice;

const {
	[`set${name}SearchText`]: setSearchText,
	[`openNew${name}Dialog`]: openNewDialog,
	[`closeNew${name}Dialog`]: closeNewDialog,
	[`openEdit${name}Dialog`]: openEditDialog,
	[`closeEdit${name}Dialog`]: closeEditDialog
} = ContactAppSlice.actions;

  
const actions = { setSearchText, openNewDialog, closeNewDialog, openEditDialog, closeEditDialog };
const ContactApp = () => {
	const pageLayout = useRef(null);
	const dispatch = useDispatch();
	const hasContact = useSelector(state => {
		console.log(state)
		return state.contact.ids > 0
	});

	useEffect(() => {
		if (!hasContact) {
			dispatch(getContacts());
		}
	}, []);
	const handleSearchText = ev => {
		dispatch(setSearchText(ev));
	};

	const thunkActions = {
		addEntity: addContact,
		removeEntity: removeContact,
		updateEntity: updateContact
	};

	// const {addEntity,removeEntity,updateEntity} = thunkActions
	return (
		<>
			<FusePageSimple
				classes={{
					contentWrapper: 'p-0 sm:p-24 h-full',
					content: 'flex flex-col h-full',
					leftSidebar: 'w-256 border-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
					wrapper: 'min-h-0'
				}}
				header={
					<Header
						pageLayout={pageLayout}
						setSearchText={handleSearchText}
						title={title}
						name={name}
						openNewDialog={openNewDialog}
					/>
				}
				content={
					<List
						tableConfig={contactTableConfig}
						name={name}
						{...actions}
						removeEntity={removeContact}
						selectEntities={selectAllContacts}
					/>
				}
				ref={pageLayout}
				innerScroll
				sidebarInner
			/>
			<Dialog
				tableConfig={contactTableConfig}
				title={title}
				actions={actions}
				thunkActions={thunkActions}
				name={name}
			/>
		</>
	);
};

export default withReducer(`contactPageApp`, reducer)(ContactApp);
