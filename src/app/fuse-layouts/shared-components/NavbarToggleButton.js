import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultSettings } from 'app/store/fuse/settingsSlice';
import _ from '@lodash';
import { navbarToggleMobile, navbarToggle } from 'app/store/fuse/navbarSlice';

function NavbarToggleButton(props) {
	const dispatch = useDispatch();
	const theme = useTheme();
	const mdDown = useMediaQuery(theme.breakpoints.down('md'));
	const settings = useSelector(({ fuse }) => fuse.settings.current);
	const { config } = settings.layout;

	return (
		<IconButton
			className={props.className}
			onClick={ev =>
				dispatch(
					mdDown
						? navbarToggleMobile()
						: config.navbar.style === 'style-2'
						? dispatch(
								setDefaultSettings(
									_.set({}, 'layout.config.navbar.folded', !settings.layout.config.navbar.folded)
								)
						  )
						: navbarToggle()
				)
			}
			color="inherit"
			size="small"
		>
			{props.children}
		</IconButton>
	);
}

NavbarToggleButton.defaultProps = {
	children: <Icon fontSize="inherit">menu_open</Icon>
};

export default NavbarToggleButton;