import React, { useCallback, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import ReactSelect from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
/* import FormControlLabel from '@material-ui/core/FormControlLabel' */
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import getInputFields from 'app/shared-components/InputGroup/getInputFields';
import appStrings from 'app/strings';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import WYSIWYGEditor from 'app/shared-components/WYSIWYGEditor';

const InputGroup = ({ control, sectionInputKeys, defaultValues }) => {
	return (
		<>
			{sectionInputKeys.map(item => {
				const { type, label } = item;

				if (item.type === 'select') {
					return (
						<FormControl key={item.id} component="fieldset" className="w-full mb-24 z-50">
							<FormLabel component="legend" className="text-14 mb-4">
								{label}
							</FormLabel>
							<Controller
								render={({ field }) => (
									<ReactSelect
										className="react-select z-999"
										classNamePrefix="react-select"
										options={item.options}
										{...field}
									/>
								)}
								options={item.options}
								name={item.id}
								isClearable
								control={control}
								onChange={([selected]) => {
									return { value: selected };
								}}
							/>
						</FormControl>
					);
				}
				if (item.type === 'multi-select') {
					return (
						<FormControl key={item.id} component="fieldset" className="w-full mb-24 z-50">
							<FormLabel component="legend" className="text-14 mb-4">
								{label}
							</FormLabel>
							<Controller
								render={({ field }) => (
									<ReactSelect
										className="react-select z-999"
										classNamePrefix="react-select"
										options={item.options}
										{...field}
										isMulti
									/>
								)}
								options={item.options}
								name={item.id}
								isClearable
								control={control}
								onChange={([selected]) => {
									return { value: selected };
								}}
							/>
						</FormControl>
					);
				}

				if (item.type === 'editor') {
					return (
						<Controller
							className="mt-8 mb-16"
							render={({ field }) => {
								return defaultValues ? (
									<WYSIWYGEditor {...field} defaultValue={defaultValues[item.id]} />
								) : (
									<WYSIWYGEditor {...field} defaultValue="" />
								);
							}}
							name="template"
							control={control}
						/>
					);
				}
				if (item.type === 'radio') {
					return (
						<FormControl>
							<FormLabel component="legend" className="text-14 mb-4">
								{label}
							</FormLabel>
							<Controller
								control={control}
								name={item.id}
								render={({ field }) => {
									return (
										<RadioGroup
											value={`${field.value}`}
											onChange={field.onChange}
											aria-label={label}
											row
										>
											{item.options.map(opt => (
												<FormControlLabel
													value={`${opt.value}`}
													control={<Radio />}
													label={opt.name}
												/>
											))}
										</RadioGroup>
									);
								}}
							/>
						</FormControl>
					);
				}
				return (
					<div className="flex" key={item.id}>
						{/* <div className="min-w-48 pt-20" /> */}

						<Controller
							control={control}
							name={item.id}
							render={({ field }) => {
								return getInputFields({ field, type, label });
							}}
						/>
					</div>
				);
			})}
		</>
	);
};

export default InputGroup;
