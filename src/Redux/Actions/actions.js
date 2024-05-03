export const fetchHotels = (hotels) => ({
    type: 'FETCH_HOTELS',
    payload: hotels,
  });

  export const fetchHotelsSearh = (hsearch) => ({
    type: 'FETCH_HOTELS_Search',
    payload: hsearch,
  });

  export const fetchHotelDetail = (hoteldetail) => ({
    type: 'FETCH_HOTEL_Detail',
    payload: hoteldetail,
  });
  export const fetchCheckoutDetail = (checkoutdetail) => ({
    type: 'FETCH_Checkout_Detail',
    payload: checkoutdetail,
  });
  export const SearchToursDetail = (toursdetail) => ({
    type: 'Search_Tours_Detail',
    payload: toursdetail,
  });
  export const ViewTourDetail = (viewtourdetail) => ({
    type: 'View_Tour_Detail',
    payload: viewtourdetail,
  });
  export const SelectPackageData = (packagedata) => ({
    type: 'Select_Package_Data',
    payload: packagedata,
  });
  export const PackageInvoiceData = (packageinvdata) => ({
    type: 'Select_Package_Inv_Data',
    payload: packageinvdata,
  });
  export const OneWayFlightSearchData = (OneWayFlight) => ({
    type: 'OneWay_Flight_Search',
    payload: OneWayFlight,
  });
 
  export const OneWayFlightCheckout = (OneWayFlightcheckout) => ({
    type: 'OneWay_Flight_Checkout',
    payload: OneWayFlightcheckout,
  });
  export const OneWayFlightIndexSearchData = (OneWayFlightSearchData) => ({
    type: 'OneWay_Flight_Index_SearchData',
    payload: OneWayFlightSearchData,
  });
  export const CurrencyRates = (Currency) => ({
    type: 'Currency_Rates',
    payload: Currency,
  });
  export const AllCurrencyRates = (AllCurrency) => ({
    type: 'All_Currency_Rates',
    payload: AllCurrency,
  });
  export const FlightCurrencyRates = (FlightCurrency) => ({
    type: 'Flight_Currency_Rates',
    payload: FlightCurrency,
  });

  export const ActivitiesListing = (ActivityListing) => ({
    type: 'Activity_Listing',
    payload: ActivityListing,
  });
  export const TransferSearchResponse = (TrSeResponse) => ({
    type: 'Transfer_Search_Response',
    payload: TrSeResponse,
  });