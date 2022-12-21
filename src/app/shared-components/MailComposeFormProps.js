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
import WYSIWYGEditor from './WYSIWYGEditor';
import MailAttachment from './MailAttachment';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	to: yup.string().required('You must enter an e-mail').email('You must enter a valid e-mail.')
});

function MailCompose({
    defaultEmail,
	formProps
}) {

	const { watch, handleSubmit, formState, control , setValue} = formProps


	return (
        <>
			<form className="flex flex-col">
				<div classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }}>

					<Controller
						name="to"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-8 mb-16"
								label="To"
								autoFocus
								id="to"
								variant="outlined"
								fullWidth
								required
							/>
						)}
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
								fullWidth
							/>
						)}
					/>
					) }

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
								variant="outlined"
								fullWidth
							/>
						)}
					/>

					<Controller
						className="mt-8 mb-16"
						render={({ field }) => <WYSIWYGEditor {...field} />}
						name="message"
						control={control}
					/>
				</div>
			</form>
        </>
	);
}

export default MailCompose;
