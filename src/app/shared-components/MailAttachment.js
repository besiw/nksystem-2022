import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';

const useStyles = makeStyles({
	root: {
		fontSize: 13,
		backgroundColor: 'rgba(0, 0, 0, 0.08)',
		border: '1px solid rgba(0, 0, 0, 0.16)',
		paddingLeft: 16,
		marginBottom: 8,
		borderRadius: 2,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	filename: {
		fontWeight: 600
	},
	size: {
		marginLeft: 8,
		fontWeight: 300
	}
});

function MailAttachment(props) {
	const classes = useStyles();
	return (
		<div className={clsx(classes.root, props.className)}>
			<div className="flex">
				<Typography variant="caption" className={classes.filename}>
					{props.name}
				</Typography>
				<Typography variant="caption" className={classes.size}>
					({props.size})
				</Typography>
			</div>
			<IconButton>
				<Icon className="text-16" onClick={props.onClose}>
					close
				</Icon>
			</IconButton>
		</div>
	);
}

export default MailAttachment;
