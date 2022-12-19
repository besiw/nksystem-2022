import FusePageCarded from '@fuse/core/FusePageCarded';
import FuseLoading from '@fuse/core/FuseLoading';
import withReducer from 'app/store/withReducer';
import { lazy, useState } from 'react';
import slugs from 'app/strings';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Redirect, useRouteMatch, useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import reducer from './store';
import { newProject, getProject, resetProject, getProjectWithWorkflow } from './store/projectSlice';

const TestRouteComponent = props => {
	const params = useParams();
	const project = useSelector(({ projectApp }) => projectApp.project && projectApp.project.info);
	return <div>test component</div>;
};

function Projects() {
	console.log('project')
	const { path, url } = useRouteMatch();
	const dispatch = useDispatch();

	const routeParams = useParams();

	const [noproject, setNoproject] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useDeepCompareEffect(() => {
		function updateprojectState() {
			const { projectId } = routeParams;
			dispatch(newProject());
			if (projectId !== 'new') {
				/**
				 * Get project data
				 */
				setIsLoading(true);
				dispatch(getProjectWithWorkflow(routeParams)).then(action => {
					/**
					 * If the requested project is not exist show message
					 */
					setIsLoading(false);
					if (!action.payload) {
						setNoproject(true);
					}
				});
			}
		}
		updateprojectState();
	}, [dispatch, routeParams]);
	console.log(routes)
	return isLoading ? (
		<FuseLoading />
	) : (
		<div>project</div>
	);
}

export default withReducer('projectApp', reducer)(Projects);

const routes = [
	{
		path: `/${slugs.slug_project}/:projectId/docs/:workflowId`,
		component: lazy(() => import('./projectWorkplace/ProjectDocsApp'))
	},
	{
		path: `/${slugs.slug_project}/:projectId/config`,
		component: lazy(() => import('./projectConfig/ProjectConfigApp'))
	},
	{
		path: `/${slugs.slug_project}/:projectId/workplace/:wIdsId`,
		component: lazy(() => import('./projectWorkplace/ProjeckWorkplaceApp'))
	},
	{
		path: `/${slugs.slug_project}/:projectId/workplace`,
		component: lazy(() => import('./projectWorkplace/ProjeckWorkplaceApp'))
	},
	{
		path: `/${slugs.slug_project}/:projectId`,
		component: lazy(() => import('./projectWorkplace/ProjeckWorkplaceApp'))
	},
	{
		path: `/`,
		component: () => <TestRouteComponent routePath="/" />
	}
];
