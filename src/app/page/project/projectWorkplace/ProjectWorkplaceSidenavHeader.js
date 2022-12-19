import Icon from '@material-ui/core/Icon';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
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
