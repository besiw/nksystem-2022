import React from 'react';
const LoginPage = React.lazy(() => import('./LoginPage'))
const LoginPageConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/login',
			element: <LoginPage/>
		}
	]
};

export default LoginPageConfig;
