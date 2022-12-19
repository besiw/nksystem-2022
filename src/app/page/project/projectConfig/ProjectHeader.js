import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import _ from '@lodash';
import appStrings from 'app/strings';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import { saveProject, removeProject, createProject } from '../store/projectSlice';

function ProductHeader(props) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const routeParams = useParams();
	const { projectId } = routeParams;
	const { formState, watch, getValues } = methods;

	const { isValid, dirtyFields } = formState;
	const name = watch('title');
	const theme = useTheme();
	const history = useHistory();

	function handleSaveProduct() {
		const value = getValues();
		console.log(value);
		let errorMessage = '';
		if (!value.projectService || value.projectService.length === 0) {
			errorMessage += 'You must add a service. ';
		}

		let missingFields = '';
		const keyArray = [
			'address',
			'bruksnmmer',
			'gardsNo',
			'postNo',
			'kommune',
			'poststed',
			'buildingSupplierId',
			'contactPersonId',
			'customerId'
		];
		keyArray.forEach(key => {
			const isNumber = typeof value[key] === 'number' || value[key] === 'string';
			const isString = typeof value[key] === 'string' && value[key].trim() !== '';

			if (!isNumber && !isString) {
				missingFields += ` ${key},`;
			}
		});

		if (missingFields !== '') {
			errorMessage += `These fields are missing: ${missingFields}`;
		}

		if (errorMessage !== '') {
			dispatch(showMessage({ message: errorMessage }));
		} else if (projectId === 'new') {
			dispatch(createProject({ data: value, history }));
		} else {
			dispatch(saveProject({ data: value, history }));
		}
	}

	function handleRemoveProduct() {
		dispatch(removeProject(projectId)).then(() => {
			history.push('/products');
		});
	}

	const backLink =
		projectId === 'new' ? `/${appStrings.slug_projects}` : `/${appStrings.slug_project}/${projectId}/workplace`;
	const backText = projectId === 'new' ? appStrings.projects : 'Dashboard';
	return (
		<div className="flex flex-1 w-full items-center justify-between">
			<div className="flex flex-col items-start max-w-full min-w-0">
				<motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}>
					<Typography
						className="flex items-center sm:mb-12"
						component={Link}
						role="button"
						to={backLink}
						color="inherit"
					>
						<Icon className="text-20">arrow_back</Icon>
						<span className="hidden sm:flex mx-4 font-medium">{backText}</span>
					</Typography>
				</motion.div>

				<div className="flex items-center max-w-full">
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								{projectId === 'new' ? 'New project' : name}
							</Typography>
							<Typography variant="caption" className="font-medium">
								Project Detail
							</Typography>
						</motion.div>
					</div>
				</div>
			</div>
			<motion.div
				className="flex"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
			>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					onClick={handleRemoveProduct}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Remove
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					/* disabled={_.isEmpty(dirtyFields) || !isValid} */
					onClick={handleSaveProduct}
				>
					{projectId === 'new' ? 'Create' : 'Save'}
				</Button>
			</motion.div>
		</div>
	);
}

export default ProductHeader;
