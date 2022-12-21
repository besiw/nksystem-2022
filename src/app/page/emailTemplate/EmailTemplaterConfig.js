import React from 'react';
const EmailTemplateApp = React.lazy(() => import('./EmailTemplateApp'))
import { Navigate } from 'react-router-dom';

const BuildingSuppliersAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/email-template',
			element: <EmailTemplateApp />		},
		{
			path: '/email-template/new',
			element: <Navigate to="/building-suppliers" />
		}
	]
};

export default BuildingSuppliersAppConfig;
