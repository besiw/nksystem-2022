import axios from 'axios';
import { showMessage } from 'app/store/fuse/messageSlice';

const mockResponse = (data) => {
	return new Promise((resolve, reject) => {
		resolve(data);
	});
};


export const requestNBK = (requestOptions) => {
	const { requestConfig, body, dispatch } = requestOptions;
	const url = `${requestConfig.url}`; //
	const options = {
		url,
		method: requestConfig.method
	};
	let newUrl = url;

	if (requestConfig.method === 'DELETE') {
		if (typeof body === 'object') {
			const keys = Object.keys(body);
			let query = '?';
			keys.forEach((key, index) => {
				query += `${index === 0 ? '' : '&'}${key}=${body[key]}`;
			});

			newUrl += query;
			options.url = newUrl;
		}
		return axios
			.delete(options.url, { data: body })
			.then(res => processRes(res))
			.catch(error => processError(error, dispatch));
	}
	if (requestConfig.method === 'POST' || requestConfig.method === 'PUT') {
		options.data = body;
	}

	if (requestConfig.method === 'GET') {
		if (typeof body === 'object') {
			options.params = body;
		}
	}

	return axios(options)
		.then(res => {
			return processRes(res);
		})
		.catch(error => {
			console.log('error');
			console.log(options.url);
			console.log(options);
			return processError(error, dispatch);
		});
};

const processRes = (res) => {
	if (res.status === 401) {
		window.localStorage.removeItem('session_user_id');
		window.localStorage.removeItem('jwt_access_token');
		window.location.href = '/';
		return null;
	}
	if (res.data) {
		return res.data;
	}
	return res;
};

