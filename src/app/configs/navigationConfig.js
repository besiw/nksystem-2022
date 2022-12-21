import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';
import appStrings from 'app/strings';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
	{
		id: 'applications-2',
		title: appStrings.slug_projects,
		type: 'group',
		icon: 'apps',
		children: [
			{
				id: 'new-project',
				title: appStrings.new_projects,
				type: 'item',
				icon: 'chevron_right',
				url: `/${appStrings.slug_project}/new/config`
			},
			{
				id: 'projects',
				title: appStrings.all_projects,
				type: 'item',
				icon: 'chevron_right',
				url: `/${appStrings.slug_projects}`
			},
			{
				id: 'deleted-projects',
				title: appStrings.delete_projects,
				type: 'item',
				icon: 'chevron_right',
				url: `/${appStrings.slug_projects}-deleted`
			},
			{
				id: 'archived-projects',
				title: appStrings.archived_projects,
				type: 'item',
				icon: 'chevron_right',
				url: `/${appStrings.slug_projects}-archived`
			}
		]
	},
	{
		id: 'applications',
		title: appStrings.projects_setting,
		type: 'group',
		icon: 'apps',
		children: [
			{
				id: 'contact',
				title: appStrings.contacts,
				type: 'item',
				icon: 'chevron_right',
				url: `/${appStrings.contacts}`
			},
			{
				id: 'services',
				title: appStrings.services,
				type: 'item',
				icon: 'chevron_right',
				url: '/services'
			},
			{
				id: 'checklists',
				title: appStrings.checklist_template,
				type: 'item',
				icon: 'chevron_right',
				url: '/checklists'
			},
			{
				id: 'other',
				title: 'Other',
				icon: 'chevron_right',
				type: 'collapse',
				children: [
					// /partyType
					{
						id: 'partyType',
						title: appStrings.third_party,
						type: 'item',
						icon: 'chevron_right',
						url: '/partyType'
					},
					{
						id: 'building-supplier',
						title: appStrings.building_supplier,
						type: 'item',
						icon: 'chevron_right',
						url: '/building-supplier'
					},
					{
						id: 'email-template',
						title: appStrings.email_template,
						type: 'item',
						icon: 'chevron_right',
						url: '/email-template'
					},
					{
						id: 'docs',
						title: appStrings.documentions,
						type: 'item',
						icon: 'chevron_right',
						url: '/doctype'
					}
				]
			}
		]
	},
	{
		id: 'applications-3',
		title: appStrings.my_team,
		type: 'group',
		icon: 'apps',
		children: [
			{
				id: 'company',
				title: appStrings.company_profile,
				type: 'item',
				icon: 'chevron_right',
				url: '/team/company'
			},
			{
				id: 'profile',
				title: appStrings.my_profile,
				type: 'item',
				icon: 'chevron_right',
				url: '/team/me'
			},
			{
				id: 'users',
				title: appStrings.users,
				type: 'item',
				icon: 'chevron_right',
				url: '/team/all'
			}
		]
	}
];

export default navigationConfig;
