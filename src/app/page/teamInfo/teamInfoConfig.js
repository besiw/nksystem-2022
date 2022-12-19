import React from 'react';
import { Redirect } from 'react-router-dom';

const TeamInfoConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/team/me',
			component: React.lazy(() => import('./userProfile'))
		},
		{
			path: '/team/all',
			component: React.lazy(() => import('./UsersApp'))
		},
		{
			path: '/team/company',
			component: React.lazy(() => import('./CompanyProfile'))
		}
	]
};

export default TeamInfoConfig;
