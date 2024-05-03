import React, { useEffect, useState } from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import Layout from '../../Components/Layout/Layout'
import bgimage from '../../Images/Packages/kabapic.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Axios from 'axios'
import moment from 'moment'
import Loading from '../../Components/Loading/Loader'
import { ToastContainer, toast } from 'react-toastify'
import {
  CustomerDomainName,
  Hotelapitoken,
  ApiEndPoint,
  StripeClientSecret,
 
} from '../../Components/GlobalData/GlobalData'
import { Stripe } from 'stripe';
import { useStripe, useElements,CardNumberElement, CardExpiryElement, CardCvcElement} from '@stripe/react-stripe-js';
import { useSelector,useDispatch}  from 'react-redux'
import { PackageInvoiceData } from '../../Redux/Actions/actions'
import {
  faCalendarDays,
  faCheck,
  faHeadset,
  faAngleDown,
  faCancel,
  faClock,
  faDollar,
  faHeadphones,
  faStar,
  faLock,
  faEnvelope,
  faPhone,
} from '@fortawesome/free-solid-svg-icons'
var StripePayment=0;
var StripeCurrency='';
function PackageCheckout () {
  const Dispatch=useDispatch();
  const navigation=useNavigate();
  var endpoint=ApiEndPoint();
  const [selectedImage, setSelectedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [cardInfo, setCardInfo] = useState({
    name: '',
  });
  var Secretkey=StripeClientSecret();
  const stripe = new Stripe(Secretkey);
  const elements = useElements();
  const stripeInstance = useStripe();
  const [error, setError] = useState(null);
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
  const tourDetail = useSelector(state => state.hotels.viewtourdetail.tours)
  const Packagedetail = useSelector(state => state.hotels.packagedata)
  console.log(Packagedetail)
  const accomodationdetail = JSON.parse(tourDetail.accomodation_details)
 
  const adultsCount1 = Packagedetail.total_adults;
  const childrenCount1 = Packagedetail.total_childs;
  const infantsCount1 = Packagedetail.total_Infants;
  const [countryList, setCountryList] = useState([]);
  const [showOtherData, setShowOtherData] = useState(false);
  const childsArray = Array.from({ length: childrenCount1 });
  const adultsArray = Array.from({ length: adultsCount1 - 1 });
  const infantsArray = Array.from({ length: infantsCount1 });
  const [adultsData, setAdultsData] = useState(
    Array(adultsCount1).fill({ type: 'adults' })
  );
  const [childrenData, setChildrenData] = useState(
    Array(childrenCount1).fill({ type: 'child' })
  );
  const [infantsData, setInfantsData] = useState(
    Array(infantsCount1).fill({ type: 'infant' })
  );
  useEffect(() => {
    fetchData()
  }, []);
  var url = CustomerDomainName();

  const handleSelectChange = event => {
    setPersonData(prevdata => ({
      ...prevdata,
      nationality: event.target.value
    }))
  }
  async function fetchData () {
    Axios.get(endpoint+'/api/countries/fetch')
      .then(response => {
        setCountryList(response.data.countries)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  };
  const handletitlechange = event => {
    setPersonData(prevdata => ({
      ...prevdata,
      title: event.target.value
    }))
  };

  const handledata = event => {
    const { name, value } = event.target
    setPersonData(prevdata => ({
      ...prevdata,
      [name]: value
    }))
  };
  const showotherData=()=>{
    setShowOtherData(!showOtherData);
  };
  // const handleImageSelect = event => {
  //   const file = event.target.files[0]
  //   const allowedTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif']
  //   if (file && allowedTypes.includes(file.type)) {
  //     if (file) {
  //       const reader = new FileReader()

  //       reader.onload = e => {
  //         setSelectedImage(e.target.result)
  //       }

  //       reader.readAsDataURL(file)
  //     }
  //   } else {
  //     toast.error('Please select a valid image file.', {
  //       position: toast.POSITION.TOP_RIGHT
  //     })
  //   }
  // }
  const BookPackage = async() => {
    
    var apitoken = Hotelapitoken()
    if(personData.title !==''&& personData.fname!=='' && personData.lname !=='' && personData.email !== '' && personData.pasportno !==''){
      var status=await handlePayment();
      if(status.success===false){
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      var leaduserdata = {
      _token: apitoken,
      lead_title: personData.title,
      name: personData.fname,
      lname: personData.lname,
      email: personData.email,
      passengerType: 'adults',
      country: personData.nationality,
      date_of_birth: personData.dob,
      phone: personData.phno,
      passport_lead: personData.pasportno,
      passport_exp_lead: personData.pasportexpiry,
      gender: personData.gender
    }
    var visa={
      "126":{
         "visa_actual_price":"66.67",
         "double_adult_visa_type":null,
         "double_adult_visa_persons":null,
         "visa_price_double_purc_rate":"300",
         "visa_price_double_exchange_rate":"4.5",
         "visa_actual_price_change":"66.67",
         "triple_adult_visa_type":null,
         "triple_adult_visa_persons":null,
         "visa_price_triple_purc_rate":"300",
         "visa_price_triple_exchange_rate":"4.5",
         "visa_actual_price_change_triple":"66.67",
         "quad_adult_visa_type":null,
         "quad_adult_visa_persons":null,
         "visa_price_quad_purc_rate":"300",
         "visa_price_quad_exchange_rate":"4.5",
         "visa_actual_price_change_quad":"66.67",
         "without_acc_adult_visa_type":null,
         "without_acc_adult_visa_persons":null,
         "visa_price_without_acc_purc_rate":"300",
         "visa_price_without_acc_exchange_rate":"4.5",
         "visa_actual_price_change_without_acc":"66.67",
         "without_acc_child_visa_type":null,
         "without_acc_child_visa_persons":null,
         "visa_price_without_acc_child_purc_rate":"300",
         "visa_price_without_acc_child_exchange_rate":"4.5",
         "visa_actual_price_change_without_acc_child":"66.67",
         "double_child_visa_type":null,
         "double_child_visa_persons":null,
         "visa_price_double_child_purc_rate":"300",
         "visa_price_double_child_exchange_rate":"4.5",
         "visa_actual_price_change_double_child":"66.67",
         "triple_child_visa_type":null,
         "triple_child_visa_persons":null,
         "visa_price_triple_child_purc_rate":"300",
         "visa_price_triple_child_exchange_rate":"4.5",
         "visa_actual_price_change_triple_child":"66.67",
         "quad_child_visa_type":null,
         "quad_child_visa_persons":null,
         "visa_price_quad_child_purc_rate":"300",
         "visa_price_quad_child_exchange_rate":"4.5",
         "visa_actual_price_change_quad_child":"66.67",
         "without_acc_infant_visa_type":null,
         "without_acc_infant_visa_persons":null,
         "visa_price_without_acc_infant_purc_rate":"300",
         "visa_price_without_acc_infant_exchange_rate":"4.5",
         "visa_actual_price_change_without_acc_infant":"66.67",
         "double_infant_visa_type":null,
         "double_infant_visa_persons":null,
         "visa_price_double_infant_purc_rate":"300",
         "visa_price_double_infant_exchange_rate":"4.5",
         "visa_actual_price_change_double_infant":"66.67",
         "triple_infant_visa_type":null,
         "triple_infant_visa_persons":null,
         "visa_price_triple_infant_purc_rate":"300",
         "visa_price_triple_infant_exchange_rate":"4.5",
         "visa_actual_price_change_triple_infant":"66.67",
         "quad_infant_visa_type":null,
         "quad_infant_visa_persons":null,
         "visa_price_quad_infant_purc_rate":"300",
         "visa_price_quad_infant_exchange_rate":"4.5",
         "visa_actual_price_change_quad_infant":"66.67"
      }
   };
   var leaddata=[];
   leaddata[0]=leaduserdata;
   var cartdata=[];
   var x=[];
   x[0]=Packagedetail;
   cartdata[0]=x;
   cartdata[1]='tour';
    var data = {
      'token': apitoken,
      'request_data': JSON.stringify(leaddata),
      'request_form': 'web',
      'adults':adultsData.length > 1 ? JSON.stringify(adultsData.map((adult, index) => ({
        token: apitoken,
        passengerType: adult.type,
        passengerName: adult.firstName,
        lname: adult.lastName,
        country: adult.nationality,
        date_of_birth: adult.dob,
        passport_lead: adult.passportno,
        passport_exp_lead: adult.passportexpiry,
        gender: adult.gender,
      }))) : null,
      'childs': childrenData.length>1 ? JSON.stringify( childrenData.map((adult, index) => ({
        token: apitoken,
        passengerType: adult.type,
        passengerName: adult.firstName,
        lname: adult.lastName,
        country: adult.nationality  ,
        date_of_birth: adult.dob  ,
        passport_lead: adult.passportno   ,
        passport_exp_lead: adult.passportexpiry     ,
        gender: adult.gender     ,
      }))) : null,
      'infants':infantsData.length>1 ? JSON.stringify( infantsData.map((adult, index) => ({
        token: apitoken,
        passengerType: adult.type,
        passengerName: adult.firstName,
        lname: adult.lastName,
        country: adult.nationality  ,
        date_of_birth: adult.dob  ,
        passport_lead: adult.passportno   ,
        passport_exp_lead: adult.passportexpiry     ,
        gender: adult.gender     ,
      }))) : null,
      'cart_data':JSON.stringify(cartdata),
      'cart_visa' : JSON.stringify(visa),
      'booking_person':'user',
      'stripe_payment_response':status.data

    };
   
    try {
      const response = await Axios.post(
        endpoint+'/api/save_booking_react',
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

      // console.log(response);
      setIsLoading(false);
      var id=response.data.invoice_id;
      navigation(`/package_invoice/${id}`, {
        state: {id}
      });
    } catch (error) {
      // Handle errors here
      setIsLoading(false);
      console.error('Error:', error)
    }
  }else{
    setIsLoading(false);
    toast.error('Please Fill Lead Passenger all the details. ', {
      position: toast.POSITION.TOP_RIGHT
    })
  }
  };

  // const invoicedata=async(id)=>{
  //   var tkn=Hotelapitoken();
  //   var data={
  //       'token':tkn,
  //       'booking_id':'AHT6731893'
  //   }
  //   try {
  //       const response = await Axios.post(
  //         endpoint+'/api/invoice_data_react',
  //         data,
  //         {
  //           headers: {
  //             'Access-Control-Allow-Origin': '*',
  //             // Required for CORS support to work
  //             'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
  //             'Access-Control-Allow-Headers':
  //               'Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale'
  //             // "Access-Control-Allow-Methods": "POST, OPTIONS"
  //           }
  //         }
  
  //       )
  //       Dispatch(PackageInvoiceData(response.data));

  //        navigation(`/package_invoice/${id}`, {
  //         state: {id}
  //       });
       
  //     } catch (error) {
  //       // Handle errors here
  //       console.error('Error:', error)
  //     }
  // };
  const handlePayment = async () => {
    if(cardInfo.name===""){
      setError("Enter Card Holder Name.");
      return { success: false};
    };
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

  const handlecarddetail=(e)=>{
    const {value,name}=e.target;
    setCardInfo(prevcardinfo=>({...prevcardinfo,
    [name]:value,
    }));
  };

  const otherGuestInfo = (e, guestIndex, isChild) => {
    const selectedValue = e.target.value
    if(isChild==2){
      setInfantsData(prevInfants => {
        const updatedInfants = [...prevInfants]
        updatedInfants[guestIndex] = {
          ...updatedInfants[guestIndex],
          gender: selectedValue
        }
        return updatedInfants
      })
    }else if (isChild) {
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
  }
  const otherGuestFirstName = (e, guestIndex, isChild) => {
    // Handle the first name input and update the state
    const firstName = e.target.value
    if(isChild==2){
      setInfantsData(prevInfants => {
        const updatedInfants = [...prevInfants]
        updatedInfants[guestIndex] = {
          ...updatedInfants[guestIndex],
          firstName: firstName
        }
        return updatedInfants
      })
    }else if (isChild) {
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
  const otherGuestLastName = (e, guestIndex, isChild) => {
    // Handle the last name input and update the state
    const lastName = e.target.value
    if(isChild==2){
      setInfantsData(prevInfants => {
        const updatedInfants = [...prevInfants]
        updatedInfants[guestIndex] = {
          ...updatedInfants[guestIndex],
          lastName: lastName
        }
        return updatedInfants
      })
    } else if (isChild) {
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
  }
  const otherGuestNationality = (e, guestIndex, isChild) => {
    // Handle the last name input and update the state
    const newvalue = e.target.value
    if(isChild==2){
      setInfantsData(prevInfants => {
        const updatedInfants = [...prevInfants]
        updatedInfants[guestIndex] = {
          ...updatedInfants[guestIndex],
          nationality: newvalue
        }
        return updatedInfants
      })
    }else if (isChild) {
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
  }
  const otherGuestdob = (e, guestIndex, isChild) => {
    // Handle the last name input and update the state
    const newvalue = e.target.value
    if(isChild==2){
      setInfantsData(prevInfants => {
        const updatedInfants = [...prevInfants]
        updatedInfants[guestIndex] = {
          ...updatedInfants[guestIndex],
          dob: newvalue
        }
        return updatedInfants
      })
    } else if (isChild) {
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
  }
  const otherGuestpassportnumber = (e, guestIndex, isChild) => {
    // Handle the last name input and update the state
    const newvalue = e.target.value
    if(isChild==2){
      setInfantsData(prevInfants => {
        const updatedInfants = [...prevInfants]
        updatedInfants[guestIndex] = {
          ...updatedInfants[guestIndex],
          passportno: newvalue
        }
        return updatedInfants
      })
    }else if (isChild) {
      setChildrenData(prevChilds => {
        const updatedChilds = [...prevChilds]
        updatedChilds[guestIndex] = {
          ...updatedChilds[guestIndex],
          passportno: newvalue
        }
        return updatedChilds
      })
    } else {
      setAdultsData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          passportno: newvalue
        }
        return updatedGuests
      })
    }
  }
  const otherGuestpassportexpiry = (e, guestIndex, isChild) => {
    // Handle the last name input and update the state
    const newvalue = e.target.value
    if(isChild==2){
      setInfantsData(prevInfants => {
        const updatedInfants = [...prevInfants]
        updatedInfants[guestIndex] = {
          ...updatedInfants[guestIndex],
          passportexpiry: newvalue
        }
        return updatedInfants
      })
    }else if (isChild) {
      setChildrenData(prevChilds => {
        const updatedChilds = [...prevChilds]
        updatedChilds[guestIndex] = {
          ...updatedChilds[guestIndex],
          passportexpiry: newvalue
        }
        return updatedChilds
      })
    } else {
      setAdultsData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          passportexpiry: newvalue
        }
        return updatedGuests
      })
    }
  };

  return (
    <>
    {isLoading && (<Loading/>)}
      <Layout>
        <ToastContainer />
       
        <div className='container mt-5'>
          <div className='col-lg-12 mb-3  hotel-checkout-shadow'>
            <div className=''>
              <div class='row p-2'>
                <div class='col-md-12'>
                  <p><FontAwesomeIcon style={{color:'red'}} icon={faCancel}/> Cancellation Policy :</p>
                  <p>{Packagedetail.cancellation_policy}</p>
                </div>
              </div>
            </div>
          </div>
       

          <div className='row mt-3'>
            <div className='col-lg-7 margin-checkout'>
              <div class=''>
                <div className='hotel-checkout-shadow p-2 mb-2'>
                  {accomodationdetail.map((item, index) => (
                    <div key={index} className='row'>
                      <div className='col-lg-3 item-from '>
                        <div>
                          <img
                            class='tour-img'
                            src={
                              url
                              +'public/uploads/package_imgs/' +
                              item.accomodation_image[0]
                            }
                            alt=''
                          />
                        </div>
                      </div>
                      <div className='col-lg-9 '>
                        <h5 class='card-title mt-2'>
                          <a class='p-card-title'>{item.acc_hotel_name}</a>
                        </h5>
                        <div className='row  mt-2 mb-2 p-2'>
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
                                  {moment(item.acc_check_in).format(
                                    'DD-MM-YYYY'
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className=' col-sm-3 col-6 col-md-4 col-lg-4 mt-1'>
                            <div class='single-tour-feature d-flex align-items-center mb-2'>
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
                                  Check Out
                                </p>
                                <p
                                  className='mt-0'
                                  style={{ fontSize: '12px' }}
                                  class='title '
                                >
                                  {moment(item.acc_check_out).format(
                                    'DD-MM-YYYY'
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className=' col-sm-3 col-6 col-md-4 col-lg-4 mt-1'>
                            <div class='single-tour-feature d-flex align-items-center mb-2'>
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
                                  Nights
                                </p>
                                <p
                                  className='mt-0'
                                  style={{ fontSize: '12px' }}
                                  class='title '
                                >
                                  {item.acc_no_of_nightst}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className=' col-sm-3 col-6 col-md-4 col-lg-4 mt-1'>
                            <div class='single-tour-feature d-flex align-items-center mb-2'>
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
                                  Transport
                                </p>
                                <p
                                  className='mt-0'
                                  style={{ fontSize: '12px' }}
                                  class='title '
                                >
                                  Included
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className=' col-sm-3 col-6 col-md-4 col-lg-4 mt-1'>
                            <div class='single-tour-feature d-flex align-items-center mb-2'>
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
                                  Visa
                                </p>
                                <p
                                  className='mt-0'
                                  style={{ fontSize: '12px' }}
                                  class='title '
                                >
                                  Included
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                    <div class='form-group col-md-4 col-sm-6 mt-2'>
                      <label className='fw-bold'>Date Of Birth</label>
                      <input
                        value={personData.dob}
                        onChange={handledata}
                        type='date'
                        class='form-control mt-2'
                        name='dob'
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
                        className='form-control form-select select-styling'
                        aria-label='Default select example'
                      >
                        <option selected>Select Nationality</option>
                        {countryList.map(item => (
                          <option key={item.id} value= {item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div class='form-group col-md-4 col-sm-6 mt-2'>
                      <label className='fw-bold'>Phone Number</label>
                      <input
                        type='text mt-2'
                        class='form-control'
                        value={personData.phno}
                        onChange={handledata}
                        name='phno'
                        placeholder='Phone Number'
                      />
                    </div>
                    <div class='form-group col-md-4 col-sm-6 mt-2'>
                      <label className='fw-bold'>Passport Number</label>
                      <input
                        type='text'
                        value={personData.pasportno}
                        onChange={handledata}
                        class='form-control '
                        name='pasportno'
                        placeholder='Passport Number'
                      />
                    </div>
                    <div class='form-group col-md-4 col-sm-6 mt-2'>
                      <label className='fw-bold'>Passport Expiry</label>
                      <input
                        type='date'
                        value={personData.pasportexpiry}
                        onChange={handledata}
                        class='form-control mt-2'
                        name='pasportexpiry'
                      />
                    </div>
                    {/* <div className='form-group col-md-8 col-sm-6 mt-2'>
                      <label className='fw-bold'>Upload Passport</label>
                      <input
                        type='file'
                        accept='image/*'
                        class='form-control mt-2'
                        placeholder='Upload Passport'
                        onChange={handleImageSelect}
                      />
                    </div> */}
                    {/* <div>
                      {selectedImage && (
                        <div className='mt-2 passport-preview'>
                          <label className='fw-bold'>Passport Preview:</label>
                          <img
                            src={selectedImage}
                            alt='Selected'
                            style={{ maxWidth: '100%' }}
                          />
                        </div>
                      )}
                    </div> */}

                    <div className='mt-2 text-end'>
                      {/* <button
                      onClick={BookPackage}
                        style={{ width: '30%' }}
                        class='btn btn-primary btn-block select-styling search-btn1'
                      >
                        Book Package
                      </button> */}
                    </div>
                  </div>
                 
                </div>
              </div>
              <div className='hotel-checkout-shadow mt-4 p-3'>
              <div className='row mt-2'>
                  <div className='d-flex justify-content-between'>
                  <h4 className=' '>Other Passenger Detail (Optional)</h4>
                  <span onClick={showotherData} className='mt-auto currency-modal mb-auto'><FontAwesomeIcon icon={faAngleDown}/></span>
                  </div>
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
                            class='form-control form-select select-styling'
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
                            className='form-control form-select select-styling'
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
                          <label className='fw-bold'>Passport Number</label>
                          <input
                            type='text'
                            class='form-control '
                            value={adultsData.passportno}
                            name='passportno'
                            onChange={e => otherGuestpassportnumber(e, index)}
                            placeholder='Passport Number'
                          />
                        </div>
                        <div class='form-group col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Passport Expiry</label>
                          <input
                            type='date'
                            class='form-control mt-2'
                            value={adultsData.passportexpiry}
                            name='passportexpiry'
                            onChange={e => otherGuestpassportexpiry(e, index)}
                          />
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
                            class='form-control form-select select-styling'
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
                            className='form-control form-select select-styling'
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
                          <label className='fw-bold'>Passport Number</label>
                          <input
                            type='text'
                            class='form-control '
                            value={childrenData.passportno}
                            name='passportno'
                            onChange={e => otherGuestpassportnumber(e, index,true)}
                            placeholder='Passport Number'
                          />
                        </div>
                        <div class='form-group col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Passport Expiry</label>
                          <input
                            type='date'
                            class='form-control mt-2'
                            value={childrenData.passportexpiry}
                            name='passportexpiry'
                            onChange={e => otherGuestpassportexpiry(e, index,true)}
                          />
                        </div>
                      </div>
                    ))}
                     {infantsArray.map((_, index) => (
                      <div className='row' key={index}>
                        <div className='mt-4'>
                          <h5>Infant {index + 1} Detail</h5>
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
                            value={infantsData.firstname}
                            name='firstname'
                            placeholder='First Name'
                            onChange={e => otherGuestFirstName(e, index,2)}
                            class='form-control mt-2'
                          />
                        </div>
                        <div class='form-group mt-4 col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Last Name</label>
                          <input
                            type='text'
                            class='form-control mt-2'
                            value={infantsData.lastname}
                            name='lastname'
                            placeholder='Last Name'
                            onChange={e => otherGuestLastName(e, index,2)}
                          />
                        </div>

                        <div class='form-group mt-4 col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Date Of Birth</label>
                          <input
                            type='date'
                            class='form-control mt-2'
                            value={infantsData.dob}
                            name='dob'
                            onChange={e => otherGuestdob(e, index,2)}
                            placeholder='First Name'
                          />
                        </div>
                        <div className='form-group col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Gender:</label>
                          <select
                            value={infantsData.gender}
                            name='gender'
                            onChange={e => otherGuestInfo(e, index,2)}
                            class='form-control form-select select-styling'
                          >
                            <option selected>Select Gender</option>
                            <option value='male'>Male</option>
                            <option value='Female'>Female</option>
                          </select>
                        </div>
                        <div class='form-group field-icon-wrap  col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Nationality</label>
                          <select
                            value={infantsData.nationality} // Set the selected value from the state
                            onChange={e => otherGuestNationality(e, index,2)}
                            className='form-control form-select select-styling'
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
                          <label className='fw-bold'>Passport Number</label>
                          <input
                            type='text'
                            class='form-control '
                            value={infantsData.passportno}
                            name='passportno'
                            onChange={e => otherGuestpassportnumber(e, index,2)}
                            placeholder='Passport Number'
                          />
                        </div>
                        <div class='form-group col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Passport Expiry</label>
                          <input
                            type='date'
                            class='form-control mt-2'
                            value={infantsData.passportexpiry}
                            name='passportexpiry'
                            onChange={e => otherGuestpassportexpiry(e, index,2)}
                          />
                        </div>
                      </div>
                    ))}
                    </div>
                    )}
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
                  <button className='btn fw-bold btn-warning mt-2' onClick={BookPackage}>
                    {' '}
                    Book Package
                  </button>
                
                </div>
              </div>
            </div>
            
            <div className='col-lg-5 order-first order-md-last'>
               
              <div className='checkout-hotel-detail p-3'>
                 <div class='checkout-note'>
                <p>
                  <i class='fa-regular fa-calendar-days'>
                    <FontAwesomeIcon icon={faCalendarDays} />{' '}
                  </i>{' '}
                  We have limited availability at this price - book now!{' '}
                </p>
              </div>
               <div class='checkout-note mt-2'>
                <p>
                  <i class='fa-regular fa-calendar-days'>
                    <FontAwesomeIcon icon={faHeadset} />{' '}
                  </i>{' '}
                  FREE CUSTOMER SERVICE AVAILABLE FOR 365/24/7{' '}
                </p>
              </div>
                <div className='mt-2'>
                  <h4>Tour Booking Details</h4>
                </div>
                <div className='tour_booking_amount_area'>
                  <div className='Hotel-img'>
                    
                    <div className='card-body  '>
                      <div class='d-flex justify-content-between'>
                        <div>
                          <h4 class='mt-2'>Adult Detail:</h4>
                        </div>
                        <div></div>
                      </div>
                      <ul class='list-items  list-items-2 mt-2 py-2'>
                        {Packagedetail.without_acc_adults !== '' &&
                          Packagedetail.without_acc_adults !== '0' && (
                            <li className='mt-2'>
                              <span>Adult Price :</span>
                              {Packagedetail.without_acc_adults} X{' '}
                              {Packagedetail.currency}{' '}
                              {Packagedetail.without_acc_adult_price}
                            </li>
                          )}
                        {Packagedetail.double_adults !== '' &&
                          Packagedetail.double_adults !== '0' && (
                            <li className='mt-2'>
                              <span>Adult Double Price :</span>
                              {Packagedetail.double_adults} X{' '}
                              {Packagedetail.currency} {Packagedetail.sharing2}
                            </li>
                          )}
                        {Packagedetail.triple_adults !== '' &&
                          Packagedetail.triple_adults !== '0' && (
                            <li className='mt-2'>
                              <span>Adult Triple Price :</span>
                              {Packagedetail.triple_adults} X{' '}
                              {Packagedetail.currency} {Packagedetail.sharing3}
                            </li>
                          )}
                        {Packagedetail.quad_adults !== '' &&
                          Packagedetail.quad_adults !== '0' && (
                            <li className='mt-2'>
                              <span>Adult Quad Price :</span>
                              {Packagedetail.quad_adults} X{' '}
                              {Packagedetail.currency} {Packagedetail.sharing4}
                            </li>
                          )}
                      </ul>
                      {(Packagedetail.children !== '' || Packagedetail.double_childs !== '' || Packagedetail.triple_childs !== '' || Packagedetail.quad_childs !== '') && (
                        <div>
                          <div className='border-line'></div>
                          <div className='mt-2'>
                            <h4 className='card-title'>Child Detail:</h4>
                          </div>
                        </div>
                      )}
                      <ul class='list-items mt-2 list-items-2 py-2'>
                        {Packagedetail.children !== '' &&
                          Packagedetail.children !== '0' && (
                            <li className='mt-2'>
                              <span>Child Price :</span>
                              {Packagedetail.children} X{' '}
                              {Packagedetail.currency}{' '}
                              {Packagedetail.child_price}
                            </li>
                          )}
                        {Packagedetail.double_childs !== '' &&
                          Packagedetail.double_childs !== '0' && (
                            <li className='mt-2'>
                              <span>Child Double Price :</span>
                              {Packagedetail.double_childs} X{' '}
                              {Packagedetail.currency}{' '}
                              {Packagedetail.double_child_price}
                            </li>
                          )}
                        {Packagedetail.triple_childs !== '' &&
                          Packagedetail.triple_childs !== '0' && (
                            <li className='mt-2'>
                              <span>Child Triple Price :</span>
                              {Packagedetail.triple_childs} X{' '}
                              {Packagedetail.currency}{' '}
                              {Packagedetail.triple_child_price}
                            </li>
                          )}
                        {Packagedetail.quad_childs !== '' &&
                          Packagedetail.quad_childs !== '0' && (
                            <li className='mt-2'>
                              <span>Child Quad Price :</span>
                              {Packagedetail.quad_childs} X{' '}
                              {Packagedetail.currency}{' '}
                              {Packagedetail.quad_child_price}
                            </li>
                          )}
                      </ul>
                      {(Packagedetail.infants !== '' || Packagedetail.double_infant !== '' || Packagedetail.triple_infant !== '' || Packagedetail.quad_infant !== '') && (
                      <div>
                      <div className='border-line'></div>
                      <div className='mt-2'>
                        <h4 class='card-title'>Infant Detail:</h4>
                      </div>
                      </div>
                      )}
                      <ul class='list-items mt-2 list-items-2 py-2'>
                        {Packagedetail.infants !== '' &&
                          Packagedetail.infants !== '0' && (
                            <li className='mt-2'>
                              <span>Infant Price :</span>
                              {Packagedetail.infants} X  {Packagedetail.currency}{' '}
                              {Packagedetail.infant_price}
                            </li>
                          )}
                        {Packagedetail.double_infant !== '' &&
                          Packagedetail.double_infant !== '0' && (
                            <li className='mt-2'>
                              <span>Infant Double Price :</span>
                              {Packagedetail.double_infant} X{' '}
                              {Packagedetail.currency}{' '}
                              {Packagedetail.double_infant_price}
                            </li>
                          )}
                        {Packagedetail.triple_infant !== '' &&
                          Packagedetail.triple_infant !== '0' && (
                            <li className='mt-2'>
                              <span>Infant Triple Price :</span>
                              {Packagedetail.triple_infant} X{' '}
                              {Packagedetail.currency}{' '}
                              {Packagedetail.triple_infant_price}
                            </li>
                          )}
                        {Packagedetail.quad_infant !== '' &&
                          Packagedetail.quad_infant !== '0' && (
                            <li className='mt-2'>
                              <span>Infant Quad Price :</span>
                              {Packagedetail.quad_infant} X{' '}
                              {Packagedetail.currency}{' '}
                              {Packagedetail.quad_infant_price}
                            </li>
                          )}
                      </ul>
                      {/* <div className='border-line'></div> */}
                      {/* <ul class='list-items  list-items-2 py-2'>
                        <li>
                          <span>October Umrah Package Group 1</span>£ 18250
                        </li>
                      </ul> */}
                      <div className='border-line'></div>
                      <ul class='list-items  mt-2 list-items-2 py-3'>
                        <li className='fw-bold mt-2'>
                          <span>Sub Total:</span>
                          {Packagedetail.currency}{' '}
                          {Packagedetail.tour_total_price}
                        </li>
                        <li className='fw-bold mt-2'>
                          <span>Discount Price:</span>
                          {Packagedetail.currency}{' '}
                          {Packagedetail.discount_Price}
                        </li>

                        {/* <li className='fw-bold'>
                          <span>Agent Commisson:</span> 3432
                        </li> */}
                        <li className='fw-bold mt-2'>
                          <span>Total Price:</span>
                          {StripeCurrency=Packagedetail.currency}{' '}
                          {StripePayment=Packagedetail.tour_total_price -
                            Packagedetail.discount_Price}
                        </li>
                      </ul>
                      <div className='text-center'>
                        {/* <button class='btn btn-primary btn-block select-styling search-btn1'>
                          Book Package
                        </button> */}
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
             
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default PackageCheckout
