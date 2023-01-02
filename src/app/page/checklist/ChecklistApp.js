import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import appStrings from 'app/strings';
import Header from 'app/main/apps/GeneralCrudAppCreator/Header';
import List from 'app/main/apps/GeneralCrudAppCreator/List';
import ChecklistAppSlice from './ChecklistAppSlice';
import Dialog from './ChecklistDialog';


const title = `${appStrings.checklist_template}`;
const name = 'Checklist';

const tableConfig = {
	inputKeys: [
		{
			id: 'title',
			required: true,
			type: 'text'
		}
	],
	tableHead: [
		{
			Header: appStrings.name,
			accessor: 'title'
		}
	],
	defaultSorted: {
		id: 'title',
		desc: false
	}
};

const { thunkActions, slice, selectors } = ChecklistAppSlice;
const { addEntity, getEntities, removeEntity, updateEntity } = thunkActions;
const { reducer } = slice;
const {
	[`set${name}SearchText`]: setSearchText,
	[`openNew${name}Dialog`]: openNewDialog,
	[`closeNew${name}Dialog`]: closeNewDialog,
	[`openEdit${name}Dialog`]: openEditDialog,
	[`closeEdit${name}Dialog`]: closeEditDialog
} = slice.actions;
// console.log(slice.actions)
const actions = { setSearchText, openNewDialog, closeNewDialog, openEditDialog, closeEditDialog };
function App(props) {
	const dispatch = useDispatch();

	const pageLayout = useRef(null);
	const routeParams = useParams();

	useDeepCompareEffect(() => {
		dispatch(getEntities(routeParams));
	}, [dispatch, routeParams]);

	const handleSearchText = ev => {
		dispatch(setSearchText(ev));
	};

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
						tableConfig={tableConfig}
						name={name}
						{...actions}
						removeEntity={removeEntity}
						selectEntities={selectors.selectAllChecklists}
					/>
				}
				ref={pageLayout}
				innerScroll
				sidebarInner
			/>
			<Dialog title={title} actions={actions} thunkActions={thunkActions} name={name} tableConfig={tableConfig} />
		</>
	);
}

export default withReducer(`${name}App`, reducer)(App);
