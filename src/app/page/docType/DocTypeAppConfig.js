import React from 'react';
import { Redirect } from 'react-router-dom';

const DocTypeAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/doctype',
			component: React.lazy(() => import('./DocTypeApp'))
		},
		{
			path: '/doctype/new',
			component: () => <Redirect to="/doctype" />
		}
	]
};

export default DocTypeAppConfig;
