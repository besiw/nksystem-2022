import { useEffect, useState, useRef, lazy, useCallback } from 'react';
import AppDialog from 'app/page/project/projectWorkplace/StepDialog';
import Typography from '@material-ui/core/Typography';

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
import MailAttachment from 'app/shared-components/UploadFile/Popup';

const UploadFileDialog = ({ className, handleSubmit }) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [files, setFiles] = useState([]);
	const onDrop = acceptedFiles => {
		setFiles([...files, ...acceptedFiles]);
		// Do something with the files
	};
	const removeFile = () => {
		setFiles([]);
	};

	const onSubmit = () => {
		handleSubmit(files);
		setIsDialogOpen(false);
	};
	return (
		<div className={className}>
			<button
				className="px-12"
				type="button"
				onClick={() => {
					setIsDialogOpen(true);
				}}
			>
				<Typography color="secondary" className="whitespace-nowrap">
					Attatch file
				</Typography>
			</button>
			<AppDialog
				title="UpdalodFile"
				isDialogOpen={isDialogOpen}
				closeDialog={() => {
					setIsDialogOpen(false);
				}}
				content={
					<div className="">
						<MyDropzone removeFile={removeFile} onDrop={onDrop} files={files} />
						<Button onClick={onSubmit} variant="contained" color="primary" type="submit">
							Send
						</Button>
					</div>
				}
			/>
		</div>
	);
};

export default UploadFileDialog;

export function MyDropzone({ files, onDrop, removeFile }) {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<div>
			<div className="min-h-64 rounded w-full flex flex-col mb-24">
				{
					<div
						style={{ height: '100px' }}
						className="bg-grey-50 border min-h-96 w-full flex flex-col justify-center items-center"
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
				}
				{files.length > 0 && (
					<>
						{files.map(item => {
							return (
								<FileChip name={item.name} size={`${bytesToSize(item.size)}`} onClose={removeFile} />
							);
						})}
					</>
				)}
			</div>
		</div>
	);
}
