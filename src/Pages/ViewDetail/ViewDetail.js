import React, { useState, useEffect } from 'react'
import FlightDetail from './FlightCard'
import Faqs from '../../Components/FAQs/FAQs'
import Layout from '../../Components/Layout/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faPhone,
  faMapMarker,
  faPersonCirclePlus,
  faPersonCircleMinus,
  faCalendar,
  faMoon,
  faClipboardCheck,
  faBus,
  faBuildingCircleCheck,
  faPlaneDeparture,
  faPlaneArrival,
  faBed,
  faClock,
  faDollar,
  faHeadphones,
  faStar,
  faLock,
  faMailBulk,
  faEnvelope,
  faCalendarCheck,
  faCalendarMinus
} from '@fortawesome/free-solid-svg-icons'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import kaba from '../../Images/Packages/kabapic.jpg';
import busimage from '../../Images/Logo/bus.png' 
import { CustomerDomainName } from '../../Components/GlobalData/GlobalData'
import moment from 'moment'
import Images from '../../Components/Images/images'

import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
function ViewDeail () {
  var url = CustomerDomainName();
  const tourDetail = useSelector(state => state.hotels.viewtourdetail);
  const CurrencyRates = useSelector(state => state.hotels.Currency);
  const GBPCurrencyRates = useSelector(state => state.hotels.AllCurrency);
  const tourlocation = JSON.parse(tourDetail.tours.tour_location);
  const transportationdetail = JSON.parse(
    tourDetail.tours.transportation_details
  )
  const Itinerarydetail = JSON.parse(tourDetail.tours.Itinerary_details)
  var Itinerarydetailmore=[]
  if(tourDetail.tours.tour_itinerary_details_1 !== null){
  Itinerarydetailmore = JSON.parse(
    tourDetail.tours.tour_itinerary_details_1
  )
}
  const accomodationdetail = JSON.parse(tourDetail.tours.accomodation_details)
  const accomodationdetailmore = JSON.parse(
    tourDetail.tours.accomodation_details_more
  )
  const transportationdetailmore = tourDetail.tours.transportation_details_more
  ? JSON.parse(tourDetail.tours.transportation_details_more)
  : [];
  const images = JSON.parse(tourDetail.tours.gallery_images)
  const [opencartmodel, setOpencartmodel] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeIndex, setActiveIndex] = useState(null)
  const [cancelModal, setCancelModal] = useState(false)
  const [minValue, setMinValue] = useState({price:0,currency:''})
  const [modalAdultRoom, setModalAdultRoom] = useState({double:'',triple:'',quad:''});
  const [modalAdultAdult, setModalAdultAdult] = useState({double:'',triple:'',quad:''});
  const [modalAdultTotal, setModalAdultTotal] = useState({double:0,triple:0,quad:0});

  const [activeButton, setActiveButton] = useState(null)

  // const handleAdultRoomChange = (event, price) => {
  //   var { name, value } = event.target;

  //   if(name==='double_rooms'){
  //     setModalAdultRoom((prevAdultRoom) => ({
  //       ...prevAdultRoom,
  //      double: value
  //     }));
  //     var adult=value*2;
  //     setModalAdultAdult((prevAdultRoom) => ({
  //       ...prevAdultRoom,
  //       double: adult
  //     }));

  //     var p=adult*price;
  //     setModalAdultTotal((prevAdultRoom) => ({
  //       ...prevAdultRoom,
  //       double: p
  //     }));

  //   }
  // };
  // const handleAdultAdultChange = (event, price) => {
  //   var { name, value } = event.target;

  //   if(name==='double_adult'){
  //     setModalAdultAdult((prevAdultRoom) => ({
  //       ...prevAdultRoom,
  //       double: value
  //     }));

  //     var p=value*price;
  //     setModalAdultTotal((prevAdultRoom) => ({
  //       ...prevAdultRoom,
  //       double: p
  //     }));

  //   }
  // };
  const handleButtonClick = buttonName => {
    setActiveButton(buttonName)
  }
  const show = index => {
    const buttons = document.getElementsByClassName('accordion')
    const panel = buttons[index].nextElementSibling
    buttons[index].classList.toggle('active-2')

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px'
    }

    // Remove "active" class from other buttons
    for (let i = 0; i < buttons.length; i++) {
      if (i !== index) {
        buttons[i].classList.remove('active-2')
        buttons[i].nextElementSibling.style.maxHeight = null
      }
    }
  }
  useEffect(() => {
    calcalutemin();
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

  const toggleModal2=()=>{
    setCancelModal(!cancelModal)
  }
const calcalutemin=()=>{
  var min_value = Math.min(tourDetail.tours.double_grand_total_amount, tourDetail.tours.triple_grand_total_amount, tourDetail.tours.quad_grand_total_amount);
  if (minValue.price !== min_value) {
   setMinValue({price:min_value,currency:tourDetail.tours.currency_symbol});
 }

};
  return (
    <>
      <Layout>
      
        <Images data={images} setting={1} />
        <nav className='navbar view-detail-navbar gradient-green'>
          <div className='container'>
            <ul>
              <li>
                <a
                  href='#section-1'
                  onClick={() => handleButtonClick('section-1')}
                  className={activeButton === 'section-1' ? 'current' : ''}
                >
                  Overview
                </a>
              </li>
              <li>
                <a
                  href='#section-2'
                  onClick={() => handleButtonClick('section-2')}
                  className={activeButton === 'section-2' ? 'current' : ''}
                >
                  Itinerary Schedule
                </a>
              </li>
              <li>
                <a
                  href='#section-3'
                  onClick={() => handleButtonClick('section-3')}
                  className={activeButton === 'section-3' ? 'current' : ''}
                >
                  Flights
                </a>
              </li>
              <li>
                <a
                  href='#section-4'
                  onClick={() => handleButtonClick('section-4')}
                  className={activeButton === 'section-4' ? 'current' : ''}
                >
                  Accomodation
                </a>
              </li>
              <li>
                <a
                  href='#section-5'
                  onClick={() => handleButtonClick('section-5')}
                  className={activeButton === 'section-5' ? 'current' : ''}
                >
                  Transportion
                </a>
              </li>
              <li>
                <a
                  href='#section-6'
                  onClick={() => handleButtonClick('section-6')}
                  className={activeButton === 'section-6' ? 'current' : ''}
                >
                  Visa
                </a>
              </li>
              <li>
                <a
                  href='#section-7'
                  onClick={() => handleButtonClick('section-7')}
                  className={activeButton === 'section-7' ? 'current' : ''}
                >
                  FAQ
                </a>
              </li>
            </ul>
          

          </div>
        </nav>
        <div className='container'>
          <div className='row'>
            <div class='col-sm-12 col-md-8'>
              <section id='section-1' className='pt-2'>
                <div class='row'>
                  <div class='col-md-12'>
                    <div class='product-title'>
                      <h2 className='view-detail-title'>{tourDetail.tours.title}</h2>
                    </div>
                    <div class='product-address'>
                      <span>
                        {' '}
                        <i class='fa-solid tc fa-location-dot'>
                          <FontAwesomeIcon icon={faMapMarker} />
                        </i>
                        &nbsp;
                        {tourlocation.map((location, index) => (
                          <span key={index}>
                            {location}
                            {index !== tourlocation.length - 1 ? ' ' : ''}
                          </span>
                        ))}
                        &nbsp;
                        <i class='fa-solid tc fa-phone'>
                          <FontAwesomeIcon icon={faPhone} />
                        </i>
                        &nbsp; +966 50 978 6777
                      </span>
                    </div>
                    <p class='mt-2 mb-2'>{tourDetail.tours.content}</p>
                  </div>
                  <div class='col-md-6'>
                    <h6 className='inc-excl'>
                      {' '}
                      <i class='fa-solid fa-person-circle-plus'>
                        {'   '}
                        <FontAwesomeIcon icon={faPersonCirclePlus} />
                      </i>{' '}
                      Whats Included?
                    </h6>
                    <p></p>
                    <p>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: tourDetail.tours.whats_included
                        }}
                      ></span>
                      <br />
                    </p>
                    <p></p>
                  </div>
                  <div class='col-md-6'>
                    <h6 className='inc-excl'>
                      <i class='fa-solid fa-person-circle-minus'>
                        <FontAwesomeIcon icon={faPersonCircleMinus} />
                      </i>{' '}
                      Whats Excluded?
                    </h6>
                    <p></p>
                    <p>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: tourDetail.tours.whats_excluded
                        }}
                      ></span>
                      <br />
                    </p>
                    <p></p>
                  </div>
                </div>

               
               
              </section>
              <section id='section-2'>
                <h4 className='mt-3 view-detail-heading'>Itinerary Schedule</h4>
                <button
                  className={`accordion  ${activeIndex === 0 ? 'active' : ''}`}
                  onClick={() => show(0)}
                >
                  {Itinerarydetail[0].Itinerary_title}:{' '}
                  {Itinerarydetail[0].Itinerary_content}
                </button>
                <div className='panel'>
                  <p>{Itinerarydetail[0].Itinerary_city}</p>
                </div>
                {Itinerarydetailmore.map((item, index) => (
                  <div key={index}>
                    <button
                      className={`accordion  ${
                        activeIndex === index + 1 ? 'active' : ''
                      }`}
                      onClick={() => show(index + 1)}
                    >
                      {item.more_Itinerary_title} : {item.more_Itinerary_city}
                    </button>
                    <div class='panel'>
                      <p>{item.more_Itinerary_content}</p>
                    </div>
                  </div>
                ))}
              </section>

              <section id='section-3'>
                <h4 className='view-detail-heading mb-2'>Flight Details</h4>
                <FlightDetail />
                {/* <div class='row'>
                <div class='col-md-6 mt-3'>
                  <h6 className='text-center'>Departure - Egypt Air</h6>

                  <div class='row'>
                    <div class='col-md-5'>
                      <div class='item-thumb'>
                        <div class='image-thumb text-center'>
                          <img src={departureplan} alt='' />
                        </div>
                      </div>
                    </div>
                    <div class='col-md-7 flight-text-center'>
                      <h6 className='flight-detail-text'>
                        12:00 <span>→</span> 20:30
                      </h6>

                      <h6 style={{ fontSize: '.8em' }}>
                        Wednesday,29,March,2023{' '}
                      </h6>
                    </div>

                    <div class='col-md-12 mt-4 text-center'>
                      <ul class='cs-bar_list'>
                        <li>
                          <b class='cs-primary_color'>
                            <i class='fa-solid fa-plane-departure'>
                              <FontAwesomeIcon icon={faPlaneDeparture} />
                            </i>{' '}
                          </b>
                          <span class='time'>12:00</span>
                          <span> Heathrow Airport (LHR),</span>
                        </li>

                        <li class='mt-1'>
                          <b class='cs-primary_color'>
                            <i class='fa-solid fa-plane-arrival'>
                              <FontAwesomeIcon icon={faPlaneArrival} />
                            </i>{' '}
                          </b>
                          <span class='time'>20:30</span>
                          <span> Luchthaven Riyad (RUH)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class='col-md-6 mt-3'>
                  <h6 className='text-center'>Return - Egypt Air</h6>
                  <div class='row'>
                    <div class='col-md-5'>
                      <div class='item-thumb'>
                        <div class='image-thumb text-center'>
                          <img src={landingplan} alt='' />
                        </div>
                      </div>
                    </div>
                    <div class='col-md-7 flight-text-center'>
                      <h6 className='flight-detail-text'>
                        12:00 <span>→</span> 20:15
                      </h6>

                      <h6 style={{ fontSize: '.8em' }}>
                        Monday,10,April,2023{' '}
                      </h6>
                    </div>

                    <div class='col-md-12 mt-4 text-center'>
                      <ul class='cs-bar_list'>
                        <li>
                          <b class='cs-primary_color'>
                            <i class='fa-solid fa-plane-departure'>
                              <FontAwesomeIcon icon={faPlaneDeparture} />
                            </i>{' '}
                          </b>
                          <span class='time'>12:00</span>
                          <span> Luchthaven Riyad (RUH),</span>
                        </li>

                        <li class='mt-1'>
                          <b class='cs-primary_color'>
                            <i class='fa-solid fa-plane-arrival'>
                              <FontAwesomeIcon icon={faPlaneArrival} />
                            </i>{' '}
                          </b>
                          <span class='time'>20:15</span>
                          <span> Heathrow Airport (LHR),</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div> */}
              </section>

              <section id='section-4' className='hotel-detail-padding'>
                {accomodationdetail.map((item, index) => {
                  const hotels = accomodationdetailmore.filter(
                    x => x.more_hotel_city.toUpperCase() === item.hotel_city_name.toUpperCase()
                  )

                  return (
                    <div key={index} class='hotel-details-top'>
                      <h4 className='view-detail-heading mt-1 pt-1'>
                        {item.hotel_city_name} Hotel Details
                      </h4>
                      <div class='row mt-4'>
                        <div class='col-sm-12 col-md-6'>
                          <img
                            src={
                              url +
                              '/public/uploads/package_imgs/' +
                              item.accomodation_image[0]
                            }
                            alt=''
                          />
                        </div>
                        <div class='col-sm-12 col-md-6'>
                          <h5 className='inc-excl'>{item.acc_hotel_name}</h5>
                          <ul>
                            <li className='mt-1'>
                              <i class='fa-solid fa-bed'>
                                <FontAwesomeIcon icon={faBed} />
                              </i>{' '}
                              Room Type: {item.acc_type}
                              {hotels.map((a, index) => (
                                <span key={index}>/{a.more_acc_type} </span>
                              ))}
                              <span></span>
                            </li>
                            <li className='mt-1'>
                              {' '}
                              <i class='fa-solid fa-bed'>
                                <FontAwesomeIcon icon={faCalendarCheck} />
                              </i>{' '}
                              Check In : {moment(item.acc_check_in).format('DD-MM-YYYY')}
                            </li>
                            <li className='mt-1'>
                              {' '}
                              <i class='fa-solid fa-bed'>
                                <FontAwesomeIcon icon={faCalendarMinus} />
                              </i>{' '}
                              Check Out : {moment(item.acc_check_out).format('DD-MM-YYYY')}
                            </li>
                            <li className='mt-1'>
                              {' '}
                              <i class='fa-solid fa-bed'>
                                <FontAwesomeIcon icon={faMoon} />
                              </i>{' '}
                              No Of Nights : {item.acc_no_of_nightst}
                            </li>
                          </ul>
                          <h5>Room Amenities </h5>
                          <p>{item.hotel_whats_included}</p>
                        </div>
                                
                      </div>
                    </div>
                  )
                })}
              </section>
              <section id='section-5'>
                <h4 className='view-detail-heading '>Transfer Details</h4>
                <div className='row mt-5'>
                  <div className='col-sm-6 col-md-4 text-center'>
                    <div class='image-thumb'>
                      <img
                        src={busimage}
                        alt=''
                        height='100'
                      />
                    </div>
                    <div class='tr-vehicle-name'>
                      <span>
                        Vehicle:{' '}
                        {transportationdetail[0].transportation_vehicle_type}
                      </span>
                      <h3>
                        {transportationdetail[0].transportation_total_Time}
                      </h3>
                    </div>
                  </div>
                  <div className='col-sm-6 col-md-4  item-from'>
                    <div class=''>
                      <h3 className='tc' style={{ fontSize: '1.1rem' }}>
                        Pickup Location
                      </h3>
                      <h6 style={{ fontSize: '1rem' }}>
                        {
                          transportationdetail[0]
                            .transportation_pick_up_location
                        }
                      </h6>
                      <h6 style={{ fontSize: '.8rem' }}>
                        Pickup Date :{' '}
                        {moment(
                          transportationdetail[0].transportation_pick_up_date
                        ).format('DD-MM-YYYY')}{' '}
                      </h6>
                      <h6 style={{ fontSize: '.8rem' }}>
                        Pickup Date :{' '}
                        {moment(
                          transportationdetail[0].transportation_pick_up_date
                        ).format('LT')}{' '}
                      </h6>
                    </div>
                  </div>
               
                  <div className='col-sm-6 col-md-4  item-from'>
                    <div class=''>
                      <h3 className='tc' style={{ fontSize: '1.1rem' }}>
                        Drop off Location
                      </h3>
                      <h6 style={{ fontSize: '1rem' }}>
                        {
                          transportationdetail[0]
                            .transportation_drop_off_location
                        }
                      </h6>
                      <h6 style={{ fontSize: '.8rem' }}>
                        Drop off Date :{' '}
                        {moment(
                          transportationdetail[0].transportation_drop_of_date
                        ).format('DD-MM-YYYY')}{' '}
                      </h6>
                      <h6 style={{ fontSize: '.8rem' }}>
                        Drop off Time :{' '}
                        {moment(
                          transportationdetail[0].transportation_drop_of_date
                        ).format('LT')}{' '}
                      </h6>
                    </div>
                  </div>
                </div>
                {transportationdetailmore.map((item, index) => (
                  <div
                    key={index}
                    className='row  mt-4'
                    style={{ borderTop: '2px solid #8080804d' }}
                  >
                    <div className='col-sm-6 col-md-4 text-center'>
                    <div class='image-thumb'>
                      <img
                        src={busimage}
                        alt=''
                        height='100'
                      />
                    </div>
                      <div class='tr-vehicle-name'>
                        <span>
                          Vehicle:{' '}
                          {transportationdetail[0].transportation_vehicle_type}
                        </span>
                        <h3>{item.more_transportation_total_Time}</h3>
                      </div>
                    </div>
                    <div className='col-sm-6 col-md-4  item-from'>
                      <div class=''>
                        <h3 className='tc' style={{ fontSize: '1.1rem' }}>
                          Pickup Location
                        </h3>
                        <h6 style={{ fontSize: '1rem' }}>
                          {item.more_transportation_pick_up_location}
                        </h6>
                        <h6 style={{ fontSize: '.8rem' }}>
                          Pickup Date :{' '}
                          {moment(item.more_transportation_pick_up_date).format(
                            'DD-MM-YYYY'
                          )}{' '}
                        </h6>
                        <h6 style={{ fontSize: '.8rem' }}>
                          Pickup Date :{' '}
                          {moment(item.more_transportation_pick_up_date).format(
                            'LT'
                          )}{' '}
                        </h6>
                      </div>
                    </div>
                    
                    <div className='col-sm-6 col-md-4  item-from'>
                      <div class=''>
                        <h3 className='tc' style={{ fontSize: '1.1rem' }}>
                          Drop off Location
                        </h3>
                        <h6 style={{ fontSize: '1rem' }}>
                          {item.more_transportation_drop_off_location}
                        </h6>
                        <h6 style={{ fontSize: '.8rem' }}>
                          Drop off Date :{' '}
                          {moment(item.more_transportation_drop_of_date).format(
                            'DD-MM-YYYY'
                          )}{' '}
                        </h6>
                        <h6 style={{ fontSize: '.8rem' }}>
                          Drop off Time :{' '}
                          {moment(item.more_transportation_drop_of_date).format(
                            'LT'
                          )}{' '}
                        </h6>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
              <section id='section-6'>
                <h4 className='view-detail-heading '>Visa Details</h4>
                <div className='row mt-5'>
                  <div className='col-sm-6 col-4 col-md-4 text-center'>
                    <div class='image-thumb'>
                      <img
                        src={
                          url +
                          '/public/uploads/package_imgs/' +
                          tourDetail.tours.visa_image
                        }
                        alt=''
                        height='100'
                      />
                    </div>
                  </div>
                  <div className='col-sm-6 col-8 col-md-4 text-center item-from'>
                    <div class=''>
                      <h6 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                        Visa Type
                      </h6>
                      <h6 style={{ fontSize: '1rem', color: 'gray' }}>
                        {tourDetail.tours.visa_type}
                      </h6>
                    </div>
                  </div>
                  <div className='col-sm-12 col-8 col-md-4 text-justify item-from'>
                    <h6 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                      Visa Requirements
                    </h6>
                    <h6 style={{ fontSize: '.8rem', color: 'gray' }}>
                      {/* {tourDetail.tours.visa_detials} */}
                    </h6>
                  </div>
                </div>
              </section>
              <Faqs />
            </div>
            <div className='col-md-4 '>
              {/* <div className='hotel-checkout-shadow mt-5'>
                <div className='lead-passenger-detail'>
                  <div className='flight-heading invoice-heading'>
                    <h5>Contact Information</h5>
                  </div>
                  <div className='text-center'>
                    <h6>Feel free to contact us any time.</h6>
                  </div>
                </div>
              </div> */}
              <div className='theiaStickySidebar'>
              <div className=' book-package-2'>
                <h6>Package Information</h6>
                <table class='ticket-price gradient-green mt-2'>
                  <thead>
                    <tr className='text-center ticket-size'>
                      <th class='adult p-2'>
                        <span>Double Price</span>
                      </th>
                      <th class='adult tr-border'>
                        <span>Triple Price</span>
                      </th>

                      <th class='kid'>
                        <span>Quad Price</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr className='text-center table-border'>
                      <td class='adult'>
                        <span class='amount double fw-bold'>
                          {tourDetail.tours.currency_symbol}{' '}
                          {tourDetail.tours.double_grand_total_amount}
                        </span>
                      </td>
                      <td class='adult tr-border'>
                        <span class='amount fw-bold'>
                        {tourDetail.tours.currency_symbol}{' '}
                          {tourDetail.tours.triple_grand_total_amount}
                        </span>
                      </td>
                      <td class='kid'>
                        <span class='amount fw-bold'>
                        {tourDetail.tours.currency_symbol}{' '}
                          {tourDetail.tours.quad_grand_total_amount}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class='row package-info'>
                  {/* <div class='product-email mt-4'>
                    <button className='btn select-styling search-btn1 detail-view-btn'>
                      Send Email Inquiry
                    </button>
                  </div> */}
                  <div class='col-6 '>
                    <div class='item'>
                      <h6> Departure Date</h6>
                      <p>
                       
                          <FontAwesomeIcon icon={faCalendar} />
                          {" "}
                        {moment(tourDetail.tours.start_date).format(
                          'DD-MM-YYYY'
                        )}
                      </p>
                    </div>
                  </div>
                  <div class='col-6  '>
                    <div class='item'>
                      <h6> Return Date</h6>

                      <p>
                        
                          <FontAwesomeIcon icon={faCalendar} />
                          {" "}
                        {moment(tourDetail.tours.end_date).format('DD-MM-YYYY')}
                      </p>
                    </div>
                  </div>
                  <div class='col-6  '>
                    <div class='item'>
                      <h6>Time length</h6>
                      <p>
                       
                       
                          <FontAwesomeIcon icon={faMoon} />
                          {" "}
                        {tourDetail.tours.time_duration} Nights
                      </p>
                    </div>
                  </div>
                  <div class='col-6 '>
                    <div class='item'>
                      <h6>Category</h6>
                      <p>
                       
                          <FontAwesomeIcon icon={faClipboardCheck} />
                          {" "}
                          Package
                      </p>
                    </div>
                  </div>
                  <div class='col-6  '>
                    <div class='item'>
                      <h6>Transport included</h6>
                      <p>
                        
                          <FontAwesomeIcon icon={faBus} />
                       {" "}
                        {transportationdetail[0].transportation_vehicle_type}
                      </p>
                    </div>
                  </div>
                  <div class='col-6'>
                    <div class='item'>
                      <h6>Destinations</h6>
                      <p title='Makkah, Madina'>
                        
                        
                          <FontAwesomeIcon icon={faBuildingCircleCheck} />
                          {" "}
                        {tourlocation.map((location, index) => (
                          <span key={index}>
                            {location},
                            {index !== tourlocation.length - 1 ? ' ' : ''}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                  <div class='col-12 col-md-12 col-sm-12 gap-2 d-flex mt-4'>
                    <button onClick={toggleModal2} className='btn select-styling detail-view-btn search-btn1'>
                      Cancellation Policy ?
                    </button>
                    <button className='btn select-styling detail-view-btn search-btn1'>
                    Send Email Inquiry
                    </button>
                  </div>
                </div>
              </div>
             
                <div className='book-now text-center cart-btn'>
              <NavLink to='/book_package'>
              <button
                class='btn select-styling search-btn1 mt-2 detail-view-btn'
              >
                Add to Cart
              </button>
              </NavLink>
              </div>
              
              </div>
            </div>
          </div>
        </div>
      </Layout>
      <Modal isOpen={cancelModal} toggle={toggleModal2}>
        <ModalHeader toggle={toggleModal2}> Cancellation Policy</ModalHeader>
        <ModalBody>
          <div className='form-group'>
           <p>{tourDetail.tours.cancellation_policy}</p>
          </div>
        </ModalBody>
      </Modal>
      <div id="mybutton">
      <NavLink to='/book_package'>
      <button class="btn feedback  select-styling search-btn1 mt-2 detail-view-btn">Add to Cart</button>
      </NavLink>
      </div>
    </>
  )
}

export default ViewDeail
