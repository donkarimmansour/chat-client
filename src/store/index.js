import { createStore,compose,combineReducers,applyMiddleware } from "redux";

import thunkMiddleware from 'redux-thunk';

import { authReducer } from "./reducers/authReducer";
import loadingReducer from "./reducers/loading";
import messageReducer from "./reducers/message";
import messengerReducer  from "./reducers/messengerReducer";

const rootReducer = combineReducers({
    auth : authReducer,
    messenger: messengerReducer ,
    loading : loadingReducer ,
    message : messageReducer ,
})


const middleware = [thunkMiddleware];

const store = createStore(rootReducer,compose(
   applyMiddleware(...middleware)//,
//    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

export default store;
