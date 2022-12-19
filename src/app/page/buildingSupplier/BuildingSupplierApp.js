import createApp from 'app/main/apps/GeneralCrudAppCreator/createApp';
import createSlice from 'app/main/apps/GeneralCrudAppCreator/createSlice';
import allRequests from 'api/allRequests';
import appStrings from 'app/strings';

const title = 'Building Supplier';
const name = 'buildingSupplier';
const store = createSlice({
	name,
	allRequest: allRequests.buildingSupplier.all,
	allRequestConvertor: res => res.multiBuildingSuppliers,
	createRequest: allRequests.buildingSupplier.create,
	getCreateData: row => ({
		buildingSupplier: {
			title: row.title
		}
	}),
	updateRequest: allRequests.buildingSupplier.update,
	getUpdateData: row => ({
		buildingSupplier: {
			id: row.id,
			title: row.title
		}
	}),
	deleteRequest: allRequests.buildingSupplier.delete,
	getDeleteData: id => ({
		BuildingSupplierID: id
	})
});
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
export default createApp({ name, title, store, tableConfig });
