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
			path: '/partyType',
			component: React.lazy(() => import('./PartiesApp'))
		},
		{
			path: '/partyType/new',
			component: () => <Redirect to="/partyType" />
		}
	]
};

export default BuildingSuppliersAppConfig;
