import { combineReducers } from 'redux';
import defaultReducer from './defaultReducer';

const rootReducer = combineReducers({
  defaultReducer: defaultReducer,
});

export default rootReducer;
