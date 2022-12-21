import React from 'react';
import { Navigate } from 'react-router-dom';
const PartiesApp = React.lazy(() => import('./PartiesApp'))

const BuildingSuppliersAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/partyType',
			element: <PartiesApp/>
		},
		{
			path: '/partyType/new',
			element: <Navigate to="/partyType" />
		}
	]
};

export default BuildingSuppliersAppConfig;
