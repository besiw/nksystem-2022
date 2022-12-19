import React from 'react';
import { Redirect } from 'react-router-dom';

const ServicesAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/services',
			component: React.lazy(() => import('./serviceApp'))
		},
		{
			path: '/services/new',
			component: () => <Redirect to="/services" />
		}
	]
};

export default ServicesAppConfig;
