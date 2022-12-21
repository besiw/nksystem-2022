import React from 'react';
import { Navigate } from 'react-router-dom';
const ChecklistApp = React.lazy(() => import('./ChecklistApp'));

const ChecklistsAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/checklists',
			element: <ChecklistApp />
		},
		{
			path: '/checklists/new',
			element: < Navigate to="/ChecklistApp"/>
		}
	]
};

export default ChecklistsAppConfig;
