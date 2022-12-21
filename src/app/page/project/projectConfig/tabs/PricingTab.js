import { useState, useEffect, useRef } from 'react';
import Icon from '@mui/material/Icon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller, useFormContext } from 'react-hook-form';
import allRequests, { requestNBK } from 'api/allRequests';
import ReactSelect from 'react-select';
import { Link, useParams } from 'react-router-dom';
import shortid from 'shortid';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';

function PricingTab(props) {
	const methods = useFormContext();
	const { control, watch } = methods;
	const routeParams = useParams();
	const [allService, setAllService] = useState([]);
	const [selectedService, setSelectedService] = useState(null);
	const [selectedOption, setSelectedOption] = useState([]);
	const [quantity, setQuantity] = useState(0);
	const [rate, setRate] = useState(0);
	const projectServiceList = watch('projectService');
	const dispatch = useDispatch();

	useEffect(() => {
		getService();
	}, []);
	const getService = () => {
		return requestNBK({ requestConfig: allRequests.service.all }).then(res => {
			if (Array.isArray(res.multiService)) {
				setAllService(res.multiService);
			}
		});
	};

	const selectService = option => {
		const service = allService.find(item => item.id === option.value);
		if (service.serviceChargedAs === 2) {
			service.servicePerSlabList.forEach(item => {
				if (item.rangeFrom <= 1 && item.rangeTo >= 1) {
					setRate(item.rate);
				}
			});
		} else {
			setRate(service.rate);
		}

		setQuantity(1);
		setSelectedService(service);
		setSelectedOption(option);
	};

	const handleQuantityChange = e => {
		const { value } = e.target;
		setQuantity(value);

		const updateQuantity = Number(value);
		if (selectedService) {
			if (selectedService.serviceChargedAs === 2) {
				selectedService.servicePerSlabList.forEach(item => {
					if (item.rangFrom <= updateQuantity && item.rangTo >= updateQuantity) {
						setRate(item.rate);
					}
				});
			} else {
				setRate(value * selectedService.rate);
			}
		}
	};

	const handleRateChange = event => {
		const { value } = event.target;
		setRate(value);
	};

	const serviceOptionList = allService.map(item => ({ label: `${item.name} (${item.description})`, value: item.id }));

	return (
		<div>
			<Controller
				control={control}
				name="projectService"
				render={({ field }) => {
					const currentValue = field.value;

					const handleUpdate = updatedItem => {
						const index = currentValue.findIndex(i => i.id === updatedItem.id);

						const newValue = [
							...currentValue.slice(0, index),
							updatedItem,
							...currentValue.slice(index + 1)
						];

						field.onChange(newValue);
						if (routeParams.projectId !== 'new') {
							/* dispatch(updateEntityChecklistItem(updatedItem)); */
						}
					};

					const handleServiceDelete = id => {
						const index = currentValue.findIndex(i => i.id === id);
						const newValue = [...currentValue.slice(0, index), ...currentValue.slice(index + 1)];

						field.onChange(newValue);

						if (currentValue[index].id && routeParams && routeParams.projectId !== 'new') {
							requestNBK({
								requestConfig: allRequests.project.deleteServcie,
								body: {
									ProjectID: routeParams.projectId,
									ProjectServiceID: currentValue[index].id
								}
							}).then(res => {
								dispatch(showMessage({ message: res.message }));
							});
						}
						/* 		if(routeParams && routeParams.projectId !=='new') {
							
						} */
					};

					const handleCreate = () => {
						if (selectedService) {
							const newItem = {
								serviceId: selectedService.id,
								quantity,
								price: rate.toString(),
								isNewAdded: true
							};

							const newValue = [...currentValue, newItem];
							field.onChange(newValue);
							setSelectedService(null);
							setRate('');
							setQuantity('');
							/* 	if(dialogState.type !== 'new'){
								dispatch(addEntityChecklistItem(newItem))
							} */
						}
					};

					return (
						<>
							<div className="grid grid-cols-7 gap-24">
								<div className=" mt-8 mb-16 col-start-1 col-end-4">
									<Typography className="mb-24" variant="subtitle1" color="inherit">
										allService
									</Typography>
									<ReactSelect
										className="react-select z-999"
										classNamePrefix="react-select"
										options={serviceOptionList}
										onChange={selectService}
									/>
								</div>
								<div className="mt-8 mb-16 col-start-4 col-end-5">
									<Typography className="mb-24" variant="subtitle1" color="inherit">
										Quantity
									</Typography>
									<TextField
										value={quantity}
										onChange={handleQuantityChange}
										label="Quantity"
										id="quantity"
										type="number"
										variant="outlined"
										autoFocus
										fullWidth
									/>
								</div>
								<div className="mt-8 mb-16 col-start-5 col-end-7">
									<Typography className="mb-24" variant="subtitle1" color="inherit">
										Rate
									</Typography>
									<TextField
										value={rate}
										onChange={handleRateChange}
										label="Rate"
										id="rate"
										InputProps={{
											startAdornment: <InputAdornment position="start">Kr</InputAdornment>
										}}
										type="number"
										variant="outlined"
										fullWidth
									/>
								</div>

								<div className="mt-8 mb-16 col-start-7 col-end-8">
									<Typography className="mb-24" variant="subtitle1" color="inherit">
										Add
									</Typography>
									<IconButton
										onClick={ev => {
											ev.preventDefault();
											ev.stopPropagation();
											handleCreate();
											/* dispatch(
										updateTodo({
											...props.todo,
											starred: !props.todo.starred
										})
									); */
										}}
									>
										<Icon>add</Icon>
									</IconButton>
								</div>
							</div>
							<div className="my-24">
								<Divider />
							</div>
							{projectServiceList &&
								projectServiceList.map(s => {
									const service = allService.find(item => item.id === s.serviceId);
									if (service) {
										return (
											<div key={shortid()} className="grid grid-cols-7 gap-24">
												<div className="col-start-1 col-end-4 flex items-center">
													<span>
														{service.name} ({service.description})
													</span>
												</div>
												<div className="col-start-4 col-end-5 flex items-center">
													<span>{s.quantity}</span>
												</div>
												<div className="col-start-5 col-end-7 flex items-center">
													<span>{s.price}</span>
												</div>
												<div className=" col-start-7 col-end-8">
													<IconButton
														variant="contained"
														color="secondary"
														onClick={() => handleServiceDelete(s.id)}
													>
														<Icon>delete</Icon>
													</IconButton>
												</div>
											</div>
										);
									}
									return null;
								})}
						</>
					);
				}}
			/>
		</div>
	);
}

export default PricingTab;
