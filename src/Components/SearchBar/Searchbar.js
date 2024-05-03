import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSuitcase,
  faBuilding,
  faCar,
  faGlobe,
  faCalendar,
  faMinus,
  faPlus,
  faPlane,
  faBus
} from '@fortawesome/free-solid-svg-icons'
import ActivitySearch from './ActivitySearch'
import TransferSearch from './Transfers'
import { ToastContainer, toast } from 'react-toastify';
import { NavLink,Link,useNavigate } from 'react-router-dom'
import Loader from '../Loading/Loader'
import { DateRangePicker } from 'rsuite'
import 'rsuite/dist/rsuite.min.css';
import {Hotelapitoken,ApiEndPoint} from '../GlobalData/GlobalData';
import Autocomplete from 'react-google-autocomplete'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import moment from 'moment'
import Axios from 'axios'
import 'react-datepicker/dist/react-datepicker.css'
import PackageSearch from './PackageSearch'
import { useDispatch } from 'react-redux';
import FlightSearch from './FlightSearch'
import { useTranslation } from 'react-i18next'
import { fetchHotels,fetchHotelsSearh,SearchToursDetail } from '../../Redux/Actions/actions'
const { beforeToday} =DateRangePicker;

function SearchBar () {
  const {t}=useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  var endpoint=ApiEndPoint();
  const [selectedDate, setSelectedDate] = useState(null);
  const [places, setPlace] = useState([]);
  const [initialRender, setInitialRender] = useState(true);
  const [countryList, setCountryList] = useState([]);
  const [selectedNationality, setSelectedNationality] = useState('');
  const [loading, setLoading] = useState(false);
  const [personData, setPersonData] = useState({
    adult: 2,
    children: 0,
    room: 1
  });
  const [placeDetail, setPlaceDetail] = useState({
    city: '',
    country: '',
    countrycode: '',
    lat: 0,
    long: 0,
    checkindate: '',
    Checkoutdate: ''
  });
  const [rooms, setRooms] = useState([
    // Initial room with default values
    {
      adults: 2,
      children: 0,
      childrenAges: [],
    },
  ]);
 
  const [showtours, setShowtours] = useState(false);
  const [Showhotels, setShowhotels] = useState(false);
  const [Showflights, setFlights] = useState(true);
  const [Showtransfers, setShowtransfers] = useState(false);
  const [ShowActivities, setShowActivities] = useState(false);
  const [activeItem, setActiveItem] = useState(4);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // You can adjust the breakpoint as needed
  const [adultModal, setAdultModal] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState({
    payment: false,
    booking: false,
    trackid: false
  });
  const [dateRange, setDateRange] = useState({ checkindate: null,Checkoutdate: null});
  // State for input value
 
  useEffect(() => {
    fetchData();
    GetPackages();
  }, [dispatch]);
 

  const Searchhotels = async () => {
    if(places.length ===0){
      toast.info('Please Select Destination.', {
        position: toast.POSITION.TOP_RIGHT
      });
      return;
    } if(dateRange.Checkoutdate===null){
      toast.info('Please Select Hotel Stay.', {
        position: toast.POSITION.TOP_RIGHT
      });
      return;
    }else if(selectedNationality ===''){
      toast.info('Please Select Nationality.', {
        position: toast.POSITION.TOP_RIGHT
      });
      return;
    };
     setLoading(true)
     var token2=Hotelapitoken();
     debugger
     // Define your API URL, authToken, and dataToSend as shown in the previous example
     const FormData = {
        "token":token2,
       "currency_slc": 'AFN',
       "currency_slc_iso": 'AF',
       "destination_name": placeDetail.city,
       "country": placeDetail.country,
       "lat": placeDetail.lat,
       "long": placeDetail.long,
       "pin": placeDetail.countrycode,
       "cityd": placeDetail.city,
       "country_code": placeDetail.countrycode,
       "check_in":placeDetail.checkindate,
       "check_out":placeDetail.Checkoutdate,
       "slc_nationality": String(selectedNationality),
       ...rooms.reduce((acc, item,index) => {
         acc.adult += item.adults;
         acc.child += item.children;
         acc.room += 1;
         acc.Adults.push(item.adults);
         acc.children.push(item.children);
         acc[`child_ages${index + 1}`] = item.childrenAges.map((age) =>
     age ? parseInt(age) : 2
   );
         acc.rooms_counter.push(acc.room);
         return acc;
       }, {
         "adult": 0,
         "child": 0,
         "room": 0,
         "Adults": [],
         "children": [],
         "child_ages1": [],
         "rooms_counter": [],
         "child_ages2": [],
       }),
      
     };
     try {
     
      dispatch(fetchHotelsSearh(FormData));
       const response = await Axios.post(endpoint+'/api/search/hotels/new_Live',FormData, {
         headers: {
           "Access-Control-Allow-Origin": "*",
           // Required for CORS support to work
           //  "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
           // "Access-Control-Allow-Headers":
           // "Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale",
           // "Access-Control-Allow-Methods": "POST, OPTIONS"
         } ,
         
       });
       sessionStorage.removeItem('FlightCheckOut');
       navigate('/hotels');
       dispatch(fetchHotels(response.data));
       // Handle the API response here
       setLoading(false)
     } catch (error) {
       // Handle errors here
       console.error('Error:', error);
     }
   };
 
   useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Update isMobile based on the screen width
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Calculate the total counts from the inputArray
    const adults = rooms.reduce((acc, item) => acc + item.adults, 0);
    const children = rooms.reduce((acc, item) => acc + item.children, 0);
    const roomss = rooms.length;
    setPersonData(prevPersonData => ({
      ...prevPersonData,
     adult:adults,
     children:children,
     room:roomss
      // Use square brackets to set the property dynamically based on the 'name' attribute
    }))
    // Update the state with the calculated totals
    
  }, [rooms]);

  async function fetchData () {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      // 'Authorization': 'Bearer YourAccessToken', // Replace with your authorization token
      'Content-Type': 'application/json' // Specify content type if needed
    }
    try {
      const response = await Axios.get(endpoint+'/api/countries/fetch', headers);
  
      // Handle the response data
      setCountryList(response.data.countries);
    } catch (error) {
      // Handle any errors
      console.error('Error:', error);
    }
  };


 
  
  // Callback function to handle date range changes
  

  const print = () => {
    // console.log(placeDetail)
    // console.log(selectedNationality)
    // console.log(personData)
    // console.log(rooms)
  };


  const GetPackages= async()=>{
    var token=Hotelapitoken();
    const fullURL = window.location.href;
    var data={
      'token':token,
      'currentURL':fullURL,
      'limit':6
    };
    // try {
    //    const response = await Axios.post('https://api.synchtravel.com/api/get_website_index_data',data, {
    //      headers: {
    //        "Access-Control-Allow-Origin": "*",
    //      } ,
         
    //    });
      
    //    setUmrahPackageId(response.data.all_cateogries[0].id);
     
    //    setAllCateogries(response.data.all_cateogries);
    //  } catch (error) {
      
    //    console.error('Error:', error);
    //  };

   };
  
  useEffect(() => {
    if (initialRender) {
      setInitialRender(false) // Update the initialRender state to false.
      return // Exit the effect early to avoid running the code below.
    }
    
    if (places.length !== 0) {
      // debugger
      if (
        places.address_components.filter(
          f =>
            JSON.stringify(f.types) ===
            JSON.stringify(['locality', 'political'])
        )[0]
      ) {
        const city1 = places.address_components.filter(
          f =>
            JSON.stringify(f.types) ===
            JSON.stringify(['locality', 'political'])
        )[0]?.short_name
        // console.log('city1=' + city1)
        setPlaceDetail(prevPlaceDetail => ({
          ...prevPlaceDetail,
          city: city1
        }))
      } else {
        const city1 = places.address_components.filter(
          f =>
            JSON.stringify(f.types) ===
            JSON.stringify(['administrative_area_level_2', 'political'])
        )[0]?.short_name
        // console.log('city1=' + city1)
        setPlaceDetail(prevPlaceDetail => ({
          ...prevPlaceDetail,
          city: city1
        }))
      }

      if (
        places.address_components.filter(
          f =>
            JSON.stringify(f.types) ===
            JSON.stringify(['locality', 'political'])
        )[0]
      ) {
        const displayCity1 = places.address_components.filter(
          f =>
            JSON.stringify(f.types) ===
            JSON.stringify(['locality', 'political'])
        )[0]?.long_name
        // console.log('displayCity1=' + displayCity1)
      } else {
        const displayCity1 = places.address_components.filter(
          f =>
            JSON.stringify(f.types) ===
            JSON.stringify(['administrative_area_level_2', 'political'])
        )[0]?.long_name
        // console.log('displayCity1=' + displayCity1)
      }

      if (
        places.address_components.filter(
          f =>
            JSON.stringify(f.types) === JSON.stringify(['country', 'political'])
        )[0]
      ) {
        const country_code = places.address_components.filter(
          f =>
            JSON.stringify(f.types) === JSON.stringify(['country', 'political'])
        )[0]?.short_name
        // console.log('country_code=' + country_code)
        setPlaceDetail(prevPlaceDetail => ({
          ...prevPlaceDetail,
          countrycode: country_code
        }))
      }
      if (
        places.address_components.filter(
          f =>
            JSON.stringify(f.types) === JSON.stringify(['country', 'political'])
        )[0]
      ) {
        const country = places.address_components.filter(
          f =>
            JSON.stringify(f.types) === JSON.stringify(['country', 'political'])
        )[0]?.long_name
        setPlaceDetail(prevPlaceDetail => ({
          ...prevPlaceDetail,
          country: country
        }))
      }

      var address = places.formatted_address
      var latitude = places.geometry.location.lat()
      setPlaceDetail(prevPlaceDetail => ({
        ...prevPlaceDetail,
        lat: latitude
      }))
      var longitude = places.geometry.location.lng()
      setPlaceDetail(prevPlaceDetail => ({
        ...prevPlaceDetail,
        long: longitude
      }))
      const latlng = new window.google.maps.LatLng(latitude, longitude)
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ latLng: latlng }, function (results, status) {
        if (status === window.google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            const addressComponents = results[0].address_components
            const lastAddressComponent =
              addressComponents[addressComponents.length - 1]
            const country = lastAddressComponent.short_name
            const state =
              addressComponents[addressComponents.length - 3].long_name
            const city =
              addressComponents[addressComponents.length - 4].long_name

          }
        }
      })
    }
  }, [places, initialRender]);

  const toggleModal = divNumber => {
    if (divNumber === 1) {
      setModalIsOpen({ payment: !modalIsOpen.payment })
    } else if (divNumber === 2) {
      setModalIsOpen({ booking: !modalIsOpen.booking })
    } else if (divNumber === 3) {
      setModalIsOpen({ trackid: !modalIsOpen.trackid })
    }
  };
  const handleDateChange = date => {
    setSelectedDate(date)
  };

  
  const handleSelectChange = event => {
    // debugger
    setSelectedNationality(event.target.value) // Update the selected nationality when the user makes a selection
  };
  

  const toggleDiv = divNumber => {
    if (divNumber === 1) {
      setActiveItem(divNumber)
      setShowtransfers(false)
      setFlights(false)
      setShowtours(true)
      setShowActivities(false);
      setShowhotels(false) // Hide div2 when showing div1
    } else if (divNumber === 2) {
      setActiveItem(divNumber)
      setShowtransfers(false)
      setShowhotels(true)
      setFlights(false)
      setShowActivities(false)
      setShowtours(false) // Hide div1 when showing div2
    } else if (divNumber === 3) {
      setActiveItem(divNumber)
      setShowtransfers(true)
      setShowhotels(false)
      setShowActivities(false)
      setFlights(false)
      setShowtours(false) // Hide div1 when showing div2
    }else if (divNumber === 4) {
      setActiveItem(divNumber)
      setShowtransfers(false)
      setShowhotels(false)
      setShowActivities(false)
      setFlights(true)
      setShowtours(false) // Hide div1 when showing div2
    }
    else if (divNumber === 5) {
      setActiveItem(divNumber)
      setShowtransfers(false)
      setShowhotels(false)
      setShowActivities(true)
      setFlights(false)
      setShowtours(false) // Hide div1 when showing div2
    }
  };
  const toggleAdultModal = () => {
    setAdultModal(!adultModal)
  };
  const childAgearray = [
    '1 Year',
    '2 Year',
    '3 Year',
    '4 Year',
    '5 Year',
    '6 Year',
    '7 Year',
    '8 Year',
    '9 Year',
    '10 Year',
    '11 Year',
    '12 Year',
    '13 Year',
    '14 Year',
    '15 Year',
    '16 Year',
    '17 Year'
  ];
  const handleDateRangeChange = (value) => {
    if (value === null) {
      // Dates have been removed, reset the date range state
      setPlaceDetail((prevPlaceDetail) => ({
        ...prevPlaceDetail,
        checkindate: '',
        Checkoutdate: '',
      }));
  
      // Reset the dateRange state
      setDateRange(null);
    } else {
      // Dates are selected, format and update the state
      setPlaceDetail((prevPlaceDetail) => ({
        ...prevPlaceDetail,
        checkindate: moment(value[0]).format('YYYY-MM-DD'),
        Checkoutdate: moment(value[1]).format('YYYY-MM-DD'),
      }));
  
      // Update the dateRange state
      setDateRange(value);
    }
  };
  
  const handleAdultIncrement = (roomIndex) => {
    // Increment the number of adults for a specific room
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].adults += 1;
    setRooms(updatedRooms);
  };

  const handleAdultDecrement = (roomIndex) => {
    // Decrement the number of adults for a specific room
    const updatedRooms = [...rooms];
    if (updatedRooms[roomIndex].adults > 1) {
      updatedRooms[roomIndex].adults -= 1;
      setRooms(updatedRooms);
    }
  };

  const handleChildrenIncrement = (roomIndex) => {
    // Increment the number of children for a specific room, if less than 4
    const updatedRooms = [...rooms];
    if (updatedRooms[roomIndex].children < 4) {
      updatedRooms[roomIndex].children += 1;
      setRooms(updatedRooms);
    }
  };

  const handleChildrenDecrement = (roomIndex) => {
    // Decrement the number of children for a specific room
    const updatedRooms = [...rooms];
    if (updatedRooms[roomIndex].children > 0) {
      updatedRooms[roomIndex].children -= 1;
      setRooms(updatedRooms);
    }
  };

  const handleChildAgeChange = (roomIndex, childIndex, value) => {
    // Update the age of a specific child for a specific room
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].childrenAges[childIndex] = value;
    setRooms(updatedRooms);
  };
  const addRoom = () => {
    // Add a new room with default values
    setRooms([...rooms, { adults: 2, children: 0, childrenAges: [] }]);
  };

  const removeLastRoom = () => {
    if (rooms.length > 1) {
      // Remove the last room by slicing the array
      setRooms(rooms.slice(0, -1));
    }
  };
const handleDeleteRoomByIndex=(roomIndex)=>{
  const updatedRooms = rooms.filter((room, index) => index !== roomIndex);
  setRooms(updatedRooms)
};
  return (
    <>
    <ToastContainer/>
      <Modal isOpen={adultModal}   centered={true}  toggle={toggleAdultModal}>
        <ModalHeader toggle={toggleAdultModal}>Select Detail</ModalHeader>
        <ModalBody>
          <div className='p-3'>
          {rooms.map((room, roomIndex) => (
            <div key={roomIndex}>
             <div className='hotel-detail-border d-flex text-center fw-bold mb-2' style={{justifyContent:'space-between',alignItems:'center'}}>
             <p className='fw-bold'>Room {roomIndex + 1}</p>
             {roomIndex > 0 && ( // Check if roomIndex is greater than 0
        <button className='delete-room-button m-1' onClick={() => handleDeleteRoomByIndex(roomIndex)}>Delete</button>
      )}
           </div>
           <div>
           <div className='select-child'>
             <div class='f4878764f1'>
               <label class='a984a491d9 fw-bold' for='group_adults'>
                 Adults
               </label>
             </div>
             <div class='d-flex fff'>
               <button
                 className='adult-modal-btn'
                 name={`adults-${roomIndex}`}
                 onClick={() => handleAdultDecrement(roomIndex)}
                 
               >
                 <i class='fas fa-minus'>
                   <FontAwesomeIcon size='sm' icon={faMinus} />
                 </i>
               </button>
               <span className='d723d73d5f fw-bold' id='input'>
               {room.adults}
               </span>
               <button
                 className='adult-modal-btn'
                 name={`adults-${roomIndex}`}
                 onClick={() => handleAdultIncrement(roomIndex)}
                 id='increment'
               >
                 <i class='fas fa-plus'>
                   <FontAwesomeIcon size='sm' icon={faPlus} />
                 </i>
               </button>
             </div>
           </div>
           <div className='select-child'>
             <div class='f4878764f1'>
               <label class='a984a491d9 fw-bold' for='group_adults'>
                 Children
               </label>
             </div>
             <div class='d-flex fff'>
               <button
                 className='adult-modal-btn'
                 onClick={() => handleChildrenDecrement(roomIndex)}
                 id='decrement'
               >
                 <i class='fas fa-minus'>
                   <FontAwesomeIcon size='sm' icon={faMinus} />
                 </i>
               </button>
               <span className='d723d73d5f fw-bold' id='input'>
                 {room.children}
               </span>
               <button
                 className='adult-modal-btn'
                 onClick={() => handleChildrenIncrement(roomIndex)}
                 id='increment'
               >
                 <i class='fas fa-plus'>
                   <FontAwesomeIcon size='sm' icon={faPlus} />
                 </i>
               </button>
             </div>
           </div>
           <div className='select-child' style={{ justifyContent: 'left' }}>
           {room.children > 0 && (
             <div className='row w-100 '>
             {Array.from({ length: room.children }, (_, childIndex) => (
              
               <div  key={childIndex} className='m-1 ' style={{width:'45%',alignItems:'center'}}>
               <label>Child {childIndex+1} (Age)</label>
               <select
                 class='form-select child-age-select'
                 name='child1'
                 onChange={(e) =>handleChildAgeChange(roomIndex, childIndex, e.target.value)}
                 aria-label='Default select example'
               >
                 <option selected>Age needed</option>
                 {childAgearray.map((item, index) => (
                   <option key={index} value={index + 1}>
                     {item}
                   </option>
                 ))}
               </select>
             </div>
             ))}
           </div>
           )}
           </div>
           
         </div>
         </div>
          ))}
           
            
          </div>
        </ModalBody>
        <ModalFooter>
        <div className='select-child'>
                <div class='f4878764f1 pe-4'>
                  <label class='a984a491d9 fw-bold' for='group_adults'>
                    Room
                  </label>
                </div>
                <div class='d-flex fff'>
                  <button
                    className='adult-modal-btn'
                    onClick={removeLastRoom}
                    id='decrement'
                  >
                    <i class='fas fa-minus'>
                      <FontAwesomeIcon size='sm' icon={faMinus} />
                    </i>
                  </button>
                  <span className='d723d73d5f fw-bold' id='input'>
                    {rooms.length}
                  </span>
                  <button
                    className='adult-modal-btn'
                    onClick={addRoom}
                    id='increment'
                  >
                    <i class='fas fa-plus'>
                      <FontAwesomeIcon size='sm' icon={faPlus} />
                    </i>
                  </button>
                </div>
              </div>
          <Button color='secondary' onClick={toggleAdultModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      {/***********  Model Windows ****************/}
      <Modal isOpen={modalIsOpen.payment} toggle={() => toggleModal(1)}>
        <ModalHeader toggle={() => toggleModal(1)}>Make Payment</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label htmlFor=''>Enter Invoice No.</label>
            <input
              type='text'
              className='form-control select-styling mt-2'
              id=''
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={() => toggleModal(1)}>
            Close
          </Button>
          <button
            className=' btn btn-warning modal-btn1'
            onClick={() => toggleModal(1)}
          >
            Submit
          </button>
        </ModalFooter>
      </Modal>
      {/***********  Model Windows ****************/}
      <Modal isOpen={modalIsOpen.booking} toggle={() => toggleModal(2)}>
        <ModalHeader toggle={() => toggleModal(2)}>View Booking</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label htmlFor=''>Enter Email.</label>
            <input
              type='email'
              className='form-control mt-2'
              id='exampleInputEmail1'
              aria-describedby='emailHelp'
              placeholder=''
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={() => toggleModal(2)}>
            Close
          </Button>
          <button
            className=' btn btn-warning modal-btn1'
            onClick={() => toggleModal(2)}
          >
            Submit
          </button>
        </ModalFooter>
      </Modal>
      {/***********  Model Windows ****************/}
      <Modal isOpen={modalIsOpen.trackid} toggle={() => toggleModal(3)}>
        <ModalHeader toggle={() => toggleModal(3)}>Track ID</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label htmlFor=''>Enter Track ID.</label>
            <input
              type='text'
              className='form-control select-styling mt-2'
              id=''
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={() => toggleModal(3)}>
            Close
          </Button>
          <button className=' btn btn-warning modal-btn1' onClick={print}>
            Submit
          </button>
        </ModalFooter>
      </Modal>
      {loading ? (
        <Loader />
      ) : (
        <section className='booking_part mt-3'>
        <div className='row search-border'>
          <div className='col-lg-12 ps-0 pe-0'>
            <div className='booking_content'>
             
              <div className='mt-1 mb-1'>
              <div className='search-menu'>
                <ul className='nav nav-tabs new-nav' id='myTab' role='tablist'>
                <li
                    className={`nav-item ${
                      activeItem === 4 ? 'active-search' : ''
                    }`}
                    onClick={() => toggleDiv(4)}
                  >
                    <a className='nav-link'>
                      <FontAwesomeIcon icon={faPlane} /> {t('Flights')}
                    </a>
                  </li>
                <li
                    className={`nav-item ${
                      activeItem === 2 ? 'active-search' : ''
                    }`}
                    onClick={() => toggleDiv(2)}
                  >
                    <a className='nav-link'>
                      <FontAwesomeIcon icon={faBuilding} /> Hotels
                    </a>
                  </li>
                  <li
                    className={`nav-item ${
                      activeItem === 1 ? 'active-search' : ''
                    }`}
                    onClick={() => toggleDiv(1)}
                  >
                    <a className='nav-link'>
                      <FontAwesomeIcon icon={faSuitcase} /> Packages
                    </a>
                  </li>
                  <li
                    className={`nav-item ${
                      activeItem === 5 ? 'active-search' : ''
                    }`}
                    onClick={() => toggleDiv(5)}
                  >
                    <a className='nav-link'>
                      <FontAwesomeIcon icon={faBus} /> Excursions
                    </a>
                  </li>
                  <li
                    className={`nav-item ${
                      activeItem === 3 ? 'active-search' : ''
                    }`}
                    onClick={() => toggleDiv(3)}
                  >
                    <a className='nav-link'>
                      <FontAwesomeIcon icon={faCar} /> Transfers
                    </a>
                  </li>
                </ul>
              </div>
              </div>
              <div className='tab-content'>
                <div className='tab-pane fade show active'>
                  <div className='row check-availabilty'>
                    {showtours && (
                     <PackageSearch/>
                    )}
                    {Showflights && (
                     <FlightSearch/>
                    )}
                    {Showhotels && (
                      <div className='block-32'>
                       
                          <div className='row'>
                            <div className='col-md-6  mb-lg-0  mt-2 col-lg-3'>
                              <label
                                htmlFor='checkin_date'
                                className='font-weight-bold text-black mb-2'
                              >
                                Destinations
                              </label>
                              <div className='field-icon-wrap'>
                                <span className='form-control-feedback'>
                                  <FontAwesomeIcon icon={faGlobe} />{' '}
                                </span>
                                <Autocomplete
                                  className='form-control search-form-control text-start select-styling '
                                  placeholder='Enter Location'
                                  apiKey='AIzaSyBmwlQFQKwxZ4D8nRbsWVRTBFUHMO-lUOY'
                                  onPlaceSelected={place => {
                                    setPlace(place);
                                    
                                  }}
                                  options={{
                                    types: ['(regions)'],
                                    componentRestrictions: null
                                  }}
                                />
                              </div>
                            </div>
                            <div className='col-md-6  mb-lg-0 col-lg-4  mt-2'>
                              <label
                                htmlFor='checkin_date'
                                className='font-weight-bold text-black mb-2'
                              >
                                Hotel Stay
                              </label>
                              <div className='field-icon-wrap'>
                                <DateRangePicker
                                  onChange={handleDateRangeChange}
                                  placeholder='Check in ~ Check out'
                                  value={dateRange}
                                  showOneCalendar={isMobile}
                                  disabledDate={beforeToday()}
                                  className='w-100 text-left select-styling '
                                />
                              
                              </div>
                            </div>
                            <div className='col-md-6 mb-3 mb-lg-0 col-lg-4  mt-2' >
                              <label
                                htmlFor='checkin_date'
                                className='font-weight-bold text-black mb-2'
                              >
                                Select Rooms
                              </label>
                              <div className='field-icon-wrap'>
                              <button onClick={toggleAdultModal} className='btn text-left btn-primary btn-block select-styling button-2 search-btn1' style={{color:'black',background:'none'}}>
                                 {personData.adult} Adults . {personData.children} Children . {personData.room} Room
                                </button> 
                              
                              </div>
                            </div>
                           
                            <div className='col-md-6 mb-lg-0 col-lg-3 mt-2'>
                              <label
                                htmlFor='checkin_date'
                                className='font-weight-bold text-black mb-2'
                              >
                                Nationality
                              </label>
                              <div className='field-icon-wrap'>
                                <select
                                  value={selectedNationality} // Set the selected value from the state
                                  onChange={handleSelectChange}
                                  className='form-control form-select select-styling'
                                  aria-label='Default select example'
                                >
                                  <option selected>Select Nationality</option>
                                  {countryList.map(item => (
                                    <option key={item.id} value={item.iso2}>
                                      {item.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className='col-md-6 col-lg-3 text-center   mt-2 align-self-end'>
                              {/* <NavLink to='/hotels'> */}
                                <button onClick={Searchhotels} className='btn btn-primary btn-block select-styling search-btn1'>
                                  Search
                                </button>
                              {/* </NavLink> */}
                            </div>
                            
                          </div>
                       
                      </div>
                    )}
                    {Showtransfers && (
                     <TransferSearch/>
                    )}
                    {ShowActivities && (
                      <ActivitySearch/>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        
      </div>
    </section>
      )}
    </>
  )
}

export default SearchBar
