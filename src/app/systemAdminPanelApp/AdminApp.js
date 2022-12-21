import FuseTheme from '@fuse/core/FuseTheme';
import history from '@history';
import FuseSuspense from '@fuse/core/FuseSuspense';
import { createGenerateClassName, jssPreset, StylesProvider } from '@mui/material/styles';

import { MuiPickersUtilsProvider } from '@mui/x-date-pickers';
import { create } from 'jss';
import jssExtend from 'jss-plugin-extend';
import rtl from 'jss-rtl';
import Provider from 'react-redux/es/components/Provider';
import { Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import DateFnsUtils from '@date-io/date-fns';
import { renderRoutes } from 'react-router-config';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import FuseAuthorization from './FuseAuthorization';
import AppContext from './AppContext';
import { Auth } from '../auth';
import routes from './routesConfig';
import store from './store';
import Layout from './Layout';

const jss = create({
	...jssPreset(),
	plugins: [...jssPreset().plugins, jssExtend(), rtl()],
	insertionPoint: document.getElementById('jss-insertion-point')
});

const generateClassName = createGenerateClassName({ disableGlobal: true });

const App = () => {
	return (
		<AppContext.Provider
			value={{
				routes
			}}
		>
			<StylesProvider jss={jss} generateClassName={generateClassName}>
				<Provider store={store}>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<Auth>
							<Router history={history}>
								<FuseAuthorization>
									<FuseTheme>
										<SnackbarProvider
											maxSnack={5}
											anchorOrigin={{
												vertical: 'bottom',
												horizontal: 'right'
											}}
											classes={{
												containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99'
											}}
										>
											<FuseSuspense>
												<Layout />
											</FuseSuspense>
										</SnackbarProvider>
									</FuseTheme>
								</FuseAuthorization>
							</Router>
						</Auth>
					</MuiPickersUtilsProvider>
				</Provider>
			</StylesProvider>
		</AppContext.Provider>
	);
};

export default App;
