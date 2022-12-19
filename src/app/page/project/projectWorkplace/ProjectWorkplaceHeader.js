import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import appStrings from 'app/strings';
import { removeProject, archiveProject } from '../store/projectSlice';

const WorkplaceHeader = ({ id, title, backToSteps, value, handleWorkflowChange, workflowsArray }) => {
	const dispatch = useDispatch();
	return (
		<div className="flex flex-1 items-center justify-between p-8 sm:p-24 relative">
			<div className="flex flex-col flex-shrink py-12 sm:w-224">
				{/*                 <Hidden lgUp>
                    <IconButton
                        onClick={ev => pageLayout.current.toggleLeftSidebar()}
                        aria-label="open left sidebar"
                    >
                        <Icon>menu</Icon>
                    </IconButton>
                </Hidden> */}

				<Link className="flex items-center text-white" to={`/${appStrings.slug_project}/${id}/workplace/home`}>
					<Typography
						onClick={() => backToSteps(null)}
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.2 } }}
						delay={300}
						color="textSecondary"
						className="text-16 md:text-24 mx-12 font-semibold whitespace-nowrap cursor-pointer"
					>
						{title}
					</Typography>
				</Link>
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
