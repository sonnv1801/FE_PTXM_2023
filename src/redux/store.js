import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
// import { persistStore } from 'redux-persist';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  rootReducer /* preloadedState, */,
  composeEnhancers(applyMiddleware(thunk))
);

// export const persistor = persistStore(store);
