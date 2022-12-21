/* import { useForm } from '@fuse/hooks'; */
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect, useRef, useCallback } from 'react';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Close from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Fab from '@mui/material/Fab';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import clsx from 'clsx';
import ChecklistItem from 'app/page/checklist/ChecklistItem';
import ImageZone from 'app/shared-components/UploadImage';
import allRequests, { requestNBK } from 'api/allRequests';

function ChecklistDialog({ defaultValues, closeDialog, isDialogOpen, updateChecklist }) {
	const [editChecklist, setEditChecklist] = useState(defaultValues);

	const { control, watch, reset, handleSubmit, formState, getValues, setValue } = useForm({
		mode: 'onChange',
		defaultValues
	});

	const { isValid, dirtyFields, errors } = formState;

	const initDialog = useCallback(() => {
		if (defaultValues) {
			reset({ ...defaultValues });
		}
	}, [defaultValues, reset]);

	useEffect(() => {
		initDialog();
	}, [defaultValues]);

	function closeComposeDialog() {
		closeDialog();
	}

	function onSubmit(data) {
		const toSend = {
			ProjectChecklistItemInspData: {
				id: data.id,
				checklistId: data.checklistId,
				status: data.status,
				comment: data.comment,
				wasDev: null
			}
		};

		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s12UpdateChecklistItem,
			body: toSend
		}).then(res => {
			updateChecklist();
			closeDialog();
		});
	}

	// isDialogOpen
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			open={isDialogOpen}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="md"
		>
			<DialogContent classes={{ root: 'p-24' }}>
				<form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
					<div className="flex flex-col mb-24">
						<h2 className="mb-24">{defaultValues && defaultValues.title}</h2>
						<h4 className="mb-24">{defaultValues && defaultValues.checklistName}</h4>
						<div className="mb-24">
							<Controller
								control={control}
								name="status"
								render={({ field }) => {
									return (
										<RadioGroup {...field} aria-label="status" row>
											{[
												{
													value: 'OK',
													label: 'Godkjent'
												},
												{
													value: 'Dev',
													label: 'Avvik'
												},
												{
													value: 'NA',
													label: 'I/A'
												}
											].map(opt => (
												<FormControlLabel
													key={opt.value}
													value={opt.value}
													control={<Radio />}
													label={opt.label}
												/>
											))}
										</RadioGroup>
									);
								}}
							/>
						</div>
						<Controller
							control={control}
							name="comment"
							render={({ field }) => {
								return (
									<TextField
										{...field}
										className="mr-20 mb-24"
										label="Comment"
										variant="outlined"
										fullWidth
									/>
								);
							}}
						/>
						<Controller
							control={control}
							name="projectChecklistItemImageInspData"
							render={({ field }) => {
								const images = field.value;
								const { onChange } = field;
								const handleDelete = index => {
									const imagesBefore = images.slice(0, index);
									const imagesAfter = images.slice(index + 1);
									const allImages = [...imagesBefore, ...imagesAfter];
									setValue('projectChecklistItemImageInspData', allImages);
								};

								const handleAdd = files => {
									const allImages = [...images, ...files];
									setValue('projectChecklistItemImageInspData', allImages);
								};
								return (
									<div>
										<div className="grid grid-cols-7 gap-24 pt-4 mb-24">
											{images.map((item, i) => {
												let imgSrc = item.imageURL;
												if (item.path) {
													const file = URL.createObjectURL(item);
													imgSrc = file;
												}

												return (
													<Badge
														style={{ zIndex: 0 }}
														badgeContent={<Close fontSize="small" />}
														color="error"
														onClick={() => handleDelete(i)}
													>
														<div>
															<img alt="" className="w-full" src={imgSrc} />
														</div>
													</Badge>
												);
											})}
										</div>
										<div className="flex pt-4">
											<ImageZone onChange={handleAdd} />
										</div>
									</div>
								);
							}}
						/>
					</div>
					<Button
						variant="contained"
						color="primary"
						type="submit"
						onClick={handleSubmit}
						disabled={!isValid}
					>
						Save
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default ChecklistDialog;
