import createApp from 'app/main/apps/GeneralCrudAppCreator/createApp';
import createSlice from 'app/main/apps/GeneralCrudAppCreator/createSlice';
import allRequests from 'api/allRequests';
import appStrings from 'app/strings';

const title = 'Email Templates';
const name = 'email-templates';
const store = createSlice({
	name,
	allRequest: allRequests.emailTemplate.all,
	allRequestConvertor: res => res.multiEmailTemplates,
	createRequest: allRequests.emailTemplate.create,
	getCreateData: row => {
		return {
			emailTemplate: row
		};
	},
	updateRequest: allRequests.emailTemplate.update,
	getUpdateData: row => ({
		emailTemplate: row
	}),
	deleteRequest: allRequests.emailTemplate.delete,
	getDeleteData: id => ({
		EmailTemplateID: id
	})
});
const tableConfig = {
	inputKeys: [
		{
			id: 'title',
			required: true,
			type: 'text'
		},
		{
			id: 'template',
			required: true,
			type: 'editor'
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
