import FuseSearch from '@fuse/core/FuseSearch';
import FuseShortcuts from '@fuse/core/FuseShortcuts';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import NavbarToggleButton from 'app/fuse-layouts/shared-components/NavbarToggleButton';
import QuickPanelToggleButton from 'app/fuse-layouts/shared-components/quickPanel/QuickPanelToggleButton';
import UserMenu from 'app/fuse-layouts/shared-components/UserMenu';
import clsx from 'clsx';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectToolbarTheme } from 'app/store/fuse/settingsSlice';
import appStrings from 'app/strings';
import AdjustFontSize from '../../shared-components/AdjustFontSize';
import FullScreenToggle from '../../shared-components/FullScreenToggle';
import LanguageSwitcher from '../../shared-components/LanguageSwitcher';

const useStyles = makeStyles(theme => ({
	root: {}
}));

function ToolbarLayout1(props) {
	const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
	const navbar = useSelector(({ fuse }) => fuse.navbar);
	const toolbarTheme = useSelector(selectToolbarTheme);

	const classes = useStyles(props);

	return (
		<ThemeProvider theme={toolbarTheme}>
			<AppBar
				id="fuse-toolbar"
				className={clsx(classes.root, 'flex relative z-20 shadow-md', props.className)}
				color="default"
				style={{ backgroundColor: toolbarTheme.palette.background.paper }}
				position="static"
			>
				<Toolbar className="p-0 min-h-48 md:min-h-64">
					<div className="flex flex-1 px-16">
						{config.navbar.display && config.navbar.position === 'left' && (
							<>
								<Hidden mdDown>
									{(config.navbar.style === 'style-3' || config.navbar.style === 'style-3-dense') && (
										<NavbarToggleButton className="w-40 h-40 p-0 mx-0" />
									)}

									{config.navbar.style === 'style-1' && !navbar.open && (
										<NavbarToggleButton className="w-40 h-40 p-0 mx-0" />
									)}
								</Hidden>

								<Hidden lgUp>
									<NavbarToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
								</Hidden>
							</>
						)}

						<Hidden mdDown>
							<FuseShortcuts />
						</Hidden>
						<div className="flex sm:block">
							<Button
								className="whitespace-nowrap mx-4"
								variant="contained"
								color="secondary"
								component={Link}
								to={`/${appStrings.slug_projects}`}
							>
								<Icon>ballot</Icon>
								<span className="hidden sm:block px-8">{appStrings.all_projects}</span>
							</Button>
							<Button
								className="whitespace-nowrap mx-4"
								variant="contained"
								color="secondary"
								component={Link}
								to={`/${appStrings.slug_project}/new/config`}
							>
								<Icon>add</Icon>
								<span className="hidden sm:block px-8">{appStrings.new_projects}</span>
							</Button>
						</div>
						{/* <div>Link to all Projects</div> */}
					</div>

					<div className="flex items-center px-8 h-full overflow-x-auto">
						{/* <LanguageSwitcher /> */}

						<AdjustFontSize />

						<FullScreenToggle />

						<FuseSearch />

						{/* <QuickPanelToggleButton /> */}

						<UserMenu />
					</div>

					{config.navbar.display && config.navbar.position === 'right' && (
						<>
							<Hidden mdDown>
								{!navbar.open && <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />}
							</Hidden>

							<Hidden lgUp>
								<NavbarToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
							</Hidden>
						</>
					)}
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default memo(ToolbarLayout1);
