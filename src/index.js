import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store'; 
import { Provider } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import './i18n.js';
store.subscribe(()=>store.getState())
const root = ReactDOM.createRoot(document.getElementById('root'));

const stripePromise = loadStripe('pk_live_51N9pi8GwYlRApJ0wG7yS3NQboZU7cUlBAHxUnolT1UsEeqy4iyMPcmNBs2cgp8o70mN7EPzQkCAdMNhkR5YlXLjH006aOplm1v');

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <Elements stripe={stripePromise}>
      <Suspense fallback="">
      <App />
    </Suspense>
      </Elements>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
reportWebVitals();
