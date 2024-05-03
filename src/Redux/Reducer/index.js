// reducers/index.js
import { combineReducers } from 'redux';
import hotelReducer from './hotelReduceer';

const rootReducer = combineReducers({
  hotels: hotelReducer,
  hsearch: hotelReducer.hsearch,
  hoteldetail: hotelReducer.hoteldetail,
  checkoutdetail:hotelReducer.checkoutdetail,
  toursdetail:hotelReducer.toursdetail,
  viewtourdetail:hotelReducer.viewtourdetail,
  packagedata:hotelReducer.packagedata,
  packageinvdata:hotelReducer.packageinvdata,
  OneWayFlight:hotelReducer.OneWayFlight,
  OneWayFlightcheckout:hotelReducer.OneWayFlightcheckout,
  OneWayFlightSearchData:hotelReducer.OneWayFlightSearchData,
  Currency:hotelReducer.Currency,
  AllCurrency:hotelReducer.AllCurrency,
  ActivityListing:hotelReducer.ActivityListing,
  FlightCurrency:hotelReducer.FlightCurrency,
  TrSeResponse:hotelReducer.TrSeResponse,
  // Add other reducers here if needed
});

export default rootReducer;
