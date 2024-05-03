import { createStore } from 'redux';
import rootReducer from "./Redux/Reducer";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// const store = createStore(rootReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const persistConfig = {
    key: 'root', // root key in local storage
    storage,
  };
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  const store = createStore(persistedReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
  const persistor = persistStore(store);
  
  export { store, persistor };