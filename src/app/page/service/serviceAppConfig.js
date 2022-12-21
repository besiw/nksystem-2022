import React from 'react';
import { Navigate } from 'react-router-dom';
const  ServiceApp= React.lazy(() => import('./serviceApp'));

const ServicesAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/services',
			element: <ServiceApp/>
		},
		{
			path: '/services/new',
			element: <Navigate to="/services" />
		}
	]
};

export default ServicesAppConfig;
