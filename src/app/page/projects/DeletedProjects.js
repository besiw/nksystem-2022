import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import reducer from './store';
import ProjectsHeader from './ProjectsHeader';
import ProjectsTable from './ProjectsTable';

import { getDeletedProjects } from './store/projectsSlice';

function Projects() {
	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={<ProjectsHeader type="delete" />}
			content={<ProjectsTable getProjects={getDeletedProjects} type="delete" />}
			innerScroll
		/>
	);
}

export default withReducer('projectsApp', reducer)(Projects);
