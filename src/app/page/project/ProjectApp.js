import FusePageCarded from '@fuse/core/FusePageCarded';
import FuseLoading from '@fuse/core/FuseLoading';
import withReducer from 'app/store/withReducer';
import { lazy, useState } from 'react';
import slugs from 'app/strings';
import { useDispatch, useSelector } from 'react-redux';
import {  useParams, Route,Routes} from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import reducer from './store';
import { newProject, getProject, resetProject, getProjectWithWorkflow } from './store/projectSlice';
import { useRoutes, matchRoutes, useLocation  } from 'react-router-dom';
const TestRouteComponent = props => {
	const params = useParams();
	const project = useSelector(({ projectApp }) => projectApp.project && projectApp.project.info);
	return <div>test component</div>;
};

function Projects(props) {
	const location =useLocation()
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

	return isLoading ? (
		<FuseLoading />
	) : (
		<Routes>
			{appRoutes.map((item, key) => {
				return <Route path={`${item.path}`} element={item.element} key={key} />;
			})}
		</Routes>
	);
}

export default withReducer('projectApp', reducer)(Projects);

const ProjectDocsApp = lazy(() => import('./projectWorkplace/ProjectDocsApp'));
const ProjectConfigApp = lazy(() => import('./projectConfig/ProjectConfigApp'));
const ProjeckWorkplaceApp= lazy(() => import('./projectWorkplace/ProjeckWorkplaceApp'));

const appRoutes = [
	{
		path: `/docs/:workflowId`,
		element: <ProjectDocsApp />
		
	},
	{
		path: `/config`,
		element: <ProjectConfigApp />
	},
	{
		path: `/config/*`,
		element: <ProjectConfigApp />
	},
	{
		path: `/workplace/:wIdsId`,
		element: <ProjeckWorkplaceApp />
		
	},
	{
		path: `/workplace/*`,
		element: <ProjeckWorkplaceApp />
	},
	{
		path: `/*`,
		element: <ProjeckWorkplaceApp />
	},
	{
		path: `/`,
		component: () => <TestRouteComponent routePath="/" />
	}
];
