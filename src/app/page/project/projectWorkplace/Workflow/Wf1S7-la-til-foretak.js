import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import allRequests, { requestNBK } from 'api/allRequests';
import Button from '@mui/material/Button';
import SelectContact from 'app/shared-components/SelectContact';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import shortid from 'shortid';

const Workflow = props => {
	const { projectId, backToSteps, selectedWorkflowId } = props;
	const [allProjectParties, setAllPorjectParties] = useState({});
	const [partyTypesForProject, setPartyTypesForProject] = useState([]);
	const [toLinkParties, setToLinkParties] = useState({});
	const [linkContactBlocks, setLinkContactBlocks] = useState([]);
	const [editingPartyType, setEditingPartyType] = useState({
		partyTypeName: '',
		id: null
	});
	const [openDialog, setOpenDialog] = useState(false);

	useEffect(() => {
		getData();
	}, [projectId]);

	const getAllProjectParties = () =>
		requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s7getProjectParties,
			body: { ProjectID: projectId }
		}).then(res => {
			const filteredParties = {};
			res.multiProjectParty.forEach(p => {
				if (p.partyTypeId) {
					filteredParties[p.partyTypeId] = p;
				}
			});
			setAllPorjectParties(filteredParties);
			return filteredParties;
		});

	const getAllPartyTypes = () =>
		requestNBK({
			requestConfig: allRequests.partyType.all
		}).then(res => res.multiPartyTypes);

	const getData = () => {
		return Promise.all([getAllProjectParties(), getAllPartyTypes()]).then(res => {
			const linkedRes = res[0];
			const allProjectPartiesRes = res[1];
			const partyTypesToLinkRes = [];
			allProjectPartiesRes.forEach(p => {
				if (!linkedRes[p.id] && p.workflowCategoryID === 1) {
					partyTypesToLinkRes.push({
						PartyTypeId: p.id,
						name: p.name
					});
				}
			});
			setPartyTypesForProject(partyTypesToLinkRes);
			return res;
		});
	};

	const updateToLinkParties = party => {
		const { PartyTypeId, contactId } = party;

		setToLinkParties({ ...toLinkParties, [PartyTypeId]: contactId });
	};

	const handleSubmitLink = (PartyTypeId, index) => {
		const contactId = toLinkParties[PartyTypeId];
		const toSend = {
			ProjectParty: {
				Id: editingPartyType.id,
				ProjectId: editingPartyType.projectId,
				PartyId: toLinkParties[editingPartyType.partyTypeId],
				PartyTypeId: editingPartyType.partyTypeId
			}
		};

		const toSendDoneRequest = {
			ProjectWorkflow: {
				ProjectId: projectId,
				WorkflowId: '1',
				WorkflowStepId: '6',
				IsTransfer: 'False'
			}
		};
		return requestNBK({ requestConfig: allRequests.projectWorkflow.w1s7linkPartiesToProject, body: toSend }).then(
			res => {
				setOpenDialog(false);
				return getData();
				/* return requestNBK({ requestConfig: allRequests.projectWorkflow.w1s6post, toSendDoneRequest }).then(
					() => {
						const afterDone = getAllProjectParties().then(linked => {
							const toUpdate = [];
							partyTypesForProject.forEach(p => {
								if (p.PartyTypeId !== PartyTypeId) {
									toUpdate.push(p);
								}
							});
							setPartyTypesForProject(toUpdate);
							setEditingPartyType({
								partyTypeName: '',
								id: null
							});
							backToSteps();
						});
					}
				); */
				/* 				 */
			}
		);
	};

	const handleReadyToLink = (option, index) => {
		setLinkContactBlocks([...linkContactBlocks, option]);
		const newValue = [...partyTypesForProject.slice(0, index), ...partyTypesForProject.slice(index + 1)];
		setPartyTypesForProject(newValue);
	};
	const removeToLink = (option, index) => {
		const newValue = [...linkContactBlocks.slice(0, index), ...linkContactBlocks.slice(index + 1)];
		setLinkContactBlocks(newValue);
		setPartyTypesForProject([...partyTypesForProject, option]);
	};

	const handleEditPartyContactLink = party => {
		setEditingPartyType(party);
		setOpenDialog(true);
	};

	const handleUpdate = () => {
		const toSend = {
			ProjectWorkflow: {
				ProjectId: projectId,
				WorkflowId: '1',
				WorkflowStepId: '6',
				IsTransfer: 'False',
				ServiceWorkflowCategoryID: selectedWorkflowId
			}
		};
		return requestNBK({ requestConfig: allRequests.projectWorkflow.w1s6post, body: toSend }).then(res => {
			backToSteps();
		});
	};
	return (
		<div>
			<List>
				{Object.keys(allProjectParties).map(partyTypeId => {
					const item = allProjectParties[partyTypeId];
					return (
						<ListItem className="grid grid-cols-3 gap-24">
							<Typography className="text-14 font-medium cursor-pointer" color="inherit">
								{item.partyTypeName}
							</Typography>
							<Typography className="text-14 cursor-pointer" color="inherit">
								{item.partyName}
							</Typography>
							<Button color="secondary" onClick={() => handleEditPartyContactLink(item)}>
								Edit
							</Button>
						</ListItem>
					);
				})}
			</List>
			<div className="w-full flex justify-end">
				<Button className="mr-24" variant="contained" color="primary" type="submit" onClick={handleUpdate}>
					Update
				</Button>
			</div>
			<Dialog
				fullWidth
				maxWidth="sm"
				open={openDialog}
				onClose={() => {
					setOpenDialog(false);
				}}
			>
				<DialogTitle>{editingPartyType.partyTypeName}</DialogTitle>
				<DialogContent>
					<SelectContact
						value={editingPartyType.partyId}
						onChange={contactId => {
							updateToLinkParties({ PartyTypeId: editingPartyType.partyTypeId, contactId });
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						className="mr-24"
						variant="contained"
						color="primary"
						type="submit"
						onClick={() => {
							handleSubmitLink(editingPartyType.id);
						}}
					>
						Update
					</Button>
				</DialogActions>
			</Dialog>

			{/* 				{partyTypesForProject.length > 0 && (
					<ListItem className="grid grid-cols-6 gap-24">
						<Typography className="text-14 font-medium mr-24 cursor-pointer" color="inherit">
							Add
						</Typography>
						<div className="flex flex-wrap col-span-5 items-center">
							{partyTypesForProject.map((option, index) => {
								return (
									<Typography
										onClick={() => handleReadyToLink(option, index)}
										component="button"
										className="text-12 mr-12 cursor-pointer bg-grey-300 rounded p-12 my-12"
										color="inherit"
									>
										{option.name}
									</Typography>
								);
							})}
						</div>
					</ListItem>
				)} */}
			{/* 				<ListItem className="grid grid-cols-2 gap-24">
					{linkContactBlocks.map((item, index) => {
						const { PartyTypeId } = item;
						return (
							<div className="mb-48" key={PartyTypeId}>
								<Typography className="text-14 font-medium cursor-pointer" color="inherit">
									{item.name}
								</Typography>
								<div>
									<SelectContact
										onChange={contactId => {
											updateToLinkParties({ PartyTypeId, contactId });
										}}
									/>
								</div>
								<Button
									className="mr-24"
									variant="contained"
									color="primary"
									type="submit"
									disabled={!toLinkParties[PartyTypeId]}
									onClick={() => handleSubmitLink(PartyTypeId, index)}
								>
									Add
								</Button>
								<Button
									variant="contained"
									color="secondary"
									type="submit"
									onClick={() => removeToLink(item, index)}
								>
									remove
								</Button>
							</div>
						);
					})}
				</ListItem> */}
		</div>
	);
};

export default Workflow;
