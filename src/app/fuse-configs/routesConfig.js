import React from 'react';
import { Navigate } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import slugs from 'app/strings';
import ExampleConfig from 'app/main/example/ExampleConfig';
import ProjectAppConfig from 'app/page/project/ProjectAppConfig';
import ProjectsAppConfig from 'app/page/projects/ProjectsAppConfig';
import ContactsAppConfig from 'app/page/contactList/ContactsAppConfig';
import BuildingSuppliersAppConfig from 'app/page/buildingSupplier/BuildingSupplierConfig';
import ChecklistAppConfig from 'app/page/checklist/ChecklistConfig';
import ServiceAppConfig from 'app/page/service/serviceAppConfig';
import DocTypeAppConfig from 'app/page/docType/DocTypeAppConfig';
import PartyTypeAppConfig from 'app/page/parties/PartiesAppConfig';
import EmailTemplateAppConfig from 'app/page/emailTemplate/EmailTemplaterConfig';
import TeamInfoConfig from 'app/page/teamInfo/teamInfoConfig';

const routeConfigs = [
	ProjectsAppConfig,
	ProjectAppConfig,
	ContactsAppConfig,
	BuildingSuppliersAppConfig,
	ChecklistAppConfig,
	DocTypeAppConfig,
	PartyTypeAppConfig,
	EmailTemplateAppConfig,
	ServiceAppConfig,
	TeamInfoConfig
];

const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs),
	{
		path: '/',
		element: <Navigate  to={`/${slugs.slug_projects}`} />
	}
];

export default routes;
