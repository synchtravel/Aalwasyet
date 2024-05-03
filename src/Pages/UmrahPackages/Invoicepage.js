import React,{useEffect,useState} from 'react';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Hotelapitoken,ApiEndPoint } from '../../Components/GlobalData/GlobalData';
import {
  faCheck,
  faPlaneArrival,
  faPlaneDeparture,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import Loading from '../../Components/Loading/Loader';
import bag from '../../Images/Logo/tour-info.jpg'
import header from '../../Images/Pages/header.png'
import footer from '../../Images/Pages/footer.png'
import { useLocation,useNavigate } from 'react-router-dom';
function InvoicePage(){
  var endpoint=ApiEndPoint();
  const [cartData, setCartData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [cartTotalData, setCartTotalData] = useState([]);
  const [InvoiceData, setInvoiceData] = useState([]);
  const [leadPassenger, setLeadPassenger] = useState([]);
  const [tourData, setTourData] = useState([]);
  const [flightDetail, setFlightDetail] = useState([]);
  const [returnFlightDetail, setReturnFlightDetail] = useState([]);
  const [accomdationDetail, setAccomdationDetail] = useState([]);
  const [accomdationDetailMore, setAccomdationDetailMore] = useState([]);
const navigate=useNavigate();
  const location = useLocation();
  const state = location.state;
  useEffect(()=>{
    invoicedata();
  },[]);
  const invoicedata=async()=>{
    var tkn=Hotelapitoken();
   if(state===null){
    const currentURL = window.location.href;
    const parts = currentURL.split('/');
   const lastPart = parts[parts.length - 1];
   var data={
    'token':tkn,
    'booking_id':lastPart
}
   }else{
    var data={
      'token':tkn,
      'booking_id':state.id
  }
   }
   setLoading(true);
   
    try {
        const response = await Axios.post(
          endpoint+'/api/invoice_data_react',
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
        setCartData(response.data.cart_data);
        var totaldata=JSON.parse(response.data.cart_data[0].cart_total_data)
       setCartTotalData(totaldata);
       setInvoiceData(response.data.inv_details)
       setLeadPassenger(JSON.parse(response.data.inv_details.passenger_detail))
       setTourData(response.data.tour_data)
       setAccomdationDetail(JSON.parse(response.data.tour_data[0].accomodation_details))
       setFlightDetail(JSON.parse(response.data.tour_data[0].flights_details))
       setAccomdationDetail(JSON.parse(response.data.tour_data[0].accomodation_details))
       setReturnFlightDetail(JSON.parse(response.data.tour_data[0].return_flights_details))
       setLoading(false);
        // navigation(`/package_invoice/${id}`);
       
      } catch (error) {
        setLoading(false);
        // Handle errors here
        console.error('Error:', error)
      }
  };
 const Printinvoice =()=>{
  navigate(`/invoice_package/${InvoiceData.invoice_no}/${InvoiceData.id}/${cartData[0].tour_id}`, {
    state: { id:InvoiceData.invoice_no , id2: InvoiceData.id, tid: cartData[0].tour_id    }
  });
 };


    return(
        <>
        {isLoading && (<Loading/>)}
        <div class="container">
           <img src={header}/>
        </div>
        <div className='container mt-5'>
          <div className='row mb-2'> 
            <div className='text-end'>
            <button onClick={() => window.print()} class="btn select-styling search-btn2  m-1  detail-view-btn">Print Voucher</button>            
            <button onClick={() => Printinvoice()} class="btn select-styling search-btn2 m-1 detail-view-btn">Print Invoice</button>            
            <button class="btn select-styling  search-btn2 m-1  detail-view-btn">Make Payment</button>            
            </div>
          </div>
        <div className='row'>
          <div className='col-md-8 '>
            <div className='hotel-checkout-shadow mb-4'>
              <div className=''>
                <div className='flight-heading invoice-heading'>
                  <h4>Package Details</h4>
                </div>
              </div>
              <div class='v-heading-icon clearfix mt-3'>
                
                <div class='row'>
                  <div class='col-md-12 '>
                    <div class='v-heading-icon-title float-left'>
                      <h3>Tour Information</h3>
                    </div>
                  </div>
                 
                </div>
              </div>
              <div className='clearfix v-section-info'>
                <ul className='list-items list-items-3 list-items-4  clearfix'>
                  <li>
                    <span class='text-black fw-bold'>Inovice No:</span>
                    {/* {hoteldetail2.hotel_name} */}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{InvoiceData.invoice_no}</p>
                  </li>
                  <li>
                    {/* <span class='text-black fw-bold'>Hotel City:</span>
                    {hoteldetail2.destinationName} */}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    ></p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Tour Name:</span>
                    {/* {hoteldetail2.destinationName} */}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{cartTotalData.name }</p>
                  </li>
                  {cartTotalData.double_rooms !=='' && (
                  <li>
                    <span class='text-black fw-bold'>Double Rooms X {cartTotalData.double_rooms}:</span>
                    {/* {hoteldetail2.stars_rating} */}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{cartTotalData.double_adults} Adults</p>
                  </li>
                   )}
                    {cartTotalData.triple_rooms !=='' && (
                  <li>
                    <span class='text-black fw-bold'>Triple Rooms X {cartTotalData.triple_rooms}:</span>
                    {/* {hoteldetail2.stars_rating} */}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{cartTotalData.triple_adults} Adults</p>
                  </li>
                   )}
                    {cartTotalData.quad_rooms !=='' && (
                  <li>
                    <span class='text-black fw-bold'>Quad Rooms X {cartTotalData.triple_rooms}:</span>
                    {/* {hoteldetail2.stars_rating} */}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{cartTotalData.quad_adults } Adults</p>
                  </li>
                   )}
                  {tourData.length > 0 ? (
                    <div>
                  <li>
                    <span class='text-black fw-bold'>Check-In:</span>
                    {/* {hotelDetail.status} */}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{tourData[0].start_date}</p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>
                    Check-Out:
                    </span>
                    {/* {hotelDetail.reference_no} */}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{tourData[0].end_date}</p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Duration:</span>
                    {/* {hotel.creationDate} */}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{tourData[0].time_duration} Nights</p>
                  </li>
                  </div>
                  ) : (
                    <div>Loading...</div>
                  )}
                  <li>
                    <span class='text-black fw-bold'>Destinations:</span>
                    {/* {invoiceDetail.exchange_price} */}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    ></p>
                  </li>
                </ul>
              </div>
              <div class='v-heading-icon clearfix mt-3'>
              
                <div class='row'>
                  <div class='col-md-12'>
                    <div class='v-heading-icon-title float-left'>
                      <h3>Hotel Detail</h3>
                    </div>
                  </div>
                 
                </div>
              </div>
              {/* {rooms.map((item, index) => ( */}
                  <div  className='clearfix v-section-info'>
                    {accomdationDetail.map((item,index)=>(
                    <div key={index} className=' p-2 mb-2'>
                     <h6 className='packg-inv-hotel'>{item.acc_hotel_name}</h6>
                     <div className='row mt-2'>
                     <div className=' col-sm-3 col-6 col-md-4 col-lg-4 mt-1'>
                            <div class='single-tour-feature d-flex align-items-center mb-3'>
                              <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                                <i class='fas fa-check'>
                                  <FontAwesomeIcon icon={faCheck} />
                                </i>
                              </div>
                              <div class='single-feature-titles'>
                                <p
                                  style={{ fontSize: '13px' }}
                                  class='title fw-bold'
                                >
                                  Check in
                                </p>
                                <p
                                  className='mt-0'
                                  style={{ fontSize: '12px' }}
                                  class='title '
                                >
                                 {item.acc_check_in} 
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className=' col-sm-3 col-6 col-md-4 col-lg-4 mt-1'>
                            <div class='single-tour-feature d-flex align-items-center mb-3'>
                              <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                                <i class='fas fa-check'>
                                  <FontAwesomeIcon icon={faCheck} />
                                </i>
                              </div>
                              <div class='single-feature-titles'>
                                <p
                                  style={{ fontSize: '13px' }}
                                  class='title fw-bold'
                                >
                                  Check out
                                </p>
                                <p
                                  className='mt-0'
                                  style={{ fontSize: '12px' }}
                                  class='title '
                                >
                                 {item.acc_check_out} 
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className=' col-sm-3 col-6 col-md-4 col-lg-4 mt-1'>
                            <div class='single-tour-feature d-flex align-items-center mb-3'>
                              <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                                <i class='fas fa-check'>
                                  <FontAwesomeIcon icon={faCheck} />
                                </i>
                              </div>
                              <div class='single-feature-titles'>
                                <p
                                  style={{ fontSize: '13px' }}
                                  class='title fw-bold'
                                >
                                  Type
                                </p>
                                <p
                                  className='mt-0'
                                  style={{ fontSize: '12px' }}
                                  class='title '
                                >
                                 {item.hotel_type_cat} 
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className=' col-sm-3 col-6 col-md-4 col-lg-4 mt-1'>
                            <div class='single-tour-feature d-flex align-items-center mb-3'>
                              <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                                <i class='fas fa-check'>
                                  <FontAwesomeIcon icon={faCheck} />
                                </i>
                              </div>
                              <div class='single-feature-titles'>
                                <p
                                  style={{ fontSize: '13px' }}
                                  class='title fw-bold'
                                >
                                 No of Nights:
                                </p>
                                <p
                                  className='mt-0'
                                  style={{ fontSize: '12px' }}
                                  class='title '
                                >
                                 {item.acc_no_of_nightst} Nights
                                </p>
                              </div>
                            </div>
                          </div>
                     </div>
                    </div>
                     ))}
                  
                    {/* <div className='flight-heading mt-2'>
                      <h5>Room #</h5>
                    </div> */}
                   
                    <div class='v-heading-icon clearfix mt-3'>
                      {/* <div class='float-left'>
                <img src='https://demo.alhijaztours.net/public/admin_package/frontend/images/tour-info.jpg' />
              </div> */}
                      {/* <div class='row'>
                        <div class='col-md-8'>
                          <div class='v-heading-icon-title float-left'>
                            <h4 className='ms-2'>Cancellation Policy</h4>
                          </div>
                        </div>
                        <div class='col-md-4'></div>
                      </div> */}
                      {/* <table class='table'>
                        <thead>
                          <tr>
                            <th scope='col'>From</th>
                            <th scope='col'>Type</th>
                            <th scope='col'>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope='row'> </th>

                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table> */}
                    </div>
                  </div>
                  <div className='flight-heading invoice-heading mt-2'>
                      <h5>Flight Detail</h5>
                    </div>
                    {flightDetail.length > 0 ? (
                    <div className='p-2'>
                     <h4>Departure Detail</h4>
                     <div className='package-invoice23 mt-2'>
                     <h6 >{flightDetail[0].departure_airport_code} <FontAwesomeIcon icon={faPlaneDeparture}/> {flightDetail[0].arrival_airport_code} ({flightDetail[0].departure_flight_route_type})</h6>
                    <h6>Airline Name : <span style={{color:'cadetblue'}} className='fw-bold'>{flightDetail[0].other_Airline_Name2}</span></h6>
                    </div>
                    <div className='row mt-2'>
                  <div className='col-sm-6 col-md-4 text-center'>
                  <div class='border01'>
                      <h6 style={{ fontSize: '1rem' }}>
                        
                      </h6>
                    
                      <h6 style={{ fontSize: '.8rem' }}>
                      {flightDetail[0].other_Airline_Name2}{' '}
                       
                      </h6>
                      <h3 className='tc' style={{ fontSize: '1.1rem' }}>
                      {flightDetail[0].departure_flight_number}
                      </h3>
                      <h6 style={{ fontSize: '.8rem' }}>
                      {flightDetail[0].departure_flight_route_type}{' '}
                       
                      </h6>
                    </div>
                   
                  </div>
                  <div className='col-sm-6 col-md-4 text-center item-from'>
                    <div class=''>
                      <h3  style={{ fontSize: '1rem' }}>
                      <FontAwesomeIcon icon={faPlaneDeparture}/> {flightDetail[0].departure_airport_code}
                      </h3>
                      <h6 style={{ fontSize: '1rem' }}>
                       
                      </h6>
                      <h6 style={{ fontSize: '.8rem' }}>
                     {moment(flightDetail[0].departure_time).format('LTS')}{' '}
                       
                      </h6>
                      <h6 style={{ fontSize: '.8rem' }}>
                      {moment(flightDetail[0].departure_time).format('YYYY-MM-DD')}{' '}
{' '}
                      
                      </h6>
                    </div>
                  </div>
                  <div className='col-sm-6 col-md-4 text-center item-from'>
                    <div class=''>
                      <h3 style={{ fontSize: '1rem' }}>
                      <FontAwesomeIcon icon={faPlaneArrival}/> {flightDetail[0].arrival_airport_code}
                      </h3>
                      <h6 style={{ fontSize: '1rem' }}>
                      {moment(flightDetail[0].arrival_time).format('LTS')}
                      </h6>
                     
                      <h6 style={{ fontSize: '.8rem' }}>
                      {moment(flightDetail[0].arrival_time).format('YYYY-MM-DD')}{' '}
                       
                      </h6>
                    </div>
                  </div>
                </div>
                    </div>
                    ) : (
                      <div>Loading...</div>
                    )}
                     {returnFlightDetail.length > 0 ? (
                    <div className='p-2 mt-2'>
                     <h4>Return Detail</h4>
                     <div className='package-invoice23 mt-2'>
                     <h6 >{returnFlightDetail[0].return_departure_airport_code} <FontAwesomeIcon icon={faPlaneArrival}/> {returnFlightDetail[0].return_arrival_airport_code} ({returnFlightDetail[0].return_flight_route_type})</h6>
                    <h6>Airline Name : <span style={{color:'cadetblue'}} className='fw-bold'>{returnFlightDetail[0].return_other_Airline_Name2}</span> </h6>
                    </div>
                    <div className='row mt-2'>
                  <div className='col-sm-6 col-md-4 text-center'>
                  <div class='border01'>
                      <h6 style={{ fontSize: '1rem' }}>
                        
                      </h6>
                    
                      <h6 style={{ fontSize: '.8rem' }}>
                      {returnFlightDetail[0].return_other_Airline_Name2}{' '}
                       
                      </h6>
                      <h3 className='tc' style={{ fontSize: '1.1rem' }}>
                      {returnFlightDetail[0].return_departure_flight_number}
                      </h3>
                      <h6 style={{ fontSize: '.8rem' }}>
                      {returnFlightDetail[0].return_flight_route_type}{' '}
                       
                      </h6>
                    </div>
                   
                  </div>
                  <div className='col-sm-6 col-md-4 text-center item-from'>
                    <div class=''>
                      <h3  style={{ fontSize: '1rem' }}>
                      <FontAwesomeIcon icon={faPlaneDeparture}/> {returnFlightDetail[0].return_departure_airport_code}
                      </h3>
                      <h6 style={{ fontSize: '1rem' }}>
                       
                      </h6>
                      <h6 style={{ fontSize: '.8rem' }}>
                      {moment(returnFlightDetail[0].return_departure_time).format('LTS')}{' '}
                       
                      </h6>
                      <h6 style={{ fontSize: '.8rem' }}>
                      {moment(returnFlightDetail[0].return_departure_time).format('YYYY-MM-DD')}{' '}
                      
                      </h6>
                    </div>
                  </div>
                  <div className='col-sm-6 col-md-4 text-center item-from'>
                    <div class=''>
                      <h3 style={{ fontSize: '1rem' }}>
                      <FontAwesomeIcon icon={faPlaneArrival}/>  {returnFlightDetail[0].return_arrival_airport_code}
                      </h3>
                      <h6 style={{ fontSize: '1rem' }}>
                      {moment(returnFlightDetail[0].return_arrival_time).format('LTS')}{' '}

                      </h6>
                     
                      <h6 style={{ fontSize: '.8rem' }}>
                      {moment(returnFlightDetail[0].return_arrival_time).format('YYYY-MM-DD')}{' '}

                       
                      </h6>
                    </div>
                  </div>
                </div>
                    </div>
                      ) : (
                        <div>Loading...</div>
                      )}
                    <div className='flight-heading invoice-heading mt-2'>
                      <h5>Visa Detail</h5>
                    </div>
                    <div className='p-2'>
                    <div className='row '>
                  <div className='col-sm-6 col-md-4 text-center'>
                  <div class='border01'>
                      <h6 style={{ fontSize: '1rem' }}>
                        
                      </h6>
                    </div>
                   
                  </div>
                  <div className='col-sm-6 col-md-4 text-center item-from'>
                    <div class=''>
                      <h3  style={{ fontSize: '1rem' }}>
                        Visa Type
                      </h3>
                      <h6 style={{ fontSize: '1rem' }}>
                       
                      </h6>
                      {tourData.length > 0 &&(
                        <h6 style={{ fontSize: '.8rem' }}>
                        {tourData[0].visa_type}{' '}
                          
                        </h6>
                      )}
                     
                    </div>
                  </div>
                  <div className='col-sm-6 col-md-4 text-center item-from'>
                    <div class=''>
                      <h3 style={{ fontSize: '1rem' }}>
                      Visa Requirements                      </h3>
                      <h6 style={{ fontSize: '1rem' }}>
                     
                      </h6>
                    </div>
                  </div>
                </div>
                    </div>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='hotel-checkout-shadow'>
              <div className='lead-passenger-detail'>
                <div className='flight-heading invoice-heading'>
                  <h5>Lead Passenger Details</h5>
                </div>
                <div className='row mt-2 '>
                  <div className='col-4'>
                  <FontAwesomeIcon className='userfont' icon={faUser}/>    
                  </div>
                  <div className='col-8'>
                    
                  
                {leadPassenger.length > 0 ? (

                <ul className='list-items list-items-3 list-items-4  clearfix'>
                      <li>
                        <span class='text-black fw-bold'>Full Name:</span>
                        {/* {leadPassenger.lead_title+leadPassenger.lead_first_name+" "+leadPassenger.lead_last_name} */}
                        <p
                          class='f-20 text-black fw-bold'
                          id='makkah_booking_status'
                        >{leadPassenger[0].lead_title+' '+leadPassenger[0].name+' ' + leadPassenger[0].lname+' ' }</p>
                      </li>
                      <li>
                        <span class='text-black fw-bold'>Gender:</span>
                        {/* {leadPassenger.lead_phone} */}
                        <p
                          class='f-20 text-black fw-bold'
                          id='makkah_booking_status'
                        >{leadPassenger[0].gender}</p>
                      </li>
                      <li>
                        <span class='text-black fw-bold'>Phone Number:</span>
                        {/* {leadPassenger.lead_email} */}
                        <p
                          class='f-20 text-black fw-bold'
                          id='makkah_booking_status'
                        >{leadPassenger[0].phone }</p>
                      </li>
                      <li>
                        <span class='text-black fw-bold'>Email:</span>
                        {/* {leadPassenger.lead_email} */}
                        <p
                          class='f-20 text-black fw-bold'
                          id='makkah_booking_status'
                        >{leadPassenger[0].email}</p>
                      </li>
                      </ul>
                 ) : (
                  <div>Loading...</div>
                )}
                </div>

                </div>
              </div>
            </div>
            <div className='hotel-checkout-shadow mt-5'>
              <div className='lead-passenger-detail'>
                <div className='flight-heading invoice-heading'>
                  <h5>Contact Information</h5>
                </div>
                <div className='text-center'>
                  <h6>Feel free to contact us any time.</h6>
                </div>
                <div className='row mt-2 '>
                  <div className='col-md-4 col-4 col-sm-4 mt-2 invoice-lead-gest'>
                    <h6 className=' ms-2'>Phone:</h6>
                  </div>
                  <div className='col-md-8 col-sm-8 col-8 mt-2'>
                    <p className=' ms-2'>+966 50 978 6777</p>
                  </div>
                  <div className='col-md-4 col-sm-4 col-4 mt-2 invoice-lead-gest'>
                    <h6 className=' ms-2'>Email:</h6>
                  </div>
                  <div className='col-md-8 col-sm-8 col-8 mt-2'>
                    <p className=' ms-2'> info@Alwasyet.com</p>
                  </div>
                  <div className='col-md-4 col-sm-4 col-4 mt-2 invoice-lead-gest'>
                    <h6 className=' ms-2'>Address:</h6>
                  </div>
                  <div className='col-md-8 col-sm-8 col-8 mb-2 mt-2'>
                    <p className=' ms-2'>
                      1a Nansen Road Sparkhill Birmingham B11 4DR UK
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
      <img src={footer}/>
        </div>
        </>
    );
}
export default InvoicePage;