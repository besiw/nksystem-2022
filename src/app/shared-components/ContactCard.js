import { useState, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { motion } from 'framer-motion';
import allRequests, { requestNBK } from 'api/allRequests';

const ContactCard = contact => {
	const { name, companyName, contactNo, email } = contact;
	return (
		<>
			<div className="py-4">
				<Typography className="pb-4">{name}</Typography>
				<Typography className="pb-4">({companyName})</Typography>
				<Typography className="pb-4">
					<a href={`tel:${contactNo}`}>{contactNo}</a>
				</Typography>
				<Typography className="pb-4">
					<a target="_blank" href={`mailto:${email}`} rel="noreferrer">
						{email}
					</a>
				</Typography>
			</div>
		</>
	);
};

export default ContactCard;
