import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import allRequests, { requestNBK } from 'api/allRequests';
import MailCompose from 'app/shared-components/MailCompose';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import { useForm, Controller } from 'react-hook-form';
import InputGroup from 'app/shared-components/InputGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const inputKeys = [
	{
		id: 'tepmlateValue',
		required: true,
		type: 'number',
		label: 'UK lufttetthet'
	},
	{
		id: 'avvik',
		required: true,
		type: 'radio',
		label: 'Avvik',
		options: [
			{ name: 'Ja', value: '1' },
			{ name: 'Nei', value: '2' }
		]
	},
	{
		id: 'avvikSendtKommune',
		required: true,
		type: 'radio',
		label: 'Åpne avvik sendt kommunen',
		options: [
			{ name: 'Ja', value: '1' },
			{ name: 'Nei', value: '2' }
		]
	}
];
const Workflow2 = props => {
	const { projectId, closeDialog, updateprojectState, selectedWorkflowId } = props;
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [defaultInfo, setDefaultInfo] = useState({});
	useEffect(() => {
		/*         getFields() */
		getInfo();
	}, [projectId]);

	const { watch, handleSubmit, formState, control, setValue, getValues, reset } = useForm({
		mode: 'onChange',
		defaultValues: {
			tepmlateValue: 0,
			Avvik: 0,
			AvvikSendtKommune: 0
		}
		/* 		resolver: yupResolver(schema) */
	});
	const { isValid, dirtyFields, errors } = formState;
	const getInfo = () => {
		setIsLoading(true);
		const body = {
			ProjectWorkflow: {
				ProjectId: `${projectId}`,
				WorkflowId: '2',
				WorkflowStepId: '1',
				IsTransfer: 'False'
			}
		};

		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w2s1getInfo,
			body,
			dispatch
		}).then(res => {
			console.log(res);
			const { projectWorkflow } = res;
			const { TepmlateValue, Avvik, AvvikSendtKommune } = projectWorkflow;
			setDefaultInfo(projectWorkflow);
			reset(projectWorkflow);
			setIsLoading(false);
		});
	};

	function onSubmit(data) {
		console.log(data);
		setIsLoading(true);
		const body = {
			ProjectWorkflow: {
				ProjectId: `${projectId}`,
				WorkflowId: '2',
				WorkflowStepId: '1',
				IsTransfer: 'False',
				...data
			}
		};

		return requestNBK({
			requestConfig: allRequests.projectWorkflow.w2s1postInfo,
			body,
			dispatch
		}).then(res => {
			console.log(res);
			setIsLoading(false);
		});
	}

	return (
		<form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col py-12">
			<InputGroup control={control} sectionInputKeys={inputKeys} />
			<Button variant="contained" color="primary" type="submit" onClick={handleSubmit} disabled={!isValid}>
				Save
			</Button>
		</form>
	);
};

export default Workflow2;
