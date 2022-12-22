import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import withReducer from 'app/store/withReducer';

import ProjectsHeader from './AllComapniesHeader';
import ProjectsTable from './AllCompaniesTable';
import reducer, { getEntities } from './store/companySlice';
/* const { thunkActions, slice, selectors } = store;
const { addEntity, getEntities, removeEntity, updateEntity } = thunkActions;
const { reducer } = slice;
console.log(reducer); */
/* const { setcompanySearchText: setSearchText } = slice.actions;
const { selectAllcompanys } = selectors; */
function Companies() {
	const dispatch = useDispatch();
	const searchText = useSelector(props => {
		/* const { companyApp } = props;
		return companyApp.searchText; */
	});
	useEffect(() => {
		dispatch(getEntities());
	}, [dispatch, getEntities]);
	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={<ProjectsHeader />}
			content={<ProjectsTable getProjects={getEntities} />}
			innerScroll
		/>
	);
}

export default withReducer('companyApp', reducer)(Companies);
