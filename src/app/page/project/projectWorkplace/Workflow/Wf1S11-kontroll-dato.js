import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import { DateTimePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import allRequests, { requestNBK } from 'api/allRequests';
import ReactSelect from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import { showMessage } from 'app/store/fuse/messageSlice';

const Workflow = ({ projectId, closeDialog, selectedWorkflowId }) => {
	const dispatch = useDispatch();
	const [inspectorsOptions, setInspectorsOptions] = useState([]);
	const [allInspectors, setAllInspectors] = useState([]);
	const [state, setState] = useState({
		checkedA: false,
		checkedB: true
	});

	const tomorrow = new Date();
	tomorrow.setDate(new Date().getDate() + 1);
	tomorrow.setHours(9);
	const { watch, handleSubmit, formState, control, setValue, getValues } = useForm({
		mode: 'onChange',
		defaultValues: {
			ProjectInspectorId: null,
			ProjectInspectionDate: tomorrow,
			ProjectSkipInspection: false,
			IsInspectorEmail: true,
			ProjectInspectionEventComment: ''
		}
		/* 		resolver: yupResolver(schema) */
	});
	// all
	useEffect(() => {
		getInspectors().then(res => {
			getSavedData();
		});
	}, []);
	const getSavedData = () => {
		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s11getInspection,
			body: {
				ProjectID: projectId,
				WorkflowId: '1',
				WorkflowStepId: '10'
			}
		}).then(res => {
			const data = res.projectWFTenSavedDetails;
			setValue('ProjectInspectorId', data.inspectorId);
			setValue('ProjectInspectionDate', data.inspectionDate ? new Date(data.inspectionDate) : new Date());
			setValue('ProjectInspectionEventComment', data.inspectionEventComment);
			setValue('ProjectSkipInspection', data.skipInspection);
		});
	};
	const getInspectors = () => {
		// all

		return requestNBK({ requestConfig: allRequests.project.getInspectors }).then(res => {
			if (res.multiUserInspectors) {
				const list = res.multiUserInspectors.filter(item => item.contactId);
				setAllInspectors(list);
				const options = list.map(i => {
					return { label: i.fullName, value: i.id };
				});
				setInspectorsOptions(options);
			}
		});
	};
	const ProjectSkipInspection = watch('ProjectSkipInspection');

	const handleChange = event => {
		setState({ ...state, [event.target.name]: event.target.checked });
	};

	const submitWf1S10 = fields => {
		let toSend = {
			ProjectWorkflow: {
				ProjectId: projectId,
				WorkflowId: '1',
				WorkflowStepId: '10',
				IsTransfer: 'False',
				ProjectInspectorId: fields.ProjectInspectorId,
				ProjectInspectionDate: fields.ProjectInspectionDate.toISOString(),
				ProjectSkipInspection: false,
				IsInspectorEmail: true,
				ProjectInspectionEventComment: fields.ProjectInspectionEventComment,
				ServiceWorkflowCategoryID: selectedWorkflowId
			}
		};

		if (fields.ProjectSkipInspection === true) {
			toSend = {
				ProjectWorkflow: {
					ProjectId: projectId,
					WorkflowId: '1',
					WorkflowStepId: '10',
					IsTransfer: 'False',
					ProjectInspectorId: null,
					ProjectInspectionDate: null,
					ProjectSkipInspection: true,
					IsInspectorEmail: true,
					ProjectInspectionEventComment: null
				}
			};
		}

		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w1s11postInspection,
			body: toSend
		})
			.then(res => {
				dispatch(showMessage({ message: res.message }));
				closeDialog();
			})
			.catch(error => {
				console.log(error);
			});
	};
	return (
		<form>
			<div className="w-full flex justify-end">
				<Controller
					id="ProjectSkipInspection"
					name="ProjectSkipInspection"
					control={control}
					render={({ field }) => (
						<div className="flex items-center">
							<Typography className="text-14 font-medium mr-24 cursor-pointer" color="inherit">
								Skip Inspection
							</Typography>
							<Switch
								{...field}
								className="mt-8 mb-16"
								label="Unassign inspector"
								autoFocus
								variant="outlined"
								fullWidth
								required
							/>
						</div>
					)}
				/>
			</div>

			<div className="flex w-full flex-col">
				<div className="grid grid-cols-2 gap-24 z-50">
					<Controller
						name="ProjectInspectorId"
						id="ProjectInspectorId"
						isDisabled={ProjectSkipInspection}
						control={control}
						defaultValue={[]}
						render={({ field }) => {
							const find = inspectorsOptions.find(i => i.value === field.value);
							const handleProjectInspectorIdChange = option => {
								field.onChange(option.value);
							};
							return (
								<ReactSelect
									className="react-select z-999"
									classNamePrefix="react-select"
									disabled={ProjectSkipInspection}
									options={inspectorsOptions}
									value={find}
									onChange={handleProjectInspectorIdChange}
								/>
							);
						}}
					/>

					<Controller
						name="ProjectInspectionDate"
						control={control}
						render={({ field: { onChange, value } }) => (
							<DateTimePicker
								label="Dato"
								disabled={ProjectSkipInspection}
								inputVariant="outlined"
								value={value}
								onChange={onChange}
								className="mt-8 mb-16 mx-4"
							/>
						)}
					/>
				</div>

				<Controller
					id="ProjectInspectionEventComment"
					name="ProjectInspectionEventComment"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							disabled={ProjectSkipInspection}
							className="mt-8 mb-16"
							label="Comment"
							autoFocus
							placeholder="Comments"
							variant="outlined"
							fullWidth
							required
						/>
					)}
				/>
			</div>
			<div className="w-full flex justify-end">
				<Button className="mt-24" variant="contained" color="primary" onClick={handleSubmit(submitWf1S10)}>
					Send
				</Button>
			</div>
		</form>
	);
};

export default Workflow;
