import * as React from 'react';
import allRequests, { requestNBK } from 'api/allRequests';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const Step1Email = props => {
	const { projectId } = props;
	const [allProjectParties, setAllPorjectParties] = React.useState({});
	React.useEffect(() => {
		getAllProjectParties();
	}, []);

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
						</ListItem>
					);
				})}
			</List>
		</div>
	);
};

export default Step1Email;
