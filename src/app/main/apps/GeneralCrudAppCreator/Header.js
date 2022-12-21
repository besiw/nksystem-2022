
import Icon from '@mui/material/Icon';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

function Header(props) {
	const { setSearchText, title, name, openNewDialog } = props;
	const dispatch = useDispatch();
	const searchText = useSelector(state => {
		return state[`${name}App`].searchText;
	});
	const mainTheme = useSelector(selectMainTheme);

	return (
			<div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
				<Typography
				component={motion.span}
				initial={{ x: -20 }}
				animate={{ x: 0, transition: { delay: 0.2 } }}
				delay={300}
				className="text-24 md:text-32 font-extrabold tracking-tight"
				>
					{title}
				</Typography>


				<div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
				
					<Paper 
						component={motion.div}
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
						className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
						>
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
					<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
				>
						<Button
						className=""
						onClick={() => {
							dispatch(openNewDialog());
						}}
						variant="contained"
						color="secondary"
						startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
						>
						Add
						</Button>
					</motion.div>
				</div>
		</div>
	);
}

export default Header;
