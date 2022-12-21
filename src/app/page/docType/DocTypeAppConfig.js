import React from 'react';
import { Navigate } from 'react-router-dom';
const DocTypeApp = React.lazy(() => import('./DocTypeApp'))
const DocTypeAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/doctype',
			element: <DocTypeApp/>
		},
		{
			path: '/doctype/new',
			element: <Navigate to="/doctype"/>
		}
	]
};

export default DocTypeAppConfig;
