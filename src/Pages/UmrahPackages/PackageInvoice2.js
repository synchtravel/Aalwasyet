import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import header from '../../Images/Pages/header.png'
import footer from '../../Images/Pages/footer.png'
import { useLocation} from 'react-router-dom'
import { Hotelapitoken,ApiEndPoint } from '../../Components/GlobalData/GlobalData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBed,
  faCalendar,
  faCircle,
  faDownload,
  faPlane,
  faPlaneArrival,
  faPlaneDeparture,
  faPrint,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
function PackageInvoice2 () {
  const location = useLocation()
  var endpoint=ApiEndPoint();
  const state = location.state
  const [tourData, setTourData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [cartTotalData, setCartTotalData] = useState([]);
  const [bookingDetail, setBookingDetail] = useState([]);
  const [leadPassenger, setLeadPassenger] = useState([]);
  const [flightDetail, setFlightDetail] = useState([]);
  const [returnFlightDetail, setReturnFlightDetail] = useState([]);
  const [accomodationdetail, setAccomodationdetail] = useState([]);

  useEffect(() => {
    invoicedata();
  }, []);
  const invoicedata = async () => {
    
    var tkn = Hotelapitoken()
    if(state===null){
      const currentURL = window.location.href;
      const parts = currentURL.split('/');
     const tid = parts[parts.length - 1];
     const tid2 = parts[parts.length - 2];
     const id = parts[parts.length - 3];

     var data = {
      token: tkn,
      booking_id: id,
      booking_id1: tid2,
      T_ID: tid
    }
  } else{
      var data = {
        token: tkn,
        booking_id: state.id,
        booking_id1: state.id2,
        T_ID: state.tid
      }
     }
    
    try {
      const response = await Axios.post(
        endpoint+'/api/invoice_package_data_react',
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
     
      setCartData(response.data.cart_data[0]);
      setTourData(response.data.tours_data[0]);
      setCartTotalData(JSON.parse(response.data.cart_data[0].cart_total_data));
      setBookingDetail(response.data.booking_ID);
      setFlightDetail(JSON.parse(response.data.tours_data[0].flights_details))
      setReturnFlightDetail(JSON.parse(response.data.tours_data[0].return_flights_details))
      setLeadPassenger(JSON.parse(response.data.booking_ID.passenger_detail ));
      setAccomodationdetail(JSON.parse(response.data.tours_data[0].accomodation_details ));
      // navigation(`/package_invoice/${id}`);
    } catch (error) {
      // Handle errors here
      console.error('Error:', error)
    }
  };
  return (
    <>
    <div style={{background:'#80808017'}}>
      <div className='cs-container'>
        <div className='cs-invoice cs-style1'>
          <div className='cs-invoice_in'>
           <img src={header}/>
            <div className='row'>
              <div className='col-md-6'>
                <div className="invoice-t">
                  <div className='text-style01'>INVOICE NO:</div>{' '}
                  <div className='text-style02'>{cartData.invoice_no}</div>
                </div>
              </div>
              <div className='col-md-6 text-end'>
              <div className="invoice-t">
                  <div className='text-style01'> Package Name:</div>{' '}
                  <div className='text-style02'>{tourData.title}</div>
                </div>
             
              </div>
            </div>
            <div className='row mt-2'>
            <div className='col-md-6'>
            <h4>{cartData.confirm === 1 ? "Confirm" : "Tentative"}</h4>
            <h5>{tourData.time_duration} Days</h5>
            <h5>Booked By: {bookingDetail.passenger_name}</h5>
            <h5>{moment(bookingDetail.created_at).format('LL')}</h5>
            </div>
            {/* {cartTotalData.length > 0 ? (
              <div className='col-md-6'>
                <h4>{cartData.confirm === 1 ? "Confirm" : "Tentative"}</h4>
                <h5>{tourData.time_duration} Days</h5>
                <h5>Booked By: {cartTotalData.agent_name !== null && cartTotalData.agent_name !== '' && cartTotalData.agent_name !== -1 ? (
  <h5>P name</h5>
) : (
  (cartTotalData.agent_info !== false ? <h5>a name</h5> :<h5>P name</h5>)
)}</h5>
                <h5>September, 30, 2023</h5>
              </div>
              ) : (
                    <div>Loading...</div>
                  )} */}
              <div className='col-md-6 item-from '>
                <ul class='cs-bar_list'>
                  <li>
                   
                    <b class='cs-primary_color'>
                      <FontAwesomeIcon icon={faPlaneDeparture} />{' '}
                    </b>
                    {moment(tourData.start_date).format('LLLL')}{' '}
                  </li>
                  <li>
                  
                    <b class='cs-primary_color'>
                      <FontAwesomeIcon icon={faPlaneArrival} />
                    </b>
                    {moment(tourData.end_date).format('LLLL')}{' '}
                  </li>
                </ul>
              </div>
            </div>
            <div className='row mt-2'>
              <h5>  <span className='userfont30'><FontAwesomeIcon icon={faUser} /> </span> Adults</h5>
              {leadPassenger.length > 0 ? (
              <h5>Lead Passenger : {leadPassenger[0].name} {leadPassenger[0].lname} ({leadPassenger[0].gender})</h5>
              ) : (
                <div>Loading...</div>
              )}
              </div>
             
            <div className='row hotel-checkout-shadow mt-5'>
              <div class='flight-heading2 invoice-heading text-start'>
                <h4>
                  <FontAwesomeIcon icon={faBed} /> Accomodation Details
                </h4>
              </div>
                 {accomodationdetail.map((item,index)=>(
              <div key={index}>
              <h5 className='mt-2'>Hotel Name :{item.acc_hotel_name}</h5>
              <div className='row mt-2 mb-2'>
                <div className='col-md-6'>
                  <h6>
                    <span>
                      <FontAwesomeIcon icon={faCalendar} />
                    </span>{' '}
                    Check In: {item.acc_check_in}
                  </h6>
                </div>
                <div className='col-md-6'>
                  <h6>
                    <span>
                      <FontAwesomeIcon icon={faCalendar} />
                    </span>{' '}
                    Check Out: {item.acc_check_out}
                  </h6>
                </div>
              </div>
              </div>
              ))}
            </div>
            
              {flightDetail.length > 0 ? (
            <div className='row justify-content-center hotel-checkout-shadow mt-5'>
              <div class='flight-heading2 invoice-heading text-start'>
                <h4>
                  <FontAwesomeIcon icon={faPlane} /> Departure Details ({flightDetail[0].departure_flight_route_type})
                </h4>
              </div>
              <div className='row mt-2 mb-2'>
                <div className='col-md-6'>
                  <h6>
                    <span>
                      <FontAwesomeIcon icon={faPlane} />
                    </span>{' '}
                    {flightDetail[0].departure_airport_code}
                  </h6>
                </div>
                <div className='col-md-6 text-end'>
                  <h6>
                    <span>
                      <FontAwesomeIcon icon={faPlane} />
                    </span>{' '}
                    {flightDetail[0].arrival_airport_code}
                  </h6>
                </div>
                <div className='row mt-3'>
                  <div className='col-sm-6 col-md-3 text-center item-from'>
                    <div>
                      <h6 style={{ fontSize: '1rem' }}>Type</h6>

                      <h6 style={{ fontSize: '.8rem' }}> </h6>
                      <h3 style={{ fontSize: '.9rem' }}>{flightDetail[0].departure_flight_route_type}</h3>
                      <h6 style={{ fontSize: '.8rem' }}> </h6>
                    </div>
                  </div>
                  <div className='col-sm-6 col-md-3 text-center item-from'>
                    <div class=''>
                      <h3 style={{ fontSize: '1rem' }}>Departure</h3>
                      <h6 style={{ fontSize: '1rem' }}></h6>
                      <h6 style={{ fontSize: '.8rem' }}>{flightDetail[0].departure_airport_code}</h6>
                      <h6 style={{ fontSize: '.8rem' }}> {flightDetail[0].departure_time}</h6>
                    </div>
                  </div>
                  <div className='col-sm-6 col-md-3 text-center item-from'>
                    <div class=''>
                      <h3 style={{ fontSize: '1rem' }}>Arrival</h3>
                      <h6 style={{ fontSize: '1rem' }}></h6>

                      <h6 style={{ fontSize: '.8rem' }}>{flightDetail[0].arrival_airport_code}</h6>
                      <h6 style={{ fontSize: '.8rem' }}>{flightDetail[0].arrival_time}</h6>
                    </div>
                  </div>
                  <div className='col-sm-6 col-md-3 text-center item-from'>
                    <div class=''>
                      <h3 style={{ fontSize: '1rem' }}>Airline Name</h3>
                      <h6 style={{ fontSize: '1rem' }}></h6>

                      <h6 style={{ fontSize: '.8rem' }}>{flightDetail[0].other_Airline_Name2}</h6>
                      <h6 style={{ fontSize: '.8rem' }}>({flightDetail[0].departure_flight_number})</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
             ) : (
              <div>Loading...</div>
            )}
               {returnFlightDetail.length > 0 ? (
            <div className='row justify-content-center hotel-checkout-shadow mt-5'>
              <div class='flight-heading2 invoice-heading text-start'>
                <h4>
                  <FontAwesomeIcon icon={faPlane} /> Return Details ({returnFlightDetail[0].return_flight_route_type})
                </h4>
              </div>
              <div className='row mt-2 mb-2'>
                <div className='col-md-6'>
                  <h6>
                    <span>
                      <FontAwesomeIcon icon={faPlane} />
                    </span>{' '}
                    {returnFlightDetail[0].return_departure_airport_code}
                  </h6>
                </div>
                <div className='col-md-6 text-end'>
                  <h6>
                    <span>
                      <FontAwesomeIcon icon={faPlane} />
                    </span>{' '}
                    {returnFlightDetail[0].return_arrival_airport_code}
                  </h6>
                </div>
                <div className='row mt-3'>
                  <div className='col-sm-6 col-md-3 text-center item-from'>
                    <div>
                      <h6 style={{ fontSize: '1rem' }}>Type</h6>

                      <h6 style={{ fontSize: '.8rem' }}> </h6>
                      <h3 style={{ fontSize: '.9rem' }}>{returnFlightDetail[0].return_flight_route_type}</h3>
                      <h6 style={{ fontSize: '.8rem' }}> </h6>
                    </div>
                  </div>
                  <div className='col-sm-6 col-md-3 text-center item-from'>
                    <div class=''>
                      <h3 style={{ fontSize: '1rem' }}>Departure</h3>
                      <h6 style={{ fontSize: '1rem' }}></h6>
                      <h6 style={{ fontSize: '.8rem' }}>{returnFlightDetail[0].return_departure_airport_code}</h6>
                      <h6 style={{ fontSize: '.8rem' }}> {returnFlightDetail[0].return_departure_time}</h6>
                    </div>
                  </div>
                  <div className='col-sm-6 col-md-3 text-center item-from'>
                    <div class=''>
                      <h3 style={{ fontSize: '1rem' }}>Arrival</h3>
                      <h6 style={{ fontSize: '1rem' }}></h6>

                      <h6 style={{ fontSize: '.8rem' }}>{returnFlightDetail[0].return_arrival_airport_code}</h6>
                      <h6 style={{ fontSize: '.8rem' }}>{returnFlightDetail[0].return_arrival_time}</h6>
                    </div>
                  </div>
                  <div className='col-sm-6 col-md-3 text-center item-from'>
                    <div class=''>
                      <h3 style={{ fontSize: '1rem' }}>Airline Name</h3>
                      <h6 style={{ fontSize: '1rem' }}></h6>

                      <h6 style={{ fontSize: '.8rem' }}>{returnFlightDetail[0].return_other_Airline_Name2}</h6>
                      <h6 style={{ fontSize: '.8rem' }}>({returnFlightDetail[0].return_departure_flight_number})</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
             ) : (
              <div>Loading...</div>
            )}
            <div className='row justify-content-center hotel-checkout-shadow mt-5'>
              <div class='flight-heading2 invoice-heading text-start'>
                <h4>Other Detail</h4>
              </div>
              <div className='row mt-2 mb-2'>
                <div className='row mt-3'>
                  <div className='col-sm-6 col-md-4  item-from'>
                    <div>
                      <h6 style={{ fontSize: '1rem' }}>Room</h6>
                      <h6 style={{ fontSize: '.8rem' }}> </h6>
                      {cartTotalData.double_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>Double Rooms X {cartTotalData.double_rooms}</h3>
                      )}
                       {cartTotalData.triple_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>Triple Rooms X {cartTotalData.triple_rooms}</h3>
                      )}
                       {cartTotalData.quad_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>Quad Rooms X {cartTotalData.quad_rooms }</h3>
                      )}
                      <h6 style={{ fontSize: '.8rem' }}> </h6>
                    </div>
                  </div>
                  <div className='col-sm-6 col-md-4  item-from'>
                    <div class=''>
                      <h3 style={{ fontSize: '1rem' }}>No of Pax</h3>
                      <h6 style={{ fontSize: '1rem' }}></h6>
                      {cartTotalData.double_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>{cartTotalData.double_adults} Adults</h3>
                      )}
                       {cartTotalData.triple_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>{cartTotalData.triple_adults} Adults</h3>
                      )}
                       {cartTotalData.quad_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>{cartTotalData.quad_adults} Adults</h3>
                      )}
                      <h6 style={{ fontSize: '.8rem' }}></h6>
                    </div>
                  </div>
                  <div className='col-sm-6 col-md-4  item-from'>
                    <div class=''>
                      <h3 style={{ fontSize: '1rem' }}>Price</h3>
                      <h6 style={{ fontSize: '1rem' }}></h6>
                      {cartTotalData.double_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>{cartTotalData.currency} {cartTotalData.double_adult_total}</h3>
                      )}
                       {cartTotalData.triple_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>{cartTotalData.currency} {cartTotalData.triple_adult_total}</h3>
                      )}
                       {cartTotalData.quad_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>{cartTotalData.currency} {cartTotalData.quad_adult_total }</h3>
                      )}
                      <h6 style={{ fontSize: '.8rem' }}></h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className='package_inv_hr' />
              <div className='row mt-2 mb-2'>
                <div className='row mt-3'>
                  <div className='col-sm-2 col-md-3  item-from'>
                    <div>
                      <h6 style={{ fontSize: '1rem' }}>Room</h6>
                      <h6 style={{ fontSize: '.8rem' }}> </h6>
                      {cartTotalData.double_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>Adults in Double Room </h3>
                      )}
                       {cartTotalData.triple_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>Adults in Triple Room </h3>
                      )}
                       {cartTotalData.quad_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>Adults in Quad Room </h3>
                      )}
                      <h6 style={{ fontSize: '.8rem' }}> </h6>
                    </div>
                  </div>
                  <div className='col-sm-2 col-md-2  item-from'>
                    <div class=''>
                      <h3 style={{ fontSize: '1rem' }}>No of Pax</h3>
                      <h6 style={{ fontSize: '1rem' }}></h6>
                      {cartTotalData.double_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>{cartTotalData.double_adults} Adults</h3>
                      )}
                       {cartTotalData.triple_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>{cartTotalData.triple_adults} Adults</h3>
                      )}
                       {cartTotalData.quad_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>{cartTotalData.quad_adults} Adults</h3>
                      )}
                      <h6 style={{ fontSize: '.8rem' }}></h6>
                    </div>
                  </div>
                  <div className='col-sm-2 col-md-3  item-from'>
                    <div class=''>
                      <h3 style={{ fontSize: '1rem' }}>Price Per Person</h3>
                      <h6 style={{ fontSize: '1rem' }}></h6>
                      {cartTotalData.double_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>{cartTotalData.currency} {cartTotalData.sharing2}</h3>
                      )}
                       {cartTotalData.triple_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>{cartTotalData.currency} {cartTotalData.sharing3}</h3>
                      )}
                       {cartTotalData.quad_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>{cartTotalData.currency} {cartTotalData.sharing4}</h3>
                      )}
                      <h6 style={{ fontSize: '.8rem' }}></h6>
                    </div>
                  </div>
                  <div className='col-sm-2 col-md-2  item-from'>
                    <div class=''>
                      <h3 style={{ fontSize: '1rem' }}>Discount</h3>
                      <h6 style={{ fontSize: '1rem' }}></h6>
                      {cartTotalData.double_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>{cartTotalData.currency} {cartTotalData.double_adult_disc}</h3>
                   
                      )}
                          {cartTotalData.triple_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>{cartTotalData.currency} {cartTotalData.triple_adult_disc                      }</h3>
                     
                      )}
                       {cartTotalData.quad_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>{cartTotalData.currency} {cartTotalData.quad_adult_disc    }</h3>
                      )}
                     
                      <h6 style={{ fontSize: '.8rem' }}></h6>
                    </div>
                  </div>
                  <div className='col-sm-2 col-md-2 text-center item-from'>
                    <div class=''>
                      <h3 style={{ fontSize: '1rem' }}>Total</h3>
                      <h6 style={{ fontSize: '1rem' }}></h6>
                      {cartTotalData.double_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>{cartTotalData.currency} {cartTotalData.double_adult_total}</h3>
                      )}
                       {cartTotalData.triple_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>{cartTotalData.currency} {cartTotalData.triple_adult_total}</h3>
                      )}
                       {cartTotalData.quad_adults && (
                      <h3 style={{ fontSize: '.9rem' }}>{cartTotalData.currency} {cartTotalData.quad_adult_total
                      }</h3>
                      )}                      <h6 style={{ fontSize: '.8rem' }}></h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className='package_inv_hr' />
              <div className='row p-3 text-end'>
                    <h5 className='m-2'>Package Price :	{cartTotalData.currency} {cartTotalData.price_without_disc}</h5>
                    <h5 className='m-2'>Discount Price :	{cartTotalData.currency} {cartTotalData.discount_Price}</h5>
                    <h5 className='m-2'>Total Amount :	{cartTotalData.currency} {cartTotalData.price}</h5>
              </div>
             </div>
             <div className='inv-btn text-center mt-4'>
              <button className='btn btn-secondary'><FontAwesomeIcon icon={faPrint}/> Print</button>
              <button className='btn btn-success'><FontAwesomeIcon icon={faDownload}/> Download</button>
              <button className='btn btn-info'>Send Email</button>
             </div>
            
             
              <img src={footer}/>
            
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default PackageInvoice2
