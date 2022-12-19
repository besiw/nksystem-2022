import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import reducer from './store';
import ProjectsHeader from './ProjectsHeader';
import ProjectsTable from './ProjectsTable';
import { getProjects } from './store/projectsSlice';

function Projects() {
	const dispatch = useDispatch();

	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={<ProjectsHeader />}
			content={<ProjectsTable getProjects={getProjects} />}
			innerScroll
		/>
	);
}

export default withReducer('projectsApp', reducer)(Projects);
