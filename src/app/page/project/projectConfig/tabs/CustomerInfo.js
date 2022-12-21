import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { Autocomplete } from '@mui/lab';
import { useFormContext, Controller } from 'react-hook-form';
import ContactForm from 'app/shared-components/SelectContact';
import Typography from '@mui/material/Typography';

function BasicInfoTab(props) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div className="grid grid-cols-2 gap-24">
			<div>
				<Typography className="mb-24" variant="subtitle1" color="inherit">
					Kunde
				</Typography>
				<Controller name="customerId" control={control} render={({ field }) => <ContactForm {...field} />} />
			</div>
			<div>
				<Typography className="mb-24" variant="subtitle1" color="inherit">
					Ansvarlig søker
				</Typography>
				<Controller
					name="contactPersonId"
					control={control}
					render={({ field }) => <ContactForm {...field} />}
				/>
			</div>
		</div>
	);
}

export default BasicInfoTab;
