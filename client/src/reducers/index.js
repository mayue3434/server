import {combineReducers} from 'redux';
import authreducer from './authReducer';
export default combineReducers({
    auth: authreducer
});