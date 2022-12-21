import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import Fab from '@mui/material/Fab';

function Header(props) {
	const { setSearchText, title, name, openNewDialog } = props;
	const dispatch = useDispatch();
	const searchText = useSelector(state => {
		return state[`${name}App`].searchText;
	});
	const mainTheme = useSelector(selectMainTheme);

	return (
		<div className="flex flex-1 items-center justify-between p-4 sm:p-24 relative">
			<div className="flex flex-shrink items-center sm:w-224">
				<Typography variant="h6" className="mx-12 hidden sm:flex">
							{title}
				</Typography>
			</div>

			<div className="flex flex-1 items-center justify-center px-8 sm:px-12">
				<ThemeProvider theme={mainTheme}>
					<Paper className="flex p-4 items-center w-full max-w-512 h-48 px-8 py-4 rounded-8 shadow">
							<Icon color="action">search</Icon>
							<Input
								placeholder="Search for anything"
								className="flex flex-1 px-16"
								disableUnderline
								fullWidth
								value={searchText}
								inputProps={{
									'aria-label': 'Search'
								}}
								onChange={ev => setSearchText(ev)}
							/>
					</Paper>
				</ThemeProvider>
			</div>
			<div className="flex items-end">
				<Fab
						onClick={() => {
							dispatch(openNewDialog());
						}}
						color="secondary"
						aria-label="add"
						className=""
						/* className="absolute bottom-0 ltr:left-0 rtl:right-0 mx-16 -mb-28 z-999" */
					>
						<Icon>add</Icon>
				</Fab>
			</div>
		</div>
	);
}

export default Header;
