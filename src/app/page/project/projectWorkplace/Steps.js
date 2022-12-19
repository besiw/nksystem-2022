import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { Link, useParams } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';
import slugs from 'app/strings';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { useState } from 'react';
import shorid from 'shortid';
import transferRequests from './Workflow/Transfer/requests';

export const CustomListItem = ({ children }) => (
	<ListItem className="py-20 px-0 sm:px-8 bg-white rounded-12 mb-12 cursor-pointer flex justify-between">
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
							label: 'To do',
							value: 0
						},
						{
							label: 'Done',
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
											<Typography className="text-12 border-grey-400">Overføre</Typography>
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
