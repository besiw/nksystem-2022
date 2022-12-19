import FuseAnimate from '@fuse/core/FuseAnimate';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import Fab from '@material-ui/core/Fab';

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
				<div className="flex items-center">
					<FuseAnimate animation="transition.expandIn" delay={300}>
						<Icon className="text-32">account_box</Icon>
					</FuseAnimate>
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
						<Typography variant="h6" className="mx-12 hidden sm:flex">
							{title}
						</Typography>
					</FuseAnimate>
				</div>
			</div>

			<div className="flex flex-1 items-center justify-center px-8 sm:px-12">
				<ThemeProvider theme={mainTheme}>
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
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
					</FuseAnimate>
				</ThemeProvider>
			</div>
			<div className="flex items-end">
				<FuseAnimate animation="transition.expandIn" delay={600}>
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
				</FuseAnimate>
			</div>
		</div>
	);
}

export default Header;
