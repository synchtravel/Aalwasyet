import React,{useEffect,useState} from 'react';
import Axios from 'axios';
import moment from 'moment';
import header from '../../Images/Pages/header.png'
import footer from '../../Images/Pages/footer.png'
import { ApiEndPoint,TransferCheckoutToken } from '../../Components/GlobalData/GlobalData';
function TransferInvoice(){
    var endpoint=ApiEndPoint();
    const [leadPassenger, setLeadPassenger] = useState([]);
    const [bookingInfo, setBookingInfo] = useState([]);
    const [TransferData, setTransferData] = useState([]);
    useEffect(()=>{
        invoicedata();
      },[]);


    const invoicedata=async()=>{
        var tkn=TransferCheckoutToken();
        const currentURL = window.location.href;
        const parts = currentURL.split('/');
       const lastPart = parts[parts.length - 1];
       var data={
        'token':tkn,
        'invoice_no':lastPart
        }
       
        try {
            const response = await Axios.post(
              endpoint+'/api/transfer_invoice_react',
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
            setBookingInfo(response.data.transfer_booking_data);
            setLeadPassenger(JSON.parse(response.data.transfer_booking_data.lead_passenger_data));
            setTransferData(JSON.parse(response.data.transfer_booking_data.transfer_data));
          } catch (error) {
            // Handle errors here
            console.error('Error:', error)
          }
      };
    return(
        <>
           <div class="container">
            <img src={header} />
            </div>
                    <div className='container mt-5'>
                        <div className='row mb-2'>
                            <div className='text-end'>
                            <button onClick={() => window.print()} class="btn select-styling search-btn1 set-page-ntm-width detail-view-btn btn-success">Print Voucher</button>            
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
                {/* <div class='float-left'>
                  <img src={bag} />
                </div> */}
                <div class='row'>
                  <div class='col-md-8 '>
                    <div class='v-heading-icon-title ms-3 float-left'>
                      <h3>Transfer Information</h3>
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
                    >{bookingInfo.invoice_no}</p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Booking Status:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{bookingInfo.booking_status}</p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Provider Name:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{TransferData.transfer_supplier}</p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Total Amount:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{bookingInfo.exchange_currency==='GBP' ? bookingInfo.currency:bookingInfo.exchange_currency} {bookingInfo.exchange_currency==='GBP' ?bookingInfo.transfer_total_price:bookingInfo.transfer_total_price_exchange}</p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Transfer Type:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{TransferData.transfer_type}</p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Date:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{moment(bookingInfo.departure_date).format('DD-MM-YYYY')}</p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Vehicle Name:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{TransferData.vehicle_Name}</p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Pickup Location:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{TransferData.pickup_City}</p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Dropof Location:</span>
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    >{TransferData.dropof_City}</p>
                  </li>
                </ul>
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
                {Object.keys(leadPassenger).length > 0 ? (

                <ul className='list-items list-items-3 list-items-4  clearfix'>
                      <li>
                        <span class='text-black fw-bold'>Full Name:</span>
                        <p
                          class='f-20 text-black fw-bold'
                          id='makkah_booking_status'
                        >{leadPassenger.lead_title+' '+leadPassenger.lead_first_name+' ' + leadPassenger.lead_last_name+' ' }</p>
                      </li>
                      <li>
                        <span class='text-black fw-bold'>Date of Birth:</span>
                      
                        <p
                          class='f-20 text-black fw-bold'
                          id='makkah_booking_status'
                        >{moment(leadPassenger.lead_date_of_birth).format('DD-MM-YYYY')}</p>
                      </li>
                      <li>
                        <span class='text-black fw-bold'>Phone Number:</span>
                      
                        <p
                          class='f-20 text-black fw-bold'
                          id='makkah_booking_status'
                        >{leadPassenger.lead_phone }</p>
                      </li>
                      <li>
                        <span class='text-black fw-bold'>Email:</span>
                       
                        <p
                          class='f-20 text-black fw-bold'
                          id='makkah_booking_status'
                        >{leadPassenger.lead_email}</p>
                      </li>
                      </ul>
                 ) : (
                  <div>Loading...</div>
                )}
                </div>
              </div>
            </div>
            {/* <div className='hotel-checkout-shadow mt-5'>
              <div className='lead-passenger-detail'>
                <div className='flight-heading invoice-heading'>
                  <h5>Payment Information</h5>
                </div>
                <div className='row mt-2 '>
                  <div className='c mt-2 mb-2 text-center '>
                    <h4 className=' ms-2'>Total: {bookingInfo.currency} {bookingInfo.currency==='GBP' ?bookingInfo.transfer_total_price:bookingInfo.transfer_total_price_exchange}</h4>
                  </div>
                </div>
              </div>
            </div> */}
            <div className='hotel-checkout-shadow mt-2'>
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

                    <div class="container">
        <img src={footer} />
        </div>
        </>
    )
};

export default TransferInvoice;