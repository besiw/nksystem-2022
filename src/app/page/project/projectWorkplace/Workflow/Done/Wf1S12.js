import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import allRequests, { requestNBK } from 'api/allRequests';
import { forEach } from 'lodash';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import shortId from 'shortid';
import { showMessage } from 'app/store/fuse/messageSlice';
import { boxColor } from '../Wf1S12-gjennomgaa-rapport';

const Step1Email = props => {
	const dispatch = useDispatch();
	const { projectId } = props;
	const [checklists, setChecklists] = useState([]);
	const [deviations, setDeviatons] = useState([]);
	const [devToSend, setDevToSend] = useState({});
	const [devSelectAll, setDevSelectAll] = useState(false);
	const [dialogEditData, setDialogEditData] = useState(null);
	const [openEmailDialog, setOpenEmailDialog] = useState(false);
	const [tabValue, setTabValue] = useState(0);

	useEffect(() => {
		getChecklistData();
	}, [projectId]);

	const getChecklistData = () => {
		requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s12getAllChecklistsData,
			body: { ProjectID: projectId }
		}).then(res => {
			setChecklists(res.multiProjectChecklistInspData);
		});
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
								{cl.projectChecklistItemsInspData.map((item, i) => {
									const {
										title,
										checklistName,
										status,
										comment,
										projectChecklistItemImageInspData,
										handleOpenDialog,
										showClName,
										imageURL,
										imageName,
										handleSelectOne,
										checklistValue
									} = item;
									return (
										<li
											key={shortId()}
											className={`w-full px-12 py-24 border-b ${
												status === 'Dev' ? 'bg-red-100' : ''
											}`}
										>
											<h3 className="mb-12">{title}</h3>
											{showClName && <h6 className="mb-12">{checklistName}</h6>}
											<div className="pb-12 grid gap-2 grid-cols-2">
												<span className={boxColor[status]}>Status: {status}</span>
												<span>Comment: {comment}</span>
											</div>
											<div className="grid grid-cols-5 gap-4">
												{projectChecklistItemImageInspData.map(img => {
													return (
														<img
															key={img.imageName}
															src={img.imageURL}
															alt={img.imageName}
														/>
													);
												})}
											</div>
										</li>
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
