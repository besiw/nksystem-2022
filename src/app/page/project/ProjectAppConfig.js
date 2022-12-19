import { lazy } from 'react';

import slugs from 'app/strings';

const ProjectAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: `/${slugs.slug_project}/:projectId`,
			component: lazy(() => import('./ProjectApp'))
		},
		{
			path: `/${slugs.slug_project}`,
			component: lazy(() => import('./ProjectApp'))
		}
	]
};

export default ProjectAppConfig;
