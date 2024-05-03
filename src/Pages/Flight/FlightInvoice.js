import React,{useEffect,useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FlightSearchToken,ApiEndPoint } from '../../Components/GlobalData/GlobalData';
import {
    faCheckCircle,
  faClock,
  faClockFour,
  faInfoCircle,
  faPlane
} from '@fortawesome/free-solid-svg-icons'
import { useLocation } from 'react-router-dom';
import Loading from '../../Components/Loading/Loader';
import moment from 'moment'
import { AirLineNames } from '../../Components/Data/AirLineNames';
import Axios from 'axios';
import img4 from '../../Components/Data/airline.png'
function FlightInvoice () {
    let AdultAmount=0;
    let ChildAmount=0;
    let InfantAmount=0;
    let Currency='';
    let SubTotal=0;
    var endpoint=ApiEndPoint();
    var Airlinenamesdata=AirLineNames;
    const location = useLocation();
    const state = location.state;
    const [invoiceData, setInvoiceData] = useState([]);
    const [passengerDetail, setPassengerDetail] = useState([]);
    const [faresDetail, setFaresDetail] = useState([]);
    const [BookingDetail, setBookingDetail] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
        invoicedata();
      },[]);

      const invoicedata=async()=>{
        const currentURL = window.location.href;
        const parts = currentURL.split('/');
       const lastPart = parts[parts.length - 1];
        var tkn=FlightSearchToken();
        var data={
            'token_authorization':tkn,
            'invoice_no':lastPart
        };
        setIsLoading(true);
        try {
            const response = await Axios.post(
              endpoint+'/api/flight_invoice_new_Live',
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
            setBookingDetail(response.data.booking_data);
            setInvoiceData(response.data.result_view_reservation.Data.TripDetailsResult);
            setFaresDetail(response.data.result_view_reservation.Data.TripDetailsResult.TravelItinerary.TripDetailsPTC_FareBreakdowns);
         setPassengerDetail(response.data.result_view_reservation.Data.TripDetailsResult.TravelItinerary.PassengerInfos);
         setIsLoading(false);
        } catch (error) {
            // Handle errors here
            setIsLoading(false);
            console.error('Error:', error)
          };
      };
     
  return (
    <>
     {isLoading && (<Loading/>)}
      <div class='container'>
        <img
          style={{ width: '100%' }}
          src='https://system.alhijaztours.net/public/admin_package/frontend/images/vochure-header.png'
          alt='letterhead'
        />
      </div>
      <div className='container mt-5'>
        <div className='row mb-2'>
          <div className='text-end'>
            <button
              onClick={() => window.print()}
              class='btn select-styling search-btn2  m-1  detail-view-btn'
            >
              Print Invoice
            </button>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-8 '>
            <div className='hotel-checkout-shadow mb-4'>
              <div className=''>
              {invoiceData && invoiceData.TravelItinerary ? (
      <div className='flight-heading invoice-heading'>
        <h5>MFRef: {invoiceData.TravelItinerary.MFRef}</h5>
      </div>
    ) : (
      <p>Loading data...</p>
    )}
              </div>
              <div class='v-heading-icon clearfix mt-3'>
                <div class='float-left'>
                  {/* <img src='https://demo.alhijaztours.net/public/admin_package/frontend/images/tour-info.jpg' /> */}
                </div>
                <div class='row'>
                  <div class='col-md-8 '>
                    <div class='v-heading-icon-title ms-2 float-left'>
                      <h3>Flight Information</h3>
                    </div>
                  </div>
                  <div class='col-md-4'></div>
                </div>
                <div className='row mt-5'>
                  <div className='col-md-6 text-center'>
                  {invoiceData && invoiceData.TravelItinerary ? (
                    <h5> Flight Type : {invoiceData.TravelItinerary.TripType }</h5>
                    ) : (
                        <p>Loading data...</p>
                      )}
                  </div>
                  <div className='col-md-6 text-center'>
                  {invoiceData && invoiceData.TravelItinerary ? (
                    <h5> Flight Status : {invoiceData.TravelItinerary.BookingStatus }</h5>
                    ) : (
                        <p>Loading data...</p>
                      )}
                  </div>
                </div>
                {invoiceData && invoiceData.TravelItinerary ? (
                <div className='row ms-1 me-1 mt-4'>
                    {invoiceData.TravelItinerary.Itineraries[0].ItineraryInfo.ReservationItems.map((item,index)=>(
                 <div key={index} className=' mb-4'>
                    <div className='row  pt-0'>
                      <div className='d-flex'  style={{ background: 'aliceblue',justifyContent:'space-between' }}>
                        <h5 className='card-title m-2'>
                        {Airlinenamesdata[item.OperatingAirlineCode].AirLineName} ({item.CabinClassType})
                        </h5>
                        <h5 style={{color:'cadetblue'}} className='card-title m-2'>Flight Number : {item.FlightNumber}</h5>
                      </div>
                      <div className='col-md-2 item-from'>
                        <div className=''>
                          <div style={{ backgroundImage: `url(${img4})` }} className={`image-cover_airline logo-margin bg-${item.OperatingAirlineCode}`}></div>
                        </div>
                      </div>

                      <div
                        className='col-md-10'
                        style={{ marginTop: 'auto', marginBottom: 'auto' }}
                      >
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
                                  {moment(item.DepartureDateTime).format('LT')}<span> ({item.DepartureAirportLocationCode})</span>
                                  </h4>
                                  <h4 class='center fl-width text-center'>
                                    <FontAwesomeIcon
                                      color='gray'
                                      icon={faClockFour}
                                    />{' '}
                                    {/* {moment(flight.ArrivalDateTime).diff(moment(flight.DepartureDateTime), 'hours')}h{' '}
                            {moment(flight.ArrivalDateTime).diff(moment(flight.DepartureDateTime), 'minutes') % 60}m */}
                                    {Math.floor(item.JourneyDuration / 60)}h{' '}
                           {item.JourneyDuration % 60}m
                                  </h4>
                                  <h4 class='right fl-width text-end'>
                                  {moment(item.ArrivalDateTime).format('LT')}<span> ({item.ArrivalAirportLocationCode})</span>
                                  </h4>
                                </div>
                                <div class='fl-route-direction'>
                                  <div class='fl-route-bar'></div>
                                  <div class='fl-icon'>
                                    <FontAwesomeIcon icon={faPlane} />
                                  </div>
                                </div>
                                <div class='fl-route-detail mt-2'>
                                  <p class='left' style={{ fontSize: '.9em' }}>
                                    {' '}
                                    {moment(item.DepartureDateTime).format('dddd')}<br />
                                    {moment(item.DepartureDateTime).format('ll')}
                                  </p>
                                  <p
                                    class='center text-center'
                                    style={{ fontSize: '.9em' }}
                                  >
                                    {item.StopQuantity === 0 ? "Non-stop" : item.StopQuantity+"Stop"}
                                  </p>
                                  <p
                                    class='right text-end'
                                    style={{ fontSize: '.9em' }}
                                  >
                                  {moment(item.ArrivalDateTime).format('dddd')} <br />
                                   {moment(item.ArrivalDateTime).format('ll')}
                                  </p>
                                  
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                    ))}
                  
                </div>
                 ) : (
                    <p>Loading data...</p>
                  )}
                <div class='row'>
                  <div class='col-md-8 '>
                    <div class='v-heading-icon-title  ms-2 float-left'>
                      <h3>Cancellation Policy</h3>
                    </div>
                  </div>
                  <div class='col-md-4'></div>
                </div>
                {invoiceData && invoiceData.TravelItinerary ? (
                <div className='m-2'>
                  {/* <h4>Adults</h4>
                  <h6>USD 210.4 will be deducted upon cancellation 3 hours before Departure.</h6> */}
                  {faresDetail.map((item1, index) => (
                    <div key={index} className='m-2'>
                    {item1.PassengerTypeQuantity.Code==='ADT' && (
                        <div>
                     <h4>Adults</h4>
                     {item1.AirRefundCharges.RefundCharges.map((x,index)=>(
                      <div key={index}>
                          {x.ChargesBeforeDeparture.map((y,index)=>(
                            <div key={index}>
                          <h6 > <span><FontAwesomeIcon icon={faCheckCircle}/></span> {x.Currency} {y.Charges} will be deducted upon cancellation {y.HoursBeforeDeparture} hours before Departure.</h6>
                            </div>
                          ))}
                     </div>
                     ))}
                     </div>
                     )}
                     {item1.PassengerTypeQuantity.Code==='CHD' && (
                        <div>
                     <h4>Child</h4>
                     {item1.AirRefundCharges.RefundCharges.map((x,index)=>(
                      <div key={index}>
                          {x.ChargesBeforeDeparture.map((y,index)=>(
                            <div key={index}>
                          <h6 > <span><FontAwesomeIcon icon={faCheckCircle}/></span> {x.Currency} {y.Charges} will be deducted upon cancellation {y.HoursBeforeDeparture} hours before Departure.</h6>
                            </div>
                          ))}
                     </div>
                     ))}
                     </div>
                     )}
                     {item1.PassengerTypeQuantity.Code==='INF' && (
                        <div>
                     <h4>Infant</h4>
                     {item1.AirRefundCharges.RefundCharges.map((x,index)=>(
                      <div key={index}>
                          {x.ChargesBeforeDeparture.map((y,index)=>(
                            <div key={index}>
                          <h6 > <span><FontAwesomeIcon icon={faCheckCircle}/></span> {x.Currency} {y.Charges} will be deducted upon cancellation {y.HoursBeforeDeparture} hours before Departure.</h6>
                            </div>
                          ))}
                     </div>
                     ))}
                     </div>
                     )}
                  {/* <li  className='mt-2'>
                            {item1.PassengerTypeQuantity.Code==='CHD' && (
                             <div style={{display:'contents'}}>
                           <span>Child Price :</span>  <span>{item1.TripDetailsPassengerFare.TotalFare.CurrencyCode} {ChildAmount=item1.TripDetailsPassengerFare.TotalFare.Amount}</span>
                           </div>
                         
                           )}
                           {item1.PassengerTypeQuantity.Code==='INF' && (
                             <div style={{display:'contents'}}>
                           <span>Infant Price :</span>  <span>{item1.TripDetailsPassengerFare.TotalFare.CurrencyCode} {InfantAmount=item1.TripDetailsPassengerFare.TotalFare.Amount}</span>
                           </div>
                         
                           )}
                          
                         </li> */}
                  </div>
                       
                          ))}
                </div>
                ) : (
                    <p>Loading data...</p>
                  )}
              </div>

              {/* {rooms.map((item, index) => ( */}
              <div className='p-2'>
                <div className='row '>
                  <div className='col-sm-6 col-md-4 text-center'>
                    <div class='border01'>
                      <h6 style={{ fontSize: '1rem' }}></h6>
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
                {invoiceData && invoiceData.TravelItinerary ? (
                  <ul className='list-items list-items-3 list-items-4  clearfix'>
                    <li>
                      <span class='text-black '>Full Name:</span>
                      {/* {leadPassenger.lead_title+leadPassenger.lead_first_name+" "+leadPassenger.lead_last_name} */}
                     
                      <p
                        class='f-20 text-black '
                        id='makkah_booking_status'
                      >
                        {passengerDetail[0].Passenger.PaxName.PassengerTitle+' '+passengerDetail[0].Passenger.PaxName.PassengerFirstName+' '+passengerDetail[0].Passenger.PaxName.PassengerLastName}
                      </p>
                       
                    </li>
                    <li>
                      <span class='text-black '>Gender:</span>
                      {/* {leadPassenger.lead_phone} */}
                      <p
                        class='f-20 text-black '
                        id='makkah_booking_status'
                      >
                        {passengerDetail[0].Passenger.Gender === 'M' ? "Male" : "Female"}
                      </p>
                    </li>
                    <li>
                      <span class='text-black '>Phone Number:</span>
                      {/* {leadPassenger.lead_email} */}
                      <p
                        class='f-20 text-black '
                        id='makkah_booking_status'
                      >
                      {passengerDetail[0].Passenger.PhoneNumber}
                      </p>
                    </li>
                    <li>
                      <span class='text-black '>Email:</span>
                      {/* {leadPassenger.lead_email} */}
                      <p
                        class='f-20 text-black '
                        id='makkah_booking_status'
                      >
                        {passengerDetail[0].Passenger.EmailAddress}
                      </p>
                    </li>
                    <li>
                      <span class='text-black '>Date Of Birth:</span>
                      {/* {leadPassenger.lead_email} */}
                      <p
                        class='f-20 text-black '
                        id='makkah_booking_status'
                      >
                         {moment(passengerDetail[0].Passenger.DateOfBirth).format('DD-MM-YYYY')}
                      </p>
                    </li>
                    <li>
                      <span class='text-black '>Passport:</span>
                      {/* {leadPassenger.lead_email} */}
                      <p
                        class='f-20 text-black '
                        id='makkah_booking_status'
                      >
                        {passengerDetail[0].Passenger.PassportNumber}
                      </p>
                    </li>
                    {/* <li>
                      <span class='text-black '>Number:</span>
                      {leadPassenger.lead_email}
                      <p
                        class='f-20 text-black '
                        id='makkah_booking_status'
                      >
                        
                      </p>
                    </li> */}
                    <li>
                      <span class='text-black '>Nationality:</span>
                      {/* {leadPassenger.lead_email} */}
                      <p
                        class='f-20 text-black '
                        id='makkah_booking_status'
                      >
                       {passengerDetail[0].Passenger.PassengerNationality}

                      </p>
                    </li>
                  </ul>
                  ) : (
                    <p>Loading data...</p>
                  )}
                  {/* ) : (
                  <div>Loading...</div>
                )} */}
                </div>
              </div>
            </div>
            <div className='hotel-checkout-shadow mt-4'>
              <div className='lead-passenger-detail'>
                {/* <div className='flight-heading invoice-heading'>
                  <h5>Other Passenger Detail</h5>
                </div> */}
                <div className=' mt-2 '>
                    
                  {/* <table class='table'>
                    <thead>
                      <tr>
                        <th>First</th>
                        <th>Last</th>
                        <th>Handle</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                      </tr>
                      <tr>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                      </tr>
                      <tr>
                        <td>Larry</td>
                        <td>the Bird</td>
                        <td>@twitter</td>
                      </tr>
                    </tbody>
                  </table> */}
                  {/* ) : (
                  <div>Loading...</div>
                )} */}
                </div>
              </div>
            </div>
            <div className='hotel-checkout-shadow mt-4'>
              <div className='lead-passenger-detail'>
                <div className='flight-heading invoice-heading'>
                  <h5>Payment</h5>
                </div>
                <div className='row mt-2 '>
                {invoiceData && invoiceData.TravelItinerary ? (
                  <ul className='list-items list-items-3 list-items-4  clearfix'>

                        <li className='mt-2'>
                         {Number(BookingDetail.adult_price_markup) > 0 && (
                             <div style={{display:'contents'}}>
                           <span>Adult Price :</span>  <span>{Currency=BookingDetail.currency} { AdultAmount = Number(BookingDetail.adult_price_markup).toFixed(2)}</span>
                           </div>
                         
                           )}
                            {Number(BookingDetail.child_price_markup) > 0 && (
                             <div style={{display:'contents'}}>
                           <span>Child Price :</span>  <span>{BookingDetail.currency} {ChildAmount=Number(BookingDetail.child_price_markup).toFixed(2)}</span>
                           </div>
                         
                           )}
                           {Number(BookingDetail.infant_price_markup) > 0 && (
                             <div style={{display:'contents'}}>
                           <span>Infant Price :</span>  <span>{BookingDetail.currency} {InfantAmount=Number(BookingDetail.infant_price_markup).toFixed(2)}</span>
                           </div>
                         
                           )}
                          
                         </li>
                         
                          <li  className='mt-2'>
                           <span>SubTotal :</span>  <span>{BookingDetail.currency} {SubTotal= Number(AdultAmount)+Number(ChildAmount)+Number(InfantAmount)}</span>
                            </li>
                           <li  className='mt-2'>
                           <span>Tax :</span>  <span>0% </span>
                            </li>
                            <li  className='mt-2'>
                           <span>Pay Amount :</span>  <span> {BookingDetail.currency} {SubTotal}</span>
                            </li>
                  </ul>
                  ) : (
                    <p>Loading data...</p>
                  )}
                  {/* ) : (
                  <div>Loading...</div>
                )} */}
                </div>

              </div>
            </div>
            <div className='hotel-checkout-shadow mt-4'>
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
                    <p className=' ms-2'>0121 777 2522</p>
                  </div>
                  <div className='col-md-4 col-sm-4 col-4 mt-2 invoice-lead-gest'>
                    <h6 className=' ms-2'>Email:</h6>
                  </div>
                  <div className='col-md-8 col-sm-8 col-8 mt-2'>
                    <p className=' ms-2'> info@alhijaztours.net</p>
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
      <div class='container'>
        <img
          src='https://system.alhijaztours.net/public/admin_package/frontend/images/vochure-footer.png'
          alt='letterhead'
        />
      </div>
    </>
  )
}
export default FlightInvoice
