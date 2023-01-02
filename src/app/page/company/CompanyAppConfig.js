import { lazy, useState } from 'react';
const CompanyProfile  = lazy(() => import('./CompanyProfile'));
const  AllCompaniesApp= lazy(() => import('./AllCompaniesApp'))


const CompanyAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: `/company/:companyId/*`,
			element: <CompanyProfile />
		},
		{
			path: `/company/:companyId`,
			element: <CompanyProfile />
		},
		{
			path: `/company`,
			element: <AllCompaniesApp/>
		},
		{
			path: `/`,
			element:<AllCompaniesApp/>
		}
	]
};

export default CompanyAppConfig;
