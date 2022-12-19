import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import React, { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import Header from 'app/main/apps/GeneralCrudAppCreator/Header';
import List from 'app/main/apps/GeneralCrudAppCreator/List';
import appStrings from 'app/strings';
import allRequests, { requestNBK } from 'api/allRequests';
import Dialog from './serviceDialog';
import ServiceSlice from './serviceAppSlice';

const name = 'service';
const title = 'Service';
const store = ServiceSlice;
const { thunkActions, slice, selectors } = store;
const { addEntity, getEntities, removeEntity, updateEntity, openEditDialog } = thunkActions;
const { reducer } = slice;
const {
	[`set${name}SearchText`]: setSearchText,
	[`openNew${name}Dialog`]: openNewDialog,
	[`closeNew${name}Dialog`]: closeNewDialog,
	/*     [`openEdit${name}Dialog`]:openEditDialog, */
	[`closeEdit${name}Dialog`]: closeEditDialog
} = slice.actions;
// console.log(slice.actions)
const actions = { setSearchText, openNewDialog, closeNewDialog, openEditDialog, closeEditDialog };
function App(props) {
	const [checklists, setChecklists] = useState(null);
	const [workflows, setWorkflows] = useState([]);
	const dispatch = useDispatch();

	const pageLayout = useRef(null);
	const routeParams = useParams();

	useEffect(() => {
		Promise.all([getChecklistOptions(), getWorkflowOptions()]);
	}, []);

	const getChecklistOptions = () => {
		return requestNBK({
			requestConfig: allRequests.checklistTemplate.all,
			dispatch
		}).then(res => {
			const templates = res.multiChecklistTemplate;

			setChecklists(templates);
		});
	};

	const getWorkflowOptions = () => {
		return requestNBK({
			requestConfig: allRequests.workflow.all,
			dispatch
		}).then(res => {
			setWorkflows(res.multiWorkflowCategory);
			/* const templates = res.multiChecklistTemplate

            setChecklists(templates) */
		});
	};

	useDeepCompareEffect(() => {
		dispatch(getEntities(routeParams));
	}, [dispatch, routeParams]);

	const handleSearchText = ev => {
		dispatch(setSearchText(ev));
	};

	if (checklists === null) {
		return null;
	}
	const checklistOptions = checklists.map(p => ({ label: p.title, value: p.id }));
	const workflowOptions = workflows.map(w => ({ label: w.name, value: w.id }));
	const tableConfig = {
		inputKeys: [
			{
				id: 'name',
				required: true,
				type: 'text',
				label: appStrings.name
			},
			{
				id: 'description',
				required: true,
				type: 'text',
				label: appStrings.description
			},
			/* 			{
				id: 'rate',
				required: true,
				type: 'text',
				label: appStrings.rate
			}, */
			{
				id: 'checklistTempId',
				required: false,
				type: 'select',
				options: checklistOptions,
				label: appStrings.checklist_template,
				convertor: id => {
					if (id) {
						const find = checklistOptions.find(item => id === item.value);
						return find;
					}
					return id;
				}
			},
			{
				id: 'serviceWorkflowCategory',
				required: false,
				type: 'multi-select',
				options: workflowOptions,
				label: 'Workflow',
				convertor: workflowArray => {
					if (workflowArray) {
						return workflowArray.map(w => {
							// {id: 44, workflowCategoryId: 1, serviceId: 61}
							const find = workflowOptions.find(o => o.value === w.workflowCategoryId);
							return find;
						});
					}
					return [];
				}
			}
		],
		radioInputKeys: [
			{
				id: 'serviceTypeId',
				label: 'Tiltaksklasse',
				type: 'radio',
				options: [
					{
						name: ' Tiltaksklasse 1',
						value: 1
					},
					{
						name: 'Tiltaksklasse 2',
						value: 2
					},
					{
						name: ' None',
						value: 3
					}
				]
			},
			{
				id: 'serviceChargedAs',
				label: 'Prising av tjeneste',
				type: 'radio',
				options: [
					{
						name: 'Denne tjenesten skal betales per enhet',
						value: 1
					},
					{
						name: 'Denne tjenesten har fastpris',
						value: 2
					}
				]
			}
		],
		tableHead: [
			{
				Header: appStrings.name,
				accessor: 'longName'
			},
			{
				Header: appStrings.rate,
				accessor: 'rate'
			}
		],
		defaultSorted: {
			id: 'title',
			desc: false
		}
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
						selectEntities={selectors[`selectAll${name}s`]}
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
