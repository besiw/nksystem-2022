import { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import appStrings from 'app/strings';

const ProjectsAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: `/${appStrings.slug_projects}`,
			component: lazy(() => import('./ProjectsApp'))
		},
		{
			path: `/${appStrings.slug_projects}-archived`,
			component: lazy(() => import('./ArchivedProjects'))
		},
		{
			path: `/${appStrings.slug_projects}-deleted`,
			component: lazy(() => import('./DeletedProjects'))
		}
	]
};

export default ProjectsAppConfig;
