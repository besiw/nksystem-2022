import React, { lazy } from 'react';
const UploadDocs = lazy(() => import('./UploadDocs'))
const UpdateDeviation = lazy(() => import('./UpdateDeviation'))

const LoginPageConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/external/UploadDocument',
			element: <UploadDocs/>
		},
		{
			path: '/external/UpdateDeviation',
			element: <UpdateDeviation />		}
	]
};

export default LoginPageConfig;
