import React from 'react';
import appStrings from 'app/strings';

const ContactApp = React.lazy(() => import('./ContactApp'));
const ContactsAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: `/${appStrings.contacts}`,
			element: <ContactApp/>
		}
	]
};

export default ContactsAppConfig;
