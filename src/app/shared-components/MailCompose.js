import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import _ from '@lodash';
import MailAttachment from 'app/shared-components/UploadFile/Popup';
import MailAttachmentFile from 'app/shared-components/MailAttachment';
import WYSIWYGEditor from './WYSIWYGEditor';
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	to: yup.string().required('You must enter an e-mail').email('You must enter a valid e-mail.')
});

function MailCompose({ defaultEmail, submitEmail, hasAttachment }) {
	const processedDefaultEmail = {
		to: '',
		message: '',
		subject: '',
		cc: '',
		attachments: []
	};
	const { watch, handleSubmit, formState, control, setValue } = useForm({
		mode: 'onChange',
		defaultValues: processedDefaultEmail,
		resolver: yupResolver(schema)
	});

	useEffect(() => {
		setValue('to', defaultEmail.to);
		setValue('message', defaultEmail.message);
		setValue('subject', defaultEmail.subject);
		setValue('cc', defaultEmail.cc);
		setValue('attachments', []);
	}, [defaultEmail, defaultEmail.cc]);
	const { isValid, dirtyFields, errors } = formState;

	const handleSubmitFile = files => {
		setValue('attachments', files);
	};
	const attachments = watch('attachments');
	return (
		<>
			<form noValidate onSubmit={handleSubmit(submitEmail)} className="flex flex-col">
				<div classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }}>
					<Controller
						name="to"
						control={control}
						render={({ field }) => {
							return (
								<TextField
									{...field}
									className="mt-8 mb-16"
									label="To"
									id="to"
									error={!!errors.to}
									helperText={errors?.to?.message}
									variant="outlined"
									fullWidth
									required
									autoFocus
								/>
							);
						}}
					/>
					{defaultEmail.cc && (
						<Controller
							name="cc"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mt-8 mb-16"
									label="Cc"
									id="cc"
									variant="outlined"
									type="text"
									fullWidth
								/>
							)}
						/>
					)}

					<Controller
						name="subject"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-8 mb-16"
								label="Subject"
								id="subject"
								name="subject"
								type="text"
								variant="outlined"
								fullWidth
							/>
						)}
					/>

					<Controller
						className="mt-8 mb-16"
						render={({ field }) => {
							return <WYSIWYGEditor {...field} defaultValue={defaultEmail.message} />;
						}}
						name="message"
						control={control}
					/>
					{hasAttachment &&
						attachments &&
						attachments.map(file => {
							return (
								<div className="my-8">
									<MailAttachmentFile name={file.name} size={file.size} />
								</div>
							);
						})}
					{hasAttachment && <MailAttachment handleSubmit={handleSubmitFile} className="mt-12" />}
					<div className="py-8 my-12">
						<Button variant="contained" color="primary" type="submit">
							Send
						</Button>
					</div>
				</div>
			</form>
		</>
	);
}

export default MailCompose;
