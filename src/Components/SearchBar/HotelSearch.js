import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGlobe,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios'
import Loader from '../Loading/Loader'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import { fetchHotels,fetchHotelsSearh,SearchToursDetail } from '../../Redux/Actions/actions'
import Autocomplete from 'react-google-autocomplete'
import { DateRangePicker } from 'rsuite'
import {Hotelapitoken,ApiEndPoint} from '../GlobalData/GlobalData';
import { useDispatch } from 'react-redux';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';
const { beforeToday} =DateRangePicker;
function HotelSearch(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    var endpoint=ApiEndPoint();
    const [places, setPlace] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // You can adjust the breakpoint as needed
    const [placeDetail, setPlaceDetail] = useState({
        city: '',
        country: '',
        countrycode: '',
        lat: 0,
        long: 0,
        checkindate: '',
        Checkoutdate: ''
      });
      const [initialRender, setInitialRender] = useState(true);
      const [selectedNationality, setSelectedNationality] = useState('');
      const [loading, setLoading] = useState(false);
      const [adultModal, setAdultModal] = useState(false);
      const [dateRange, setDateRange] = useState({ checkindate: null,Checkoutdate: null});
      const [personData, setPersonData] = useState({
        adult: 2,
        children: 0,
        room: 1
      });
      const [rooms, setRooms] = useState([
       
        {
          adults: 2,
          children: 0,
          childrenAges: [],
        },
      ]);
    
      const [countryList, setCountryList] = useState([]);
      useEffect(() => {
        fetchData();
      }, [dispatch]);

      const handleSelectChange = event => {
        // debugger
        setSelectedNationality(event.target.value) // Update the selected nationality when the user makes a selection
      };
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
         const currentURL = window.location.href;
         const parts = currentURL.split('/');
        const pagename = parts[parts.length - 1];
         // Define your API URL, authToken, and dataToSend as shown in the previous example
         const FormData = {
            "token":'r9fdvwRyF35JUnD6xXdRiDELANYjtfASzPmyGol4-1PN461EY50LbXcqkfEfISsOJDrnFDJbuMzPuxTz37zFWGWBVemQGhi2SYLrr-MZ75vJSAiV73z94UOVrDz5P6R-0KjFqr9XR6P2857snQbcKTUn9YNqjBOQQIkXENeO7tmjxdTJs2KUVoXqo6fFyT9TTq99eKe288N-wyanZXxOsfABWPjtSom2oKLVz6vJnn1WeQwHSp7VnzPUqq53rn80eFXNBSMIiEXBdDmlsokRYSa0evDrQKluhnIzMYkRiazxtnkb-z5Xj0tQReTTHsLz1sgnit2mRGGzP4EIdBK8TiLuEN7GD1kmOT3CMreL7ELrI4yxmEbnYyflICtG-ySk3aZkk8iM9mRZlA7CS10Zuj-C0HEBOFW8vMzy4Eq2CET5WN62S1xe0HPAOrDVwO6jDvVpKEMwm-NiyyjkU8oTTlgYpN77pXtfFjKPTF0julnAMC6cPzxZOGBIkRv0',
           "currency_slc": 'AFN',
           "currency_slc_iso": 'AF',
           "destination_name": placeDetail.city,
           "country": placeDetail.country,
           "lat": placeDetail.lat,
           "long": placeDetail.long,
           "pin": placeDetail.countrycode,
           "cityd": placeDetail.city,
           "country_code": placeDetail.countrycode,
           // "daterange_date": placeDetail.checkindate+'-'+placeDetail.Checkoutdate,
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
         // navigate('/hotels',{state:{FormData}});
         try {
         
          dispatch(fetchHotelsSearh(FormData));
  
           const response = await Axios.post(endpoint+'/api/search/hotels/new',FormData, {
             headers: {
               "Access-Control-Allow-Origin": "*",
               // Required for CORS support to work
               //  "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
               // "Access-Control-Allow-Headers":
               // "Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale",
              
             } ,
             
           });
           dispatch(fetchHotels(response.data));
           setLoading(false);
           sessionStorage.removeItem('FlightCheckOut');
          
           if(pagename==='hotels'){
           
           }else{
            navigate('/hotels');
           }
          
         } catch (error) {
           console.error('Error:', error);
           setLoading(false);
         }
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

      const handleDeleteRoomByIndex=(roomIndex)=>{
        const updatedRooms = rooms.filter((room, index) => index !== roomIndex);
        setRooms(updatedRooms)
      };
      const handleAdultDecrement = (roomIndex) => {
        // Decrement the number of adults for a specific room
        const updatedRooms = [...rooms];
        if (updatedRooms[roomIndex].adults > 1) {
          updatedRooms[roomIndex].adults -= 1;
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
      const handleChildrenIncrement = (roomIndex) => {
        // Increment the number of children for a specific room, if less than 4
        const updatedRooms = [...rooms];
        if (updatedRooms[roomIndex].children < 4) {
          updatedRooms[roomIndex].children += 1;
          setRooms(updatedRooms);
        }
      };
      const handleChildAgeChange = (roomIndex, childIndex, value) => {
        // Update the age of a specific child for a specific room
        const updatedRooms = [...rooms];
        updatedRooms[roomIndex].childrenAges[childIndex] = value;
        setRooms(updatedRooms);
      };
      const handleAdultIncrement = (roomIndex) => {
        // Increment the number of adults for a specific room
        const updatedRooms = [...rooms];
        updatedRooms[roomIndex].adults += 1;
        setRooms(updatedRooms);
      };
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
      const toggleAdultModal = () => {
        setAdultModal(!adultModal)
      };
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
    
    return(
        <>
                {loading && (
                <Loader />
            )}
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
         <div className='tab-content'>
                <div className='tab-pane fade show active'>
                    <div className='row check-availabilty'>
                    <div className=''>
                       
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
                           <button onClick={toggleAdultModal} className='btn text-left btn-primary btn-block select-styling button-2 search-btn1' style={{color:'black',background:'none',borderRadius:'21px'}}>
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
                    </div>
                 </div>
            </div>
        </>
    )
};

export default HotelSearch;