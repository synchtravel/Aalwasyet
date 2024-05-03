import React, { useEffect, useState } from 'react'
import bgimage from '../../Images/Pages/banner.jpg'
import Layout from '../../Components/Layout/Layout'
import { useStripe, useElements,CardNumberElement, CardExpiryElement, CardCvcElement} from '@stripe/react-stripe-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDays,
  faHeadset,
  faCancel,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons'
import { Stripe } from 'stripe';
import Axios from 'axios'
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify'
import {
  CustomerDomainName,
  ApiEndPoint,
  StripeClientSecret,
  ActivityToken
} from '../../Components/GlobalData/GlobalData';
import Loading from '../../Components/Loading/Loader';
import { useNavigate } from 'react-router-dom';
import { json } from 'react-router-dom';
var StripePayment=0;
var StripeCurrency='';
function ActivityCheckout () {
  const DomainURL = CustomerDomainName();
  const endpoint = ApiEndPoint();
  const token=ActivityToken();
  const navigation=useNavigate();
  var Secretkey=StripeClientSecret();
  const stripe = new Stripe(Secretkey);
  const elements = useElements();
  const stripeInstance = useStripe();
  const [error, setError] = useState(null);
  const AdditionalServices = JSON.parse(sessionStorage.getItem('AdditionalServices'));
  const ActivityDetail = JSON.parse(sessionStorage.getItem('ActivityDetail'))
  const ActivityData = JSON.parse(sessionStorage.getItem('ActivityData'))
const adultsCount1 = Number(ActivityData.adults);
 const childrenCount1 = Number(ActivityData.childs);
const childsArray = Array.from({ length: childrenCount1 });
  const adultsArray = Array.from({ length: adultsCount1 - 1 });
  const [countryList, setCountryList] = useState([])
  const [additionalServicesTotal, setAdditionalServicesTotal] = useState('')
  const [isLoading, setisLoading] = useState(false)
  const [showOtherData, setShowOtherData] = useState(false);
  const [adultsData, setAdultsData] = useState(
    Array(adultsCount1).fill({ type: 'adults' })
  );
  const [childrenData, setChildrenData] = useState(
    Array(childrenCount1).fill({ type: 'child' })
  );
  const [cardInfo, setCardInfo] = useState({
    name: '',
  });
  const [personData, setPersonData] = useState({
    title: '',
    fname: '',
    lname: '',
    email: '',
    dob: '',
    gender: '',
    nationality: '',
    phno: '',
    pasportno: '',
    pasportexpiry: ''
  });
  const handletitlechange = event => {
    setPersonData(prevdata => ({
      ...prevdata,
      title: event.target.value
    }))
  };
  const handlePayment = async () => {
    if(cardInfo.name===""){
      setError("Enter Card Holder Name.");
      return { success: false};
    };
    debugger
    const response = await stripe.paymentIntents.create({
      amount: Number(StripePayment)*100, // Amount in cents
      currency: 'GBP',
      description: 'Example payment',
      payment_method_types: ['card'],
    });

    var Client_Secret= response.client_secret;
    try {
      // Confirm the payment intent with the payment method
      const { paymentIntent, error } = await stripeInstance.confirmCardPayment(Client_Secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name:cardInfo.name,
          },
        },
      });

      if (error) {
         setError(error.message);
        console.error(error);
        return { success: false};
      } else {
        return { success: true,data:paymentIntent};
      }
    } catch (error) {
      console.error('Error:', error);
      return { success: false};
    }
  };

  const bookTour=async()=>{
    setisLoading(true);
      if(personData.title !==''&& personData.fname!=='' && personData.lname !=='' && personData.email !== '' && personData.phno !==''){
          var status=await handlePayment();
          if(status.success===false){
            setisLoading(false);
            return;
          };
  
          var LeadPassanger=[
            {
            "_token":token,
            "lead_title":personData.title,
            "name":personData.fname,
            "lname":personData.lname,
            "email":personData.email,
            "passengerType":"adults",
            "country":personData.nationality,
            "date_of_birth":personData.dob,
            "phone":personData.phno,
            "passport_lead":personData.pasportno,
            "passport_exp_lead":personData.pasportexpiry,
            "gender":personData.gender
         }
        ];
  
         var data2={
          "activtyId":ActivityDetail.id,
          "generate_id":ActivityDetail.generate_id,
          "name":ActivityDetail.title,
          "adults":ActivityData.adults,
          "children":ActivityData.childs,
          "activity_select_date":moment(ActivityData.date).format('DD-MM-YYYY'),
          "adult_price":ActivityData.adultPrice,
          "child_price":ActivityData.childrenPrice,
          "activity_total_price":StripePayment,
          "price":StripePayment,
          "total_service_price":0,
          "image":"",
          "currency":StripeCurrency,
          "pakage_type":"activity",
          "Additional_services_names_more":"null",
          "services_persons_more":"null",
          "services_price_more":"[]",
          "services_days_more":"[]",
          "services_dates_more":"[]",
          "cancellation_policy":ActivityDetail.cancellation_policy,
          "checkout_message":null,
          "agent_name":"-1",
          "customer_id":"11",
          "cost_price":ActivityDetail.cost_price
             }
         var cartdata=[];
          var x=[];
          x[0]=data2;
          cartdata[0]=x;
          cartdata[1]='activity';
          var data={
            'token':token,
            'request_data':JSON.stringify(LeadPassanger),
            'adults':adultsData.length > 1 ? JSON.stringify(adultsData.map((adult, index) => ({
              '_token': token,
              'passengerType': adult.type,
              'passengerName': adult.firstName,
              'lname': adult.lastName,
              'country': adult.nationality,
              'date_of_birth': adult.dob,
              'passport_lead': adult.passportno,
              'passport_exp_lead': adult.passportexpiry,
              'gender': adult.gender,
              'submit':null
            }))) : null,
            'childs': childrenData.length>1 ? JSON.stringify( childrenData.map((adult, index) => ({
              _token: token,
              passengerType: adult.type,
              passengerName: adult.firstName,
              lname: adult.lastName,
              country: adult.nationality  ,
              date_of_birth: adult.dob  ,
              passport_lead: adult.passportno   ,
              passport_exp_lead: adult.passportexpiry     ,
              gender: adult.gender,
            }))) : null,
            'additional_services': AdditionalServices.length>1 ? JSON.stringify( AdditionalServices.map((item, index) => ({
              service: item.name,
              service_price: item.price,
              service_type: item.type,
              person:item.type==='Per Person'? item.adult : '',
              total_price: item.type==='Per Person'? item.adult*Number(item.price) :  item.price  ,
            }))) : null,
            'infants':'',
            'cart_data':JSON.stringify(cartdata),
            'cart_visa':null,
          }
          try {
            const response = await Axios.post(
              endpoint+'/api/book_activity',
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
            // console.log(response)
            setisLoading(false);
            if(response.data.status==='error'){
              toast.error(response.data.message, {
                position: toast.POSITION.TOP_RIGHT
              })
              return;
            }else{
  
              navigation(`/activity_invoice/${response.data.invoice_id}`);
  
            }
            
          } catch (error) {
            // Handle errors here
            setisLoading(false);
            console.error('Error:', error)
          }
  
  
      }else{
        setisLoading(false);
          toast.error('Please Fill Lead Passenger all the details. ', {
            position: toast.POSITION.TOP_RIGHT
          })
        }
  };

const AdditionalSum = () => {
  let sum = AdditionalServices.reduce((total, item) => {
    const itemPrice = item.type === 'Per Person' ? item.adult * parseInt(item.price, 10) : parseInt(item.price, 10);
    return total + itemPrice;
  }, 0);
  setAdditionalServicesTotal(sum);
};

  const handledata = event => {
    const { name, value } = event.target
    setPersonData(prevdata => ({
      ...prevdata,
      [name]: value
    }))
  };

  const handleSelectChange = event => {
    setPersonData(prevdata => ({
      ...prevdata,
      nationality: event.target.value
    }))
  };

  useEffect(() => {
    fetchData();
    AdditionalSum();
  }, []);

  async function fetchData () {
    Axios.get(endpoint + '/api/countries/fetch')
      .then(response => {
        setCountryList(response.data.countries)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  };

  const handlecarddetail=(e)=>{
    const {value,name}=e.target;
    setCardInfo(prevcardinfo=>({...prevcardinfo,
    [name]:value,
    }));
  };

  const showotherData=()=>{
    setShowOtherData(!showOtherData);
  };
  const otherGuestFirstName = (e, guestIndex, isChild) => {
    // Handle the first name input and update the state
    const firstName = e.target.value
    if (isChild) {
      setChildrenData(prevChilds => {
        const updatedChilds = [...prevChilds]
        updatedChilds[guestIndex] = {
          ...updatedChilds[guestIndex],
          firstName: firstName
        }
        return updatedChilds
      })
    } else {
      setAdultsData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          firstName: firstName
        }
        return updatedGuests
      })
    }
  };
  const otherGuestdob = (e, guestIndex, isChild) => {
    // Handle the last name input and update the state
    const newvalue = e.target.value
     if (isChild) {
      setChildrenData(prevChilds => {
        const updatedChilds = [...prevChilds]
        updatedChilds[guestIndex] = {
          ...updatedChilds[guestIndex],
          dob: newvalue
        }
        return updatedChilds
      })
    } else {
      setAdultsData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          dob: newvalue
        }
        return updatedGuests
      })
    }
  };

  const otherGuestInfo = (e, guestIndex, isChild) => {
    const selectedValue = e.target.value
    if (isChild) {
      setChildrenData(prevChilds => {
        const updatedChilds = [...prevChilds]
        updatedChilds[guestIndex] = {
          ...updatedChilds[guestIndex],
          gender: selectedValue
        }
        return updatedChilds
      })
    } else {
      setAdultsData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          gender: selectedValue
        }
        return updatedGuests
      })
    }
  };

  const otherGuestLastName = (e, guestIndex, isChild) => {
    // Handle the last name input and update the state
    const lastName = e.target.value
    if (isChild) {
      setChildrenData(prevChilds => {
        const updatedChilds = [...prevChilds]
        updatedChilds[guestIndex] = {
          ...updatedChilds[guestIndex],
          lastName: lastName
        }
        return updatedChilds
      })
    } else {
      setAdultsData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          lastName: lastName
        }
        return updatedGuests
      })
    }
  };
  const otherGuestNationality = (e, guestIndex, isChild) => {
    // Handle the last name input and update the state
    const newvalue = e.target.value
    if (isChild) {
      setChildrenData(prevChilds => {
        const updatedChilds = [...prevChilds]
        updatedChilds[guestIndex] = {
          ...updatedChilds[guestIndex],
          nationality: newvalue
        }
        return updatedChilds
      })
    } else {
      setAdultsData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          nationality: newvalue
        }
        return updatedGuests
      })
    }
  };
  
  
  return (
    <>
    {isLoading && (
      <Loading/>
    )}
    <ToastContainer/>
      <Layout>
        <div className='contact-img'>
          <img src={bgimage} />
        </div>
        <div className='container mt-5'>
          <div className='col-lg-12 mb-3  hotel-checkout-shadow'>
            <div className=''>
              <div class='row p-2'>
                <div class='col-md-12'>
                  <p>
                    <FontAwesomeIcon style={{ color: 'red' }} icon={faCancel} />{' '}
                    Cancellation Policy :
                  </p>
                  <p>{ActivityDetail.cancellation_policy}</p>
                </div>
              </div>
            </div>
          </div>
         
          <div className='row mt-3'>
            <div className='col-lg-7 margin-checkout'>
              <div className='hotel-checkout-shadow p-3'>
                <div className='row'>
                  <div>
                    <h4>Let us know who you are?</h4>
                  </div>
                  <div class='form-group mt-4 col-md-4 col-sm-6 mt-2'>
                    <label className='fw-bold'>Title</label>
                    <select
                      value={personData.title}
                      onChange={handletitlechange}
                      id='inputState'
                      name='title'
                      class='form-control form-select select-styling mt-2'
                    >
                      <option selected>Select Title</option>
                      <option value='Mr.'>Mr.</option>
                      <option value='Mrs.'>Mrs.</option>
                    </select>
                  </div>
                  <div class='form-group mt-4 col-md-4 col-sm-6 mt-2'>
                    <label className='fw-bold'>First Name</label>
                    <input
                      type='text'
                      value={personData.fname}
                      onChange={handledata}
                      class='form-control mt-2'
                      name='fname'
                      placeholder='First Name'
                    />
                  </div>
                  <div class='form-group mt-4 col-md-4 col-sm-6 mt-2'>
                    <label className='fw-bold'>Last Name</label>
                    <input
                      value={personData.lname}
                      onChange={handledata}
                      type='text'
                      class='form-control mt-2'
                      placeholder='Last Name'
                      name='lname'
                    />
                  </div>
                  <div class='form-group col-md-4 col-sm-6 mt-2'>
                    <label className='fw-bold'>Email</label>
                    <input
                      value={personData.email}
                      onChange={handledata}
                      type='email'
                      class='form-control mt-2'
                      name='email'
                      placeholder='Email'
                    />
                  </div>
                  <div className='form-group col-md-4 col-sm-6 mt-2'>
                    <label className='fw-bold'>Gender:</label>
                    <select
                      value={personData.gender}
                      name='gender'
                      onChange={handledata}
                      class='form-control  mt-2 form-select select-styling'
                    >
                      <option selected>Select Gender</option>
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                    </select>
                  </div>

                  <div class='form-group field-icon-wrap  col-md-4 col-sm-6 mt-2'>
                    <label className='fw-bold'>Nationality</label>
                    <select
                      value={personData.nationality} // Set the selected value from the state
                      onChange={handleSelectChange}
                      className='form-control mt-2 form-select select-styling'
                      aria-label='Default select example'
                    >
                      <option selected>Select Nationality</option>
                      {countryList.map(item => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div class='form-group col-md-4 col-sm-6 mt-2'>
                    <label className='fw-bold'>Phone Number</label>
                    <input
                      type='text mt-2'
                      class='form-control mt-2'
                      value={personData.phno}
                      onChange={handledata}
                      name='phno'
                      placeholder='Phone Number'
                    />
                  </div>
                </div>
              </div>
              <div className='hotel-checkout-shadow mt-4 p-3'>
                <div className='row mt-2'>
                    <div className='d-flex justify-content-between'>
                    <h4 className=' '>Other Passenger Data (Optional)</h4>
                    <span onClick={showotherData} className='mt-auto currency-modal mb-auto'><FontAwesomeIcon icon={faAngleDown}/></span>
                    </div>
                    <div>
                    {showOtherData && (
                       <div>
                    {adultsArray.map((_, index) => (
                      <div className='row' key={index}>
                        <div className='mt-4'>
                          <h5>Adult {index + 1} Detail</h5>
                        </div>
                        <input
                          type='hidden'
                          name={`adultType${index}`}
                          value='adults'
                        />
                        <div class='form-group mt-4 col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>First Name</label>
                          <input
                            type='text'
                            value={adultsData.firstname}
                            name='firstname'
                            placeholder='First Name'
                            onChange={e => otherGuestFirstName(e, index)}
                            class='form-control mt-2'
                          />
                        </div>
                        <div class='form-group mt-4 col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Last Name</label>
                          <input
                            type='text'
                            class='form-control mt-2'
                            value={adultsData.lastname}
                            name='lastname'
                            placeholder='Last Name'
                            onChange={e => otherGuestLastName(e, index)}
                          />
                        </div>

                        <div class='form-group mt-4 col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Date Of Birth</label>
                          <input
                            type='date'
                            class='form-control mt-2'
                            value={adultsData.dob}
                            name='dob'
                            onChange={e => otherGuestdob(e, index)}
                            placeholder='First Name'
                          />
                        </div>
                        <div className='form-group col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Gender:</label>
                          <select
                            value={adultsData.gender}
                            name='gender'
                            onChange={e => otherGuestInfo(e, index)}
                            class='form-control mt-2 form-select select-styling'
                          >
                            <option selected>Select Gender</option>
                            <option value='male'>Male</option>
                            <option value='Female'>Female</option>
                          </select>
                        </div>
                        <div class='form-group field-icon-wrap  col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Nationality</label>
                          <select
                            value={adultsData.nationality} // Set the selected value from the state
                            onChange={e => otherGuestNationality(e, index)}
                            className='form-control mt-2 form-select select-styling'
                            aria-label='Default select example'
                          >
                            <option selected>Select Nationality</option>
                            {countryList.map(item => (
                              <option key={item.id} value={item.name}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                    {childsArray.map((_, index) => (
                      <div className='row' key={index}>
                        <div className='mt-4'>
                          <h5>Child {index + 1} Detail</h5>
                        </div>
                        <input
                          type='hidden'
                          name={`adultType${index}`}
                          value='adults'
                        />
                        <div class='form-group mt-4 col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>First Name</label>
                          <input
                            type='text'
                            value={childrenData.firstname}
                            name='firstname'
                            placeholder='First Name'
                            onChange={e => otherGuestFirstName(e, index,true)}
                            class='form-control mt-2'
                          />
                        </div>
                        <div class='form-group mt-4 col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Last Name</label>
                          <input
                            type='text'
                            class='form-control mt-2'
                            value={childrenData.lastname}
                            name='lastname'
                            placeholder='Last Name'
                            onChange={e => otherGuestLastName(e, index,true)}
                          />
                        </div>

                        <div class='form-group mt-4 col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Date Of Birth</label>
                          <input
                            type='date'
                            class='form-control mt-2'
                            value={childrenData.dob}
                            name='dob'
                            onChange={e => otherGuestdob(e, index,true)}
                            placeholder='First Name'
                          />
                        </div>
                        <div className='form-group col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Gender:</label>
                          <select
                            value={childrenData.gender}
                            name='gender'
                            onChange={e => otherGuestInfo(e, index,true)}
                            class='form-control mt-2 form-select select-styling'
                          >
                            <option selected>Select Gender</option>
                            <option value='male'>Male</option>
                            <option value='Female'>Female</option>
                          </select>
                        </div>
                        <div class='form-group field-icon-wrap  col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Nationality</label>
                          <select
                            value={childrenData.nationality} // Set the selected value from the state
                            onChange={e => otherGuestNationality(e, index,true)}
                            className='form-control mt-2 form-select select-styling'
                            aria-label='Default select example'
                          >
                            <option selected>Select Nationality</option>
                            {countryList.map(item => (
                              <option key={item.id} value={item.name}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                    </div>
                    )}
                    </div>
                  </div>
              </div>
              <div class=' mt-4'>
                <div class='hotel-checkout-shadow p-3'>
                  <div class='row'>
                    <div>
                      <h4>Payment Method</h4>
                    </div>
                    <div class='section-tab check-mark-tab text-center mt-3 pb-4'>
                      <ul class='nav nav-tabs' id='myTab' role='tablist'>
                        <li class='nav-item'>
                          <i class='la la-check icon-element'></i>
                          <img
                            src='https://haramaynhotels.com/public/assets/images/payment-img.png'
                            alt=''
                          />
                          <span class='d-block pt-2'>
                            Payment with credit card
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div class='form-group mt-2 col-md-6'>
                    <label htmlFor="cardNumber" className="form-label">Card Holder Name</label>
                    <input
                      type='text'
                      class='form-control card-holder-name'
                      name='name'
                     value={cardInfo.name}
                     onChange={handlecarddetail}
                      placeholder='Name'
                    />
                  </div>
                  <div class='form-group mt-2 col-md-6'>
                  <label htmlFor="cardNumber" className="form-label">Card number</label>
                    <CardNumberElement className="form-control" id="cardNumber" />
                  </div>
                  <div class='form-group mt-2 col-md-6'>
                     <label htmlFor="expiryDate" className="form-label">Expiration date</label>
                     <CardExpiryElement className="form-control" id="expiryDate" />
                  </div>
                  <div class='form-group mt-2 col-md-6'>
                  <label htmlFor="cvc" className="form-label">CVC</label>
                    <CardCvcElement className="form-control" id="cvc" />
                  </div>
              </div>
              {error && (
              <div style={{color:"red"}}  className="error mt-2" role="alert">
                {error}
              </div>
            
            )}
                  <button onClick={bookTour} className='btn fw-bold btn-warning mt-2' >
                    {' '}
                    Book Activity
                  </button>
                
                </div>
              </div>
            </div>
            <div className='col-lg-5 order-first order-md-last'>
              <div className='checkout-hotel-detail p-3'>
                <div>
                  <h4>{ActivityDetail.title}</h4>
                </div>
                <div className='tour_booking_amount_area'>
                  <div className='Hotel-img'>
                    <div class='card-img mt-2 pb-4'>
                      <img
                        src={
                          DomainURL +
                          '/public/images/activites/' +
                          ActivityDetail.featured_image
                        }
                        alt='tour-img'
                      />
                    </div>
                  </div>
                  <div className='card-body  '>
                      <div class='d-flex justify-content-between'>
                        <div>
                          <h4 class='card-title'>Adults Details:</h4>
                        </div>
                        <div></div>
                      </div>
                      <ul class='list-items  list-items-2 mt-2 py-2'>
                            <li className='mt-2'>
                              <span>Adult Price :</span>
                              {ActivityData.adults} X{' '}
                              {ActivityDetail.currency_symbol}{' '}
                              {ActivityDetail.sale_price}
                            </li>
                        
                      </ul>
                      <div className='border-line'></div>
                      </div>
                      {ActivityData.childs !=='' && (
                      <div className='card-body  '>
                      <div class='d-flex justify-content-between'>
                        <div>
                          <h4 class='card-title'>Childs Details:</h4>
                        </div>
                        <div></div>
                      </div>
                      <ul class='list-items  list-items-2 mt-2 py-2'>
                            <li className='mt-2'>
                              <span>Child Price :</span>
                              {ActivityData.childs} X{' '}
                              {ActivityDetail.currency_symbol}{' '}
                              {ActivityDetail.sale_price}
                            </li>
                      </ul>
                      <div className='border-line'></div>
                      </div>
                      )}
                      {AdditionalServices.length > 0 && (
                        <>
                          <div>
                              <h4 class='card-title'>Additional Services:</h4>
                            </div>
                            <ul class='list-items  list-items-2 mt-2 py-2'>
                              {AdditionalServices.map((item,index)=>(
                                <li key={index} className='mt-2'>
                                  <span>{item.name} :</span>
                                  {item.type === 'Per Person' ? (
                                      <>{item.adult} X {ActivityDetail.currency_symbol} {item.price}</>
                                    ) : (
                                      <>{ActivityDetail.currency_symbol}  {item.price}</>
                                    
                                    )}                            
                                    </li>
                              ))}
                          </ul>
                            <div className='border-line'></div>
                        </>
                        )}
                       <ul class='list-items  mt-2 list-items-2 py-3'>
                        <li className='fw-bold mt-2'>
                          <span>Sub Total:</span>
                          {ActivityDetail.currency_symbol}{' '}
                          {(Number(ActivityData.adultPrice)*Number(ActivityData.adults))+(Number(ActivityData.childrenPrice)*Number(ActivityData.childs))+additionalServicesTotal}
                        </li>
                        <li className='fw-bold mt-2'>
                          <span>Discount Price:</span>
                          {ActivityDetail.currency_symbol}{' '}
                          0
                        </li>
                        <li className='fw-bold mt-2'>
                          <span>Total Price:</span>
                          {StripeCurrency=ActivityData.currency}{' '}
                          {StripePayment=(Number(ActivityData.adultPrice)*Number(ActivityData.adults))+(Number(ActivityData.childrenPrice)*Number(ActivityData.childs))+additionalServicesTotal}
                        </li>
                      </ul>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default ActivityCheckout
