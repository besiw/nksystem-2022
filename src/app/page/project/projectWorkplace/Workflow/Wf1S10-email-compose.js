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
