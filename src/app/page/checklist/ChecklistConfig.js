import React from 'react';
import { Redirect } from 'react-router-dom';

const ChecklistsAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/checklists',
			component: React.lazy(() => import('./ChecklistApp'))
		},
		{
			path: '/checklists/new',
			component: () => <Redirect to="/ChecklistApp'" />
		}
	]
};

export default ChecklistsAppConfig;
