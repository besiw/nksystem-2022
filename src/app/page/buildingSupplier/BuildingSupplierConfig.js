import React from 'react';
import { Navigate } from 'react-router-dom';
const BuildingSupplierApp =  React.lazy(() => import('./BuildingSupplierApp'));


const BuildingSuppliersAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/building-supplier',
			element: <BuildingSupplierApp />
		},
		{
			path: '/building-supplier/new',
			element: <Navigate to="/building-suppliers" />
		}
	]
};

export default BuildingSuppliersAppConfig;
