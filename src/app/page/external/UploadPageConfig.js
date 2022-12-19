import React, { lazy } from 'react';

const LoginPageConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/external/UploadDocument',
			component: lazy(() => import('./UploadDocs'))
		},
		{
			path: '/external/UpdateDeviation',
			component: lazy(() => import('./UpdateDeviation'))
		}
	]
};

export default LoginPageConfig;
