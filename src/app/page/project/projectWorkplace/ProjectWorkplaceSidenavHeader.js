import Icon from '@mui/material/Icon';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useState } from 'react';

function SidebarHeader(props) {
	const { workflows, defaultWorkflow } = props;
	const [selectedWorkflow, setSelectedWorkflow] = useState(defaultWorkflow);

	function handleWorkflowChange(ev) {
		setSelectedWorkflow(ev.target.value);
	}

	return <div className="flex flex-col justify-center h-full">Header</div>;
}

export default SidebarHeader;
