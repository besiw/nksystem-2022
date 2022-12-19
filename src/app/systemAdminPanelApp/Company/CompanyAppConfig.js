import { lazy, useState } from 'react';

import { Redirect } from 'react-router-dom';
import appStrings from 'app/strings';

const CompanyAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: `/company/:companyId`,
			component: lazy(() => import('./CompanyProfile'))
		},
		{
			path: `/company`,
			component: lazy(() => import('./AllCompaniesApp'))
		},
		{
			path: `/`,
			component: lazy(() => import('./AllCompaniesApp'))
		}
	]
};

export default CompanyAppConfig;
