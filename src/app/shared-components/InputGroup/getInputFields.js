import React, { useCallback, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import { makeStyles } from '@mui/styles';

export default item => {
	const useStyles = makeStyles(theme => ({
		root: {},
		formControl: {
			margin: '6px 0',
			width: '100%',
			'&:last-child': {
				marginBottom: 0
			}
		},
		group: {},
		formGroupTitle: {
			position: 'absolute',
			top: -10,
			left: 8,
			fontWeight: 600,
			padding: '0 4px',
			backgroundColor: theme.palette.background.paper
		},
		formGroup: {
			position: 'relative',
			border: `1px solid ${theme.palette.divider}`,
			borderRadius: 2,
			padding: '12px 12px 0 12px',
			margin: '24px 0 16px 0',
			'&:first-of-type': {
				marginTop: 16
			}
		}
	}));

	const classes = useStyles({});

	const { field, type, label } = item;

	const inputField = (
		<TextField {...field} type={type} className="mb-24" label={label} variant="outlined" fullWidth />
	);
	switch (type) {
		case 'text' || 'textArea' || 'mobile' || 'number' || 'email' || 'password': {
			return inputField;
		}

		default:
			return inputField;
	}
};
