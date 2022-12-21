import * as React from 'react';
import Typography from '@mui/material/Typography';
import Email from './Email';

const Step1Email = props => {
	const email = props.context.info;
	return <Email {...email} />;
};

export default Step1Email;
