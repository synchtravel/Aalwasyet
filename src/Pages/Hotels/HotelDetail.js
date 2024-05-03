import React, { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBed, faBuilding, faCalendarCheck, faCheck, faGlobe, faLocation, faMoon, faUtensils } from '@fortawesome/free-solid-svg-icons'
import noImage from '../../Images/Hotels/no-img.jpg'
import moment from 'moment'
import Loader from '../../Components/Loading/Loader'
import bgimage from '../../Images/Hotels/bg.jpg'
import image from '../../Images/View Detail/1.jpeg'
import { useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ApiEndPoint,Hotelapitoken } from '../../Components/GlobalData/GlobalData'
import { fetchCheckoutDetail } from '../../Redux/Actions/actions'
import Images from '../../Components/Images/images'
import Layout from '../../Components/Layout/Layout'
import RoomFacilities from '../../Components/Hotel/RoomFacility'
import Axios from 'axios'
function HotelDetail () {
  const location = useLocation();
  const dispatch = useDispatch();
  const todayDate = new Date();
  var endpoint=ApiEndPoint();
  const { index } = location.state || {};
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [showPrice, setShowPrice] = useState(true);
  const [baseCName, setBaseCName] = useState('GBP');
  const [counter, setCounter] = useState(0);

  const [hotelSelectedRooms, setHotelSelectedRooms] = useState([]);

  const navigate = useNavigate();
  const hoteldetail = useSelector(state => state.hotels.hoteldetail);
  const seleectedhotelfromlist = useSelector(
    state => state.hotels.hotels.hotels_list[index]
  );

  let { id } = useParams();
  const CurrencyRates = useSelector(state => state.hotels.Currency);
  const GBPCurrencyRates = useSelector(state => state.hotels.AllCurrency);
  const ReduxSearchData = useSelector(state => state.hotels.hsearch);
  let Checkin = moment(ReduxSearchData.check_in);
  let checkout = moment(ReduxSearchData.check_out);
  let daysBetween = Math.abs(checkout.diff(Checkin, 'days'));
  const latitude = hoteldetail.latitude;
  const longitude = hoteldetail.longitude;
  var mapUrl =
    'https://maps.google.com/maps?width=50%25&height=600&hl=en&q=' +
    latitude +
    ',' +
    longitude +
    '&t=&z=19&ie=UTF8&iwloc=B&output=embed';
 
  useEffect(() => {
    // Function to handle scroll events
    const handleScroll = () => {
      const sectionIds = [
        'section-1',
        'section-2',
        'section-3',
        'section-4',
        'section-5',
        'section-6',
        'section-7'
      ]

      // Find the section that is currently in view
      for (const id of sectionIds) {
        const section = document.getElementById(id)
        if (section) {
          const rect = section.getBoundingClientRect()
          if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            setActiveButton(id)
            break
          }
        }
      }
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)

    // Clean up the listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, []);
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName)
  };
  const handleButtonClick2 = (buttonName) => {
    setActiveButton(buttonName)
  };
  const selectedRoomData = (index, event) => {
    event.preventDefault()
    event.stopPropagation()
    if (selectedRooms.some(room => room.index === index)) {
      setCounter(counter - 1)
      // Check if there's a room with the same index in selectedRooms
      const updatedSelectedRooms = selectedRooms.filter(
        room => room.index !== index
      )
      const newroom = hotelSelectedRooms.filter(item => item.index !== index)
      // Update the selectedRooms state with the new array
      setSelectedRooms(updatedSelectedRooms)
      setHotelSelectedRooms(newroom)
    } else {
      if (counter < ReduxSearchData.room) {
        setCounter(counter + 1)
        const selectedroom = hoteldetail.rooms_options[index]
        const key = { rateKey: selectedroom.booking_req_id, index: index }
        const newSelectedRoom = {
          room_rate_key: JSON.stringify(key),
          rooms_qty: selectedroom.rooms_qty,
          index: index
        }
        setSelectedRooms([...selectedRooms, newSelectedRoom])
        setHotelSelectedRooms([...hotelSelectedRooms, key])
      } else {
        toast.error('Select the room according to the search criteria.', {
          position: toast.POSITION.TOP_RIGHT
      });
      }
    }

    // } else {
    //   alert(`You can only select ${ReduxSearchData.room} room(s).`);
    // }
  };
  const BookRoom = async () => {
    if(hotelSelectedRooms.length !==0){
    const roomdata = {
      rooms_select_data: JSON.stringify(selectedRooms),
      hotel_index: index,
      hotelbeds_select_room: hotelSelectedRooms
    }
    const Apitoken=Hotelapitoken();
    const finaldata = {
      token:Apitoken,
      request_data: JSON.stringify(roomdata),
      selected_hotel: JSON.stringify(seleectedhotelfromlist),
      selected_hotel_details: JSON.stringify({
        check_in: ReduxSearchData.check_in,
        check_out: ReduxSearchData.check_out,
        hotel_address: hoteldetail.hotel_address,
        hotel_country: hoteldetail.hotel_country,
        hotel_city: hoteldetail.hotel_city,
        atitude: hoteldetail.latitude,
        longitude: hoteldetail.longitude
      }),
      req_index: index
    }
    setLoading(true)
    try {
      const response = await Axios.post(
        endpoint+'/api/hotels/checkavailability_Live',
        finaldata,
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
      if(response.data.status==='error'){
        setLoading(false);
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT
      });
      return;
      };
      dispatch(fetchCheckoutDetail(response.data.hotels_data))
      navigate('/hotel_checkout')
      setLoading(false)
    } catch (error) {
      // Handle errors here
      setLoading(false);
      console.error('Error:', error)
    }
  }else{
    toast.error('Please Select Room First.', {
      position: toast.POSITION.TOP_RIGHT
  });
  }
  };

  const renderPrice = (price) =>{
    const userData = localStorage.getItem('HotelCurrency');
    const Rates = JSON.parse(userData);
      if(userData !==null){
          if(CurrencyRates===undefined){
            const gbpprice = Rates.conversion_rates[baseCName]; // Use square brackets to access the property
            var baseprice = (Number(gbpprice) * Number(price)).toFixed(0);
        
          }else{
            var select123 = CurrencyRates.selectedcurrency;
            const gbpprice = Rates.conversion_rates[baseCName];
            var baseprice1 = (Number(gbpprice) * Number(price)).toFixed(0);
            const gbpprice2 = GBPCurrencyRates.conversion_rates[select123]; // Use square brackets to access the property
            var baseprice = (Number(gbpprice2) * Number(baseprice1)).toFixed(0);
          }
          return baseprice
       }else{
        setShowPrice(false);
       }
  };
  const calculateMarkup = (price) => {
    if(Object.keys(hoteldetail).length !==0){
    let markupprice=0;
    let adminmarkupprice=0;
    let clientmarkupprice=0;
    let finalpricemarkup=Number(price);
    if(Number(hoteldetail.admin_markup) !== 0)
   {
    if(hoteldetail.admin_markup_type === "Percentage")
    {
      markupprice=( price * Number(hoteldetail.admin_markup))/100;
    }else{
      markupprice= Number(hoteldetail.admin_markup);
     }
      adminmarkupprice=markupprice;
      finalpricemarkup +=markupprice
      
   }
   if(Number(hoteldetail.customer_markup) !== 0)
   {
    if(hoteldetail.customer_markup_type=== "Percentage")
    {
      markupprice= (finalpricemarkup * Number(hoteldetail.customer_markup))/100;
    }else{
      markupprice= Number(hoteldetail.customer_markup);
     }
     clientmarkupprice=markupprice;
      finalpricemarkup +=markupprice;
   }
   return finalpricemarkup.toFixed(2);
  }
  };
 
  return (
    <>
   
      {loading ? (
        <Loader />
      ) : (
        <Layout>
        <div>
          <ToastContainer/>
          {/* <div className='contact-img'>
            <img src={bgimage} />
          </div> */}
          <nav className='navbar view-detail-navbar'>
            <div className='container'>
              <ul>
                <li>
                  <a
                    href='#section-1'
                    onClick={() => handleButtonClick2('section-1')}
                    className={activeButton === 'section-1' ? 'current' : ''}
                  >
                    Overview
                  </a>
                </li>
                <li>
                  <a
                    href='#section-2'
                    onClick={() => handleButtonClick2('section-2')}
                    className={activeButton === 'section-2' ? 'current' : ''}
                  >
                    Rooms
                  </a>
                </li>
                <li>
                  <a
                    href='#section-3'
                    onClick={() => handleButtonClick('section-3')}
                    className={activeButton === 'section-3' ? 'current' : ''}
                  >
                    Facilities
                  </a>
                </li>
                <li>
                  <a
                    href='#section-4'
                    onClick={() => handleButtonClick('section-4')}
                    className={activeButton === 'section-4' ? 'current' : ''}
                  >
                    Near By Place
                  </a>
                </li>
                <li>
                  <a
                    href='#section-5'
                    onClick={() => handleButtonClick('section-5')}
                    className={activeButton === 'section-5' ? 'current' : ''}
                  >
                    Location
                  </a>
                </li>
                <li>
                  <a
                    href='#section-6'
                    onClick={() => handleButtonClick('section-6')}
                    className={activeButton === 'section-6' ? 'current' : ''}
                  >
                    Review & Rating
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <div className='container mt-2'>
            <section id='section-1' className='pt-2'>
              <h3>{hoteldetail.hotel_name}</h3>
              <div className='row'>
                <div>
                  <i class='awe-icon fa tc fa-check' aria-hidden='true'>
                    <FontAwesomeIcon icon={faLocation} />
                  </i>{' '}
                  {hoteldetail.hotel_address}
                </div>
                <Images data={hoteldetail.hotel_gallery} />
              </div>
              
             
              <div className='row '>
                <div className='col-sm-6'>
                  <div className='hotel-dec p-3'>
                    <h3 className='mt-2'>{hoteldetail.hotel_name}</h3>
                    <p className='mt-2 text-justify'>{hoteldetail.description} </p>
                  </div>
                </div>  
                <div className='col-sm-6 hotel-dec'>
                <div className='row  mt-2 mb-2 p-2'>
                <div className=' col-sm-6 col-6 col-md-4 mt-1'>
                  <div class='single-tour-feature d-flex align-items-center mb-3'>
                    <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                      <i class='fas fa-check'>
                        <FontAwesomeIcon icon={faBuilding} />
                      </i>
                    </div>
                    <div class='single-feature-titles'>
                      <p style={{ fontSize: '15px' }} class='title fw-bold'>
                        Hotel Type
                      </p>
                      <p
                        className='mt-0'
                        style={{ fontSize: '14px' }}
                        class='title '
                      ></p>
                    </div>
                  </div>
                </div>
                <div className=' col-sm-6 col-6 col-md-4 mt-1'>
                  <div class='single-tour-feature d-flex align-items-center mb-3'>
                    <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                      <i class='fas fa-check'>
                        <FontAwesomeIcon icon={faMoon} />
                      </i>
                    </div>
                    <div class='single-feature-titles'>
                      <p style={{ fontSize: '15px' }} class='title fw-bold'>
                        Minimum Stay
                      </p>
                      <p
                        className='mt-0'
                        style={{ fontSize: '14px' }}
                        class='title '
                      >
                        {daysBetween} Night
                      </p>
                    </div>
                  </div>
                </div>
                <div className=' col-sm-6 col-6 col-md-4 mt-1'>
                  <div class='single-tour-feature d-flex align-items-center mb-3'>
                    <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                      <i class='fas fa-check'>
                        <FontAwesomeIcon icon={faCalendarCheck} />
                      </i>
                    </div>
                    <div class='single-feature-titles'>
                      <p style={{ fontSize: '15px' }} class='title fw-bold'>
                        Check In
                      </p>
                      <p
                        className='mt-0'
                        style={{ fontSize: '14px' }}
                        class='title '
                      >
                        {moment(ReduxSearchData.check_in).format('DD-MM-YYYY')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=' col-sm-6 col-6 col-md-4 mt-1'>
                  <div class='single-tour-feature d-flex align-items-center mb-3'>
                    <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                      <i class='fas fa-check'>
                        <FontAwesomeIcon icon={faCalendarCheck} />
                      </i>
                    </div>
                    <div class='single-feature-titles'>
                      <p style={{ fontSize: '15px' }} class='title fw-bold'>
                        Check Out
                      </p>
                      <p
                        className='mt-0'
                        style={{ fontSize: '14px' }}
                        class='title '
                      >
                        {moment(ReduxSearchData.check_out).format('DD-MM-YYYY')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=' col-sm-4 col-6 col-md-4 mt-1'>
                  <div class='single-tour-feature d-flex align-items-center mb-3'>
                    <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                      <i class='fas fa-check'>
                        <FontAwesomeIcon icon={faGlobe} />
                      </i>
                    </div>
                    <div class='single-feature-titles'>
                      <p style={{ fontSize: '15px' }} class='title fw-bold'>
                        Country
                      </p>
                      <p
                        className='mt-0'
                        style={{ fontSize: '14px' }}
                        class='title '
                      >
                        {hoteldetail.hotel_country}
                      </p>
                    </div>
                  </div>
                </div>
               
                <div className=' col-sm-6 col-6 col-md-4 mt-1'>
                  <div class='single-tour-feature d-flex align-items-center mb-3'>
                    <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                      <i class='fas fa-check'>
                        <FontAwesomeIcon icon={faUtensils} />
                      </i>
                    </div>
                    <div class='single-feature-titles'>
                      <p style={{ fontSize: '15px' }} class='title fw-bold'>
                        Boards
                      </p>
                      {hoteldetail.hotel_boards.map((item, index) => (
                        <span
                          key={index}
                          className='mt-0'
                          style={{ fontSize: '14px' }}
                          class='title '
                        >
                          {item.board_name}{' '}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
               
              </div>
                </div>
              </div>
            </section>

            <section id='section-2' className='mt-2'>
              <h5 className='flight-heading'>  <FontAwesomeIcon icon={faBed} /> Room Details</h5>
              <div className='row'>
                <div className='col-md-10 col-sm-10'>
                  
                  {hoteldetail.rooms_options.map((item, index) => (
                    <div
                      key={index}
                      className='row hotel-detail-border pt-2 pb-2'
                    >
                      <div className='col-md-4'>
                    
                        <div style={{ height: '15em', overflow: 'hidden' }}>
                          {item.rooms_images && item.rooms_images.length > 0 ? (
                            <img
                              src={item.rooms_images[0]} 
                              alt={item.room_name}
                            />
                          ) : (
                            <img src={noImage} alt='Default Image' />
                          )}
                        </div>
                       
                        <ul>
                          {item.rooms_facilities &&
                          item.rooms_facilities.length > 0 ? (
                            <RoomFacilities item={item}/>
                            // item.rooms_facilities.map((facility, index) => (
                            //   <li key={index}>
                            //     <i
                            //       class='awe-icon fa tc fa-check'
                            //       aria-hidden='true'
                            //     >
                            //       <FontAwesomeIcon icon={faCheck} />
                            //     </i>{' '}
                            //     {facility}
                            //   </li>
                            // ))
                          ) : (
                            <li>No facilities Available</li>
                          )}
                        </ul>
                      </div>
                      <div className='col-md-8'>
                          <div className='col-md-12'>
                          <h5 className='mt-3 border-dash-rad fw-bold '>Room Detail</h5>
                        </div>
                        {item.request_type !=='' &&(
                        <div className='room-request mt-1 mb-1'>
                          <h6>Room on Request</h6>
                        </div>
                      ) }
                        <div className='row pt-4 pb-4 border-set-room'>
                          <div className='col-md-4 col-6 room-detail-center item-from'>
                          <h5 className='mt-2'>{item.room_name}</h5>
                            <h6 className='tc'>Meal Type</h6>
                            <h6>{item.board_id}</h6>
                            {/* <h6 style={{ color: 'red' }}>Non Refundable</h6> */}
                          </div>
                          <div className='col-md-4 col-6   item-from'>
                            <h6 className='tc'>Room Capacity</h6>
                            <h6>
                              {' '}
                              {item.adults} Adults , {item.childs} children
                            </h6>
                            <h6> {item.rooms_qty} Rooms</h6>
                          </div>
                          <div
                            className='col-md-4 text-center card-price-section   item-from'
                            style={{ alignItems: 'center' }}
                          >
                            <div className='price text-center p-card-price'>
                              {showPrice ?(
                              <h6>{CurrencyRates===undefined ? (baseCName):(CurrencyRates.selectedcurrency)} {renderPrice(calculateMarkup(item.rooms_total_price))}</h6>
                              ):(
                                <h6>{hoteldetail.hotel_curreny} {calculateMarkup(item.rooms_total_price)}</h6>

                              )}
                              </div>
                            <h6 className='mt-2'>
                              {' '}
                              Price For {daysBetween} Nights
                            </h6>
                            {/* <button className='btn mt-2 btn-primary btn-block select-styling search-btn1'>
                          Book
                        </button> */}
                            <div class='form-group' data-toggle='buttons'>
                              <label
                                onClick={event =>
                                  selectedRoomData(index, event)
                                }
                                class='btn btn-default mt-2 select-room--checkbox primary'
                              >
                                <i class='fa fa-fw'></i>
                                <input
                                  id={index}
                                  autoComplete='off'
                                  className='room-check'
                                  type='checkbox'
                                  checked={selectedRooms.some(
                                    room => room.index === index
                                  )}
                                  onChange={() => {}} // Add an empty onChange handler to prevent warnings
                                />
                                Select Room
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className='row'>
                          <div className='d-flex justify-content-center'>
                            {item.cancliation_policy_arr &&
                            item.cancliation_policy_arr.length > 0 ? (
                              new Date(
                                item.cancliation_policy_arr[0].from_date
                              ) > todayDate ? (
                                <h6> <span style={{ color: 'green' }}>RISK FREE!</span> No cancellation fee before {moment(item.cancliation_policy_arr[0].from_date).format('DD-MM-YYYY')} (property local time)</h6>
                              ) : (
                                //  <h6 style={{ fontSize: '12px' }}>
                                //     GBP {item.cancliation_policy_arr[0].amount} will be deducted upon cancellation From{' '}
                                //     {moment(item.cancliation_policy_arr[0].from_date).format(' Do MMMM YYYY ')}{' '}
                                //   </h6>
                                <h6>Non Refundable</h6>
                              )
                            ) : null}
                          </div>
                        </div>
                      
                      </div>
                    </div>
                  ))}
                </div>
                <div className='col-md-2 col-sm-2'>
                  <div className='theiaStickySidebar'>
                    <div className='book-now button-4 cart-btn'>
                      <button
                        className='btn mt-1 btn-primary  btn-block select-styling search-btn1 '
                        onClick={BookRoom}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section id='section-3'>
              <div class='property-highlights'>
                <h3>Property Highlights</h3>
                <div class='property-highlights__content'>
                  <div class='row'>
                    {hoteldetail.hotel_facilities.map((item, index) => (
                      <div key={index} class='col-md-3 col-6'>
                        <div class='item'>
                          <i
                            style={{ color: '#00591e' }}
                            class='awe-icon fa fa-check'
                            aria-hidden='true'
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </i>{' '}
                          <span>{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            <section id='section-4'>
              <h5>Near By Places </h5>
              <div class='row'></div>
            </section>
            <section id='section-5'>
              <h5 className='flight-heading mb-2'>Location</h5>
              <div class='col-12 col-md-12'>
                <div style={{ width: '100%' }}>
                  <iframe
                    width='100%'
                    height='300'
                    frameborder='0'
                    scrolling='no'
                    marginheight='0'
                    marginwidth='0'
                    src={mapUrl}
                  ></iframe>
                </div>
              </div>
            </section>
            <section id='section-7'>
              <h5 className='flight-heading mb-3'>Reviews</h5>
              <div id='reviews'>
                <div class='rating-info'>
                  <div class='average-rating-review good'>
                    <span class='count'>7.5</span>
                    <em>Average rating</em>
                    <span>Good</span>
                  </div>
                  <ul class='rating-review'>
                    <li>
                      <em>Facility</em>
                      <span>7.5</span>
                    </li>
                    <li>
                      <em>Human</em>
                      <span>9.0</span>
                    </li>
                    <li>
                      <em>Service</em>
                      <span>9.5</span>
                    </li>
                    <li>
                      <em>Interesting</em>
                      <span>8.7</span>
                    </li>
                  </ul>
                  <button
                    className='btn btn-primary btn-block select-styling search-btn1'
                    style={{ width: 'unset', float: 'right' }}
                  >
                    Write a Review
                  </button>
                </div>
                {/* <div id="add_review">
                                            <h3 class="comment-reply-title">Add a review</h3>
                                            <form>
                                                <div class="comment-form-author">
                                                    <label for="author">Name <span class="required">*</span></label>
                                                    <input id="author" type="text"/>
                                                </div>
                                                <div class="comment-form-email">
                                                    <label for="email">Email <span class="required">*</span></label>
                                                    <input id="email" type="text"/>
                                                </div>
                                                <div class="comment-form-rating">
                                                    <h4>Your Rating</h4>
                                                    <div class="comment-form-rating__content">
                                                        <div class="item facility">
                                                            <label>Facility</label>
                                                            <div class="awe-select-wrapper"><select class="awe-select">
                                                                <option>5.0</option>
                                                                <option>6.5</option>
                                                                <option>7.5</option>
                                                                <option>8.5</option>
                                                                <option>9.0</option>
                                                                <option>10</option>
                                                            </select><i class="fa fa-caret-down"></i></div>
                                                        </div>
                                                        <div class="item human">
                                                            <label>Human</label>
                                                            <div class="awe-select-wrapper"><select class="awe-select">
                                                                <option>5.0</option>
                                                                <option>6.5</option>
                                                                <option>7.5</option>
                                                                <option>8.5</option>
                                                                <option>9.0</option>
                                                                <option>10</option>
                                                            </select><i class="fa fa-caret-down"></i></div>
                                                        </div>
                                                        <div class="item service">
                                                            <label>Service</label>
                                                            <div class="awe-select-wrapper"><select class="awe-select">
                                                                <option>5.0</option>
                                                                <option>6.5</option>
                                                                <option>7.5</option>
                                                                <option>8.5</option>
                                                                <option>9.0</option>
                                                                <option>10</option>
                                                            </select><i class="fa fa-caret-down"></i></div>
                                                        </div>
                                                        <div class="item interesting">
                                                            <label>Interesting</label>
                                                            <div class="awe-select-wrapper"><select class="awe-select">
                                                                <option>5.0</option>
                                                                <option>6.5</option>
                                                                <option>7.5</option>
                                                                <option>8.5</option>
                                                                <option>9.0</option>
                                                                <option>10</option>
                                                            </select><i class="fa fa-caret-down"></i></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="comment-form-comment">
                                                    <label for="comment">Your Review</label>
                                                    <textarea id="comment"></textarea>
                                                </div>
                                                <div class="form-submit">
                                                    <input type="submit" class="submit" value="Submit"/>
                                                </div>
                                            </form>
                                        </div> */}
                <div id='comments'>
                  <ol class='commentlist'>
                    <li>
                      <div class='comment-box'>
                        {/* <div class="avatar">
                                                            <img src="images/img/demo-thumb.jpg" alt=""/>
                                                        </div> */}
                        <div class='comment-body'>
                          <p class='meta'>
                            <strong>Nguyen Gallahendahry</strong>
                            <span class='time'>December 10, 2012</span>
                          </p>
                          <div class='description'>
                            <p>
                              Takes me back to my youth. I love the design of
                              this soda machine. A bit pricy though..!
                            </p>
                          </div>

                          <div class='rating-info'>
                            <div class='average-rating-review good'>
                              <span class='count'>7.5</span>
                              <em>Average rating</em>
                              <span>Good</span>
                            </div>
                            <ul class='rating-review'>
                              <li>
                                <em>Facility</em>
                                <span>7.5</span>
                              </li>
                              <li>
                                <em>Human</em>
                                <span>9.0</span>
                              </li>
                              <li>
                                <em>Service</em>
                                <span>9.5</span>
                              </li>
                              <li>
                                <em>Interesting</em>
                                <span>8.7</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class='comment-box'>
                        <div class='avatar'>
                          <img src='images/img/demo-thumb.jpg' alt='' />
                        </div>
                        <div class='comment-body'>
                          <p class='meta'>
                            <strong>James Bond not 007</strong>
                            <span class='time'>December 10, 2012</span>
                          </p>
                          <div class='description'>
                            <p>
                              Takes me back to my youth. I love the design of
                              this soda machine. A bit pricy though..!
                            </p>
                          </div>

                          <div class='rating-info'>
                            <div class='average-rating-review good'>
                              <span class='count'>7.5</span>
                              <em>Average rating</em>
                              <span>Good</span>
                            </div>
                            <ul class='rating-review'>
                              <li>
                                <em>Facility</em>
                                <span>7.5</span>
                              </li>
                              <li>
                                <em>Human</em>
                                <span>9.0</span>
                              </li>
                              <li>
                                <em>Service</em>
                                <span>9.5</span>
                              </li>
                              <li>
                                <em>Interesting</em>
                                <span>8.7</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class='comment-box'>
                        <div class='avatar'>
                          <img src='images/img/demo-thumb.jpg' alt='' />
                        </div>
                        <div class='comment-body'>
                          <p class='meta'>
                            <strong>Bratt not Pitt</strong>
                            <span class='time'>December 10, 2012</span>
                          </p>
                          <div class='description'>
                            <p>
                              Takes me back to my youth. I love the design of
                              this soda machine. A bit pricy though..!
                            </p>
                          </div>

                          <div class='rating-info'>
                            <div class='average-rating-review fine'>
                              <span class='count'>5.0</span>
                              <em>Average rating</em>
                              <span>Fine</span>
                            </div>
                            <ul class='rating-review'>
                              <li>
                                <em>Facility</em>
                                <span>7.5</span>
                              </li>
                              <li>
                                <em>Human</em>
                                <span>9.0</span>
                              </li>
                              <li>
                                <em>Service</em>
                                <span>9.5</span>
                              </li>
                              <li>
                                <em>Interesting</em>
                                <span>8.7</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </section>
          </div>
        </div>
        </Layout>
      )}
      <div id="mybutton">
      <button  onClick={BookRoom} class="btn feedback  select-styling search-btn1 mt-2 detail-view-btn">Book Now</button>
      </div>
    </>
  )
}

export default HotelDetail
