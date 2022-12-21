import React from 'react';
const  UserProfile= React.lazy(() => import('./userProfile'))
const UsersApp=React.lazy(() => import('./UsersApp'))
const CompanyProfile = React.lazy(() => import('./CompanyProfile'))
const TeamInfoConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/team/me',
			element: <UserProfile/>
		},
		{
			path: '/team/all',
			element: <UsersApp/>
		},
		{
			path: '/team/company',
			element: <CompanyProfile/>
		}
	]
};

export default TeamInfoConfig;
