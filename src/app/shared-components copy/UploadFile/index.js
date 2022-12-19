import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import FileChip from 'app/shared-components/MailAttachment';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import './uploadfile.css';

export function bytesToSize(bytes) {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0) return '0 Byte';
	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
	return `${Math.round(bytes / 1024 ** i, 2)} ${sizes[i]}`;
}

function MyDropzone({ onChange, maxFile, height }) {
	const dispatch = useDispatch();
	const [files, setFiles] = useState([]);
	const onDrop = useCallback(acceptedFiles => {
		setFiles(acceptedFiles);
		onChange(acceptedFiles);
		// Do something with the files
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<div className="bg-grey-50 border rounded-lg p-12 mb-12 uploadfile-child-1 sm:mr-12 w-full">
			{!maxFile || files.length < maxFile ? (
				<div
					className=" h-full w-full flex flex-col justify-center items-center cursor-pointer"
					{...getRootProps()}
				>
					<input {...getInputProps()} />
					{
						/*    isDragActive ? */
						<div className="text-md  text-center">
							<p>Drop the files here ...</p>
							<p className="underline text-blue-600">click to select files</p>
						</div>
					}
				</div>
			) : (
				<div className=" h-full w-full flex flex-col justify-center items-center">
					<span>Max {maxFile} files</span>
				</div>
			)}
		</div>
	);
}
export default MyDropzone;
