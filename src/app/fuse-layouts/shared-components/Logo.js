import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import NKSLogo from 'app/shared-components/Logo';
import LogoImg from 'app/img/NBK-LOGO-white.png';

const useStyles = makeStyles(theme => ({
	root: {
		'& .logo-icon': {
			transition: theme.transitions.create(['width', 'height'], {
				duration: theme.transitions.duration.shortest,
				easing: theme.transitions.easing.easeInOut
			})
		},
		'& .react-badge, & .logo-text': {
			transition: theme.transitions.create('opacity', {
				duration: theme.transitions.duration.shortest,
				easing: theme.transitions.easing.easeInOut
			})
		}
	},
	reactBadge: {
		backgroundColor: '#121212',
		color: '#61DAFB'
	}
}));

function Logo({ full }) {
	const classes = useStyles();

	return (
		<div className={clsx(classes.root, 'flex items-center')}>
			{full ? (
				<NKSLogo className="logo-icon fill-current text-primary" customSize="12" />
			) : (
				<img src={LogoImg} style={{ height: 40, width: 40 }} alt="logo" />
			)}
		</div>
	);
}

export default Logo;
