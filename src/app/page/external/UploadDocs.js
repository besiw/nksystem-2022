import queryString from 'query-string';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDeepCompareEffect } from '@fuse/hooks';
import { useParams, useLocation } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FileChip from 'app/shared-components/MailAttachment';
import * as yup from 'yup';
import _ from '@lodash';
import { useQuery } from 'app/helpers';
import allRequests, { requestNBK } from 'api/allRequests';
import UploadFile, { bytesToSize } from 'app/shared-components/UploadFile';
import axios from 'axios';

import Table from '@material-ui/core//Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function UploadDocsPage() {
	const [files, setFiles] = useState({});
	const [showMessage, setShowMessage] = useState(null);
	const routeParams = useParams();
	const queryStrings = useQuery();
	const dispatch = useDispatch();

	const { PartyID, PartyTypeID, UrlKey, prId, ID } = queryStrings;
	const isUrlValid = PartyID && PartyTypeID && UrlKey;
	const isRedirectedUrl = ID && prId && queryStrings.PartyTypeId;
	const [status, setStatus] = useState('');
	useDeepCompareEffect(() => {
		if (isUrlValid || isRedirectedUrl) {
			let params = { ...queryStrings };
			if (isRedirectedUrl) {
				params = {
					PartyID: ID,
					ProjectId: prId,
					PartyTypeID: queryStrings.PartyTypeId,
					UrlKey: 'hZ8ygadsDaOLDSYS',
					WorkflowId: '1'
				};
			}
			Promise.all([
				requestNBK({
					requestConfig: allRequests.docs.getSinglePartyRequiredFileList,
					body: params,
					dispatch
				}),
				requestNBK({
					requestConfig: allRequests.docs.getSinglePartyUploadedFileList,
					body: params,
					dispatch
				})
			])
				.then(res => {
					const requiredFileList = res[0].projectPartyDocsMulti;
					const uploadedFileList = res[1].filesList;

					const filesToAdd = {};
					if (requiredFileList && Array.isArray(requiredFileList)) {
						requiredFileList.forEach(item => {
							filesToAdd[item.docTypeId] = {
								...item,
								uploaded: []
							};
						});
					}

					if (res[1].filesList) {
						res[1].filesList.forEach(item => {
							if (filesToAdd[item.docTypeId]) {
								filesToAdd[item.docTypeId].uploaded.push(item);
							}
						});
					}

					setFiles(filesToAdd);
				})
				.catch(error => {
					console.log(error);
					setShowMessage(`Something went wrong. Try again later or contact us`);
				});
		}
	}, [dispatch, queryStrings]);

	function onSubmit() {
		Object.keys(files).map(key => {
			const { docs: addedFiles, ...request } = files[key];

			const body = {
				...queryStrings,
				DocTypeId: `${key}`
			};
			if (addedFiles) {
				const formData = new FormData();
				addedFiles.forEach((file, index) => {
					console.log(file);
					formData.append(`file[${index}]`, file);
				});

				formData.append('request', JSON.stringify(body));
				return axios
					.post(allRequests.docs.postSinglePartyUploadFile.url, formData, {
						headers: {
							'Content-Type': 'application/json'
						}
					})
					.then(response => {
						if (response.data && response.data.success) {
							setStatus(response.data);
							const toUpdate = { ...files };
							Object.keys(files).forEach(docTypeId => {
								toUpdate[docTypeId].docs = [];
							});
							setFiles(toUpdate);
						}
					})
					.catch(error => {});
			}
			return null;
		});
	}

	const addFiles = (addedFiles, docTypeId) => {
		const docFiles = files[docTypeId];
		docFiles.docs = docFiles.docs ? [...docFiles.docs, ...addedFiles] : addedFiles;
		setFiles({ ...files, [docTypeId]: docFiles });
	};

	const removeFile = (docTypeId, index) => {
		const docFiles = files[docTypeId];
		const toUpdate = { ...docFiles };
		toUpdate.docs = [...docFiles.docs.slice(0, index), ...docFiles.docs.slice(index + 1)];
		setFiles({ ...files, [docTypeId]: toUpdate });
	};

	return (
		<>
			{isUrlValid || isRedirectedUrl ? (
				<>
					<Typography className="mb-16 text-14 font-medium flex-1 mr-12">{showMessage}</Typography>
					<TableContainer>
						<Table sx={{ minWidth: 650 }} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell ialign="left">DOKUMENT</TableCell>
									<TableCell ialign="left">Kreves</TableCell>
									<TableCell ialign="left">FILER</TableCell>
									<TableCell ialign="left"> </TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{Object.keys(files).map(docTypeId => {
									const file = files[docTypeId];
									const onChange = updateFiles => {
										addFiles(updateFiles, docTypeId);
									};
									return (
										<TableRow
											key={file.docTypeId}
											sx={{
												'&:last-child td, &:last-child th': {
													border: 0
												}
											}}
										>
											<TableCell ialign="left">
												<Typography className="text-14 ">
													{file.docName}({file.uploaded.length})
												</Typography>
											</TableCell>
											<TableCell ialign="left">
												{file.isRequired === true ? 'Ja' : null}
											</TableCell>
											<TableCell ialign="left">
												{file.uploaded.map(item => {
													return <div key={item.docId}>{item.fileName}</div>;
												})}
											</TableCell>
											<TableCell>
												<UploadFile onChange={onChange} />
												<div className="flex flex-col mr-12">
													{file.docs &&
														file.docs.map((item, index) => {
															return (
																<FileChip
																	name={item.name}
																	size={`${bytesToSize(item.size)}`}
																	onClose={() => removeFile(docTypeId, index)}
																/>
															);
														})}
												</div>
											</TableCell>
										</TableRow>
									);
								})}
								<TableRow>
									<TableCell />
									<TableCell />
									<TableCell />
									<TableCell>
										<Button variant="contained" color="primary" onClick={onSubmit}>
											Last opp dokumentet
										</Button>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
				</>
			) : (
				<>
					<div className="flex flex-row mb-12 w-full">
						<Typography className="mb-16 text-14 font-medium flex-1 mr-12">Invalid Url</Typography>
					</div>
				</>
			)}
		</>
	);
}

export default UploadDocsPage;
