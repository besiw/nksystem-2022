import { lazy } from 'react';
import appStrings from 'app/strings';
const ProjectsApp=lazy(() => import('./ProjectsApp'))
const ArchivedProjects = lazy(() => import('./ArchivedProjects'))
const DeletedProjects = lazy(() => import('./DeletedProjects'))

const ProjectsAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: `/${appStrings.slug_projects}`,
			element: <ProjectsApp />,
		},
		{
			path: `/${appStrings.slug_projects}-archived`,
			element: <ArchivedProjects />,
		},
		{
			path: `/${appStrings.slug_projects}-deleted`,
			element: <DeletedProjects />,
		}
	]
};

export default ProjectsAppConfig;