const processError = (error, dispatch) => {
	console.log(error);
	let message = '';
	if (error.response && error.response.data) {
		console.log(error.response.data); // => the response payload
		const { data } = error.response;
		message += data.message;
	} else {
		message += error.message;
	}
	if (dispatch) {
		dispatch(
			showMessage({
				message,
				options: {
					variant: 'error'
				}
			})
		);
	} else {
		console.log(error);
	}
	throw new Error(message);
};
export const requests= {
	auth: {
		login: {
			url: '/auth/login',
			method: 'POST',
			mockResponse: mockResponse({
				message: "Credentials sent to the user's email address",
				success: true
			})
		},
		forgotPassword: {
			url: '/UserProfile/ForgotPassword',
			method: 'GET',
			mockResponse: mockResponse({
				message: "Credentials sent to the user's email address",
				success: true
			})
		}
	},
	miscellaneous: {
		postCodes: {
			url: '/Miscellaneous/GetPostCodes',
			method: 'GET',
			mockResponse: mockResponse({
				postCodes: [
					{
						id: 1,
						postnummer: '0001',
						poststed: 'OSLO',
						kommunenummer: '301',
						kommunenavn: 'OSLO',
						kategori: 'P'
					},
					{
						id: 2,
						postnummer: '0010',
						poststed: 'OSLO',
						kommunenummer: '301',
						kommunenavn: 'OSLO',
						kategori: 'B'
					}
				]
			})
		}
	},
	company: {
		all: {
			url: '/company/GetAllProfiles',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		create: {
			url: '/company/AddNewCompanyProfile',
			method: 'PUT',
			mockResponse: mockResponse({})
		},
		get: {
			url: '/company/GetProfile',
			method: 'GET',
			mockResponse: mockResponse({
				companyProfile: {
					id: 1,
					companyName: '',
					organizationalNumber: '',
					address: '',
					ownerName: '',
					postCode: '',
					telephone: '',
					mobile: '',
					nameOnEmailAddress: '',
					senderEmailAddress: ''
				}
			})
		},
		update: {
			url: '/company/UpdateProfile',
			method: 'PUT',
			mockResponse: mockResponse({
				statusCode: 200
			})
		},
		getFolderName: {
			url: '/company/GetSingleCompanyFolder',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		addFolderName: {
			url: '/company/AddCompanyFolder',
			method: 'PUT',
			mockResponse: mockResponse({})
		},
		updateFolderName: {
			url: '/company/UpdateSingleCompanyFolder',
			method: 'PUT',
			mockResponse: mockResponse({})
		}
	},
	userProfile: {
		get: {
			url: '/UserProfile/GetUserProfile',
			method: 'GET',
			mockResponse: mockResponse({
				userProfile: {
					id: 29,
					userName: 'bessiew',
					designation: 'Manager',
					password: 'bessiew',
					userTypeId: 3,
					isActive: true,
					picture: 'NoImage.jpg',
					contactId: 7092
				}
			})
		},
		update: {
			url: '/UserProfile/UpdateUserProfile',
			method: 'PUT',
			mockResponse: mockResponse({
				statusCode: 200
			})
		},
		create: {
			url: '/UserProfile/CreatUserProfile',
			method: 'POST',
			mockResponse: mockResponse({
				statusCode: 200
			})
		},
		delete: {
			url: '/UserProfile/DeleteUserProfile',
			method: 'DELETE',
			mockResponse: mockResponse({
				statusCode: 200
			})
		},
		all: {
			url: '/UserProfile/GetAllUserProfile',
			method: 'GET',
			mockResponse: mockResponse({
				multiUserProfiles: [
					{
						id: 23,
						userName: 'umar',
						designation: 'Software Developer',
						password: 'saqib123',
						userTypeId: 3,
						isActive: true,
						picture: 'NoImage.jpg',
						contactId: 5907
					},
					{
						id: 29,
						userName: 'bessiew',
						designation: 'Manager',
						password: 'bessiew',
						userTypeId: 3,
						isActive: true,
						picture: 'NoImage.jpg',
						contactId: 5988
					}
				]
			})
		}
	},
	buildingSupplier: {
		all: {
			url: '/BuildingSupplier/GetAllBuildingSupplier',
			method: 'GET',
			mockResponse: mockResponse({
				multiBuildingSuppliers: [
					{
						id: 6,
						title: 'Hellvik Hus AS'
					},
					{
						id: 7,
						title: 'BoligPartner Ski'
					}
				]
			})
		},
		get: {
			url: '/BuildingSupplier/GetBuildingSupplier',
			method: 'GET',
			mockResponse: mockResponse({
				buildingSupplier: {
					id: 6,
					title: 'Hellvik Hus AS'
				}
			})
		},
		update: {
			url: '/BuildingSupplier/UpdateBuildingSupplier',
			method: 'PUT',
			mockResponse: mockResponse({
				buildingSupplier: {
					id: 6,
					title: 'Hellvik Hus AS'
				}
			})
		},
		create: {
			url: '/BuildingSupplier/CreatBuildingSupplier',
			method: 'POST',
			mockResponse: mockResponse({
				buildingSupplier: {
					title: 'Test PostMan API'
				}
			})
		},
		delete: {
			url: '/BuildingSupplier/DeleteBuildingSupplier',
			method: 'DELETE',
			mockResponse: mockResponse({})
		}
	},
	contact: {
		all: {
			url: '/Contact/GetAllContact',
			method: 'GET',
			mockResponse: mockResponse({
				multiContact: [
					{
						id: 3001,
						name: 'IEC-HUS Øst v/Øyvind Vedvik',
						contactNo: '46797409',
						email: 'oyvind.vedvik@iec-hus.no',
						companyName: null
					},
					{
						id: 3015,
						name: 'Sonie',
						contactNo: '3424234',
						email: 'sonie@sony.com',
						companyName: 'Sony'
					},
					{
						id: 3017,
						name: 'Mahmood',
						contactNo: '20202020',
						email: 'mahmood@mehmood.com',
						companyName: 'Avionics'
					}
				]
			})
		},
		get: {
			url: '/Contact/GetContact',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		create: {
			url: '/Contact/CreatContact',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		update: {
			url: '/Contact/UpdateContact',
			method: 'PUT',
			mockResponse: mockResponse({})
		},
		delete: {
			url: '/Contact/DeleteContact',
			method: 'DELETE',
			mockResponse: mockResponse({})
		}
	},
	partyType: {
		all: {
			url: '/PartyType/GetAllPartyType',
			method: 'GET',
			mockResponse: mockResponse({
				multiPartyTypes: [
					{
						id: 5,
						name: 'Prosjekterende',
						isDefault: true
					},
					{
						id: 8,
						name: 'UTF Våtrom',
						isDefault: true
					},
					{
						id: 9,
						name: 'UTF Rørlegger',
						isDefault: true
					},
					{
						id: 10,
						name: 'UTF Tømrer',
						isDefault: true
					},
					{
						id: 15,
						name: 'Ansvarlig søker',
						isDefault: false
					}
				]
			})
		},
		get: {
			url: '/PartyType/GetPartyType',
			method: 'GET',
			mockResponse: mockResponse({
				id: 5,
				name: 'Prosjekterende',
				isDefault: true
			})
		},
		create: {
			url: '/PartyType/CreatPartyType',
			method: 'POST',
			mockResponse: mockResponse({
				id: 5,
				name: 'Prosjekterende',
				isDefault: true
			})
		},
		update: {
			url: '/PartyType/UpdatePartyType',
			method: 'PUT',
			mockResponse: mockResponse({
				id: 5,
				name: 'Prosjekterende',
				isDefault: true
			})
		},
		delete: {
			url: '/PartyType/DeletePartyType',
			method: 'DELETE',
			mockResponse: mockResponse({
				id: 5,
				name: 'Prosjekterende',
				isDefault: true
			})
		}
	},
	docType: {
		all: {
			url: '/DocType/GetAllDocType',
			method: 'GET',
			mockResponse: mockResponse({
				multiDocTypes: [
					{
						id: 64,
						partyTypeId: 5,
						docName: 'Tegning som viser slukplassering i plan og høyde',
						isRequired: true
					}
				]
			})
		},
		get: {
			url: '/DocType/GetDocType',
			method: 'GET',
			mockResponse: mockResponse({
				id: 64,
				partyTypeId: 5,
				docName: 'Tegning som viser slukplassering i plan og høyde',
				isRequired: true
			})
		},
		create: {
			url: '/DocType/CreatDocType',
			method: 'POST',
			mockResponse: mockResponse({
				id: 64,
				partyTypeId: 5,
				docName: 'Tegning som viser slukplassering i plan og høyde',
				isRequired: true
			})
		},
		update: {
			url: '/DocType/UpdateDocType',
			method: 'PUT',
			mockResponse: mockResponse({
				id: 64,
				partyTypeId: 5,
				docName: 'Tegning som viser slukplassering i plan og høyde',
				isRequired: true
			})
		},
		delete: {
			url: '/DocType/DeleteDocType',
			method: 'DELETE',
			mockResponse: mockResponse({})
		}
	},
	emailTemplate: {
		all: {
			url: '/EmailTemplate/GetAllEmailTemplate',
			method: 'GET',
			mockResponse: mockResponse({
				multiEmailTemplates: [
					{
						id: 2,
						title: 'Erklæring om ansvarsrett for Uavhengig Kontroll på #Address#',
						template:
							'<p style="line-height: 20.7999992370605px;">Hei #ansvarlig#,</p>\r\n\r\n<p style="line-height: 20.7999992370605px;">Vedlagt ligger v&aring;r ansvarsrett for uavhengig kontroll p&aring; #ProjectTitle#.</p>\r\n\r\n<p style="line-height: 20.7999992370605px;">Lykke til med s&oslash;knaden, ser fram til &aring; h&oslash;re fra dere n&aring;r det foreligger IG p&aring; tiltaket.</p>\r\n\r\n<p style="line-height: 20.7999992370605px;">Med vennlig hilsen</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">#Name#</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">#Designation#</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">Norsk Byggekontroll AS</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">T: +47 64 80 80 76&nbsp;<span style="line-height: 20.8px;">&nbsp;I M: </span>#PhoneNumber#</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">#Email# I www.norskbyggekontroll.no</p>\r\n'
					}
				]
			})
		},
		get: {
			url: '/EmailTemplate/GetEmailTemplate',
			method: 'GET',
			mockResponse: mockResponse({
				id: 2,
				title: 'Erklæring om ansvarsrett for Uavhengig Kontroll på #Address#',
				template:
					'<p style="line-height: 20.7999992370605px;">Hei #ansvarlig#,</p>\r\n\r\n<p style="line-height: 20.7999992370605px;">Vedlagt ligger v&aring;r ansvarsrett for uavhengig kontroll p&aring; #ProjectTitle#.</p>\r\n\r\n<p style="line-height: 20.7999992370605px;">Lykke til med s&oslash;knaden, ser fram til &aring; h&oslash;re fra dere n&aring;r det foreligger IG p&aring; tiltaket.</p>\r\n\r\n<p style="line-height: 20.7999992370605px;">Med vennlig hilsen</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">#Name#</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">#Designation#</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">Norsk Byggekontroll AS</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">T: +47 64 80 80 76&nbsp;<span style="line-height: 20.8px;">&nbsp;I M: </span>#PhoneNumber#</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">#Email# I www.norskbyggekontroll.no</p>\r\n'
			})
		},
		create: {
			url: '/EmailTemplate/CreatEmailTemplate',
			method: 'POST',
			mockResponse: mockResponse({
				id: 2,
				title: 'Erklæring om ansvarsrett for Uavhengig Kontroll på #Address#',
				template:
					'<p style="line-height: 20.7999992370605px;">Hei #ansvarlig#,</p>\r\n\r\n<p style="line-height: 20.7999992370605px;">Vedlagt ligger v&aring;r ansvarsrett for uavhengig kontroll p&aring; #ProjectTitle#.</p>\r\n\r\n<p style="line-height: 20.7999992370605px;">Lykke til med s&oslash;knaden, ser fram til &aring; h&oslash;re fra dere n&aring;r det foreligger IG p&aring; tiltaket.</p>\r\n\r\n<p style="line-height: 20.7999992370605px;">Med vennlig hilsen</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">#Name#</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">#Designation#</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">Norsk Byggekontroll AS</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">T: +47 64 80 80 76&nbsp;<span style="line-height: 20.8px;">&nbsp;I M: </span>#PhoneNumber#</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">#Email# I www.norskbyggekontroll.no</p>\r\n'
			})
		},
		update: {
			url: '/EmailTemplate/UpdateEmailTemplate',
			method: 'PUT',
			mockResponse: mockResponse({
				id: 2,
				title: 'Erklæring om ansvarsrett for Uavhengig Kontroll på #Address#',
				template:
					'<p style="line-height: 20.7999992370605px;">Hei #ansvarlig#,</p>\r\n\r\n<p style="line-height: 20.7999992370605px;">Vedlagt ligger v&aring;r ansvarsrett for uavhengig kontroll p&aring; #ProjectTitle#.</p>\r\n\r\n<p style="line-height: 20.7999992370605px;">Lykke til med s&oslash;knaden, ser fram til &aring; h&oslash;re fra dere n&aring;r det foreligger IG p&aring; tiltaket.</p>\r\n\r\n<p style="line-height: 20.7999992370605px;">Med vennlig hilsen</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">#Name#</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">#Designation#</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">Norsk Byggekontroll AS</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">T: +47 64 80 80 76&nbsp;<span style="line-height: 20.8px;">&nbsp;I M: </span>#PhoneNumber#</p>\r\n\r\n<p style="line-height: 20.8px; margin: 0px;">#Email# I www.norskbyggekontroll.no</p>\r\n'
			})
		},
		delete: {
			url: '/EmailTemplate/DeleteEmailTemplate',
			method: 'DELETE',
			mockResponse: mockResponse({})
		},
		templateFields: {
			url: '/EmailTemplate/GetAllEmailHashtags',
			method: 'GET',
			mockResponse: mockResponse({})
		}
	},
	service: {
		all: {
			url: '/Service/GetAllService',
			method: 'GET',
			mockResponse: mockResponse({
				multiService: [
					{
						id: 6,
						name: 'Trykktest',
						description: 'Trykktest',
						serviceTypeId: 3,
						serviceChargedAs: 1,
						rate: '5500',
						servicePerSlabList: null
					}
				]
			})
		},
		get: {
			url: '/Service/GetService',
			method: 'GET',
			mockResponse: mockResponse({
				id: 6,
				name: 'Trykktest',
				description: 'Trykktest',
				serviceTypeId: 3,
				serviceChargedAs: 1,
				rate: '5500',
				servicePerSlabList: null
			})
		},
		create: {
			url: '/Service/CreateService',
			method: 'POST',
			mockResponse: mockResponse({
				id: 6,
				name: 'Trykktest',
				description: 'Trykktest',
				serviceTypeId: 3,
				serviceChargedAs: 1,
				rate: '5500',
				servicePerSlabList: null
			})
		},
		update: {
			url: '/Service/UpdateService',
			method: 'PUT',
			mockResponse: mockResponse({
				id: 6,
				name: 'Trykktest',
				description: 'Trykktest',
				serviceTypeId: 3,
				serviceChargedAs: 1,
				rate: '5500',
				servicePerSlabList: null
			})
		},
		delete: {
			url: '/Service/DeleteService',
			method: 'DELETE',
			mockResponse: mockResponse({
				id: 6,
				name: 'Trykktest',
				description: 'Trykktest',
				serviceTypeId: 3,
				serviceChargedAs: 1,
				rate: '5500',
				servicePerSlabList: null
			})
		}
	},
	project: {
		projectsCount: {
			url: '/Project/GetProjectsCount',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		all: {
			url: '/Project/GetAllProjectList',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		allActive: {
			url: '/Project/GetAllProjectListNotArchivedOrDeleted',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		allDeleted: {
			url: '/Project/GetAllDeletedProjectList',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		allArchived: {
			url: '/Project/GetAllArchivedProjectList',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		get: {
			url: '/Project/GetProject',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		create: {
			url: '/Project/CreatProject',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		update: {
			url: '/Project/UpdateProject',
			method: 'PUT',
			mockResponse: mockResponse({})
		},
		delete: {
			url: '/Project/DeleteProject',
			method: 'DELETE',
			mockResponse: mockResponse({})
		},
		archive: {
			url: '/Project/ArchiveProject',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		deleteServcie: {
			url: '/Project/DeleteProjectService',
			method: 'DELETE',
			mockResponse: mockResponse({})
		},
		getAllProjectChecklists: {
			url: '/Project/GetAllProjectChecklists',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		getSingleProjectChecklist: {
			url: '/Project/GetSingleProjectChecklist',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		createSingleProjectChecklist: {
			url: '/Project/CreateSingleProjectChecklist',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		updateSingleProjectChecklist: {
			url: '/Project/UpdateSingleProjectChecklist',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		deleteSingleProjectChecklist: {
			url: '/Project/DeleteSingleProjectChecklist',
			method: 'DELETE',
			mockResponse: mockResponse({})
		},
		createSingleProjectChecklistItem: {
			url: '/Project/CreatSingleProjectChecklistItem',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		updateSingleProjectChecklistItem: {
			url: '/Project/UpdateSingleProjectChecklistItem',
			method: 'PUT',
			mockResponse: mockResponse({})
		},
		deleteSingleProjectChecklistItem: {
			url: '/Project/DeleteSingleProjectChecklistItem',
			method: 'DELETE',
			mockResponse: mockResponse({})
		},
		getInspectors: {
			url: '/Project/GetInspectorUsers',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		getAllDocsAllParties: {
			url: '/Project/ProjectRequiredDocListAllParties',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		getAllDocsPerParty: {
			url: '/Project/ProjectRequiredDocListBySingleParty',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		// ProjectApprovalRequiredDocList
		getApprovedRequiredDocs: {
			url: '/Project/ProjectApprovalRequiredDocList',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		postUploadedDocs: {
			url: '/Project/ProjectUploadDocument',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		deleteUploadedDocs: {
			url: '/Project/DeleteProjectDocument',
			method: 'DELETE',
			mockResponse: mockResponse({})
		},
		getSystemGeneratedDocs: {
			url: '/Project/ProjectSystemGeneratedDocListAllSteps',
			method: 'GET',
			mockResponse: mockResponse({})
		}
	},
	checklistTemplate: {
		all: {
			url: '/ChecklistTemplate/GetAllChecklistTemplate',
			method: 'GET',
			mockResponse: mockResponse({
				multiPartyTypes: []
			})
		},
		get: {
			url: '/ChecklistTemplate/GetChecklistTemplate',
			method: 'GET',
			mockResponse: mockResponse({
				id: 5,
				name: 'Prosjekterende',
				isDefault: true
			})
		},
		create: {
			url: '/ChecklistTemplate/CreatChecklistTemplateWithItems',
			method: 'POST',
			mockResponse: mockResponse({
				id: 5,
				name: 'Prosjekterende',
				isDefault: true
			})
		},
		update: {
			url: '/ChecklistTemplate/UpdateChecklistTemplate',
			method: 'PUT',
			mockResponse: mockResponse({
				id: 5,
				name: 'Prosjekterende',
				isDefault: true
			})
		},
		delete: {
			url: '/ChecklistTemplate/DeleteChecklistTemplate',
			method: 'DELETE',
			mockResponse: mockResponse({
				id: 5,
				name: 'Prosjekterende',
				isDefault: true
			})
		}
	},
	checklistTemplateItem: {
		create: {
			url: '/ChecklistTemplate/CreatChecklistItemTempByChecklistTempId',
			method: 'POST',
			mockResponse: mockResponse({
				checklistItemTemplate: {
					id: 88,
					checklistId: 36,
					title: 'alkdflkasdlfk question 1'
				}
			})
		},
		update: {
			url: '/ChecklistTemplate/UpdateSingleChecklistItemTemp',
			method: 'PUT',
			mockResponse: mockResponse({
				checklistItemTemplate: {
					id: 88,
					checklistId: 36,
					title: 'alkdflkasdlfk question 1'
				}
			})
			// UpdateSingleChecklistItemTemp
		},
		delete: {
			url: '/ChecklistTemplate/DeleteSingleChecklistItemTemp',
			method: 'DELETE',
			mockResponse: mockResponse({
				id: 5,
				name: 'Prosjekterende',
				isDefault: true
			})
		}
	},
	projectWorkflow: {
		getCompletedSteps: {
			url: '/ProjectWorkflow/GetProjectWorkflowCompletedTransferedSteps',
			method: 'GET',
			mockResponse: mockResponse({
				multiWorkflowCategory: [
					{
						id: 1,
						name: 'UK Våtrom',
						isDefault: true
					}
				]
			})
		},
		w1s1post: {
			url: '/ProjectWorkflow/ProjectWFOne', // (int ProjectID, int WorkflowID, int WorkflowStepID)
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s1get: {
			url: '/ProjectWorkflow/GetProjectWFOneEmailFormated', // (int ProjectID, int WorkflowID, int WorkflowStepID)
			method: 'POST',
			mockResponse: mockResponse({})
		},

		w1s2post: {
			url: '/ProjectWorkflow/ProjectWFTwo',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s2get: {
			url: '/ProjectWorkflow/GetProjectWFTwoEmailFormated',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s3post: {
			url: '/ProjectWorkflow/ProjectWFThree',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s3get: {
			url: '/ProjectWorkflow/GetProjectWFThree',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s4post: {
			url: '/ProjectWorkflow/ProjectWFFour',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s4get: {
			url: '/ProjectWorkflow/GetProjectWFFourEmailFormated',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s5post: {
			url: '/ProjectWorkflow/ProjectWFFive',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s6post: {
			url: '/ProjectWorkflow/ProjectWFSix',
			method: 'POST',
			mockResponse: mockResponse({})
		},

		w1s7getProjectParties: {
			url: '/Project/GetAllProjectPartiesByProjectID',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		w1s7linkPartiesToProject: {
			url: '/Project/AssociatePartyWithProjectPartyType',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s8getProjectLeader: {
			// /Project/AssociateProjectLeaderWithProject
			url: '/Project/GetProjectLeaderWithProjectID',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		w1s8postProjectLeader: {
			// /Project/AssociateProjectLeaderWithProject
			url: '/Project/AssociateProjectLeaderWithProject',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s8getReminder: {
			url: '/Project/GetProjectContactCustomerReminderDate',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		w1s8postReminder: {
			url: '/ProjectWorkflow/ProjectWFSeven',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s9getEmail: {
			url: '/ProjectWorkflow/GetProjectWFEightEmailFormated',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s9postEmail: {
			url: '/ProjectWorkflow/ProjectWFEightSendEmail',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s9transfer: {
			url: '/ProjectWorkflow/ProjectWFEightTransfer',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s10getEmail: {
			url: '/ProjectWorkflow/GetProjectWFNineEmailFormated',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s10postEmail: {
			url: '/ProjectWorkflow/ProjectWFNineSendEmail',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s10transfer: {
			url: '/ProjectWorkflow/ProjectWFNineTransfer',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s11postInspection: {
			url: '/ProjectWorkflow/ProjectWFTen',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s11transfer: {
			url: '/ProjectWorkflow/ProjectWFTenTransfer',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s11getInspection: {
			url: '/project/GetProjectWFTenSavedDetails',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		w1s12getAllChecklistsData: {
			url: '/project/GetAllProjectChecklistsInspData',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		w1s12UpdateChecklistItem: {
			url: '/project/UpdateSingleProjectChecklistItemInspData',
			method: 'PUT',
			mockResponse: mockResponse({})
		},
		w1s12getFormatedEmail: {
			url: '/project/GetProjectInspThirPartyEmailFormated',
			method: 'POST',
			mockResponse: mockResponse({})
		},

		w1s12sendEmail: {
			url: '/project/ProjectInspThirPartySendEmail',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s12done: {
			url: '/projectWorkflow/ProjectWFElevenDone',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s13getInvoiceDetails: {
			url: '/ProjectWorkflow/ProjectWFFifteenGetDetails',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s13sendInvoice: {
			url: '/ProjectWorkflow/ProjectWFFifteen',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s14getEmail: {
			url: '/ProjectWorkflow/GetProjectWFThirteenEmailFormated',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s14sendEmail: {
			url: '/ProjectWorkflow/ProjectWFThirteen',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s15getReport: {
			url: '/ProjectWorkflow/GetProjectWFFourteenEmailFormated',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1s15sendReport: {
			url: '/ProjectWorkflow/ProjectWFFourteen',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1PartyDocsRequiredFromParty: {
			url: '/PartyDoc/GetDocumentsListRequiredFromParty',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		w1PartyDocsSinglePartyUploaded: {
			url: '/PartyDoc/GetProjectSinglePartyDocsUploadedFileList',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		w1PartyDocsCountByParty: {
			url: '/PartyDoc/GetDocumentsListCountUploadByParty',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		w1PartyDocsUploadDocumentFromParty: {
			url: '/PartyDoc/UploadDocumentFromParty',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w1GetAllParties: {
			url: '/Project/GetAllProjectPartiesByProjectID',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		w2s1getInfo: {
			url: '/ProjectWorkflow/GetProjectWFTwoStepOne',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		w2s1postInfo: {
			url: '/ProjectWorkflow/UpdateProjectWFTwoStepOne',
			method: 'PUT',
			mockResponse: mockResponse({})
		}
	},
	workflow: {
		all: {
			url: '/WorkflowCategory/GetAllWorkflowCategory',
			method: 'GET',
			mockResponse: mockResponse({
				multiWorkflowCategory: [
					{
						id: 1,
						name: 'UK Våtrom',
						isDefault: true
					}
				]
			})
		},
		get: {
			url: '/WorkflowCategory/GetWorkflowCategory',
			method: 'GET',
			mockResponse: mockResponse({
				id: 1,
				name: 'UK Våtrom',
				isDefault: true
			})
		},
		getSteps: {
			url: '/WorkflowCategory/GetWorkflowCategoryStepsForOneWorkflow',
			method: 'GET',
			mockResponse: mockResponse({
				multiWorkflowCategorySteps: [
					{
						id: 1,
						workflowCategoryId: 1,
						stepName: 'Send e-post: Takk for bestillingen',
						stepSequence: 1,
						isActive: true,
						isTransferable: true
					},
					{
						id: 2,
						workflowCategoryId: 1,
						stepName: 'Opprett og send: Erklæring om ansvarsrett',
						stepSequence: 2,
						isActive: true,
						isTransferable: true
					},
					{
						id: 3,
						workflowCategoryId: 1,
						stepName: 'Last opp Igangsettelsestillatelse - IG',
						stepSequence: 3,
						isActive: true,
						isTransferable: true
					},
					{
						id: 5,
						workflowCategoryId: 1,
						stepName: 'Send e-post: Gratulerer med Godkjent byggesøknad.',
						stepSequence: 4,
						isActive: true,
						isTransferable: true
					},
					{
						id: 6,
						workflowCategoryId: 1,
						stepName: 'Opprett Sjekklister for Prosjektet',
						stepSequence: 5,
						isActive: true,
						isTransferable: true
					},
					{
						id: 7,
						workflowCategoryId: 1,
						stepName: 'La til: Foretak i prosjektet',
						stepSequence: 6,
						isActive: true,
						isTransferable: true
					},
					{
						id: 8,
						workflowCategoryId: 1,
						stepName: 'Tildel prosjektleder og send påminnelse om kontroll til tiltakshaver',
						stepSequence: 7,
						isActive: true,
						isTransferable: true
					},
					{
						id: 9,
						workflowCategoryId: 1,
						stepName: 'Send e-post til tiltakshaver for kommende kontroll',
						stepSequence: 8,
						isActive: true,
						isTransferable: true
					},
					{
						id: 10,
						workflowCategoryId: 1,
						stepName: 'Send e-post til foretak for innhenting av dokumentasjon',
						stepSequence: 9,
						isActive: true,
						isTransferable: true
					},
					{
						id: 11,
						workflowCategoryId: 1,
						stepName: 'Sett dato for kontroll og tildel kontrollør',
						stepSequence: 10,
						isActive: true,
						isTransferable: true
					},
					{
						id: 12,
						workflowCategoryId: 1,
						stepName: 'Gjennomgå rapport fra utført kontroll',
						stepSequence: 11,
						isActive: true,
						isTransferable: true
					},
					{
						id: 13,
						workflowCategoryId: 1,
						stepName: 'Send faktura',
						stepSequence: 12,
						isActive: true,
						isTransferable: true
					},
					{
						id: 14,
						workflowCategoryId: 1,
						stepName: 'Lag Kontrollerklæring og send til Ansvarlig søker',
						stepSequence: 13,
						isActive: true,
						isTransferable: true
					},
					{
						id: 15,
						workflowCategoryId: 1,
						stepName: 'Opprett sluttrapport på prosjektet og send til tiltakshaver',
						stepSequence: 14,
						isActive: true,
						isTransferable: true
					}
				]
			})
		}
	},
	docs: {
		getSinglePartyUploadedFileList: {
			url: '/PartyDoc/GetProjectSinglePartyDocsUploadedFileList',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		getSinglePartyRequiredFileList: {
			url: '/PartyDoc/GetDocumentsListRequiredFromParty',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		// /PartyDoc/GetDocumentsListCountUploadByParty?WorkflowId=1&ProjectId=3375&PartyID=5846&PartyTypeID=5&UrlKey=juK1OidIM5kDBtdr
		getSinglePartyDocCount: {
			url: '/PartyDoc/GetDocumentsListCountUploadByParty',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		postSinglePartyUploadFile: {
			url: '/PartyDoc/UploadDocumentFromParty',
			method: 'POST',
			mockResponse: mockResponse({})
		},
		getChecklistItemsForParty: {
			url: '/PartyDoc/GetChecklistItemInspectinDataForParty',
			method: 'GET',
			mockResponse: mockResponse({})
		},
		postChecklistItemsForParty: {
			url: '/PartyDoc/UploadChecklistItemImageInspectinDataFromParty',
			method: 'POST',
			mockResponse: mockResponse({})
		}
		/*         getChecklistItemsForParty:{
			url:'/PartyDoc/GetChecklistItemInspectinDataForParty',
			method: 'POST',
			mockResponse: mockResponse({})
		} */
		// http://nksystem-dev.eu-north-1.elasticbeanstalk.com/api/PartyDoc/GetDocumentsListRequiredFromParty?WorkflowId=1&ProjectId=3375&PartyID=5846&PartyTypeID=5&UrlKey=juK1OidIM5kDBtdr
	}
};

export default requests;
