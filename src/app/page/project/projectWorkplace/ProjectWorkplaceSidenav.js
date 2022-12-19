import { useState, useEffect } from 'react';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import allRequests, { requestNBK } from 'api/allRequests';
import ContactCard from 'app/shared-components/ContactCard';
import appStrings from 'app/strings';
import { Link, useHistory, useParams } from 'react-router-dom';
import DialogWrapper from 'app/page/project/projectWorkplace/StepDialog';
import Button from '@material-ui/core/Button';
import { saveProject, removeProject, createProject } from '../store/projectSlice';

const useStyles = makeStyles(theme => ({
	paper: {
		[theme.breakpoints.down('md')]: {
			boxShadow: 'none'
		}
	},
	listItem: {
		color: 'inherit!important',
		textDecoration: 'none!important',
		height: 40,
		width: '100%',
		borderRadius: 6,
		paddingLeft: 12,
		paddingRight: 12,
		marginBottom: 4,
		'&.active': {
			backgroundColor:
				theme.palette.type === 'light' ? 'rgba(0, 0, 0, .05)!important' : 'rgba(255, 255, 255, .1)!important',
			pointerEvents: 'none',
			'& .list-item-icon': {
				color: 'inherit'
			}
		},
		'& .list-item-icon': {
			fontSize: 16,
			width: 16,
			height: 16,
			marginRight: 16
		}
	}
}));

const SidebarContent = props => {
	const dispatch = useDispatch();
	const classes = useStyles(props);
	const history = useHistory();
	const { defaultWorkflow, workflows, project } = props;
	const {
		address,
		customerId,
		postNo,
		poststed,
		description,
		dated,
		id,
		buildingSupplierId,
		projectServiceWorkflowList,
		buildingSupplier,
		contactPerson,
		customer,
		projectService,
		projectParties
	} = project;
	const [selectedWorkflow, setSelectedWorkflow] = useState(defaultWorkflow);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [projectDescription, setDescription] = useState(description);
	const handleCloseDialog = () => {
		setIsDialogOpen(false);
	};

	const handleprojectDescriptionChange = e => {
		setDescription(e.target.value);
	};
	const updateDescription = () => {
		dispatch(saveProject({ data: { description: projectDescription }, history }));
		setIsDialogOpen(false);
	};
	return (
		<div className="hidden sm:block col-start-9 col-end-13 p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4 px-12 h-full bg-white rounded-lg">
			<div className="py-16 flex flex-col">
				<div className="w-full flex justify-end my-4">
					<Link to={`/${appStrings.slug_project}/${id}/config`} className="ml-12">
						<Icon color="primary">create</Icon>
						Edit
					</Link>
				</div>
				<Typography variant="h6">
					{address}, {postNo} {poststed}
				</Typography>

				<div className="w-full flex justify-between items-center  my-4">
					<Typography variant="subtitle1">Opprettet: </Typography>
					<Typography>{dated.split('T')[0]}</Typography>
				</div>
				{/* 				<div className="w-full flex justify-between mt-36 items-center">
					<Typography variant="h6">Project summary</Typography>
					<Link to={`/${appStrings.slug_project}/${id}/config`} className="ml-12">
						Edit
					</Link>
				</div> */}
			</div>
			<div className=" my-8">
				<div className="w-full flex border-b justify-between items-center">
					<Typography className="text-semibold" variant="subtitle1">
						Beskrivelse
					</Typography>
					<button
						className="text-deep-purple-200"
						type="button"
						onClick={() => {
							setIsDialogOpen(true);
						}}
					>
						Edit
					</button>
				</div>
				<Typography className="py-4">{project.description}</Typography>
			</div>
			<div className="my-8">
				<div className="border-b">
					<Typography className="text-semibold" variant="subtitle1">
						Husleverandør
					</Typography>
				</div>
				<Typography className="py-4">{buildingSupplier.title}</Typography>
			</div>
			<div className="my-8">
				<div className="border-b">
					<Typography className="text-semibold" variant="subtitle1">
						Tiltakshaver
					</Typography>
				</div>
			</div>

			{customer && <ContactCard {...customer} />}

			<div className="w-full flex border-b justify-between items-center">
				<div className="uppercase">
					<Typography variant="subtitle1">Tjenester</Typography>
				</div>
				<Link to={`/${appStrings.slug_project}/${id}/config`} className="ml-12">
					Edit
				</Link>
			</div>
			<div className="py-4">
				{projectService.map(s => {
					return (
						<Typography key={s.id} className="pb-4">
							{s.service.name} ({s.service.description}) {s.price}
						</Typography>
					);
				})}
			</div>
			{projectParties && projectParties.multiProjectParty && projectParties.multiProjectParty.length > 0 && (
				<div className="w-full my-8">
					<Typography variant="subtitle1"> </Typography>
					<div className="w-full flex border-b justify-between items-center">
						<div className="uppercase">
							<Typography className="text-semibold" variant="subtitle1">
								Foretak
							</Typography>
						</div>
						<Link to={`/${appStrings.slug_project}/${id}/workplace/w1s7`} className="ml-12">
							Edit
						</Link>
					</div>
					<div className="py-4">
						{projectParties.multiProjectParty.map(p => {
							return (
								<div className="mb-8" key={p.id}>
									<Typography variant="subtitle1">{p.partyTypeName}</Typography>
									<ContactCard
										{...customer}
										name={p.partyName}
										contactNo={p.contactNumber}
										email={p.email}
									/>
								</div>
							);
						})}
					</div>
				</div>
			)}
			<DialogWrapper
				isDialogOpen={isDialogOpen}
				closeDialog={handleCloseDialog}
				title="Beskrivelse"
				content={
					<form>
						<TextField
							onChange={handleprojectDescriptionChange}
							value={projectDescription}
							type="text"
							className="mb-24"
							label="name"
							variant="outlined"
							fullWidth
						/>
						<Button
							className="whitespace-nowrap mx-4"
							variant="outlined"
							color="secondary"
							onClick={updateDescription}
						>
							Update
						</Button>
					</form>
				}
			/>
		</div>
	);
};

export default SidebarContent;
