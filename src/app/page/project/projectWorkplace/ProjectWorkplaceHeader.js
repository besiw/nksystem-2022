import Hidden from '@mui/material/Hidden';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/Button';
import { Link } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { motion } from 'framer-motion';
import { useDispatch} from 'react-redux';
import appStrings from 'app/strings';

const WorkplaceHeader = ({ id, title, backToSteps, value, handleWorkflowChange, workflowsArray }) => {
	const dispatch = useDispatch();
	const backLink =
	id === 'new' ? `/${appStrings.slug_projects}` : `/${appStrings.slug_project}/${id}/workplace`;
	const backText = id === 'new' ? appStrings.projects : 'Dashboard';
	console.log(backLink)
	return (
		<div className="flex flex-1 items-center justify-between p-8 sm:p-24 relative">
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
								{id === 'new' ? 'New project' : title}
							</Typography>
							<div className="flex">
					<Link to={`/${appStrings.slug_project}/${id}/config`} className="ml-12">
						<IconButton>
							<Icon color={true ? 'action' : 'disabled'}>create</Icon>
							<Typography className="text-12 ml-4">Edit</Typography>
						</IconButton>
					</Link>
					<IconButton
						className="ml-12"
						onClick={() => {
							dispatch(removeProject(id));
						}}
					>
						<Icon color={true ? 'action' : 'disabled'}>delete</Icon>
						<Typography className="text-12 ml-4">{appStrings.delete}</Typography>
					</IconButton>
					<IconButton
						className="ml-12"
						onClick={() => {
							dispatch(archiveProject(id));
						}}
					>
						<Icon color={true ? 'action' : 'disabled'}>archive</Icon>
						<Typography className="text-12 ml-4">{appStrings.archive}</Typography>
					</IconButton>
				</div>
						</motion.div>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-end">
				<TextField
					className="w-full bg-secondary"
					id="account-selection"
					select
					label="Service"
					value={value}
					onChange={handleWorkflowChange}
					placeholder="Select Account"
					margin="normal"
					variant="filled"
				>
					{workflowsArray.map(w => (
						<MenuItem key={w.id} {...w}>
							{w.name}
						</MenuItem>
					))}
				</TextField>
			</div>
		</div>
	);
};

export default WorkplaceHeader;
