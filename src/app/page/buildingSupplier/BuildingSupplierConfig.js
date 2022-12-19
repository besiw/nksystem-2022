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
			path: '/building-supplier',
			component: React.lazy(() => import('./BuildingSupplierApp'))
		},
		{
			path: '/building-supplier/new',
			component: () => <Redirect to="/building-suppliers" />
		}
	]
};

export default BuildingSuppliersAppConfig;
