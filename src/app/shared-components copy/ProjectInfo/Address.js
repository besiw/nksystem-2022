import { useState, useEffect } from 'react';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { motion } from 'framer-motion';
import allRequests, { requestNBK } from 'api/allRequests';

const Address = props => {
	const { address, postNo, poststed } = props;
	return (
		<Paper
			component={motion.div}
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
			className="rounded-0 shadow-none lg:rounded-20 lg:shadow p-12 mb-12"
		>
			<Typography className="mb-24 text-lg border-b">Address</Typography>
			<Typography>
				{address} {postNo} {poststed}
			</Typography>
		</Paper>
	);
};

export default Address;
