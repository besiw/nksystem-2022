import FuseAnimate from '@fuse/core/FuseAnimate';
import { useForm } from '@fuse/hooks';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import { makeStyles } from '@mui/styles';
import { darken } from '@mui/material/styles/colorManipulator';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import NBKLogo from 'app/shared-components/Logo';
import LoginForm from './LoginForm';

const useStyles = makeStyles(theme => ({
	root: {
		background: `linear-gradient(to left, #02b591 0%, #065e47 100%)`,
		color: theme.palette.primary.contrastText
	},
	leftSection: {},
	rightSection: {
		background: `linear-gradient(to right, rgba(2, 181, 145) 0%, #065e47 100%)`,
		color: theme.palette.primary.contrastText
	}
}));

function Login3Page() {
	const classes = useStyles();

	return (
		<div
			className={clsx(
				classes.root,
				'flex flex-col flex-auto items-center justify-center flex-shrink-0 p-16 md:p-24'
			)}
		>
			<FuseAnimate animation="transition.expandIn">
				<div className="flex w-full max-w-400 md:max-w-3xl rounded-12 shadow-2xl overflow-hidden">
					<Card
						className={clsx(
							classes.leftSection,
							'flex flex-col w-full max-w-sm items-center justify-center shadow-0'
						)}
						square
					>
						<CardContent className="flex flex-col items-center justify-center w-full py-96 max-w-320 font-400">
							<FuseAnimate delay={300}>
								<div className="flex items-center">
									<NBKLogo customSize="24" />
								</div>
							</FuseAnimate>
							<div className="mb-48">
								<LoginForm />
							</div>
						</CardContent>
					</Card>

					<div
						className={clsx(classes.rightSection, 'hidden md:flex flex-1 items-center justify-center p-64')}
					>
						<div className="max-w-320">
							<FuseAnimate animation="transition.slideUpIn" delay={400}>
								<Typography variant="h3" color="inherit" className="font-800 leading-tight">
									Welcome to
									<br />
									Norsk Kontroll System!
								</Typography>
							</FuseAnimate>

							<FuseAnimate delay={500}>
								<Typography variant="subtitle1" color="inherit" className="mt-32">
									Powerful and professional inspection system for project administration.
								</Typography>
							</FuseAnimate>
						</div>
					</div>
				</div>
			</FuseAnimate>
		</div>
	);
}

export default Login3Page;
