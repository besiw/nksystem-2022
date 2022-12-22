import FuseUtils from '@fuse/utils';
import AppContext from 'app/AppContext';
import { Component } from 'react';
import { matchRoutes } from 'react-router-dom';
import withRouter from '@fuse/core/withRouter';
import history from '@history';
import Login from 'app/page/Login/LoginPage';
import AdminLogin from 'app/page/Login/AdminLoginPage';
import External from 'app/page/external/ExternalLayout';
const isAdmin = process.env.REACT_APP_IS_ADMIN_PANEL;
let loginRedirectUrl = null;

class FuseAuthorization extends Component {
  constructor(props, context) {
    super(props);
    const { routes } = context;
    this.state = {
      accessGranted: false,
      routes,
	    external: false,
    };
    this.defaultLoginRedirectUrl = props.loginRedirectUrl || '/';
  }

  componentDidMount() {
    if (!this.state.accessGranted) {
      this.redirectRoute();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.accessGranted !== this.state.accessGranted;
  }

  componentDidUpdate() {
    if (!this.state.accessGranted) {
      this.redirectRoute();
    }
  }

  static getDerivedStateFromProps(props, state) {
    console.log(props)
    console.log(state)
	const { location, userRole } = props;
	const { pathname } = location;
  console.log(matchRoutes(state.routes, pathname))
  const result = matchRoutes(state.routes, pathname)
	const matched = result?result[0]:result;
	let hasPermission = false;
	let external = false;
	if (userRole && userRole.length > 0 && ['admin'].includes(userRole[0])) {
		hasPermission = true;
	}

	if (pathname.startsWith('/external')) {
		hasPermission = true;
		external = true;
	}

  console.log(matched)
	if (pathname) {
		return {
			accessGranted: matched ? hasPermission : false,
			external
		};
	}
	return null;
}

  redirectRoute() {
    const { location, userRole } = this.props;
    const { pathname } = location;
    const redirectUrl = loginRedirectUrl || this.defaultLoginRedirectUrl;

    /*
        User is guest
        Redirect to Login Page
        */
    if (!userRole || userRole.length === 0) {
      setTimeout(() => history.push('/sign-in'), 0);
      loginRedirectUrl = pathname;
    } else {
      /*
        User is member
        User must be on unAuthorized page or just logged in
        Redirect to dashboard or loginRedirectUrl
        */
      setTimeout(() => history.push(redirectUrl), 0);
      loginRedirectUrl = this.defaultLoginRedirectUrl;
    }
  }

  render() {
    console.log(this.state.external)
	// Login
	// console.info('Fuse Authorization rendered', accessGranted);
	if (this.state.external) {
		return <External />;
	}
	return this.state.accessGranted ? <>{this.props.children}</> : (isAdmin?<AdminLogin />:<Login />);
}
}

FuseAuthorization.contextType = AppContext;

export default withRouter(FuseAuthorization);
