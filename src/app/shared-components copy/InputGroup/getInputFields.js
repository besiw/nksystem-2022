import React, { useCallback, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';

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
