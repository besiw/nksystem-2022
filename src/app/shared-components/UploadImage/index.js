import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';

function MyDropzone({ onChange }) {
	const dispatch = useDispatch();
	const onDrop = acceptedFiles => {
		onChange(acceptedFiles);
		// Do something with the files
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<div className="flex flex-col sm:flex-row">
			<div className="bg-grey-50 border rounded-lg p-12 mb-12 uploadfile-child-1 sm:mr-12">
				<div
					className=" h-full w-full flex flex-col justify-center items-center cursor-pointer"
					{...getRootProps()}
				>
					<input {...getInputProps()} />
					<div className="text-md  text-center">
						<p>Drop the files here ...</p>
						<p className="underline text-blue-600">Click to select files</p>
					</div>
				</div>
			</div>
		</div>
	);
}
export default MyDropzone;
