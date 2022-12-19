import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';

const Email = email => {
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);
	const closeDialog = () => {
		setIsDialogOpen(false);
	};

	const openDialog = () => {
		setIsDialogOpen(true);
	};
	const { emailSubject, emailTo, insertDate, emailContent, attachmentURL } = email;
	return (
		<div className="">
			<Typography variant="h4">{emailSubject}</Typography>
			<Typography variant="caption">{emailTo}</Typography>
			<div>{insertDate}</div>
			{typeof attachmentURL === 'string' && (
				<Button className="my-6" role="button" variant="contained" color="primary" onClick={openDialog}>
					<Icon className="text-16">picture_as_pdf</Icon>
					<span className="mx-4">View PDF</span>
				</Button>
			)}
			<div className="py-12" dangerouslySetInnerHTML={{ __html: emailContent }} />

			<Dialog
				classes={{
					paper: 'm-24 rounded-8'
				}}
				open={isDialogOpen}
				onClose={closeDialog}
				fullWidth
				maxWidth="md"
			>
				<DialogContent style={{ height: '80vh' }}>
					<embed src={attachmentURL} width="100%" height="100%" className="overflow-scroll" />
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Email;
