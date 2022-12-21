import React from 'react';
import { Navigate } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import slugs from 'app/strings';
import CompanyAppConfig from './Company/CompanyAppConfig';
import Login from './Login/LoginPageConfig';

const routeConfigs = [CompanyAppConfig, Login];

const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs),
	{
		path: '/',
		element:  <Navigate to="/company" />
	}
];

export default routes;
