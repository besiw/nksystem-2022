import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import FileChip from 'app/shared-components/MailAttachment';
import allRequests, { requestNBK } from 'api/allRequests';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import { bytesToSize } from 'app/shared-components/UploadFile';
import axios from 'axios';

function MyDropzone({ projectId, closeDialog, selectedWorkflowId }) {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [files, setFiles] = useState([]);
	const onDrop = useCallback(acceptedFiles => {
		setFiles(acceptedFiles);
		// Do something with the files
	}, []);

	const removeFile = () => {
		setFiles([]);
	};
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const handleSubmit = () => {
		setIsLoading(true);
		if (files.length > 0) {
			const body = {
				ProjectWorkflow: {
					ProjectId: projectId,
					WorkflowId: '1',
					WorkflowStepId: '3',
					IsTransfer: 'False',
					ServiceWorkflowCategoryID: selectedWorkflowId
				}
			};
			const formData = new FormData();
			formData.append('file', files[0]);
			formData.append('request', JSON.stringify(body));
			return axios
				.post(allRequests.projectWorkflow.w1s3post.url, formData, {
					headers: {
						'Content-Type': 'application/json'
					}
				})
				.then(response => {
					
					dispatch(showMessage({ message: response.data.message }));
					setIsLoading(false);
					closeDialog();
					return response;
				})
				.catch(error => {
					setIsLoading(false);
					dispatch(showMessage({ message: error.message }));
				});
		}
		return null;
	};
	return (
		<div>
			<div className="min-h-64 rounded w-full flex flex-col mb-24" style={{ height: '100px' }}>
				{files.length > 0 ? (
					<>
						{files.map(item => {
							return (
								<FileChip name={item.name} size={`${bytesToSize(item.size)}`} onClose={removeFile} />
							);
						})}
					</>
				) : (
					<div
						className="bg-grey-50 border h-full w-full flex flex-col justify-center items-center"
						{...getRootProps()}
					>
						<input {...getInputProps()} />
						{
							/*    isDragActive ? */
							<div className="text-md text-secondary text-center">
								<p>Drop the files here ...</p>
								<p>Drag 'n' drop some files here, or click to select files</p>
							</div>
						}
					</div>
				)}
			</div>
			<Button onClick={handleSubmit} variant="contained" color="primary" type="submit">
				Send
			</Button>
		</div>
	);
}
export default MyDropzone;
