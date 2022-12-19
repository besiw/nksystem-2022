import React from 'react';
import { Redirect } from 'react-router-dom';
import appStrings from 'app/strings';

const ContactsAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: `/${appStrings.contacts}`,
			component: React.lazy(() => import('./ContactApp'))
		}
	]
};

export default ContactsAppConfig;
