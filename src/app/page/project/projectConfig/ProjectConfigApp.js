import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDeepCompareEffect } from '@fuse/hooks';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { newProject, getProject, resetProject } from '../store/projectSlice';
import reducer from '../store';
import ProjectHeader from './ProjectHeader';
import CustomerInfo from './tabs/CustomerInfo';
import PricingTab from './tabs/PricingTab';
import ProjectInfo from './tabs/ProjectInfo';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	name: yup
		.string()
		.required('You must enter a project name')
		.min(5, 'The project name must be at least 5 characters')
});

function Project(props) {
	const dispatch = useDispatch();
	const projectData = useSelector(({ projectApp }) => projectApp.project);
	const project = projectData.info;
	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noproject, setNoproject] = useState(false);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: yupResolver(schema)
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();
	const { projectId } = routeParams;

	useDeepCompareEffect(() => {
		function updateprojectState() {
			if (projectId === 'new') {
				/**
				 * Create New project data
				 */
				dispatch(newProject());
			}
		}
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!project) {
			return;
		}
		/**
		 * Reset the form on project state changes
		 */
		reset(project);
	}, [project, reset]);

	/**
	 * Tab Change
	 */
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	/**
	 * Show Message if the requested projects is not exists
	 */
	if (noproject) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					There is no such project!
				</Typography>
				<Button className="mt-24" component={Link} variant="outlined" to="/projects" color="inherit">
					Go to projects Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while project data is loading and form is setted
	 */
	if (
		_.isEmpty(form) ||
		(project && `${routeParams.projectId}` !== `${project.id}` && routeParams.projectId !== 'new')
	) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={<ProjectHeader />}
				contentToolbar={
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						indicatorColor="primary"
						textColor="primary"
						variant="scrollable"
						scrollButtons="auto"
						classes={{ root: 'w-full h-64' }}
					>
						<Tab className="h-64" label="Contact Info" />
						<Tab className="h-64" label="Project Info" />
						<Tab className="h-64" label="Services" />
					</Tabs>
				}
				content={
					<div className="p-16 sm:p-24 max-w-2xl">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<CustomerInfo />
						</div>

						<div className={tabValue !== 1 ? 'hidden' : ''}>
							<ProjectInfo />
						</div>

						<div className={tabValue !== 2 ? 'hidden' : ''}>
							<PricingTab />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
}

export default Project;
