import React, { createContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faCheck,
  faClockFour,
  faDollar,
  faInfoCircle,
  faPlane,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import { Tooltip, Whisper } from 'rsuite'
import {
  FlightSearchToken,
  Hotelapitoken,
  ApiEndPoint,
  CurrencyConverter
} from '../GlobalData/GlobalData'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import img4 from '../Data/airline.png'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import '../Data/airline.css'
import '../Data/airline2.css'
import Loading from '../Loading/Loader'
import { ToastContainer, toast } from 'react-toastify'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  OneWayFlightCheckout,
  FlightCurrencyRates,
  fetchHotels,
  fetchHotelsSearh
} from '../../Redux/Actions/actions'
import { AirLineNames } from '../Data/AirLineNames'
import { airportcode } from '../Data/AirportCodes'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
function FlightCard ({ filterData,NewData }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  var FlightresposeData = [];
  var SearchFlights1 = useSelector(state => state.hotels.OneWayFlight.PricedItineraries);
  var IndexPageSearchData1 = useSelector( state => state.hotels.OneWayFlightSearchData);
  const [SearchFlights, setSearchFlights] = useState(NewData);
  const [IndexPageSearchData, setIndexPageSearchData] = useState(IndexPageSearchData1);
  const [isLoading, setIsLoading] = useState(false);
  const [baseCurrency, setBaseCurrency] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [baseCName, setBaseCName] = useState('GBP');
  const [showPrice, setShowPrice] = useState(true);
  const [showFilterData, setShowFilterData] = useState([]);
  const [displayedFlights, setDisplayedFlights] = useState(10);
  const CurrencyRates = useSelector(state => state.hotels.Currency);
  const GBPCurrencyRates = useSelector(state => state.hotels.AllCurrency);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [rightSideBarData, setRightSideBarData] = useState([]);
  const toggleSidebar = (data) => {
    setRightSideBarData(data);
    setSidebarOpen(!isSidebarOpen)
    document.body.style.overflow = isSidebarOpen ? 'auto' : 'hidden'
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    document.body.style.overflow = 'auto'
  }
  var Airlinenamesdata = AirLineNames;
  if (SearchFlights.length !== 0) {
  var flightCurrency =SearchFlights[0].AirItineraryPricingInfo.ItinTotalFare.TotalFare.CurrencyCode}
  var FlightMarkup = JSON.parse(localStorage.getItem('FlightMarkup'));
  
  const apiend = ApiEndPoint();
  const [currentPage, setCurrentPage] = useState(1);
  const TransferPerPage = 10; // Number of hotels to display per page
  const indexOfLastTransfer = currentPage * TransferPerPage;
  const indexOfFirstTransfer = indexOfLastTransfer - TransferPerPage;
  const currentFlights =showFilterData.slice(indexOfFirstTransfer, indexOfLastTransfer);
  const pagesCount = Math.ceil(showFilterData.length / TransferPerPage);
  const validCurrentPage = currentPage < 1 ? 1 : currentPage;
  const maxPagesToShow = 5
  const startHotelIndex = indexOfFirstTransfer + 1;
  const endHotelIndex = Math.min(indexOfLastTransfer, showFilterData.length);
  const paginate = (pageNumber) => {
    window.scrollTo(0, 0);
    setCurrentPage(pageNumber);
  };
  const renderPaginationItems = () => {
    const items = [];
    let startPage = currentPage - Math.floor(maxPagesToShow / 2);
    startPage = Math.max(startPage, 1);
    const endPage = Math.min(startPage + maxPagesToShow - 1, pagesCount);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i} active={i === currentPage}>
          <PaginationLink onClick={() => paginate(i)} href="#">
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };
  useEffect(() => {
    // Adjust the current page if it exceeds the total number of pages
    if (currentPage < 1) {
      setCurrentPage(1);
    } else if (currentPage > pagesCount) {
      setCurrentPage(pagesCount);
    }
  }, [ currentPage, pagesCount]); 

  useEffect(() => {
    setCurrentPage(1);
  }, [ showFilterData]); 
  useEffect(()=>{
    setSearchFlights(SearchFlights1);
    setIndexPageSearchData(IndexPageSearchData1);
  },[SearchFlights1,IndexPageSearchData1]);
  const handleScroll = () => {
    const windowHeight = window.innerHeight
    const scrollHeight = document.documentElement.scrollHeight
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    if (scrollHeight - (windowHeight + scrollTop) < 700) {
      setDisplayedFlights(displayedFlights + 10)
    }
  };

  useEffect(() => {
    const objectKeys = Object.keys(filterData);
    const objectLength = objectKeys.length
    if (filterData !== '' && objectLength > 1) {
      if (filterData.type === 'Stop') {
        if (filterData && filterData.hasOwnProperty('All')) {
          setShowFilterData(NewData)
          return
        }
        const filteredFlights = NewData.filter(flight => {
          const isDirect = flight.OriginDestinationOptions[0].FlightSegments.length === 1;
        
          for (const stoptype in filterData) {
            if ((isDirect && filterData[stoptype] === 'Direct') || (!isDirect && filterData[stoptype] === 'OneStop')) {
              return true; // Found a match, include the flight
            }
          }
          return false;
        });
        
        setShowFilterData(filteredFlights)
      } else if (filterData.type === 'Airline') {
        const filteredFlights = NewData.filter(flight => {
          const validatingAirlineCode = flight.ValidatingAirlineCode
          for (const stoptype in filterData) {
            if (validatingAirlineCode === filterData[stoptype]) {
              return true // Include the flight if it matches any of the specified airlines
            }
          }
          return false // Exclude the flight if it doesn't match any of the specified airlines
        })
        setShowFilterData(filteredFlights)
      } else if (filterData.type === 'Class') {
        const filteredFlights = NewData.filter(flight => {
          // Check if any room in the hotel's rooms_options array has the specified boardtype
          return flight.OriginDestinationOptions[0].FlightSegments.some(
            flight1 => {
              for (var stoptype in filterData) {
                if (flight1.CabinClassCode === filterData[stoptype]) {
                  return true
                }
              }
              return false
            }
          )
        })
        setShowFilterData(filteredFlights)
      }else if (filterData.type === 'Journey') {
        const filteredFlights = NewData.filter(flight => {
          // Calculate the total duration of all flight segments for each flight
          const totalDuration = flight.OriginDestinationOptions[0].FlightSegments.reduce((sum, flightSegment) => {
            return sum + flightSegment.JourneyDuration;
          }, 0);
        
          // Convert the total duration to hours
          const totalHours = totalDuration / 60;
        
          // Check if the total duration is less than the specified time
          return totalHours < Number(filterData.time);
        });
        setShowFilterData(filteredFlights)
      }else if (filterData.type === 'DepartureTime') {
        const filteredFlights = NewData.filter((flight) => {
          // Get the departure time of the first flight segment
          const firstSegmentDepartureTime = flight.OriginDestinationOptions[0]?.FlightSegments[0]?.DepartureDateTime;
         
          // Check if there is a valid departure time
          if (firstSegmentDepartureTime) {
            // Parse the departure time to compare with the selected range
            const departureTime = new Date(firstSegmentDepartureTime);
            const departureHours = departureTime.getHours();
            const departureMinutes = departureTime.getMinutes();
            // const departureHours = departureTime.getHours() * 60 + departureTime.getMinutes();
            const totalMinutes = departureHours * 60 + departureMinutes;
            const filterStartTime = timeToMinutes(filterData.time[0]);
            const filterEndTime = timeToMinutes(filterData.time[1]);
            // Check if the departure time is within the selected range
            return totalMinutes >= filterStartTime && totalMinutes <= filterEndTime;
          }
      
          // If no valid departure time, exclude the flight from the filtered results
          return false;
        });
        setShowFilterData(NewData)
      }
    } else if (filterData === '1' || filterData === '3') {
      var Indirectflight = NewData.filter(flight => {
        // Check if the first element of FlightSegments array has an index greater than one
        return flight.OriginDestinationOptions[0].FlightSegments.length > 1;
      });
      // Sort flights in ascending order based on totalamount
      var sotFlight = Indirectflight.sort(
        (a, b) =>
          Number(a.AirItineraryPricingInfo.PTC_FareBreakdowns[0]?.PassengerFare.TotalFare.Amount) -
          Number(b.AirItineraryPricingInfo.PTC_FareBreakdowns[0]?.PassengerFare.TotalFare.Amount)
      )
      setShowFilterData(sotFlight)
    } else if (filterData === '2' ) {
      const durations = [];
      NewData.forEach((item) => {
        var sum = 0;
        item.OriginDestinationOptions[0].FlightSegments.forEach((item2) => {
          sum = sum + item2.JourneyDuration;
        });
        durations.push(sum);
      });
      
      // Now, sort the SearchFlights array based on the durations
      const sortedFlights = NewData.slice(); // Create a copy of the array to avoid mutating the original array
      
      sortedFlights.sort((a, b) => {
        const durationA = durations[NewData.indexOf(a)];
        const durationB = durations[NewData.indexOf(b)];
      
        return durationA - durationB;
      });
      setShowFilterData(sortedFlights)
    }else if (filterData === '5') {
      bookHotel();
    }else if (filterData === '4') {
      bookHotel();
    } else {
      setShowFilterData(NewData)
    }
  }, [filterData,NewData])

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  useEffect(() => {
    AllCurrency(flightCurrency)
  }, [baseCName])

  const BookFlight = async FareSource => {
    var token = FlightSearchToken()

    setIsLoading(true)
    const retrievedNumber = localStorage.getItem('15digitnumber')
    var data = {
      token_authorization: token,
      ConversationId: retrievedNumber,
      FareSourceCode: FareSource
    }
    try {
      const response = await Axios.post(
        apiend + '/api/flight_revalidation_Live',
        data,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
            'Access-Control-Allow-Headers':
              'Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale'
          }
        }
      )
      setIsLoading(false)
      if (response.data.Success === false) {
        toast.info(response.data.Data.Errors[0].Message, {
          position: toast.POSITION.TOP_RIGHT
        })

        return
      } else if (response.data.Success === true) {
        sessionStorage.setItem(
          'FlightCheckOut',
          JSON.stringify(response.data.Data)
        )
        dispatch(OneWayFlightCheckout(response.data.Data))
        ToggleModal();
      }
      // Handle the API response here
    } catch (error) {
      // Handle errors here
      setIsLoading(false)
      console.error('Error:', error)
    }
  }
  const renderPrice = price => {
    if (CurrencyRates === undefined) {
      const gbpprice = baseCurrency[baseCName] // Use square brackets to access the property
      var baseprice = (Number(gbpprice) * Number(price))
    } else {
      var select123 = CurrencyRates.selectedcurrency
      const gbpprice = baseCurrency[baseCName]
      var baseprice1 = (Number(gbpprice) * Number(price))
      const gbpprice2 = GBPCurrencyRates.conversion_rates[select123] // Use square brackets to access the property
      var baseprice = (Number(gbpprice2) * Number(baseprice1))
    }
    return baseprice
  };

  const AllCurrency = c => {
    var token = CurrencyConverter()
    const config = {
      method: 'get',
      url: 'https://v6.exchangerate-api.com/v6/' + token + '/latest/' + c, // Replace with your API URL
      maxBodyLength: Infinity,
      headers: {}
    }

    Axios.request(config)
      .then(response => {
        // Handle the response data here
        setBaseCurrency(response.data.conversion_rates)
        dispatch(FlightCurrencyRates(response.data.conversion_rates))
      })
      .catch(error => {
        // Handle errors here
        setShowPrice(false)
        console.error(error)
      })
  }

  const ToggleModal = () => {
    setOpenModal(!openModal)
  }
  const ProceedCheckout = () => {
    localStorage.removeItem('FlightCheckOut')
    navigate('/Flight_checkout')
  }

  const bookHotel = async () => {
    setIsLoading(true)

    const departureDateObj = new Date(IndexPageSearchData.DepartureDate)
    const checkOutDateObj = new Date(departureDateObj)
    checkOutDateObj.setDate(departureDateObj.getDate() + 4)
    const checkOutDate = checkOutDateObj.toISOString().split('T')[0]
    const filteredOptions = airportcode.items.filter(option =>
      option.airportCode
        .toLowerCase()
        .includes(IndexPageSearchData.ArrivalCode.toLowerCase())
    )
    var name =
      filteredOptions[0].cityName + ' ' + filteredOptions[0].countryName
    const apiKey = 'AIzaSyBmwlQFQKwxZ4D8nRbsWVRTBFUHMO-lUOY'
    const city = name
    var latitude
    var longitude
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${apiKey}`
      )
      const data = await response.json()
      if (data.status === 'OK') {
        const result = data.results[0]
        latitude = result.geometry.location.lat
        longitude = result.geometry.location.lng
      } else {
        setIsLoading(false)
        console.log('Geocoding request failed with status: ', data.status)
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error:', error)
    }
    var token = Hotelapitoken()
    const bookingData = {
      token: token,
      Adults: [IndexPageSearchData.adult],
      adult: IndexPageSearchData.adult,
      check_in: IndexPageSearchData.DepartureDate,
      check_out: checkOutDate,
      child: IndexPageSearchData.child,
      child_ages1: [],
      child_ages2: [],
      children: [0],
      cityd: filteredOptions[0].cityName,
      country: filteredOptions[0].countryName,
      country_code: filteredOptions[0].countryCode,
      currency_slc: 'AFN',
      currency_slc_iso: 'AF',
      destination_name: filteredOptions[0].cityName,
      lat: latitude,
      long: longitude,
      pin: filteredOptions[0].countryCode,
      room: 1,
      rooms_counter: [1],
      slc_nationality: 'PK'
    }
    try {
      dispatch(fetchHotelsSearh(bookingData))
      const response = await Axios.post(
        apiend + '/api/search/hotels/new_Live',
        bookingData,
        {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      )

      //  console.log(response);
      dispatch(fetchHotels(response.data))
      if(filterData==='5' || filterData==='4'){
        openInNewTab('/hotels')
      }else{
        navigate('/hotels');
      }
      setIsLoading(false)
      // Handle the API response here
    } catch (error) {
      // Handle errors here
      setIsLoading(false)
      console.error('Error:', error)
    }
  };

  const openInNewTab = (url) => {
    window.open(url, '_blank');
    
  };

  const CalculateFLightMarkup = price => {
    var admin = 0
    var client = 0
    if (price !== 'NaN') {
      FlightMarkup.markups.forEach(markup => {
        if (markup.services_type === 'flight') {
          if (markup.added_markup === 'alhijaz') {
            if (markup.markup_type === 'Percentage') {
              const markupValue = Number(markup.markup_value)
              const markupAmount = (Number(price) * markupValue) / 100
              client = markupAmount
            } else {
              client = Number(markup.markup_value)
            }
          } else if (markup.added_markup === 'synchtravel') {
            if (markup.markup_type === 'Percentage') {
              const markupValue = parseFloat(Number(markup.markup_value))
              const markupAmount = (Number(price) * markupValue) / 100
              admin = markupAmount
            } else {
              admin = Number(markup.markup_value)
            }
          }
        }
      })

      var total = Number(price) + admin + client
      return total.toFixed(2)
    }
  }
  return (
    <>
      {isLoading && <Loading />}
      <ToastContainer />
      {/***********  Model Windows ****************/}
      <Modal isOpen={openModal} toggle={ToggleModal}>
        <ModalHeader toggle={ToggleModal}>Book Another Service</ModalHeader>
        <ModalBody>
          <div className='text-center'>
            <h6>Do You Want To Another Service</h6>
            <button onClick={bookHotel} className='btn btn-success m-2'>
              Book Hotel
            </button>
            <h6>No</h6>
            <button onClick={ProceedCheckout} className='btn btn-danger m-2'>
              Proceed Checkout
            </button>
          </div>
        </ModalBody>
      </Modal>
      <div
        className={`app-container ${
          isSidebarOpen ? 'sidebar-open2' : 'sidebar-open'
        }`}
      >
        {isSidebarOpen && (
          <>
            <RightSidebar onClose={closeSidebar} data={rightSideBarData} />
            <div className='overlay2'></div>
          </>
        )}
      </div>
        <div className='filter-page__content'>
          <div className='filter-item-wrapper' id='tours_filter'>
            <div className='row'>
              {currentFlights.map((item, index) => (
                <div key={index} className='col-md-12 mb-4'>
                  <div className='row parent_row pt-0'>
                    <div
                      className='col-md-5 col-sm-6 col-5'
                      style={{ background: 'aliceblue' }}
                    >
                      <div
                        className={`p-card-title  logo-${item.ValidatingAirlineCode}`}
                      ></div>
                    </div>
                    <div
                      className='col-md-7 col-sm-6 col-7'
                      style={{ background: 'aliceblue' }}
                    >
                      <h5 className='card-title m-2 text-end'>
                        <a className='p-card-title'>
                          {Airlinenamesdata[item.ValidatingAirlineCode]
                            ? `${
                                Airlinenamesdata[item.ValidatingAirlineCode]
                                  .AirLineName
                              } `
                            : `Unknown Airline`}
                        </a>
                      </h5>
                    </div>

                    <div
                      className='col-md-9'
                      style={{ marginTop: 'auto', marginBottom: 'auto' }}
                    >
                      {item.OriginDestinationOptions.map((item3, upindex) => {
                        const totalTime = item3.FlightSegments.reduce(
                          (sum, flight) => sum + flight.JourneyDuration,
                          0
                        )
                        var length = item3.FlightSegments.length
                        var FirstFlight = item3.FlightSegments[0]
                        var LastFlight = item3.FlightSegments[length - 1]
                        var stops = []
                        if (length > 1) {
                          for (var i = 1; i < length; i++) {
                            var currentSegment = item3.FlightSegments[i]
                            var previousSegment = item3.FlightSegments[i - 1]

                            var startTime = new Date(
                              previousSegment.ArrivalDateTime
                            )
                            var endTime = new Date(
                              currentSegment.DepartureDateTime
                            )

                            const timeDifference = endTime - startTime
                            var stopHours = Math.floor(
                              timeDifference / (1000 * 60 * 60)
                            )
                            var stopMinutes = Math.floor(
                              (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
                            )
                            const filterairport = airportcode.items.filter(
                              option =>
                                option.airportCode
                                  .toLowerCase()
                                  .includes(
                                    currentSegment.DepartureAirportLocationCode.toLowerCase()
                                  )
                            )
                            var stopName =
                              filterairport[0].cityName +
                              ' ' +
                              filterairport[0].countryName
                            stops.push({
                              name: stopName,
                              hours: stopHours,
                              minutes: stopMinutes
                            })
                          }
                        }
                        var tooltipContent = stops.map((stop, index) => {
                          return (
                            <div key={index}>
                              <p>Stop {index + 1}</p>
                              <p className='m-0'>
                                Waiting time {stop.hours}h {stop.minutes}m in{' '}
                                {stop.name}
                              </p>
                            </div>
                          )
                        })
                        return (
                          <div
                            class='fl-detail-left ms-0'
                            style={{ padding: '0' }}
                          >
                            <div class='fl-detail-left-container'>
                              <div class='fl-flight-schedual'>
                                <div
                                  class='fl-flight-route'
                                  style={{ paddingBottom: '0' }}
                                >
                                  <div class='fl-route-detail'>
                                    <h4 class='left'>
                                      {moment(
                                        FirstFlight.DepartureDateTime
                                      ).format('HH:mm')}
                                      <span>
                                        {' '}
                                        ({FirstFlight.DepartureAirportLocationCode} )
                                      </span>
                                    </h4>
                                    <Whisper
                                      placement='top'
                                      speaker={
                                        <Tooltip>Total Duration</Tooltip>
                                      }
                                    >
                                      <h4 class='center fl-width text-center'>
                                        <FontAwesomeIcon
                                          color='gray'
                                          icon={faClockFour}
                                        />{' '}
                                        {Math.floor(totalTime / 60)}h{' '}
                                        {totalTime % 60}m
                                      </h4>
                                    </Whisper>
                                    <h4 class='right fl-width text-end'>
                                      {moment(
                                        length > 1
                                          ? LastFlight.ArrivalDateTime
                                          : FirstFlight.ArrivalDateTime
                                      ).format('HH:mm')}
                                      <span>
                                        {' '}
                                        (
                                        {length > 1
                                          ? LastFlight.ArrivalAirportLocationCode
                                          : FirstFlight.ArrivalAirportLocationCode}
                                        )
                                      </span>
                                    </h4>
                                  </div>
                                  <div class='fl-route-direction'>
                                    <div class='fl-route-bar'></div>
                                    <div
                                      class={`fl-icon ${
                                        upindex === 1 ? 'filght-fa-rotate' : ''
                                      }`}
                                    >
                                      <FontAwesomeIcon icon={faPlane} />
                                    </div>
                                  </div>
                                  <div class='fl-route-detail'>
                                    <p
                                      class='left'
                                      style={{ fontSize: '.9em' }}
                                    >
                                      {' '}
                                      <br />{' '}
                                      {moment(
                                        FirstFlight.DepartureDateTime
                                      ).format('ll')}
                                    </p>
                                    <Whisper
                                      placement='bottom'
                                      speaker={
                                        <Tooltip>{tooltipContent}</Tooltip>
                                      }
                                    >
                                      <p
                                        class='center fl-width text-center'
                                        style={{
                                          fontSize: '.9em',
                                          marginTop: 'auto',
                                          color: 'green'
                                        }}
                                      >
                                        {length > 1
                                          ? length - 1 + ' Stop'
                                          : 'Direct'}
                                      </p>
                                    </Whisper>
                                    <p
                                      class='right text-end'
                                      style={{ fontSize: '.9em' }}
                                    >
                                      <br />{' '}
                                      {moment(
                                        length > 1
                                          ? LastFlight.ArrivalDateTime
                                          : FirstFlight.ArrivalDateTime
                                      ).format('ll')}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className='col-md-3 text-center card-price-section  pt-2'>
                      <h6 className='text-center p-view-detail'>
                        <h6 onClick={() => toggleSidebar(item)}>
                          Flight Detail
                        </h6>
                      </h6>
                      <div className='price text-center p-card-price mt-2'>
                        {showPrice ? (
                          <h6>
                            {item.AirItineraryPricingInfo.PTC_FareBreakdowns.map(
                              (item1, index) => (
                                <div key={index}>
                                  {item1.PassengerTypeQuantity.Code ===
                                    'ADT' && (
                                    <super>
                                      {CurrencyRates === undefined
                                        ? baseCName
                                        : CurrencyRates.selectedcurrency}{' '}
                                      {CalculateFLightMarkup(
                                        renderPrice(
                                          Number(
                                            item1.PassengerFare.TotalFare.Amount
                                          ) *
                                            item1.PassengerTypeQuantity.Quantity
                                        )
                                      )}
                                    </super>
                                  )}
                                </div>
                              )
                            )}
                            {/* <sub>PP</sub> */}
                          </h6>
                        ) : (
                          <h6>
                            {item.AirItineraryPricingInfo.PTC_FareBreakdowns.map(
                              (item1, index) => (
                                <div key={index}>
                                  {item1.PassengerTypeQuantity.Code ===
                                    'ADT' && (
                                    <super>
                                      {
                                        item1.PassengerFare.TotalFare
                                          .CurrencyCode
                                      }{' '}
                                      {CalculateFLightMarkup(
                                        Number(
                                          item1.PassengerFare.TotalFare.Amount
                                        ) * item1.PassengerTypeQuantity.Quantity
                                      )}
                                    </super>
                                  )}
                                </div>
                              )
                            )}
                            {/* <super>{item.AirItineraryPricingInfo.PTC_FareBreakdowns.ItinTotalFare.TotalFare.CurrencyCode} {CalculateFLightMarkup(item.AirItineraryPricingInfo.PTC_FareBreakdowns.TotalFare.Amount)}</super> */}
                            {/* <sub>PP</sub> */}
                          </h6>
                        )}

                        {/* {index==0 && (item.AirItineraryPricingInfo.ItinTotalFare.TotalFare.CurrencyCode)} */}
                      </div>
                      {/* <div className='mt-2' style={{ fontSize: '11px' }}>
                        <FontAwesomeIcon
                          color='#bd1c1cc9'
                          icon={faInfoCircle}
                        />{' '}
                        Exclude Fare
                      </div> */}

                      <button
                        onClick={() => BookFlight(item.AirItineraryPricingInfo.FareSourceCode ) }
                        className='btn btn-primary select-styling search-btn1 mb-3 mt-2 form-control'
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='row'>
            <div className='col-md-6 col-sm-12  col-12'>
               <div className='fw-bold  m-2'>Showing {startHotelIndex} to {endHotelIndex} of {showFilterData.length} Flights</div>                   
            </div>
            <div className='col-md-6 col-sm-12 col-12'>
            <Pagination aria-label="Page navigation example ">
                  <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink previous onClick={() => paginate(currentPage  - 1)} />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem disabled={currentPage === pagesCount}>
                    <PaginationLink next onClick={() => paginate(currentPage  + 1)} />
                  </PaginationItem>
                </Pagination>            
                </div>
          </div> 
    </>
  )
}

const RightSidebar = ({ onClose, data }) => {
  const [flightInfo, setFlightinfo] = useState({
    arivalcityname: '',
    arivalcitycode: '',
    departurename: '',
    departurecode: ''
  });
  const [FlightCurrency, setFlightCurrency] = useState([]);
  const [baseCName, setBaseCName] = useState('GBP');
  const [showPrice, setShowPrice] = useState(false)
  const CurrencyRates = useSelector(state => state.hotels.Currency)
  const GBPCurrencyRates = useSelector(state => state.hotels.AllCurrency)
  const FlightSearchData = useSelector(
    state => state.hotels.OneWayFlightSearchData
  )
  var newcurrency;
  const penalitycurency=data.AirItineraryPricingInfo.PTC_FareBreakdowns[0]?.PenaltiesInfo[0]?.CurrencyCode
  const totalTime = data.OriginDestinationOptions[0]?.FlightSegments.reduce(
    (sum, flight) => sum + flight.JourneyDuration,
    0
  )
  var Airlinenamesdata = AirLineNames
  useEffect(() => {
    GetFlightInfo();
    AllCurrency(penalitycurency);
  }, [])

  const GetFlightInfo = () => {
    const filteredOptions = airportcode.items.filter(option =>
      option.airportCode.includes(FlightSearchData.DepartureCode)
    )
    const arivaloptions = airportcode.items.filter(option =>
      option.airportCode.includes(FlightSearchData.ArrivalCode)
    )
    if (filteredOptions.length !== 0) {
      setFlightinfo({
        departurecode: filteredOptions[0]?.airportCode,
        departurename: filteredOptions[0]?.cityName,
        arivalcitycode: arivaloptions[0]?.airportCode,
        arivalcityname: arivaloptions[0]?.cityName
      })
    }
  };

  const ShowAirportName = code => {
    const filteredOptions = airportcode.items.filter(option =>
      option.airportCode.toLowerCase().includes(code.toLowerCase())
    )
    var name =
      filteredOptions[0].airportName + ' Airport ' + filteredOptions[0].cityName
    return name
  };

  const renderPrice = price => {
    if(showPrice===false){
      return price
    }
    if (CurrencyRates === undefined) {
      const gbpprice = FlightCurrency[baseCName]; // Use square brackets to access the property
      var baseprice = Number(gbpprice) * Number(price);
      newcurrency=baseCName;
    } else {
      var select123 = CurrencyRates.selectedcurrency
      const gbpprice = FlightCurrency[baseCName]
      var baseprice1 = Number(gbpprice) * Number(price)
      const gbpprice2 = GBPCurrencyRates.conversion_rates[select123] // Use square brackets to access the property
      var baseprice = Number(gbpprice2) * Number(baseprice1);
      newcurrency=select123;
    }
    return baseprice.toFixed(2)
  };

  const AllCurrency = c => {
    var token = CurrencyConverter();
    const config = {
      method: 'get',
      url: 'https://v6.exchangerate-api.com/v6/' + token + '/latest/' + c, // Replace with your API URL
      maxBodyLength: Infinity,
      headers: {}
    }

    Axios.request(config)
      .then(response => {
        // Handle the response data here
        setShowPrice(true);
        setFlightCurrency(response.data.conversion_rates);
      })
      .catch(error => {
        // Handle errors here
        setShowPrice(false)
        console.error(error)
      })
  };
  return (
    <div className='right-sidebar'>
      <p className='close-button' onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} />
      </p>
      <div className='m-3'>
        <h4>
          {' '}
          {flightInfo.departurename} ({flightInfo.departurecode}) To{' '}
          {flightInfo.arivalcityname} ({flightInfo.arivalcitycode}){' '}
        </h4>

        <div className='select-child mt-3'>
          <p>
            Total Duration : {Math.floor(totalTime / 60)}h {totalTime % 60}m
          </p>
          <p>{moment(FlightSearchData.DepartureDate).format('LL')}</p>
        </div>
        <div className='mt-5'>
          {data.OriginDestinationOptions.map((item3, index) => (
            <div key={index}>
              {item3.FlightSegments.map((flight, index) => (
                <div key={index}>
                  <div className='border-line mt-2'></div>
                  <div class='container3 mt-2'>
                    <h5 class='text3'>{flight.DepartureAirportLocationCode}</h5>
                    <h5>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </h5>
                    <h5 class='text2'>{flight.ArrivalAirportLocationCode}</h5>
                  </div>
                  <div className='border-line mt-2'></div>
                  <div className='tour_booking_amount_area'>
                    <div className='Hotel-img'>
                      <div className='card-body  '>
                        <ul class='list-items  list-items-2 mt-2 py-2'>
                          <li className='mt-2'>
                            <span>Airline :</span>
                            {Airlinenamesdata[data.ValidatingAirlineCode]
                              ? `${
                                  Airlinenamesdata[data.ValidatingAirlineCode]
                                    .AirLineName
                                } `
                              : data.ValidatingAirlineCode}
                          </li>
                          <li className='mt-2'>
                            <span>Airport :</span>
                            {ShowAirportName(
                              flight.DepartureAirportLocationCode
                            )}
                          </li>

                          <li className='mt-2'>
                            <span>Flight Type :</span>
                            {flight.CabinClassCode == 'Y'
                              ? 'Economy'
                              : flight.CabinClassCode == 'C'
                              ? 'Business'
                              : flight.CabinClassCode == 'F'
                              ? 'First'
                              : flight.CabinClassCode == 'S'
                              ? 'Premium Economy'
                              : ''}
                          </li>

                          <li className='mt-2'>
                            <span>Flight Number :</span>
                            {flight.FlightNumber}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class='fl-detail-left ms-0' style={{ padding: '0' }}>
                    <div class='fl-detail-left-container p-0'>
                      <div class='fl-flight-schedual'>
                        <div
                          class='fl-flight-route'
                          style={{ paddingBottom: '0' }}
                        >
                          <div class='fl-route-detail'>
                            <h4 class='left h4-line'>
                              {' '}
                              {moment(flight.DepartureDateTime).format('LT')}
                              <br></br>({flight.DepartureAirportLocationCode})
                            </h4>
                            <h4 class='center fl-width  h4-line text-center'>
                              <FontAwesomeIcon
                                color='gray'
                                icon={faClockFour}
                              />{' '}
                              {/* {moment(flight.ArrivalDateTime).diff(moment(flight.DepartureDateTime), 'hours')}h{' '}
                            {moment(flight.ArrivalDateTime).diff(moment(flight.DepartureDateTime), 'minutes') % 60}m */}
                              {Math.floor(flight.JourneyDuration / 60)}h{' '}
                              {flight.JourneyDuration % 60}m
                            </h4>
                            <h4 class='right  h4-line fl-width text-end'>
                              {moment(flight.ArrivalDateTime).format('LT')}
                              <span>
                                {' '}
                                ({flight.ArrivalAirportLocationCode})
                              </span>
                            </h4>
                          </div>
                          <div class='fl-route-direction'>
                            <div class='fl-route-bar'></div>
                            <div class='fl-icon'>
                              <FontAwesomeIcon icon={faPlane} />
                            </div>
                          </div>
                          <div class='fl-route-detail'>
                            <p class='left' style={{ fontSize: '.9em' }}>
                              {' '}
                              <br />{' '}
                              {moment(flight.DepartureDateTime).format('ll')}
                            </p>
                            <p
                              class='center text-center'
                              style={{ fontSize: '.9em' }}
                            >
                              {/* Direct */}
                            </p>
                            <p
                              class='right text-end'
                              style={{ fontSize: '.9em' }}
                            >
                              <br />{' '}
                              {moment(flight.ArrivalDateTime).format('ll')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className='mt-3 baggage-info'>
          <div className='p-2 flight-detail-sidebar'>
            <h5>Baggage Allowence</h5>
            <div className='d-flex mt-4'>
              <FontAwesomeIcon
                className='mt-1'
                style={{ color: '#005b1e' }}
                icon={faCheck}
              />
              <div className='ms-2'>
                <p className='fw-bold'>
                  {' '}
                  {
                    data.AirItineraryPricingInfo.PTC_FareBreakdowns[0]
                      ?.CabinBaggageInfo[0]
                  }{' '}
                  cabin baggage{' '}
                </p>
                <p className='mt-0'>1 Piece</p>
              </div>
            </div>
            <div className='d-flex mt-2'>
              <FontAwesomeIcon
                className='mt-1'
                style={{ color: '#005b1e' }}
                icon={faCheck}
              />
              <div className='ms-2'>
                <p className='fw-bold'>
                  {' '}
                  {
                    data.AirItineraryPricingInfo.PTC_FareBreakdowns[0]
                      ?.BaggageInfo[0]
                  }{' '}
                  cabin baggage{' '}
                </p>
                <p className='mt-0'>1 Piece</p>
              </div>
            </div>
          </div>

          <div className='p-2 flight-detail-sidebar'>
            <h5>Cancellation Policy</h5>
            {data.AirItineraryPricingInfo.PTC_FareBreakdowns[0]?.PenaltiesInfo.map(
              item => {
                if (item.PenaltyType === '') {
                }

                return (
                  <div className='d-flex mt-4'>
                    <FontAwesomeIcon
                      className='mt-1'
                      style={{ color: '#005b1e' }}
                      icon={faDollar}
                    />
                    <div className='ms-2'>
                      <p className='fw-bold'>
                        {item.Allowed === true
                          ? `You are allowed to ${item.PenaltyType.toLowerCase()} with a penalty of ${
                            renderPrice(item.Amount)
                            } ${showPrice ?newcurrency:item.CurrencyCode}`
                          : `No ${item.PenaltyType} Option`}
                      </p>
                    </div>
                  </div>
                )
              }
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightCard
