import React,{useEffect,useState} from 'react';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Hotelapitoken,ApiEndPoint } from '../../Components/GlobalData/GlobalData';
import {
  faCheck,
  faPlaneArrival,
  faPlaneDeparture
} from '@fortawesome/free-solid-svg-icons'
import header from '../../Images/Pages/header.png'
import footer from '../../Images/Pages/footer.png'
import bag from '../../Images/Logo/tour-info.jpg'
import moment from 'moment';
function ActivityInvoice(){
  const [leadPassenger, setLeadPassenger] = useState([]);
  const [tourData, setTourData] = useState([]);
  const [AdditionalService, setAdditionalService] = useState([]);
  const [cartTotalData, setCartTotalData] = useState([]);
  const [InvoiceData, setInvoiceData] = useState([]);

    var endpoint=ApiEndPoint();

    useEffect(()=>{
        invoicedata();
      },[]);

    const invoicedata=async()=>{
        var tkn=Hotelapitoken();
        const currentURL = window.location.href;
        const parts = currentURL.split('/');
       const lastPart = parts[parts.length - 1];
       var data={
        'token':tkn,
        'booking_id':lastPart
        }
       
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
        
            setCartTotalData(response.data?.cart_data[0]);
           setTourData(response.data.inv_details)
           setInvoiceData(response.data.tour_data[0])
           setLeadPassenger(JSON.parse(response.data.inv_details.passenger_detail))
           if(response.data?.cart_data[0].Additional_services_names !==''){
            setAdditionalService(JSON.parse(response.data?.cart_data[0].Additional_services_names));
           } 
          } catch (error) {
            // Handle errors here
            console.error('Error:', error)
          }
      };
      console.log(AdditionalService)
    return(
        <>
        <div class="container">
        <img src={header} />
                </div>
           <div className='container mt-5 mb-5'>
          <div className='row mb-2'>
            <div className='text-end'>
            <button onClick={() => window.print()} class="btn select-styling search-btn2  m-1  detail-view-btn">Print Voucher</button>            
            </div>
          </div>
            <div className='row'>
              <div className='col-md-8 '>
              <div className='hotel-checkout-shadow mb-4'>
              <div className=''>
                <div className='flight-heading invoice-heading'>
                  <h4>Detail</h4>
                </div>
              </div>
              <div class='v-heading-icon clearfix mt-3'>
               
                <div class='row'>
                  <div class='col-md-8 '>
                    <div class='v-heading-icon-title float-left'>
                      <h3>Tour Information</h3>
                    </div>
                  </div>
                  <div class='col-md-4'></div>
                </div>
              </div>
              <div className='clearfix v-section-info'>
              <ul className='list-items list-items-3 list-items-4  clearfix'>
                  <li>
                    <span class='text-black fw-bold'>Inovice No:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{tourData.invoice_no }</p>
                  </li>
                  <li>
                    
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    ></p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Tour Name:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{cartTotalData.tour_name}</p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Adults:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{cartTotalData.adults}</p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Adults Price:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{cartTotalData.adult_price}</p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Child Price:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{cartTotalData.child_price}</p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Check In:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{cartTotalData.activity_select_date}</p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Duration:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{InvoiceData.duration} hours</p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Destination:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{InvoiceData.location}</p>
                  </li>
                 
                </ul>
              </div>
              {AdditionalService.length !==0 && (
              <div class='v-heading-icon clearfix mt-3'>
                {/* <div class='float-left'>
                  <img src={bag} />
                </div> */}
                <div class='row'>
                      <div class='col-md-8 '>
                      <div class='v-heading-icon-title float-left'>
                        <h3>Additional Services</h3>
                      </div>
                    </div>
                  <div class='col-md-4'></div>
                </div>
              </div>
              )}
              {AdditionalService?.map((item,index)=>(
                  <div key={index} className='clearfix v-section-info'>
                    <div className='text-center mt-3 p-1 bg-light'>
                      <h5>{item.service}</h5>
                    </div>
                    <ul className='list-items list-items-3 list-items-4  clearfix'>
                  <li>
                    <span class='text-black fw-bold'>Service Type:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{item.service_type}</p>
                  </li>
                  <li>
                    
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    ></p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Persons:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{item.person}</p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Total Price:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{item.total_price}</p>
                  </li>
                </ul>
                  </div>
                   ))}
                </div>
                
              </div>
              <div className='col-md-4'>
              <div className='hotel-checkout-shadow'>
              <div className='lead-passenger-detail'>
                <div className='flight-heading invoice-heading'>
                  <h5>Lead Passenger Details</h5>
                </div>
                <div className='row mt-2 '>
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
            <div className='hotel-checkout-shadow mt-5'>
              <div className='lead-passenger-detail'>
                <div className='flight-heading invoice-heading'>
                  <h5>Payment Information</h5>
                </div>
                <div className='row mt-2 '>
                  <div className='c mt-2 mb-2 text-center '>
                    <h4 className=' ms-2'>Total: {cartTotalData.currency} {cartTotalData.price}</h4>
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
          <img src={footer} />
        </div>
        </>
    );
}
export default ActivityInvoice;