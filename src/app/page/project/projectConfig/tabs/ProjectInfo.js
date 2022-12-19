import { useState, useEffect, useRef } from 'react';
import { orange } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
import { Controller, useFormContext } from 'react-hook-form';
import allRequests, { requestNBK } from 'api/allRequests';
import ReactSelect from 'react-select';
import DialogWrapper from 'app/page/project/projectWorkplace/StepDialog';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({}));
const postcodeRex = /^[0-9]{4}$/;
function ProjectInfo(props) {
	const classes = useStyles(props);
	const methods = useFormContext();
	const { control, watch, setValue, formState, getValues } = methods;

	const [allSuppliers, setSuppliers] = useState([]);
	const [allPostcode, setAllPostcode] = useState([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [buildingSupplierName, setBuildingSupplierName] = useState('');
	useEffect(() => {
		getAllBuildSuppliers();
		getPostCode();
	}, []);

	const createNewBuildingSuppplier = () => {
		const dataToSend = {
			buildingSupplier: {
				title: buildingSupplierName
			}
		};
		return requestNBK({ requestConfig: allRequests.buildingSupplier.create, body: dataToSend }).then(res => {
			return getAllBuildSuppliers().then(() => {
				setIsDialogOpen(false);
				setValue('buildingSupplierId', res.buildingSupplier.id);
			});
		});
	};
	const getAllBuildSuppliers = () => {
		return requestNBK({ requestConfig: allRequests.buildingSupplier.all }).then(res => {
			if (Array.isArray(res.multiBuildingSuppliers)) {
				const list = res.multiBuildingSuppliers.map(item => {
					return {
						label: item.title,
						value: item.id
					};
				});
				setSuppliers(list);
				/*  this.setState({ buildingSupplierList: list }) */
			}
		});
	};
	const getPostCode = () => {
		return requestNBK({ requestConfig: allRequests.miscellaneous.postCodes }).then(res => {
			setAllPostcode(res.postCodes);
		});
	};
	const findPostcodeInfo = value => {
		if (postcodeRex.test(value)) {
			const foundPostCode = allPostcode.find(item => item.postnummer === value);
			if (foundPostCode) {
				setValue('poststed', foundPostCode.poststed);
				setValue('kommune', foundPostCode.kommunenavn);
			}
		} else {
			console.log('postcode must consist of 4 digits');
		}
	};
	const handleCloseDialog = () => {
		setIsDialogOpen(false);
	};

	const handleBuildingSupplierNameChange = e => {
		setBuildingSupplierName(e.target.value);
	};
	return (
		<div>
			<Typography className="mb-24" variant="subtitle1" color="inherit">
				Husleverandør
			</Typography>
			<div className="grid grid-cols-1 mb-24">
				<div className="w-full flex items-center">
					<Controller
						name="buildingSupplierId"
						control={control}
						defaultValue={[]}
						render={({ field }) => {
							const find = allSuppliers.find(i => i.value === field.value);
							const handleChange = option => {
								field.onChange(option.value);
							};
							return (
								<ReactSelect
									className="flex-1 react-select z-999 mr-24"
									classNamePrefix="react-select"
									options={allSuppliers}
									value={find}
									onChange={handleChange}
								/>
							);
						}}
					/>
					<IconButton
						color="secondary"
						onClick={() => {
							setIsDialogOpen(true);
						}}
					>
						<Icon>add</Icon>
					</IconButton>
				</div>
				{/* 				<div>Legg inn ny</div> */}
			</div>
			<Divider />
			{/* 	<Typography  className="mb-24" variant="subtitle1" color="inherit">Info om prosjektet</Typography> */}
			<div className="grid grid-cols-4 gap-24 mt-24">
				<Controller
					name="address"
					control={control}
					defaultValue={[]}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 col-start-1 col-end-3"
							required
							label="address"
							autoFocus
							id="address"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="gardsNo"
					control={control}
					defaultValue={[]}
					render={({ field }) => {
						return (
							<TextField
								{...field}
								className="mt-8 mb-16 col-start-3 col-end-4"
								required
								label="gardsNo"
								autoFocus
								id="gardsNo"
								variant="outlined"
								fullWidth
							/>
						);
					}}
				/>
				<Controller
					name="bruksnmmer"
					control={control}
					defaultValue={[]}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 col-start-4 col-end-5"
							required
							label="bruksnmmer"
							autoFocus
							id="bruksnmmer"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<div className="grid grid-cols-3 gap-24">
				<Controller
					name="postNo"
					control={control}
					defaultValue={[]} // handlePostcodeChange
					render={({ field }) => {
						const handleChange = e => {
							const { value } = e.target;
							findPostcodeInfo(value);
							field.onChange(value);
						};
						return (
							<TextField
								value={field.value}
								onChange={handleChange}
								className="mt-8 mb-16"
								required
								label="postNo"
								autoFocus
								id="postNo"
								variant="outlined"
								fullWidth
							/>
						);
					}}
				/>
				<Controller
					name="poststed"
					control={control}
					render={({ field }) => (
						<TextField
							disabled
							{...field}
							className="mt-8 mb-16"
							required
							label="poststed"
							autoFocus
							id="poststed"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="kommune"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							disabled
							className="mt-8 mb-16"
							required
							label="kommune"
							autoFocus
							id="kommune"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<div className="grid-cols-2 gap-24">
				<Controller
					name="description"
					control={control}
					defaultValue={[]}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16"
							multiline
							required
							label="description"
							autoFocus
							id="description"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<DialogWrapper
				isDialogOpen={isDialogOpen}
				closeDialog={handleCloseDialog}
				title="Husleverandør"
				content={
					<form>
						<TextField
							onChange={handleBuildingSupplierNameChange}
							value={buildingSupplierName}
							type="text"
							className="mb-24"
							label="name"
							variant="outlined"
							fullWidth
						/>
						<Button
							className="whitespace-nowrap mx-4"
							variant="outlined"
							color="secondary"
							onClick={createNewBuildingSuppplier}
						>
							Legg til
						</Button>
					</form>
				}
			/>
		</div>
	);
}

export default ProjectInfo;
