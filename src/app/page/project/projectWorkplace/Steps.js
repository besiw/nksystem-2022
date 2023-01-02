import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import slugs from 'app/strings';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import shorid from 'shortid';
import transferRequests from './Workflow/Transfer/requests';

export const CustomListItem = ({ children }) => (
	<ListItem 
	className="px-40 py-12 group shadow border-b"
	sx={{ bgcolor: 'background.paper' }}
	>
		{children}
	</ListItem>
);

export const CustomListItemText = ({ children }) => (
	<Typography className="text-14 font-medium flex-1 text-primary text-left">{children}</Typography>
);

const Step = ({ projectId, workflow, updateprojectState, handleStepChange, selectedWorkflowId }) => {
	const [tabValue, setTabValue] = useState(0);
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	const displaySteps = tabValue === 0 ? workflow.toDoSteps : workflow.processedSteps;
	console.log(displaySteps)
	const handleTransfer = ({ step, key }) => {
		transferRequests({ projectId, key, stepId: step.stepSequence, selectedWorkflowId }).then(res => {
			updateprojectState();
		});
	};
	return (
		<>
			<div>
				<Tabs
					value={tabValue}
					onChange={handleTabChange}
					indicatorColor="primary"
					textColor="primary"
					variant="scrollable"
					scrollButtons="auto"
					classes={{ root: 'w-full h-64' }}
				>
					{[
						{
							label: 'Å gjøre',
							value: 0
						},
						{
							label: 'Ferdig',
							value: 1
						}
					].map(item => {
						return <Tab className="h-64" {...item} />;
					})}
				</Tabs>
			</div>
			<motion.div
				variants={{
					show: {
						transition: {
							staggerChildren: 0.1
						}
					}
				}}
				initial="hidden"
				animate="show"
			>
				<List>
					{displaySteps.map((props, index) => {
						const { step: item, info, path } = props;
						const isTransfered = info && info.isTransfer;

						return (
							<motion.div
								key={shorid()}
								variants={{
									hidden: { opacity: 0, y: 20 },
									show: { opacity: 1, y: 0 }
								}}
							>
								{tabValue === 0 ? (
									<CustomListItem key={shorid()}>
										<button
											onClick={() => handleStepChange({ ...props, stepPath: path })}
											type="button"
											/* to={`/${slugs.slug_project}/${projectId}/workplace/${path}`} */
											className="no-underline flex-1"
										>
											<CustomListItemText> {item.stepName}</CustomListItemText>
										</button>
										<Button
											className="ml-4"
											variant="outlined"
											onClick={() => handleTransfer({ step: item, key: path, projectId })}
										>
											<Typography className="text-12">Overføre</Typography>
										</Button>
									</CustomListItem>
								) : (
									<CustomListItem key={shorid()}>
										{isTransfered ? (
											<div className="flex-1">
												<Typography className="truncate text-14 font-medium text-grey-A700">
													{item.stepName}
													{isTransfered && (
														<span className="px-4 text-xs  text-grey-A700">(Overført)</span>
													)}
												</Typography>
											</div>
										) : (
											<>
												<button
													onClick={() =>
														handleStepChange({ ...props, stepPath: `${path}-done` })
													}
													type="button"
													/* to={`/${slugs.slug_project}/${projectId}/workplace/${path}`} */
													className="no-underline flex-1"
												>
													<CustomListItemText> {item.stepName}</CustomListItemText>
												</button>
											</>
										)}

										<Button
											onClick={() => handleStepChange({ ...props, stepPath: path })}
											type="button"
										>
											<Icon color={true ? 'action' : 'disabled'}>edit</Icon>
											<Typography className="text-12 ml-4">Edit</Typography>
										</Button>
									</CustomListItem>
								)}
							</motion.div>
						);
					})}
				</List>
			</motion.div>
		</>
	);
};

export default Step;
