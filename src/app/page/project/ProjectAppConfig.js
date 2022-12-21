import { lazy } from 'react';

import slugs from 'app/strings';

const ProjectApp = lazy(() => import('./ProjectApp'));

const ProjectAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: `/${slugs.slug_project}/:projectId/*`,
			element: <ProjectApp />
		},
		{
			path: `/${slugs.slug_project}`,
			element: <ProjectApp />
		}
	]
};

export default ProjectAppConfig;
