import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import allRequests, { requestNBK } from 'api/allRequests';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@material-ui/core/Button';
import MailCompose from 'app/shared-components/MailCompose';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const Step1Email = ({ projectId }) => {
	const dispatch = useDispatch();
	const [projectChecklists, setProjectChecklists] = useState([]);
	const [checklists, setChecklists] = useState([]);
	useEffect(() => {
		getProjectChecklists();
	}, []);
	const getProjectChecklists = () => {
		return requestNBK({
			requestConfig: allRequests.project.getAllProjectChecklists,
			body: { ProjectID: projectId }
		}).then(res => {
			/* setProjectChecklists(res.multiProjectChecklist); */
			const pChecklists = res.multiProjectChecklist;
			return Promise.all(
				pChecklists.map(cl => {
					return clickProjectChecklist(cl);
				})
			).then(clRes => {
				setChecklists(clRes);
			});
		});
	};
	const clickProjectChecklist = checklist => {
		return requestNBK({
			requestConfig: allRequests.project.getSingleProjectChecklist,
			body: { ChecklistID: checklist.id },
			dispatch
		}).then(res => res.projectChecklist);
	};
	return (
		<div>
			{checklists.map(cl => {
				return (
					<ul className="border my-16">
						<Accordion>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>
								<h3>{cl.checklistName}</h3>
							</AccordionSummary>
							<AccordionDetails className="flex flex-col">
								{cl.projectChecklistItems.map((item, i) => {
									return (
										<ListItem
											key={item.id}
											className="flex hover:bg-grey-100 rounded-12 mb-12 cursor-pointer"
										>
											<Typography
												className="todo-title truncate text-14 font-medium flex-1 "
												color="inherit"
											>
												{item.title}
											</Typography>
										</ListItem>
									);
								})}
							</AccordionDetails>
						</Accordion>
					</ul>
				);
			})}
		</div>
	);
};

export default Step1Email;
