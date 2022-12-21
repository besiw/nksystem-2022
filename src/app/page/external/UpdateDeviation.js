import queryString from 'query-string';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useDeepCompareEffect } from '@fuse/hooks';
import { useParams, useLocation } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import _ from '@lodash';
import { useQuery } from 'app/helpers';
import allRequests, { requestNBK } from 'api/allRequests';
import UploadFile, { bytesToSize } from 'app/shared-components/UploadFile';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import ImageZone from 'app/shared-components/UploadImage';
import Close from '@mui/icons-material/Close';

function UpdateDeviation() {
	const dispatch = useDispatch();

	const [files, setFiles] = useState({});
	const routeParams = useParams();
	const queryStrings = useQuery();
	const { PartyID, PartyTypeID, UrlKey, WorkflowId, ProjectId, CKII } = queryStrings;
	const isUrlValid = PartyID && PartyTypeID && UrlKey;
	const [status, setStatus] = useState('');
	const [inspectionData, setInspectionData] = useState(null);

	useEffect(() => {
		getList();
	}, []);

	const getList = () => {
		return requestNBK({ requestConfig: allRequests.docs.getChecklistItemsForParty, body: queryStrings }).then(
			res => {
				setInspectionData(res.projectChecklistThirdPartyInspData);
			}
		);
	};

	const submitInspectionData = props => {
		const { projectChecklistItemsInspData, ...data } = inspectionData;

		const toSendRequest = projectChecklistItemsInspData.map(clItem => {
			const formData = new FormData();

			const images = props[`${clItem.id}-projectChecklistItemImageInspData`];
			const toSend = {
				// prettier-ignore
				'projectID':ProjectId,
				// prettier-ignore
				"workflowId": WorkflowId,
				partyID: PartyID,
				partyTypeID: PartyTypeID,
				checklistItemIdCommaSeperated: CKII,
				urlKey: UrlKey,
				projectChecklistThirdPartyInspData: {
					id: clItem.checklistId,
					ProjectId,
					projectChecklistItemsInspData: [
						{
							id: clItem.id,
							checklistId: clItem.checklistId
						}
					]
				}
			};
			formData.append('request', JSON.stringify(toSend));
			const imageFiles = images.forEach((file, index) => {
				formData.append(`file[${index}]`, file);
			});

			return axios
				.post(allRequests.docs.postChecklistItemsForParty.url, formData, {
					headers: {
						'Content-Type': 'application/json'
					}
				})
				.then(response => {
					if (response.data && response.data.success) {
						setStatus(response.data);
					}
				})
				.catch(error => {});
		});
	};

	if (isUrlValid && inspectionData) {
		const dataToadd = {};
		const { projectChecklistItemsInspData, ...data } = inspectionData;
		if (Array.isArray(projectChecklistItemsInspData)) {
			projectChecklistItemsInspData.forEach(clItem => {
				dataToadd[`${clItem.id}-projectChecklistItemImageInspData`] = [];
			});
		}

		return (
			<UpdateChecklistForm
				formValue={{ ...dataToadd, ...data }}
				inspectionData={inspectionData}
				submitInspectionData={submitInspectionData}
			/>
		);
	}

	return (
		<div className="flex flex-row mb-12 w-full">
			<Typography className="mb-16 text-14 font-medium flex-1 mr-12">Loading</Typography>
		</div>
	);
}

export default UpdateDeviation;

const UpdateChecklistForm = ({ inspectionData, formValue, submitInspectionData }) => {
	const { control, watch, handleSubmit, formState, getValues, setValue } = useForm({
		mode: 'onChange',
		defaultValues: formValue
	});

	const { projectChecklistItemsInspData, checklistName, comment } = inspectionData;
	return (
		<form onSubmit={handleSubmit(submitInspectionData)}>
			<h1 className="mb-24">{checklistName}</h1>
			{projectChecklistItemsInspData &&
				projectChecklistItemsInspData.map(checklistItem => {
					return (
						<div className=" mb-24">
							<h3 className="mb-12">{checklistItem.title}</h3>
							<Controller
								control={control}
								name={`${checklistItem.id}-projectChecklistItemImageInspData`}
								render={({ field }) => {
									const images = field.value;
									const { onChange } = field;
									const handleDelete = index => {
										const imagesBefore = images.slice(0, index);
										const imagesAfter = images.slice(index + 1);
										const allImages = [...imagesBefore, ...imagesAfter];
										setValue(`${checklistItem.id}-projectChecklistItemImageInspData`, allImages);
									};

									const handleAdd = files => {
										const allImages = [...images, ...files];
										setValue(`${checklistItem.id}-projectChecklistItemImageInspData`, allImages);
									};
									return (
										<div>
											{images.length > 0 && (
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
											)}
											<div className="flex pt-4">
												<ImageZone onChange={handleAdd} />
											</div>
										</div>
									);
								}}
							/>
						</div>
					);
				})}
			<button type="submit">Send</button>
		</form>
	);
};
