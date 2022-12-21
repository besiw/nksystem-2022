import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectAllContacts,
	getContacts,
	updateContact,
	contactTableConfig,
	addContact
} from 'app/contacts/store/contactSlice';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import ReactSelect from 'react-select';
import appStrings from 'app/strings';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { showMessage } from 'app/store/fuse/messageSlice';

const initialContact = {
	name: '',
	email: '',
	contactNo: '',
	companyName: '',
	longName: ''
};

const SelectContact = props => {
	const { value: initialContactId, onChange, name } = props;
	const [mode, setMode] = useState(null);
	const [selected, setSelected] = useState({ value: '', label: '' });
	const [contact, setContact] = useState(initialContact);
	const dispatch = useDispatch();

	const contactList = useSelector(selectAllContacts);
	const latestCreatedId = useRef();
	useEffect(() => {
		let toSetSelected = { value: '', label: '' };
		let toSetContact = initialContact;
		if (contactList.length > 0) {
			if (latestCreatedId.current) {
				const newContact = latestCreatedId.current;
				const newSelection = { value: newContact.id, label: `${newContact.name} (${newContact.companyName})` };
				setSelected(newSelection);
				setContact(newContact);
				onChange(newContact.id);
			} else {
				const found = contactList.find(item => item && item.id === initialContactId);
				if (found) {
					toSetSelected = { label: found.longName, value: found.id };
					toSetContact = found;
				}
				setSelected(toSetSelected);
				setContact(toSetContact);
			}
		} else {
			dispatch(getContacts());
		}
	}, [contactList.length, initialContactId]);

	const onSelectContactChange = option => {
		setSelected(option);
		onChange(option.value);
		const found = contactList.find(item => item.id === option.value);
		if (found) {
			setContact(found);
			setSelected({ label: found.longName, value: found.id });
		}
	};

	const onContactFormChange = (fieldName, e) => {
		const { value } = e.target;
		setContact({ ...contact, [fieldName]: value });
	};
	const { tableHead } = contactTableConfig;

	const { inputKeys } = contactTableConfig;

	const submitContact = () => {
		const found = contactList.find(item => {
			return (
				item.contactNo === contact.contactNo &&
				item.email === contact.email &&
				contact.companyName === item.companyName &&
				contact.name === item.name
			);
		});
		if (found) {
			dispatch(
				showMessage({
					message: 'The contact already exist',
					options: {
						variant: 'error'
					}
				})
			);
		} else if (mode === 'edit') {
			dispatch(updateContact(contact));
			setMode(null);
		} else {
			dispatch(addContact(contact)).then(res => {
				if (res && res.payload && res.payload.contact) {
					const newContact = res.payload.contact;

					latestCreatedId.current = newContact;
				}
			});
			setMode(null);
		}
	};
	const inEnbleForm = mode === 'edit' || mode === 'add';

	return (
		<div>
			<div className="w-full flex items-center">
				<div className="w-full mr-24">
					<ReactSelect
						className="react-select z-999"
						classNamePrefix="react-select"
						isSearchable
						value={selected}
						options={contactList.map(item => ({ value: item.id, label: item.longName }))}
						onChange={onSelectContactChange}
					/>
				</div>

				<IconButton
					color="secondary"
					disabled={inEnbleForm}
					onClick={() => {
						setMode('edit');
					}}
				>
					<Icon>create</Icon>
				</IconButton>
				<IconButton
					disabled={inEnbleForm}
					color="secondary"
					onClick={() => {
						setMode('add');
						setContact(initialContact);
					}}
				>
					<Icon>add</Icon>
				</IconButton>
			</div>
			<div className="w-full pt-6 min-h-64 flex flex-col" style={{ minHeight: '220px' }}>
				<TextField
					disabled={!inEnbleForm}
					value={contact.name}
					className="mt-8 mb-16"
					required
					label="Name"
					autoFocus
					id="name"
					onChange={e => onContactFormChange('name', e)}
					variant="outlined"
					fullWidth
				/>
				<TextField
					disabled={!inEnbleForm}
					value={contact.companyName}
					className="mt-8 mb-16"
					required
					label={appStrings.company_name}
					autoFocus
					id="companyName"
					onChange={e => onContactFormChange('companyName', e)}
					variant="outlined"
					fullWidth
				/>
				<TextField
					disabled={!inEnbleForm}
					value={contact.contactNo}
					className="mt-8 mb-16"
					required
					label="Contact No"
					autoFocus
					id="contactNo"
					onChange={e => onContactFormChange('contactNo', e)}
					variant="outlined"
					fullWidth
				/>
				<TextField
					disabled={!inEnbleForm}
					value={contact.email}
					className="mt-8 mb-16"
					required
					label="E-mail"
					autoFocus
					id="email"
					variant="outlined"
					fullWidth
					onChange={e => onContactFormChange('email', e)}
				/>
				{inEnbleForm && (
					<div>
						<Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="secondary"
							onClick={submitContact}
						>
							{mode === 'add' && 'Add New Contact'}
							{mode === 'edit' && 'Update Contact'}
						</Button>
						<Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="default"
							onClick={() => {
								setMode(null);
							}}
						>
							Cancel
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default SelectContact;
