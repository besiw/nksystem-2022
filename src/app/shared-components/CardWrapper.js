import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { motion } from 'framer-motion';
import allRequests, { requestNBK } from 'api/allRequests';

const ContactCard = ({ children }) => {
	return (
		<Paper
			component={motion.div}
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
			className="rounded-0 shadow-none lg:rounded-12 lg:shadow p-12 mb-12"
		>
			{children}
		</Paper>
	);
};

export default ContactCard;
