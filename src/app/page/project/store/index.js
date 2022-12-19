import { combineReducers } from '@reduxjs/toolkit';
/* import order from './orderSlice';
import orders from './ordersSlice'; */
import project from './projectSlice';

const reducer = combineReducers({
	project
});

export default reducer;
