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
import WYSIWYGEditor from 'app/shared-components/WYSIWYGEditor';
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	to: yup.string().required('You must enter an e-mail').email('You must enter a valid e-mail.')
});

function MailCompose({ control, partyTypeId, attachmentPDF }) {
	return (
		<>
			<form className="flex flex-col">
				<div classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }}>
					<Controller
						id={`${partyTypeId}-to`}
						name={`${partyTypeId}-to`}
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-8 mb-16"
								label="To"
								autoFocus
								variant="outlined"
								fullWidth
								required
							/>
						)}
					/>

					<Controller
						id={`${partyTypeId}-subject`}
						name={`${partyTypeId}-subject`}
						control={control}
						render={({ field }) => (
							<TextField {...field} className="mt-8 mb-16" label="Subject" variant="outlined" fullWidth />
						)}
					/>
					<div className="mt-8 mb-16">
						{attachmentPDF && (
							<a href={attachmentPDF} target="blank" key="pdfUrl">
								View attachment
							</a>
						)}
					</div>
					<Controller
						className="mt-8 mb-16"
						render={({ field }) => {
							return <WYSIWYGEditor {...field} defaultValue={field.value} />;
						}}
						id={`${partyTypeId}-message`}
						name={`${partyTypeId}-message`}
						control={control}
					/>
				</div>
			</form>
		</>
	);
}

export default MailCompose;
