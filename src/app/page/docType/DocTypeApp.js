import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import createApp from 'app/main/apps/GeneralCrudAppCreator/createApp';
import createSlice from 'app/main/apps/GeneralCrudAppCreator/createSlice';
import appStrings from 'app/strings';
import allRequests, { requestNBK } from 'api/allRequests';

const title = 'Doc Type';
const name = 'docType';

/* export default createApp({name,title,store,tableConfig}) */
const AllDocTypes = () => {
	const dispatch = useDispatch();
	/*   const [partyOptions, setPartyOptions] = useState<ILabel[]>([]) */
	const [allPartyTypes, setAllPartyTypes] = useState(null);
	useEffect(() => {
		getPartyOptions();
	}, []);

	const getPartyOptions = () => {
		return requestNBK({
			requestConfig: allRequests.partyType.all,
			dispatch
		}).then(partyRes => {
			const parties = partyRes.multiPartyTypes;
			setAllPartyTypes(parties);
		});
	};

	if (allPartyTypes === null) {
		return null;
	}
	const partyOptions = allPartyTypes.map(p => ({ label: p.name, value: p.id }));
	const tableConfig = {
		inputKeys: [
			{
				id: 'docName',
				required: true,
				type: 'textarea',
				label: appStrings.name
			},
			{
				id: 'partyTypeId',
				required: false,
				type: 'select',
				options: partyOptions,
				label: appStrings.thirdpaty_type
			},
			{
				id: 'isRequired',
				required: true,
				type: 'boolean',
				label: appStrings.required
			}
		],
		tableHead: [
			{
				Header: appStrings.name,
				accessor: 'docName'
			},
			{
				Header: appStrings.thirdpaty_type,
				accessor: 'partyType',
				width: 150
			},
			{
				Header: appStrings.required,
				accessor: 'isRequired',
				width: 150
			}
		],
		defaultSorted: {
			id: 'docName',
			desc: false
		}
	};
	const storeConfig = {
		name,
		allRequest: allRequests.docType.all,
		allRequestConvertor: res => {
			return res.multiDocTypes.map(doc => {
				const partyType = allPartyTypes.find(p => p.id === doc.partyTypeId);
				const partyTypeName = partyType ? partyType.name : undefined;
				const maxLength = 50;
				return {
					docName: doc.docName.length > maxLength ? `${doc.docName.slice(0, maxLength)}...` : doc.docName,
					partyType: partyTypeName,
					partyTypeId: { value: doc.partyTypeId, label: partyTypeName },
					id: doc.id,
					isRequired: doc.isRequired ? 'true' : 'false'
				};
			});
		},
		createRequest: allRequests.docType.create,
		getCreateData: row => {
			return {
				docType: {
					docName: row.docName,
					isRequired: row.isRequired === 'true',
					partyTypeId: row.partyTypeId.value
				}
			};
		},
		updateRequest: allRequests.docType.update,
		getUpdateData: row => {
			return {
				docType: {
					docName: row.docName,
					isRequired: row.isRequired === 'true',
					partyTypeId: row.partyTypeId.value,
					id: row.id
				}
			};
		},
		deleteRequest: allRequests.docType.delete,
		getDeleteData: id => ({
			DocTypeID: id
		})
	};
	const store = createSlice(storeConfig);
	const App = createApp({ name, title, store, tableConfig });
	return <App />;
};

export default AllDocTypes;
