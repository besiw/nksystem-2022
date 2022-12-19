import FuseUtils from '@fuse/utils';
import AppContext from 'app/AppContext';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { matchRoutes } from 'react-router-config';
import { withRouter } from 'react-router-dom';
import Login from 'app/page/Login/LoginPage';
import External from 'app/page/external/ExternalLayout';

class FuseAuthorization extends Component {
	constructor(props, context) {
		super(props);
		const { routes } = context;
		this.state = {
			accessGranted: false,
			external: false,
			routes
		};
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
		const { location, userRole } = props;
		const { pathname } = location;

		const matched = matchRoutes(state.routes, pathname)[0];
		let hasPermission = false;
		let external = false;
		if (userRole && userRole.length > 0 && ['admin'].includes(userRole[0])) {
			hasPermission = true;
		}

		if (pathname.startsWith('/external')) {
			hasPermission = true;
			external = true;
		}

		if (pathname) {
			return {
				accessGranted: matched ? hasPermission : false,
				external
			};
		}
		return null;
	}

	redirectRoute() {
		const { location, userRole, history } = this.props;
		const { pathname, state } = location;
		const redirectUrl = state && state.redirectUrl ? state.redirectUrl : '/';

		/*
        User is guest
        Redirect to Login Page
        */
		if (!userRole || userRole.length === 0) {
			history.push({
				pathname: '/login',
				state: { redirectUrl: pathname }
			});
		} else {
			/*
        User is member
        User must be on unAuthorized page or just logged in
        Redirect to dashboard or redirectUrl
        */
			/* history.push({
				pathname: redirectUrl
			}); */
		}
	}

	render() {
		// Login
		// console.info('Fuse Authorization rendered', accessGranted);
		if (this.state.external) {
			return <External />;
		}
		return this.state.accessGranted ? <>{this.props.children}</> : <Login />;
	}
}

function mapStateToProps({ auth }) {
	return {
		userRole: auth.user.role
	};
}

FuseAuthorization.contextType = AppContext;

export default withRouter(connect(mapStateToProps)(FuseAuthorization));
