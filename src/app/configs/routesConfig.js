import FuseUtils from '@fuse/utils';

import { Navigate } from 'react-router-dom';
import appStrings from 'app/strings';

import ProjectsAppConfig from '../../app/page/projects/ProjectsAppConfig';
import settingsConfig from 'app/configs/settingsConfig';
import ProjectAppConfig from '../../app/page/project/ProjectAppConfig';
import ContactsAppConfig from 'app/page/contactList/ContactsAppConfig';
import BuildingSuppliersAppConfig from 'app/page/buildingSupplier/BuildingSupplierConfig';
import ChecklistAppConfig from 'app/page/checklist/ChecklistConfig';
import ServiceAppConfig from 'app/page/service/serviceAppConfig';
import DocTypeAppConfig from 'app/page/docType/DocTypeAppConfig';
import PartyTypeAppConfig from 'app/page/parties/PartiesAppConfig';
import EmailTemplateAppConfig from 'app/page/emailTemplate/EmailTemplaterConfig';
import TeamInfoConfig from 'app/page/teamInfo/teamInfoConfig';
import ExternalPageConfig from 'app/page/external/UploadPageConfig.js'
import AdminCompanyConfig from 'app/page/company/CompanyAppConfig.js'

const isAdmin = process.env.REACT_APP_IS_ADMIN_PANEL;
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
	TeamInfoConfig,
  ExternalPageConfig
];

const routes = isAdmin?[
  ...FuseUtils.generateRoutesFromConfigs([AdminCompanyConfig], settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to={`/company`} />
  },
]:[
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to={`/${appStrings.slug_projects}`} />
  },
];

export default routes;
