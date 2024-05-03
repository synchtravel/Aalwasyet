import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import HotelDetail from '../../Pages/Hotels/HotelDetail'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLocationArrow,
  faStar,
  faGlobe,
  faCheck,
  faArrowRight,
  faInfo,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import Axios from 'axios'
import moment from 'moment'
import iLoading from '../../Images/Loading/Loader.gif'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Loading from '../Loading/Loader'
import { useDispatch } from 'react-redux'
import {
  ApiEndPoint,
  Hotelapitoken,
  CurrencyConverter
} from '../GlobalData/GlobalData'
import { fetchHotelDetail } from '../../Redux/Actions/actions'
function HotelCard ({ hotelid ,hotelDataNew }) {
  const dispatch = useDispatch();
  var endpoint = ApiEndPoint();
  var apitoken = Hotelapitoken();
  const [hotelsData, setHotelsData] = useState(hotelDataNew);
  const ReduxSearchData = useSelector(state => state.hotels.hsearch)
  const [searchData, setSearchData] = useState({
    checkin: '',
    checkout: '',
    adult: 0,
    child: 0
  });
  var filteredHotels = [];
  // var newHotels = hotelsData.hotels_list.map(hotel => ({
  //   ...hotel,
  //   rooms_options: hotel.rooms_options.filter(roomOption => {
  //     if (roomOption.cancliation_policy_arr.length > 0) {
  //       // Include rooms only if there's a cancellation policy with an amount equal to the room total price
  //       return roomOption.cancliation_policy_arr.some(policy =>
  //         parseFloat(policy.amount) === parseFloat(roomOption.rooms_total_price)
  //       );
  //     }
  //     return false;
  //   }),
  // })).filter(hotel => hotel.rooms_options.length > 0);
  // var hotels={'hotels_list':newHotels};
  
  const navigate = useNavigate()
  const [hotels, setHotels] = useState(hotelsData)
  const [Loadingpage, setLoadingpage] = useState(false)
  const [visibleHotels, setVisibleHotels] = useState(10)
  const [hotelDetails, setHotelDetails] = useState({})
  const [loading, setLoading] = useState(false)
  const [baseCName, setBaseCName] = useState('GBP')
  const [baseCurrency, setBaseCurrency] = useState([])
  const [showHotels, setShowHotels] = useState([])
  const [hotelsListing, setHotelsListing] = useState(hotelsData.hotels_list)
  const [showPrice, setShowPrice] = useState(true)
  
 
 
  const CurrencyRates = useSelector(state => state.hotels.Currency)
  const GBPCurrencyRates = useSelector(state => state.hotels.AllCurrency)
  
  var [currentPage, setCurrentPage] = useState(1);
  var TransferPerPage = 20; // Number of hotels to display per page
  var indexOfLastTransfer = currentPage * TransferPerPage;
  var indexOfFirstTransfer = indexOfLastTransfer - TransferPerPage;
  var currentHotels =hotelsListing.slice(indexOfFirstTransfer, indexOfLastTransfer);
  var pagesCount = Math.ceil(hotelsListing.length / TransferPerPage);
  var validCurrentPage = currentPage < 1 ? 1 : currentPage;
  var maxPagesToShow =5;
  var startHotelIndex = indexOfFirstTransfer + 1;
  var endHotelIndex = Math.min(indexOfLastTransfer, hotelsListing.length);
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
    useEffect(()=>{
      setHotelsData(hotelDataNew)
      setHotelsListing(hotelDataNew.hotels_list);
    },[hotelDataNew,ReduxSearchData]);
  useEffect(() => {
    
    setCurrentPage(1);
  }, [ hotelsListing]); 

  useEffect(() => {
    if (hotelid !== '') {
      setLoadingpage(true)
      if (typeof hotelid === 'number') {
        filteredHotels = hotelDataNew.hotels_list.filter(
          x => x.hotel_id === Number(hotelid)
        )
        setHotelsListing(filteredHotels)
        setLoadingpage(false)
      } else if (hotelid.type === 'Stars') {
        const filteredHotels = hotelDataNew.hotels_list.filter(hotel => {
          const hotelRating = hotel.stars_rating
          if (hotelRating !== '') {
            return Object.keys(hotelid).some(
              ratingKey => Number(hotelRating) === Number(hotelid[ratingKey])
            )
          }
        })
        setHotelsListing(filteredHotels)
        // filteredHotels.forEach(hotel => {
        //   fetchHotelDetails(hotel.hotel_id, hotel.hotel_provider)
        // })
        setLoadingpage(false)
      } else if (hotelid.type === 'meal') {
        const filteredHotels = hotelDataNew.hotels_list.filter(hotel => {
          // Check if any room in the hotel's rooms_options array has the specified boardtype
          return hotel.rooms_options.some(room => {
            for (const mealKey in hotelid) {
              if (room.board_id === hotelid[mealKey]) {
                return true // Found a match, include the hotel
              }
            }
            return false // No match found for any meal key
          })
        })
        setHotelsListing(filteredHotels)
        setHotelDetails({})
        // filteredHotels.forEach(hotel => {
        //   fetchHotelDetails(hotel.hotel_id, hotel.hotel_provider)
        // })
        setLoadingpage(false)
      } else if (hotelid.type === 'facility') {
        const filteredHotels = []
        hotelDataNew.hotels_list.forEach(hotel => {
          Facilityfilter(hotel.hotel_id, hotel.hotel_provider, metaData => {
            // Check if the hotel has the desired facilities (e.g., wifi and safe).
            for (const mealKey in hotelid) {
              if (metaData.facilities.includes(hotelid[mealKey])) {
                filteredHotels.push(hotel)
              }
            }
          })
        })
        setLoadingpage(false)
        setHotelDetails({})
        // filteredHotels.forEach(hotel => {
        //   fetchHotelDetails(hotel.hotel_id, hotel.hotel_provider)
        // })
        setHotelsListing(filteredHotels)
      } else if (hotelid.type === 'price') {
        const filteredHotels = hotelDataNew.hotels_list.filter(hotel => {
          const price = hotel.min_price
          return price >= hotelid.min && price <= hotelid.max
        })
        setHotelsListing(filteredHotels)
        setHotelDetails({})
        setLoadingpage(false)
      }
    }
  }, [hotelid])

  const Facilityfilter = async (hotelId, provider, callback) => {
    const data = {
      provider: provider,
      hotel_code: hotelId,
      token: apitoken
    }
    try {
      const response = await Axios.post(endpoint + '/api/hotels/mata_Live', data, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
      callback(response.data.details_data)
      // Handle the API response here
    } catch (error) {
      // Handle errors here
      console.error('Error:', error)
    }
  }
  
  useEffect(() => {
    setSearchData(prevdata => ({
      ...prevdata,
      adult: ReduxSearchData.adult,
      child: ReduxSearchData.child,
      checkin: moment(ReduxSearchData.check_in).format('Do MMM '),
      checkout: moment(ReduxSearchData.check_out).format('Do MMM ')
    }))
   
  }, [])

  useEffect(() => {
    filterHotels();
    var curency = hotels.hotels_list[0]?.hotel_curreny;
    AllCurrency(curency);
  }, []);


  const filterHotels = () => {
    const newHotels= hotels.hotels_list.filter(hotel => {
      // Check if there is at least one room option with a cancellation amount equal to the room price
      return hotel.rooms_options.some(roomOption => {
        if (roomOption.cancliation_policy_arr.length > 0) {
          // Assuming there can be multiple cancellation policies, check if any of them has an amount equal to the room price
               return roomOption.cancliation_policy_arr.some(policy => parseFloat(policy.amount) === parseFloat(roomOption.rooms_total_price));
        }
        return false;
      });
    });

    setShowHotels(newHotels);
  };

  const RoomDetailPage = async (id, index) => {
    const hotelRoomdetail = hotels.hotels_list.filter(
      item => item.hotel_id == id
    )
    setLoadingpage(true)
    try {
      const data = {
        token: apitoken,
        hotel_search_data: JSON.stringify(hotelRoomdetail[0]),
        hotel_code: String(id)
      }
      const response = await Axios.post(
        endpoint + '/api/hotels/details_Live',
        data,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            // Required for CORS support to work
            'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
            'Access-Control-Allow-Headers':
              'Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale'
            // "Access-Control-Allow-Methods": "POST, OPTIONS"
          }
        }
      )

      // Handle the API response here
      dispatch(fetchHotelDetail(response.data.hotel_details))
      navigate(`/hotel_detail/${id}`, { state: { index } })
      setLoadingpage(false)
    } catch (error) {
      // Handle errors here
      console.error('Error:', error)
    }
  };

  const fetchHotelDetails = async (hotelId, provider) => {
    const data = {
      provider: provider,
      hotel_code: hotelId,
      token: apitoken
    }

    try {
      const response = await Axios.post(endpoint + '/api/hotels/mata_Live', data, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
      setHotelDetails(prevDetails => ({
        ...prevDetails,
        [hotelId]: response.data
      }))
      // Handle the API response here
    } catch (error) {
      // Handle errors here
      console.error('Error:', error)
    }
  };

  useEffect(() => {
    currentHotels.forEach(hotel => {
        if (!hotelDetails[hotel.hotel_id]) {
          fetchHotelDetails(hotel.hotel_id, hotel.hotel_provider)
        }
      })
  }, [currentPage,hotelsListing])

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
    return baseprice.toFixed(0)
  };

  const AllCurrency = curency => {
    var token = CurrencyConverter()
    const config = {
      method: 'get',
      url: 'https://v6.exchangerate-api.com/v6/' + token + '/latest/' + curency, // Replace with your API URL
      maxBodyLength: Infinity,
      headers: {}
    }

    Axios.request(config)
      .then(response => {
        // Handle the response data
        setBaseCurrency(response.data.conversion_rates)
        localStorage.setItem('HotelCurrency', JSON.stringify(response.data))
      })
      .catch(error => {
        // Handle errors here
        setShowPrice(false)
        console.error(error)
      })
  };
  const calculateMarkup = (
    price,
    adminmarkup,
    admintype,
    clientmarkup,
    clienttype
  ) => {
    let markupprice = 0
    let adminmarkupprice = 0
    let clientmarkupprice = 0
    let finalpricemarkup = Number(price)
    if (Number(adminmarkup) !== 0) {
      if (admintype === 'Percentage') {
        markupprice = (price * Number(adminmarkup)) / 100
      } else {
        markupprice = Number(adminmarkup)
      }
      adminmarkupprice = markupprice
      finalpricemarkup += markupprice
      // savemarkup.admin=adminmarkupprice;
      // savemarkup.final=finalpricemarkup;
    }
    if (Number(clientmarkup) !== 0) {
      if (clienttype === 'Percentage') {
        markupprice = (finalpricemarkup * Number(clientmarkup)) / 100
      } else {
        markupprice = Number(clientmarkup)
      }
      clientmarkupprice = markupprice
      finalpricemarkup += markupprice
    }
    return finalpricemarkup
  };

  return (
    <>
      {Loadingpage && <Loading />}
      <div>
          <div className='filter-page__content'>
          <div className='fw-bold mb-2'>Showing {startHotelIndex} to {endHotelIndex} of {hotelsListing.length} hotels</div>
            <div className='filter-item-wrapper' id='tours_filter'>
              {currentHotels.map((item, index) => (
                <div key={item.hotel_id} className='row'>
                  <div className='col-md-12 mb-4'>
                    <div className='row parent_row'>
                      <div className='col-md-4 item-from hotel-img-top'>
                        {hotelDetails[item.hotel_id] &&
                        hotelDetails[item.hotel_id].details_data &&
                        hotelDetails[item.hotel_id].details_data.image ? (
                          <div>
                            <img
                            style={{height:'11em',objectFit:'cover'}}
                              className='tour-img'
                              src={
                                hotelDetails[item.hotel_id].details_data.image
                              }
                              alt=''
                            />
                          </div>
                        ) : (
                          // <ShimmerThumbnail height={250} />
                          <img src={iLoading} />
                        )}
                          <div class='room-avail'>
                          <i class='awe-icon awe-icon-marker-2'>
                            <FontAwesomeIcon icon={faCheck} />
                          </i>{' '}
                          {item.rooms_options.length} Rooms Available{' '}
                        </div>
                      </div>

                      <div className='col-md-5'>
                        <h5 className='card-title mt-2'>
                          <a
                            onClick={() => RoomDetailPage(item.hotel_id, index)}
                            className='p-card-title'
                          >
                            {item.hotel_name}
                          </a>
                        </h5>
                        <h6 className='departure-date mb-0'>
                          {searchData.checkin}{' '}
                          <FontAwesomeIcon icon={faArrowRight} />{' '}
                          {searchData.checkout}
                        </h6>
                        <p className='card-star'>
                          {item.stars_rating === '' ? (
                            <span className='fw-bold'>No Rating</span>
                          ) : (
                            Array(item.stars_rating)
                              .fill(0)
                              .map((_, index) => (
                                <i key={index} className='fa fa-star'>
                                  <FontAwesomeIcon icon={faStar} />
                                </i>
                              ))
                          )}
                        </p>
                        {hotelDetails[item.hotel_id] && (
                          <div class='item-address'>
                            <i class='awe-icon awe-icon-marker-2'>
                              <FontAwesomeIcon icon={faLocationArrow} />
                            </i>{' '}
                            {hotelDetails[item.hotel_id].details_data.address}{' '}
                          </div>
                        )}
                       
                      
                      </div>
                      <div className='col-md-3 text-center card-price-section  pt-2'>
                      
                        <div className='price text-center p-card-price'>
                          {showPrice ? (
                            <h6>
                              <super>
                                {CurrencyRates === undefined
                                  ? baseCName
                                  : CurrencyRates.selectedcurrency}{' '}
                                {renderPrice(
                                  calculateMarkup(
                                    item.min_price,
                                    item.admin_markup,
                                    item.admin_markup_type,
                                    item.customer_markup,
                                    item.customer_markup_type
                                  )
                                )}
                              </super>
                              {/* <sub>PP</sub> */}
                            </h6>
                          ) : (
                            <h6>
                              <super>
                                {item.hotel_curreny}{' '}
                                {calculateMarkup(
                                  item.min_price,
                                  item.admin_markup,
                                  item.admin_markup_type,
                                  item.customer_markup,
                                  item.customer_markup_type
                                ).toFixed(2)}
                              </super>
                              {/* <sub>PP</sub> */}
                            </h6>
                          )}
                        </div>
                        <div className='time_length'>
                          <i className='fa fa-moon-o' aria-hidden='true'></i>
                          {searchData.adult}-Adults, {searchData.child}-Children
                          {/* <span className='tour_length'>12 Night</span> */}
                        </div>

                        <button
                          className='btn btn-primary select-styling search-btn1 form-control'
                          onClick={() => RoomDetailPage(item.hotel_id, index)}
                        >
                          Book Now
                        </button>

                        <div style={{ fontSize: '11px' }}>
                          <FontAwesomeIcon
                            color='#bd1c1cc9'
                            icon={faInfoCircle}
                          />{' '}
                          Inclusive of VAT and Taxes
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='row pagination_Div'>
            <div className='col-md-6 col-sm-12  col-12'>
               <div className='fw-bold  m-2'>Showing {startHotelIndex} to {endHotelIndex} of {hotelsListing.length} hotels</div>                   
            </div>
            <div className='col-md-6 col-sm-12 col-12'>
            <Pagination aria-label="Page navigation example ">
                  <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink previous onClick={() => paginate(validCurrentPage  - 1)} />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem disabled={currentPage === pagesCount}>
                    <PaginationLink next onClick={() => paginate(validCurrentPage  + 1)} />
                  </PaginationItem>
                </Pagination>            
                </div>
          </div> 
      </div>
    </>
  )
}

export default HotelCard
