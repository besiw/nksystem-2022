import { useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const ChecklistItem = ({ id, title, checklistId, updateItem, deleteItem }) => {
	const [edit, setEdit] = useState(id === null);
	const [inputText, setInputText] = useState('');
	useEffect(() => {
		if (edit !== false) {
			setInputText(title);
		}
	}, [edit, title]);

	const handleInput = e => {
		setInputText(e.target.value);
	};

	const handleAdd = () => {
		setInputText('');
		updateItem({
			checklistId,
			title: inputText
		});
	};
	const handleUpdate = () => {
		updateItem({
			id,
			checklistId,
			title: inputText
		});
		setEdit(false);
	};

	const handleDelete = () => {
		deleteItem(id);
	};
	const handleCancel = () => {
		setEdit(false);
		setInputText('');
	};
	return (
		<ListItem className="py-20 px-0 sm:px-8" dense button>
			{edit === false ? (
				<>
					<div className="flex flex-1 flex-col relative overflow-hidden">
						<Typography className="todo-title truncate text-14 font-medium" color="inherit">
							{title}
						</Typography>
					</div>

					<div className="px-8">
						<IconButton
							onClick={ev => {
								ev.preventDefault();
								ev.stopPropagation();
								setEdit(true);
								/* dispatch(
                            updateTodo({
                                ...props.todo,
                                starred: !props.todo.starred
                            })
                        ); */
							}}
						>
							<Icon>edit</Icon>
						</IconButton>
						<IconButton
							onClick={ev => {
								ev.preventDefault();
								ev.stopPropagation();
								handleDelete();
								/* dispatch(
                            updateTodo({
                                ...props.todo,
                                starred: !props.todo.starred
                            })
                        ); */
							}}
						>
							<Icon>delete</Icon>
						</IconButton>
					</div>
				</>
			) : (
				<>
					<div className="flex flex-1 w-full">
						<TextField
							style={{ width: '100%' }}
							classNam="flex-1"
							value={inputText}
							placeholder="new add item"
							onChange={handleInput}
							name={id}
							id={id}
						/>
						<div className="px-8 flex">
							{id === null ? (
								<IconButton
									onClick={ev => {
										ev.preventDefault();
										ev.stopPropagation();
										handleAdd();
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
							) : (
								<IconButton
									onClick={ev => {
										ev.preventDefault();
										ev.stopPropagation();
										handleUpdate();
										/* dispatch(
                                updateTodo({
                                    ...props.todo,
                                    starred: !props.todo.starred
                                })
                            ); */
									}}
								>
									<Icon>check</Icon>
								</IconButton>
							)}

							{id !== null && (
								<IconButton
									onClick={ev => {
										ev.preventDefault();
										ev.stopPropagation();

										/* dispatch(
                            updateTodo({
                                ...props.todo,
                                starred: !props.todo.starred
                            })
                        ); */
									}}
								>
									<Icon onClick={handleCancel}>cancel</Icon>
								</IconButton>
							)}
						</div>
					</div>
				</>
			)}
		</ListItem>
	);
};

export default ChecklistItem;
