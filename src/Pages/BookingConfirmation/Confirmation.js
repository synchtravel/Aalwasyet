import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Modal,ModalBody,ModalHeader,ModalFooter } from 'reactstrap'
import Axios from 'axios'
import moment from 'moment'
import header from '../../Images/Pages/header.png'
import footer from '../../Images/Pages/footer.png'
import Loading from '../../Components/Loading/Loader'
import { ToastContainer, toast } from 'react-toastify';
import { ApiEndPoint,Hotelapitoken } from '../../Components/GlobalData/GlobalData'
function Confirmation () {
  const { id } = useParams()
  var endpoint=ApiEndPoint();
  const [invoiceDetail, setInvoiceDetail] = useState([]);
  const [hotelDetail, setHotelDetail] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [hotel, setHotel] = useState([]);
  const [hoteldetail2, setHoteldetail2] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [leadPassenger, setLeadPassenger] = useState([]);
  const [roomPriceSums, setRoomPriceSums] = useState([]);
  const finalRoomPrices = [];

  useEffect(() => {
    getinvoicedetail();
  }, []);
  useEffect(() => {
    total();
  }, [rooms]);
  let Checkin = moment(hoteldetail2.checkIn)
  let checkout = moment(hoteldetail2.checkOut)
  let daysBetween = Math.abs(checkout.diff(Checkin, 'days'))
  const getinvoicedetail = async () => {
    setIsLoading(true);
    var invoiceno = {
      invoice_no: id
    }
    
    try {
      const response = await Axios.post(endpoint+
        '/api/hotels/view/reservation_Live',
        invoiceno,
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
      if (response.length !== '') {
        setIsLoading(false);
        var data = response.data.booking_data;
        setInvoiceNo(data.invoice_no);
        var lead=JSON.parse(data.lead_passenger_data);
        setLeadPassenger(lead);
        var hoteldata = JSON.parse(data.reservation_response);
        setHotelDetail(
          JSON.parse(response.data.booking_data.reservation_response)
        )
        setHoteldetail2(hoteldata.hotel_details);
        setRooms(hoteldata.hotel_details.rooms);
        setHotel(hoteldata);
        setInvoiceDetail(response.data.booking_data)
      }
      setIsLoading(false);
    } catch (error) {
      // Handle errors here
      setIsLoading(false);
      console.error('Error:', error)
    }
  };
  const printinvoice =()=>{
    window.print();
  };
  const total=()=>{
    
   let roomsprice=0;
   let markupprice=0;
   let adminmarkupprice=0;
   let clientmarkupprice=0;
   let finalpricemarkup=0;
   var length=rooms.length;
   for(var x=0;x<length;x++){
    roomsprice=Number(rooms[x].room_rates[0].net);
   finalpricemarkup=roomsprice;
   if(Number(hotel.admin_markup) !== 0)
   {
    if(hotel.admin_markup_type === "Percentage")
    {
      markupprice=( roomsprice * Number(hotel.admin_markup))/100;
    }else{
      markupprice= Number(hotel.admin_markup);
     }
      // adminmarkupprice=markupprice;
      finalpricemarkup +=markupprice
      
   }
   if(Number(hotel.customer_markup) !== 0)
   {
    if(hotel.customer_markup_type === "Percentage")
    {
      markupprice= (finalpricemarkup * Number(hotel.customer_markup))/100;
    }else{
      markupprice= Number(hotel.customer_markup);
     }
    //  clientmarkupprice=markupprice;
      finalpricemarkup +=markupprice;
      
   }
   finalRoomPrices.push(finalpricemarkup);
   setRoomPriceSums(finalRoomPrices);
   }
   
  };

  const toggleModal=()=>{
    setModalOpen(!modalOpen);
  };
  const BookingCancillation =async()=>{
    var apitoken=Hotelapitoken();
    setModalOpen(!modalOpen);
    var data={
      'token':apitoken,
      'invoice_no':invoiceNo
    };
    setIsLoading(true);
    try {
      const response = await Axios.post(endpoint+
        '/api/hotel/reservation/cancell/new_Live',
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
      var data=JSON.parse(response.data.view_reservation_details);
      if (data.error) {
           setIsLoading(false);
            toast.info(data.error.message, {
              position: toast.POSITION.TOP_RIGHT
            });
            
          }else{
            getinvoicedetail();
            toast.info('Your reservation has been cancelled', {
              position: toast.POSITION.TOP_RIGHT
            });
          }
    } catch (error) {
      // Handle errors here
      setIsLoading(false);
      console.error('Error:', error)
    }

  };
  return (
    <>
    {isLoading && (
      <Loading/>
    )}
    <ToastContainer/>
        <div class="container">
        <img src={header} />
        </div>
      <div className='container mt-5'>
        <div className='row'>
          <div className='col-md-8 '>
            <div className='hotel-checkout-shadow mb-4'>
              <div className=''>
                <div className='flight-heading invoice-heading'>
                  <h4>Detail</h4>
                </div>
              </div>
              <div class='v-heading-icon clearfix mt-3'>
                
               
                    <div class='v-heading-icon-title'>
                      <h3>Hotel Information</h3>
                    
                </div>
              </div>
              <div className='clearfix v-section-info'>
                <ul className='list-items list-items-3 list-items-4  clearfix'>
                  <li>
                    <span class='text-black fw-bold'>Hotel Name:</span>
                    {hoteldetail2.hotel_name}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    ></p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Hotel City:</span>
                    {hoteldetail2.destinationName}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    ></p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Hotel Address:</span>
                    {hoteldetail2.destinationName}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    ></p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Hotel Category:</span>
                    {hoteldetail2.stars_rating} Stars
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    ></p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Booking Status:</span>
                    {invoiceDetail.status}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    ></p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>
                      Booking Reference No:
                    </span>
                    {hotelDetail.reference_no}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    ></p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Booking Date:</span>
                    {hotel.creationDate}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    ></p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Hotel Price:</span>
                    {invoiceDetail.status =='Cancelled' ? '0' : invoiceDetail.exchange_price}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    ></p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Check-In:</span>
                    {hoteldetail2.checkIn}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    ></p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Check-Out:</span>
                    {hoteldetail2.checkOut}
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    ></p>
                  </li>
                  <li>
                    <span class='text-black fw-bold'>Duration:</span>
                    {daysBetween} Nights
                    <p
                      class='f-20 text-black fw-bold'
                      id='makkah_booking_status'
                    ></p>
                  </li>
                </ul>
              </div>
              <div class='v-heading-icon clearfix mt-3'>
               
               
                    <div class='v-heading-icon-title '>
                      <h3>Room Information</h3>
                   
                  <div class='col-md-4'></div>
                </div>
              </div>
              {rooms.map((item, index) => (
                  <div key={index}  className='clearfix v-section-info'>
                    <div className='flight-heading mt-2'>
                      <h5>Room #{index + 1}</h5>
                    </div>
                    <ul className='list-items list-items-3 list-items-4  clearfix'>
                      <li>
                        <span class='text-black fw-bold'>Room Name:</span>
                        {item.room_name}
                        <p
                          class='f-20 text-black fw-bold'
                          id='makkah_booking_status'
                        ></p>
                      </li>
                      <li>
                        <span class='text-black fw-bold'>Room code:</span>
                        {item.room_code}
                        <p
                          class='f-20 text-black fw-bold'
                          id='makkah_booking_status'
                        ></p>
                      </li>
                      <li>
                        <span class='text-black fw-bold'>Room Status:</span>
                        {invoiceDetail.status =='Cancelled' ? 'Cancelled' : item.room_stutus}
                        <p
                          class='f-20 text-black fw-bold'
                          id='makkah_booking_status'
                        ></p>
                      </li>
                      <li>
                        <span class='text-black fw-bold'>Room Price:</span>
                        {invoiceDetail.status =='Cancelled' ? '0' : roomPriceSums[index]}
                        <p
                          class='f-20 text-black fw-bold'
                          id='makkah_booking_status'
                        ></p>
                      </li>
                      <li>
                        <span class='text-black fw-bold'>Board Type:</span>
                        {item.room_rates[0].room_board}
                        <p
                          class='f-20 text-black fw-bold'
                          id='makkah_booking_status'
                        ></p>
                      </li>
                      <li>
                        <span class='text-black fw-bold'>Room Quantity:</span>
                        {item.room_rates[0].room_qty}
                        <p
                          class='f-20 text-black fw-bold'
                          id='makkah_booking_status'
                        ></p>
                      </li>
                      <li>
                        <span class='text-black fw-bold'>Passenger:</span>
                        {item.room_rates[0].adults} Adults,{' '}
                        {item.room_rates[0].children} Children
                        <p
                          class='f-20 text-black fw-bold'
                          id='makkah_booking_status'
                        ></p>
                      </li>
                    </ul>
                    <div class='v-heading-icon clearfix mt-3'>
                      {/* <div class='float-left'>
                <img src='https://demo.alhijaztours.net/public/admin_package/frontend/images/tour-info.jpg' />
              </div> */}
                      <div class='row'>
                        <div class='col-md-8'>
                          <div class='v-heading-icon-title float-left'>
                            <h4 className='ms-2'>Cancellation Policy</h4>
                          </div>
                        </div>
                        <div class='col-md-4'></div>
                      </div>
                      <table class='table'>
                        <thead>
                          <tr>
                            <th scope='col'>From</th>
                            <th scope='col'>Type</th>
                            <th scope='col'>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope='row'> {moment(item.room_rates[0].cancellation_policy[0]?.from_date).format('YYYY-MM-DD')}</th>

                            <td></td>
                            <td>{item.room_rates[0].cancellation_policy[0]?.amount}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  ))}
                
             
              <div className='text-center d-flex  ms-2'>
                <button onClick={toggleModal} className='btn mb-3 me-2 select-styling search-btn1 set-page-ntm-width detail-view-btn  btn-success'>
                  Cancellation
                </button>
                <button onClick={printinvoice} className='btn mb-3 select-styling search-btn1 set-page-ntm-width detail-view-btn btn-success'>
                  Print Invoice
                </button>
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
                <ul className='list-items list-items-3 list-items-4  clearfix'>
                      <li>
                        <span class='text-black fw-bold'>Full Name:</span>
                        {leadPassenger.lead_title+" "+leadPassenger.lead_first_name+" "+leadPassenger.lead_last_name}
                        <p
                          class='f-20 text-black fw-bold'
                          id='makkah_booking_status'
                        ></p>
                      </li>
                      <li>
                        <span class='text-black fw-bold'>Number:</span>
                        {leadPassenger.lead_phone}
                        <p
                          class='f-20 text-black fw-bold'
                          id='makkah_booking_status'
                        ></p>
                      </li>
                      <li>
                        <span class='text-black fw-bold'>Email:</span>
                        {leadPassenger.lead_email}
                        <p
                          class='f-20 text-black fw-bold'
                          id='makkah_booking_status'
                        ></p>
                      </li>
                      </ul>
                 
                </div>
              </div>
            </div>
            <div className='hotel-checkout-shadow mt-5'>
              <div className='lead-passenger-detail'>
                <div className='flight-heading invoice-heading'>
                  <h5>Grand Total</h5>
                </div>
                <div className=' row mt-2 text-center p-5 '>
                  <h4 className='fw-bold'>{invoiceDetail.selected_currency} {invoiceDetail.status =='Cancelled' ? '0.0' : invoiceDetail.exchange_price}</h4>
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
                    <h6 className=' ms-2'>Phone KSA: </h6>
                  </div>
                  <div className='col-md-8 col-sm-8 col-8 mt-2'>
                    <p className=' ms-2'>+966 50 978 6777</p>
                  </div>
                  <div className='col-md-4 col-4 col-sm-4 mt-2 invoice-lead-gest'>
                    <h6 className=' ms-2'>Phone UK: </h6>
                  </div>
                  <div className='col-md-8 col-sm-8 col-8 mt-2'>
                    <p className=' ms-2'>+44 7860 234313</p>
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
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          Confirmation 
        </ModalHeader>
        <ModalBody>
        <div className='form-group'>
            <h6>Are you sure you want to cancell this booking ?</h6>
          </div>
        </ModalBody>
        <ModalFooter>
        <button onClick={toggleModal} className='btn btn-secondary' >
            Close
          </button>
          <button
          onClick={BookingCancillation}
            className=' btn btn-danger '
          >
            Confirm
          </button>
        </ModalFooter>
        </Modal>
      <div class="container">
            <img src={footer}/>
        </div>
    </>
  )
}

export default Confirmation
