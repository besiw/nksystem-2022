import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
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
