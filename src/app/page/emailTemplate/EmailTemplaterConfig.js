import React from 'react';
import { Redirect } from 'react-router-dom';

const BuildingSuppliersAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/email-template',
			component: React.lazy(() => import('./EmailTemplateApp'))
		},
		{
			path: '/email-template/new',
			component: () => <Redirect to="/building-suppliers" />
		}
	]
};

export default BuildingSuppliersAppConfig;
