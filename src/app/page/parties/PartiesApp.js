import createApp from 'app/main/apps/GeneralCrudAppCreator/createApp';
import createSlice from 'app/main/apps/GeneralCrudAppCreator/createSlice';
import appStrings from 'app/strings';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import allRequests, { requestNBK } from 'api/allRequests';

const title = 'Party App';
const name = 'thirdParty';

function App(props) {
	const [workflows, setWorkflows] = useState(null);
	const dispatch = useDispatch();
	useEffect(() => {
		getWorkflowOptions();
	}, []);
	const getWorkflowOptions = () => {
		return requestNBK({
			requestConfig: allRequests.workflow.all,
			dispatch
		}).then(res => {
			setWorkflows(res.multiWorkflowCategory);
		});
	};

	if (workflows) {
		const workflowOptions = workflows.map(w => ({ label: w.name, value: w.id }));
		const store = createSlice({
			name,
			allRequest: allRequests.partyType.all,
			allRequestConvertor: res => {
				return res.multiPartyTypes.map(item => {
					const workflow = workflowOptions.find(o => o.value === item.workflowCategoryID);
					return {
						name: item.name,
						id: item.id,
						isDefault: item.isDefault ? 'true' : 'false',
						workflowCategoryName: workflow && workflow.label,
						workflowCategoryID: workflow
					};
				});
			},
			createRequest: allRequests.partyType.create,
			getCreateData: row => {
				return {
					partyType: {
						name: row.name,
						isDefault: row.isDefault === 'true',
						workflowCategoryID: row.workflowCategoryID.value
					}
				};
			},
			updateRequest: allRequests.partyType.update,
			getUpdateData: row => ({
				partyType: {
					id: row.id,
					name: row.name,
					isDefault: row.isDefault === 'true',
					workflowCategoryID: row.workflowCategoryID.value
				}
			}),
			deleteRequest: allRequests.partyType.delete,
			getDeleteData: id => ({
				partyTypeID: id
			})
		});

		const tableConfig = {
			inputKeys: [
				{
					id: 'name',
					required: true,
					label: appStrings.name,
					type: 'text'
				},
				{
					id: 'isDefault',
					required: false,
					label: 'isDefault',
					type: 'boolean'
				},
				{
					id: 'workflowCategoryID',
					required: false,
					type: 'select',
					options: workflowOptions,
					label: 'Workflow',
					convertor: workflowArray => {
						if (workflowArray) {
							return workflowArray.map(w => {
								// {id: 44, workflowCategoryID: 1, serviceId: 61}
								const find = workflowOptions.find(o => o.value === w.workflowCategoryID);
								return find;
							});
						}
						return [];
					}
				}
			],
			tableHead: [
				{
					Header: appStrings.name,
					accessor: 'name'
				},
				{
					Header: appStrings.add_to_project_by_default,
					accessor: 'isDefault'
				},
				{
					Header: 'Workflow',
					accessor: 'workflowCategoryName'
				}
			],
			defaultSorted: {
				id: 'name',
				desc: false
			}
		};
		const PartiesApp = createApp({ name, title, store, tableConfig });

		return <PartiesApp />;
	}

	return null;
}

export default App;
