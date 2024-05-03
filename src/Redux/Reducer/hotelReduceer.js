const initialState = {
    hotels: [],
    hsearch:[],
  };
  

  const hotelReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_HOTELS':
        return {
          ...state,
          hotels: action.payload,
        };
         case 'FETCH_HOTELS_Search':
        return {
          ...state,
          hsearch: action.payload, // Update the hsearch property
        };
        case 'FETCH_HOTEL_Detail':
          return {
            ...state,
            hoteldetail: action.payload, // Update the hsearch property
          };
          case 'FETCH_Checkout_Detail':
            return {
              ...state,
              checkoutdetail: action.payload, // Update the hsearch property
            };
            case 'Search_Tours_Detail':
              return {
                ...state,
                toursdetail: action.payload, // Update the hsearch property
              };
              case 'View_Tour_Detail':
                return {
                  ...state,
                  viewtourdetail: action.payload, // Update the hsearch property
                };
                case 'Select_Package_Data':
                return {
                  ...state,
                  packagedata: action.payload, // Update the hsearch property
                };
                case 'Select_Package_Inv_Data':
                  return {
                    ...state,
                    packageinvdata: action.payload, // Update the hsearch property
                  };
                  case 'OneWay_Flight_Checkout':
                  return {
                    ...state,
                    OneWayFlightcheckout: action.payload, // Update the hsearch property
                  };
                  case 'OneWay_Flight_Index_SearchData':
                    return {
                      ...state,
                      OneWayFlightSearchData: action.payload, // Update the hsearch property
                    };
                    case 'Currency_Rates':
                      return {
                        ...state,
                        Currency: action.payload, // Update the hsearch property
                      };
                      case 'All_Currency_Rates':
                      return {
                        ...state,
                        AllCurrency: action.payload, // Update the hsearch property
                      };
                      case 'Activity_Listing':
                        return {
                          ...state,
                          ActivityListing: action.payload, // Update the hsearch property
                        };
                      case 'Flight_Currency_Rates':
                        return {
                          ...state,
                          FlightCurrency: action.payload, // Update the hsearch property
                        };
                        case 'Transfer_Search_Response':
                        return {
                          ...state,
                          TrSeResponse: action.payload, // Update the hsearch property
                        };
                  case 'OneWay_Flight_Search':
                    return {
                      ...state,
                      OneWayFlight: action.payload, // Update the hsearch property
                    };
                  default:
                    return state;
    }
  };
  
  
  export default hotelReducer;