import React, { useEffect, useState } from 'react';
import bgimage from '../../Images/Hotels/bg.jpg';
import Axios from 'axios';
import moment from 'moment';
import payment from '../../Images/Logo/payment-img.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleDown,
  faArrowRight,
  faClock,
  faClockFour,
  faPlane
} from '@fortawesome/free-solid-svg-icons';
import emailjs from 'emailjs-com';
import Select from 'react-select';
import img4 from '../../Components/Data/airline.png'
import { Stripe } from 'stripe';
import { useStripe, useElements,CardNumberElement, CardExpiryElement, CardCvcElement} from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import {useNavigate } from 'react-router-dom';
import { AirLineNames } from '../../Components/Data/AirLineNames';
import { ApiEndPoint,FlightSearchToken,StripeClientSecret,Hotelapitoken } from '../../Components/GlobalData/GlobalData';
import { ToastContainer, toast } from 'react-toastify';
import Layout from '../../Components/Layout/Layout';
var Totalsum=0;
var Currency='';
var ConverterTotalSum=0;
var StripePayment=0;
var StripeCurrency='';
var flighttotal=0;
var hotaltotal=0;
var Gbpexhangeprice=0;
var admingbpprice=0;
var exchangerateprice=0;

function BookRoom (){
  var MarkupSum=0;
  var ConverterCurrency='';
  var Secretkey=StripeClientSecret();
  const stripe = new Stripe(Secretkey);
  const elements = useElements();
  const stripeInstance = useStripe();
  const [error, setError] = useState(null);
  const navigate=useNavigate();
  var endpoint=ApiEndPoint();
  let AdultAmount=0;
  let ChildAmount=0;
  let InfantAmount=0;
  var Airlinenamesdata = AirLineNames;
  const Search_response = useSelector( state => state.hotels.OneWayFlight);
  const homesearch = useSelector(state => state.hotels.hsearch);
  const IndexPageSearchData = useSelector( state => state.hotels.OneWayFlightSearchData);
  const adultCount = homesearch.adult;
  const childCount = homesearch.child;
  var infantCount;
  if(IndexPageSearchData !== undefined){
    infantCount=IndexPageSearchData.infant;
  };
  const [gbpPrices, setGbpPrices] = useState({adult:'',child:'',infant:'',adultqty:'',childqty:'',infantqty:''});
  const [isChecked, setIsChecked] = useState(false);
  const [otherGuestData, setOtherGuestData] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [countryListsimple, setCountryListsimple] = useState([]);
  // const [adminPrices, setAdminPrices] = useState({gbpprice:0,adminPrice:0});
  const [otherDiv, setOtherDiv] = useState({adult:'',child:'',infant:''});
  const [baseCName, setBaseCName] = useState('GBP');
  const [ConversionRates, setConversionRates] = useState({gbpRate:'',exchangeRate:''});
  const [showPrice, setShowPrice] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountryother, setSelectedCountryother] = useState(null);
  const [exchangemarkup, setExchangemarkup] = useState({admin:0,client:0});
  const [totalperson, setTotalperson] = useState({adult:'',child:'',infant:'',adultprice:'',childprice:'',infantprice:''});
  const [savemarkup, setSavemarkup] = useState({totalroomprice:0,admin:0,client:0,final:0});
  const [selectedNationality, setSelectedNationality] = useState('');
  const [gestinfo, setGestinfo] = useState({
    title:'',
    firstname: '',
    lastname: '',
    dateofbirth: '',
    numbercode:'',
    email: '',
    phonenumber: '',
    gender:'',
    pno:'',
    pexpiry:'',
    country:'',
    nationality:'',
    postalcode:''
  });
  const [cardInfo, setCardInfo] = useState({
    name: '',
    cardnumber: '',
    mm: '',
    yy: '',
    cvv: ''
  });
  const [isBooking, setIsBooking] = useState(false);
  const [guests, setGuests] = useState(Array(adultCount).fill({}));
  const [childs, setChilds] = useState(Array(childCount).fill({}));
  const [infants, setinfants] = useState(Array(infantCount).fill({}));
  const checkoutdetail = useSelector(state => state.hotels.checkoutdetail)
  //  console.log(checkoutdetail)
  const hotelimg = useSelector(state => state.hotels.hoteldetail.hotel_gallery[0]);
  let Checkin = moment(checkoutdetail?.checkIn);
  let checkout = moment(checkoutdetail?.checkOut);
  let daysBetween = Math.abs(checkout.diff(Checkin, 'days'));
  const childsArray = Array.from({ length: childCount });
  const adultsArray = Array.from({ length: adultCount-1 });
  const infantsArray = Array.from({ length: infantCount });
  const FlightCurrency = useSelector( state => state.hotels.FlightCurrency);
  const CheckoutFlightData = useSelector( state => state.hotels.OneWayFlightcheckout);
  const storedData = JSON.parse(sessionStorage.getItem('FlightCheckOut'));
  var FlightMarkup=JSON.parse( localStorage.getItem('FlightMarkup'));
  useEffect(() => {
    fetchData();
    fetchData2();
    if(storedData !== null){
     Totalsum=calculateSum();
  }
    totalcount();
  }, []);

  const CurrencyRates = useSelector(state => state.hotels.Currency);
  const GBPCurrencyRates = useSelector(state => state.hotels.AllCurrency);
  async function fetchData () {
    Axios.get('https://restcountries.com/v3.1/all?fields=name,flags,cca2,cca3,idd')
          .then(response => {
            const countryOptions = response?.data.map((country) => ({
                value:country.name.common,
                label: country.name.common,
                flag: country.flags.png,
                phoneCode: country.idd.root+country.idd.suffixes[0],
              }));
            setCountryList(countryOptions)
          })
          .catch(error => {
            console.error('Error:', error)
          })
  };
  async function fetchData2 () {
    Axios.get(endpoint+'/api/countries/fetch')
      .then(response => {
        setCountryListsimple(response.data.countries)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  };
  const totalcount=()=>{ 
    
   let allroomsprice=0;
  let markupprice=0;
  let adminmarkupprice=0;
  let clientmarkupprice=0;
  let finalpricemarkup=0;
   allroomsprice= checkoutdetail.rooms_list.reduce((sum,item)=>sum+Number(item.rooms_total_price),0);
   savemarkup.totalroomprice=allroomsprice;
   finalpricemarkup=allroomsprice;
   if(Number(checkoutdetail.admin_markup) !== 0)
   {
    if(checkoutdetail.admin_markup_type === "Percentage")
    {
      markupprice=( allroomsprice * Number(checkoutdetail.admin_markup))/100;
    }else{
      markupprice= Number(checkoutdetail.admin_markup);
     }
      adminmarkupprice=markupprice;
      finalpricemarkup +=markupprice
      savemarkup.admin=adminmarkupprice;
      savemarkup.final=finalpricemarkup;
   }
   if(Number(checkoutdetail.customer_markup) !== 0)
   {
    if(checkoutdetail.customer_markup_type === "Percentage")
    {
      markupprice= (finalpricemarkup * Number(checkoutdetail.customer_markup))/100;
    }else{
      markupprice= Number(checkoutdetail.customer_markup);
     }
     clientmarkupprice=markupprice;
      finalpricemarkup +=markupprice;
      savemarkup.client=clientmarkupprice;
      savemarkup.final=finalpricemarkup;
   }else{
    savemarkup.final=allroomsprice;
   }
  };
  
  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
     setSelectedNationality(selectedOption.value);
    setGestinfo(prevdata=>({...prevdata, phonenumber:selectedOption.phoneCode, numbercode:selectedOption.phoneCode,nationality:selectedOption.value }));
  };
  const handleCountryChangeother = (selectedOption) => {
    setSelectedCountryother(selectedOption);
    setGestinfo(prevdata => ({
      ...prevdata,
      country: selectedOption.value,
    }))
  };
  const handlePayment = async () => {
    if(cardInfo.name===""){
      setError("Enter Card Holder Name.");
      return { success: false};
    };

    const response = await stripe.paymentIntents.create({
      amount: (Number(StripePayment)*100).toFixed(0), // Amount in cents
      currency: StripeCurrency,
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
        setIsBooking(!isBooking);
        return { success: false};
      } else {
        return { success: true,data:paymentIntent};
      }
    } catch (error) {
      console.error('Error:', error);
    
    setIsBooking(!isBooking);

      return { success: false};
    }
  };

  const calculateSum = () => {
    const pricedItinerary = storedData.PricedItineraries[0];
    if (pricedItinerary && pricedItinerary.AirItineraryPricingInfo) {
      const fareBreakdowns = pricedItinerary.AirItineraryPricingInfo.PTC_FareBreakdowns;
     Currency=fareBreakdowns[0].PassengerFare.TotalFare.CurrencyCode;
      const sum = fareBreakdowns.reduce((accumulator, item) => {
        var Code=item.PassengerTypeQuantity.Code;
        var x=item.PassengerTypeQuantity.Quantity;
        switch (Code) {
          case 'ADT':
              setTotalperson(prevdata => ({
                  ...prevdata,
                  adult: x,
                 adultprice:item.PassengerFare.TotalFare.Amount
                }))
                setOtherDiv(prevdata => ({
                  ...prevdata,
                  adult: x-1,
                
                }))
            break;
          case 'CHD':
              setTotalperson(prevdata => ({
                  ...prevdata,
                  child: x,
                  childprice:item.PassengerFare.TotalFare.Amount
                }))
                setOtherDiv(prevdata => ({
                  ...prevdata,
                  child: x,
                }))
            break;
          case 'INF':
              setTotalperson(prevdata => ({
                  ...prevdata,
                  infant: x,
                  infantprice:item.PassengerFare.TotalFare.Amount
                }));
                setOtherDiv(prevdata => ({
                  ...prevdata,
                  infant: x,
                }))
            break;
          default:
            break;
        }
       
        return accumulator + (Number(item.PassengerFare.TotalFare.Amount)*item.PassengerTypeQuantity.Quantity);
      }, 0);
      return sum.toFixed(2);
    } else {
      return 0; // Handle the case where the data is missing or empty
    }
  };

  const calculateMarkup = (price) => {
    if(Object.keys(checkoutdetail).length !==0){
    let markupprice=0;
    let adminmarkupprice=0;
    let clientmarkupprice=0;
    let finalpricemarkup=Number(price);
    if(Number(checkoutdetail.admin_markup) !== 0)
   {
    if(checkoutdetail.admin_markup_type === "Percentage")
    {
      markupprice=( price * Number(checkoutdetail.admin_markup))/100;
    }else{
      markupprice= Number(checkoutdetail.admin_markup);
     }
      adminmarkupprice=markupprice;
      finalpricemarkup +=markupprice
      
   }
   if(Number(checkoutdetail.customer_markup) !== 0)
   {
    if(checkoutdetail.customer_markup_type=== "Percentage")
    {
      markupprice= (finalpricemarkup * Number(checkoutdetail.customer_markup))/100;
    }else{
      markupprice= Number(checkoutdetail.customer_markup);
     }
     clientmarkupprice=markupprice;
      finalpricemarkup +=markupprice;
   }
   return finalpricemarkup.toFixed(2);
  }
  };
  

const handlegestchange=(e)=>{
  const {value,name}=e.target;
  setGestinfo(prevgestinfo=>({...prevgestinfo,
    [name]:value,
  }));
};

const confirmbooking=async()=>{
if(gestinfo.title==='')
{
  toast.error('Please Select Lead Guest Title.', {
    position: toast.POSITION.TOP_RIGHT
});
return;
}else if(gestinfo.firstname===''){
  toast.error('Please Enter Lead Guest First Name.', {
    position: toast.POSITION.TOP_RIGHT
});
return;
}else if(gestinfo.lastname===''){
  toast.error('Please Enter Lead Guest Last Name.', {
    position: toast.POSITION.TOP_RIGHT
});
return;
}else if(gestinfo.email===''){
  toast.error('Please Enter Lead Guest Email.', {
    position: toast.POSITION.TOP_RIGHT
});
return;
}else if(selectedNationality===''){
  toast.error('Please Select Lead Guest Nationality.', {
    position: toast.POSITION.TOP_RIGHT
});
return;
}else if(gestinfo.phonenumber.length < 5 ){
  toast.error('Please Enter Phone Number.', {
    position: toast.POSITION.TOP_RIGHT
});
return;
}

 if(isChecked){
  setIsBooking(true);
  if(storedData !==null){
    BothServicesBooking();
    return;
  }
  setIsBooking(true);
  if(checkoutdetail?.rooms_list[0].request_type ==''){
    var status=await handlePayment();
    if(status.success===false){
      setIsBooking(false);
      return;
    };
  }else{
    var status=false
  }
   
      var title=[];
      var firstname=[];
      var lastname=[];
      var nationality=[];
      if(guests.length!==0){
        guests.forEach(person => {
          if (person.other_title && person.other_first_name) {
          title.push(person.other_title);
          firstname.push(person.other_first_name);
          lastname.push(person.other_last_name);
          nationality.push(person.other_passport_country);
          }
       });
      };
      var Childtitle=[];
      var Childfirstname=[];
      var Childlastname=[];
      var Childnationality=[];
      if(childs.length!==0){
        childs.forEach(children => {
          if (children.title && children.firstName) {
            Childtitle.push(children.title);
            Childfirstname.push(children.firstName);
            Childlastname.push(children.lastName);
            Childnationality.push(children.nationality );
          }
       });
    
      };
  const jsonString = {
    "lead_title":gestinfo.title,
    "lead_first_name": gestinfo.firstname,
    "lead_last_name": gestinfo.lastname,
    "lead_email": gestinfo.email,
    "lead_date_of_birth": gestinfo.dateofbirth,
    "lead_country": selectedNationality,
    "lead_phone": gestinfo.phonenumber,
    "other_title":title,
    "other_first_name":firstname,
    "other_last_name": lastname,
    "other_nationality": nationality,
    "child_title":Childtitle,
    "child_first_name":Childfirstname,
    "child_last_name": Childlastname,
    "child_nationality": Childnationality,
    "slc_pyment_method": "slc_stripe",
    "name": "on",
    "base_exchange_rate": "1",
    "base_currency":'GBP',
    "selected_exchange_rate": '1',
    "exchange_price":StripePayment,
    "admin_markup": checkoutdetail.admin_markup,
    "client_markup": checkoutdetail.customer_markup,
    "exchange_currency": StripeCurrency,
  };
  const customersearch={
    "token":'r9fdvwRyF35JUnD6xXdRiDELANYjtfASzPmyGol4-1PN461EY50LbXcqkfEfISsOJDrnFDJbuMzPuxTz37zFWGWBVemQGhi2SYLrr-MZ75vJSAiV73z94UOVrDz5P6R-0KjFqr9XR6P2857snQbcKTUn9YNqjBOQQIkXENeO7tmjxdTJs2KUVoXqo6fFyT9TTq99eKe288N-wyanZXxOsfABWPjtSom2oKLVz6vJnn1WeQwHSp7VnzPUqq53rn80eFXNBSMIiEXBdDmlsokRYSa0evDrQKluhnIzMYkRiazxtnkb-z5Xj0tQReTTHsLz1sgnit2mRGGzP4EIdBK8TiLuEN7GD1kmOT3CMreL7ELrI4yxmEbnYyflICtG-ySk3aZkk8iM9mRZlA7CS10Zuj-C0HEBOFW8vMzy4Eq2CET5WN62S1xe0HPAOrDVwO6jDvVpKEMwm-NiyyjkU8oTTlgYpN77pXtfFjKPTF0julnAMC6cPzxZOGBIkRv0',
    "city_name":checkoutdetail.destinationName,
    "destination": checkoutdetail.destinationName,
    "room_searching":homesearch.room,
    "child_searching": homesearch.child,
    "adult_searching": homesearch.adult,
    "adult_per_room": homesearch.adult,
    "child_per_room": homesearch.children,
    "country_nationality": homesearch.slc_nationality,
    "check_in": homesearch.check_in,
    "check_out": homesearch.check_out,
    "request_all_data":JSON.stringify(homesearch)
  };  

  const phpArray = {
    "token":'r9fdvwRyF35JUnD6xXdRiDELANYjtfASzPmyGol4-1PN461EY50LbXcqkfEfISsOJDrnFDJbuMzPuxTz37zFWGWBVemQGhi2SYLrr-MZ75vJSAiV73z94UOVrDz5P6R-0KjFqr9XR6P2857snQbcKTUn9YNqjBOQQIkXENeO7tmjxdTJs2KUVoXqo6fFyT9TTq99eKe288N-wyanZXxOsfABWPjtSom2oKLVz6vJnn1WeQwHSp7VnzPUqq53rn80eFXNBSMIiEXBdDmlsokRYSa0evDrQKluhnIzMYkRiazxtnkb-z5Xj0tQReTTHsLz1sgnit2mRGGzP4EIdBK8TiLuEN7GD1kmOT3CMreL7ELrI4yxmEbnYyflICtG-ySk3aZkk8iM9mRZlA7CS10Zuj-C0HEBOFW8vMzy4Eq2CET5WN62S1xe0HPAOrDVwO6jDvVpKEMwm-NiyyjkU8oTTlgYpN77pXtfFjKPTF0julnAMC6cPzxZOGBIkRv0',
    "lead_title":gestinfo.title,
    'admin_exchange_currency':'GBP',
    'admin_exchange_rate':Gbpexhangeprice.toFixed(4),
    'admin_exchange_total_markup_price':admingbpprice,
    "lead_first_name": gestinfo.firstname,
    "lead_last_name": gestinfo.lastname,
    "lead_email": gestinfo.email,
    "lead_date_of_birth": gestinfo.dateofbirth,
    "lead_country": selectedNationality,
    "lead_phone": gestinfo.phonenumber,
    "other_title":title,
    "other_first_name":firstname,
    "other_last_name": lastname,
    "other_nationality": nationality,
    "slc_pyment_method": "slc_stripe",
    'payment_details': JSON.stringify(status.data),
   "base_exchange_rate": Gbpexhangeprice,
    "base_currency":'GBP',
    "selected_exchange_rate": exchangerateprice,
    "selected_currency": StripeCurrency,
   "exchange_price":StripePayment,
   "admin_markup": checkoutdetail.admin_markup,
   "client_markup": checkoutdetail.customer_markup,
    "exchange_currency": StripeCurrency,
    "request_data": JSON.stringify(jsonString),
    "creditAmount":StripePayment,
    "hotel_checkout_select":JSON.stringify(checkoutdetail),
    "customer_search_data":JSON.stringify(customersearch),
  };
  // _Live
  try {
  const response = await Axios.post(endpoint+'/api/hotels/reservation_Live',phpArray , {
    headers: {
      "Access-Control-Allow-Origin": "*",
      // Required for CORS support to work
       "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      "Access-Control-Allow-Headers":
      "Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale",
      // "Access-Control-Allow-Methods": "POST, OPTIONS"
    } ,
    
  });

  // Handle the API response here
  if(response.data.message==='Internal server error')
  {
    setIsBooking(false);
    toast.error('Please Search Hotel Again.', {
      position: toast.POSITION.TOP_RIGHT
  });
  }else if(response.data.message==='Insufficient allotment'){
    setIsBooking(false);
    toast.error('Insufficient allotment.', {
      position: toast.POSITION.TOP_RIGHT
  });
  }else if(response.data.status==='error'){
    setIsBooking(false);
    toast.error(response.data.message, {
      position: toast.POSITION.TOP_RIGHT
  });
  }else if(response.data.status==="success"){
    sendEmail(response.data.Invoice_data);
    sendWhatsappMessage(response.data.Invoice_data);
    setIsBooking(false);
  navigate(`/hotel_booking_invoice/${response.data.Invoice_id}`)

  }
  // navigate(`/hotel_detail/${id}`,{state:{index}})
} catch (error) {
  // Handle errors here
  setIsBooking(false);
  console.error('Error:', error);
}
 
}else{
  toast.error('Please Agree with Terms and Conditions.', {
    position: toast.POSITION.TOP_RIGHT
});
}
};
const sendEmail = async (data) => {
  try {
    const templateParams = {
      invoiceno:data.invoice_no ,
      booking_date: data.creationDate,
      checkin: homesearch.check_in,
      checkout: homesearch.check_out,
      rooms: data.total_rooms,
      adults:data.total_adults,
      price:data.exchange_currency+' '+data.exchange_price,
      status:data.status,
      name:gestinfo.title+' '+gestinfo.firstname+' '+ gestinfo.lastname,
      email:gestinfo.email,
      phno:gestinfo.phonenumber
    };

    await emailjs.send('service_d6zrc2l', 'template_mwxpr8h', templateParams, 'c163bgNie5rW0iU1f');
    
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email', error);
  }
};

function sendWhatsappMessage(data) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded"); 
  const message = `Dear ${gestinfo.title} ${gestinfo.firstname} ${gestinfo.lastname},\nThank you for booking with Alhijaz Tours.Below are the details of your booking: \n
Invoice No: ${data.invoice_no}\n
Booking Date: ${data.creationDate}\n
Check-in Date: ${homesearch.check_in}\n
Check-out Date: ${homesearch.check_out}\n
Number of Rooms: ${data.total_rooms}\n
Number of Adults: ${data.total_adults} \n

Room Details:\n
Price: ${data.exchange_currency} ${data.exchange_price}\n
Room Status: ${data.status}\n

Customer Details:\n
Name: ${gestinfo.title} ${gestinfo.firstname} ${gestinfo.lastname}\n
Email: ${gestinfo.email}\n
Phone Number: ${gestinfo.phonenumber}\n
We look forward to providing you with a comfortable and enjoyable stay. Should you have any questions or require further assistance, please do not hesitate to contact us.\nThank you for choosing Alhijaz Tours Ltd.
`;
  const urlencoded = new URLSearchParams();
  urlencoded.append("token", "cq62vi1wdx5a7z3b");
  urlencoded.append("to", gestinfo.phonenumber);
  urlencoded.append("body", message);

  // Constructing the request options
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };

  // Making the fetch request
  fetch("https://api.ultramsg.com/instance58881/messages/chat", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}
const handlecarddetail=(e)=>{
  const {value,name}=e.target;
  setCardInfo(prevcardinfo=>({...prevcardinfo,
  [name]:value,
  }));
};
const handleCheckboxContinue=()=>{
  setIsChecked(!isChecked);
};
const otherGuestInfo = (e, guestIndex,digit) => {
  
  const selectedValue = e.target.value;
  if(digit===2){
    setChilds((prevChilds) => {
      const updatedChilds = [...prevChilds];
      updatedChilds[guestIndex] = {
        ...updatedChilds[guestIndex],
        title: selectedValue,
      };
      return updatedChilds;
    });
  }else if(digit===1){
    setGuests((prevGuests) => {
      const updatedGuests = [...prevGuests];
      updatedGuests[guestIndex] = {
        ...updatedGuests[guestIndex],
        other_title: selectedValue,
      };
      return updatedGuests;
    });
  }
  else if(digit===3){
    setinfants((prevInfants) => {
      const updatedGuests = [...prevInfants];
      updatedGuests[guestIndex] = {
        ...updatedGuests[guestIndex],
        title: selectedValue,
      };
      return updatedGuests;
    });
  }
    
};
const otherGuestFirstName = (e, guestIndex,digit) => {
  // Handle the first name input and update the state
  const firstName = e.target.value;
  if(digit===2){
    setChilds((prevChilds) => {
      const updatedChilds = [...prevChilds];
      updatedChilds[guestIndex] = {
        ...updatedChilds[guestIndex],
        firstName: firstName,
      };
      return updatedChilds;
    });
  }else if(digit===1){
  setGuests((prevGuests) => {
    const updatedGuests = [...prevGuests];
    updatedGuests[guestIndex] = {
      ...updatedGuests[guestIndex],
      other_first_name: firstName,
    };
    return updatedGuests;
  });
}else if(digit===3){
  setinfants((prevInfant) => {
    const updatedGuests = [...prevInfant];
    updatedGuests[guestIndex] = {
      ...updatedGuests[guestIndex],
      firstName: firstName,
    };
    return updatedGuests;
  });
}
};
const otherGuestLastName = (e, guestIndex,digit) => {
  // Handle the last name input and update the state
  const lastName = e.target.value;
  if(digit===2){
    setChilds((prevChilds) => {
      const updatedChilds = [...prevChilds];
      updatedChilds[guestIndex] = {
        ...updatedChilds[guestIndex],
        lastName: lastName,
      };
      return updatedChilds;
    });
  }else if(digit===1){
    setGuests((prevGuests) => {
      const updatedGuests = [...prevGuests];
      updatedGuests[guestIndex] = {
        ...updatedGuests[guestIndex],
        other_last_name: lastName,
      };
      return updatedGuests;
    });
  }else if(digit===3){
    setinfants((prevInfant) => {
      const updatedGuests = [...prevInfant];
      updatedGuests[guestIndex] = {
        ...updatedGuests[guestIndex],
        lastName: lastName,
      };
      return updatedGuests;
    });
  }
};
const otherGuestdob = (e, guestIndex,digit) => {
  // Handle the last name input and update the state
  const other_dob = e.target.value;
  if(digit===2){
    setChilds((prevChilds) => {
      const updatedChilds = [...prevChilds];
      updatedChilds[guestIndex] = {
        ...updatedChilds[guestIndex],
        dob: other_dob,
      };
      return updatedChilds;
    });
  }else if(digit===1){
    setGuests((prevGuests) => {
      const updatedGuests = [...prevGuests];
      updatedGuests[guestIndex] = {
        ...updatedGuests[guestIndex],
        other_date_of_birth: other_dob,
      };
      return updatedGuests;
    });
  }
  else if(digit===3){
    setinfants((prevInfant) => {
      const updatedGuests = [...prevInfant];
      updatedGuests[guestIndex] = {
        ...updatedGuests[guestIndex],
        dob: other_dob,
      };
      return updatedGuests;
    });
  }
};
const otherGuestGender = (e, guestIndex,digit) => {
  // Handle the last name input and update the state
  const other_g = e.target.value;
  if(digit===2){
    setChilds((prevChilds) => {
      const updatedChilds = [...prevChilds];
      updatedChilds[guestIndex] = {
        ...updatedChilds[guestIndex],
        gender: other_g,
      };
      return updatedChilds;
    });
  }else if(digit===1){
    setGuests((prevGuests) => {
      const updatedGuests = [...prevGuests];
      updatedGuests[guestIndex] = {
        ...updatedGuests[guestIndex],
        other_gender: other_g,
      };
      return updatedGuests;
    });
  }else if(digit===3){
    setinfants((prevInfant) => {
      const updatedGuests = [...prevInfant];
      updatedGuests[guestIndex] = {
        ...updatedGuests[guestIndex],
        gender: other_g,
      };
      return updatedGuests;
    });
  }
};
const otherGuestPNumber = (e, guestIndex,digit) => {
  // Handle the last name input and update the state
  const value= e.target.value;
  if(digit===2){
    setChilds((prevChilds) => {
      const updatedChilds = [...prevChilds];
      updatedChilds[guestIndex] = {
        ...updatedChilds[guestIndex],
        pnumber: value,
      };
      return updatedChilds;
    });
  }else if(digit===1){
    setGuests((prevGuests) => {
      const updatedGuests = [...prevGuests];
      updatedGuests[guestIndex] = {
        ...updatedGuests[guestIndex],
        other_passport_no: value,
      };
      return updatedGuests;
    });
  }else if(digit===3){
    setinfants((prevInfant) => {
      const updatedGuests = [...prevInfant];
      updatedGuests[guestIndex] = {
        ...updatedGuests[guestIndex],
        pnumber: value,
      };
      return updatedGuests;
    });
  }
};

const otherGuestPExpiry = (e, guestIndex,digit) => {
  const value= e.target.value;
  if(digit===2){
    setChilds((prevChilds) => {
      const updatedChilds = [...prevChilds];
      updatedChilds[guestIndex] = {
        ...updatedChilds[guestIndex],
        pexpiry: value,
      };
      return updatedChilds;
    });
  }else if(digit===1){
    setGuests((prevGuests) => {
      const updatedGuests = [...prevGuests];
      updatedGuests[guestIndex] = {
        ...updatedGuests[guestIndex],
        other_passport_expiry_date: value,
      };
      return updatedGuests;
    });
  }else if(digit===3){
    setinfants((prevInfants) => {
      const updatedGuests = [...prevInfants];
      updatedGuests[guestIndex] = {
        ...updatedGuests[guestIndex],
        pexpiry: value,
      };
      return updatedGuests;
    });
  }
};
const otherGuestNationality = (e, guestIndex,digit) => {
  // Handle the last name input and update the state
  const newvalue = e.target.value;
  if(digit===2){
    setChilds((prevChilds) => {
      const updatedChilds = [...prevChilds];
      updatedChilds[guestIndex] = {
        ...updatedChilds[guestIndex],
        nationality: newvalue,
      };
      return updatedChilds;
    });
  }else if(digit===1){
  setGuests((prevGuests) => {
    const updatedGuests = [...prevGuests];
    updatedGuests[guestIndex] = {
      ...updatedGuests[guestIndex],
      other_passport_country: newvalue,
    };
    return updatedGuests;
  });
}else if(digit===3){
  setinfants((prevInfants) => {
    const updatedGuests = [...prevInfants];
    updatedGuests[guestIndex] = {
      ...updatedGuests[guestIndex],
      nationality: newvalue,
    };
    return updatedGuests;
  });
}
};
const renderPrice = (price,check) =>{
  const userData = localStorage.getItem('HotelCurrency');
  const Rates = JSON.parse(userData);
  if(userData !==null){
  if(CurrencyRates===undefined){
    const gbpprice = Rates.conversion_rates[baseCName]; // Use square brackets to access the property
    // setConversionRates({gbpRate:gbpprice});
    var baseprice = (Number(gbpprice) * Number(price));
    StripeCurrency=baseCName;
    Gbpexhangeprice=gbpprice;
    admingbpprice=baseprice
  }else{
    var select123 = CurrencyRates.selectedcurrency;
    StripeCurrency=select123;
    const gbpprice = Rates.conversion_rates[baseCName];
    var baseprice1 = (Number(gbpprice) * Number(price));
    const gbpprice2 = GBPCurrencyRates.conversion_rates[select123]; // Use square brackets to access the property
    var baseprice = (Number(gbpprice2) * Number(baseprice1));
    Gbpexhangeprice=gbpprice;
    admingbpprice=baseprice1;
    exchangerateprice=gbpprice2;
    // setConversionRates({gbpRate:gbpprice,exchangeRate:gbpprice2});

  }
  // if(check===1){
  //   StripePayment=baseprice;
  // }
  return baseprice.toFixed(0)
}else{
  setShowPrice(false);
}
};

const renderPrice2 = (price,qty,check) => {
  
  if(FlightCurrency !==undefined){
  if (CurrencyRates === undefined) {
    const gbpprice = FlightCurrency[baseCName] // Use square brackets to access the property
    var baseprice = (Number(gbpprice) * Number(price))
      
    if(check===2){
      gbpPrices.adult=baseprice;
      gbpPrices.adultqty=qty;
    }else if(check===3){
      gbpPrices.child=baseprice;
      gbpPrices.childqty=qty;
    }else if(check===4){
      gbpPrices.infant=baseprice;
      gbpPrices.infantqty=qty;
    };

    StripeCurrency=baseCName;

  } else {
    var select123 = CurrencyRates.selectedcurrency
    const gbpprice = FlightCurrency[baseCName]
    var baseprice1 = (Number(gbpprice) * Number(price))
    if(check===2){
      gbpPrices.adult=baseprice1;
      gbpPrices.adultqty=qty;
    }else if(check===3){
      gbpPrices.child=baseprice1;
      gbpPrices.childqty=qty;
    }else if(check===4){
      gbpPrices.infant=baseprice1;
      gbpPrices.infantqty=qty;
    };
    const gbpprice2 = GBPCurrencyRates.conversion_rates[select123] // Use square brackets to access the property
    var baseprice = (Number(gbpprice2) * Number(baseprice1))
  }
}else{
  setShowPrice(false);
};
  return baseprice
};

const ShowOtherGuestForm=()=>{
  setOtherGuestData(!otherGuestData);
};
const BothServicesBooking= async()=>{
//   debugger
//   var check=0;
//   if(adultCount-1 !==0){
//     for (let i = 0; i < adultsArray.length; i++) {
//      if (!validateAdultData(adultsArray[i], i)) {
//        // Validation failed for at least one adult, handle accordingly
//        check=1;
//        return;
//      }
//    }
//  }
//    if(check==1){
//      return;
//     }
//    check=0;
//    if(childCount !==''){
//    for (let i = 0; i < childsArray.length; i++) {
//      if (!validateChildData(childsArray[i], i)) {
//        // Validation failed for at least one adult, handle accordingly
//        check=1;
//        return;
//      }
//    }
//  }
//    if(check==1){
//      return;
//     }
var token=FlightSearchToken();
var limit={
  'token':token
}
var limitcheck;
try {
  const response = await Axios.post(endpoint+'/api/flight_credit_limit_Live', limit, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    } ,
    
  });
  limitcheck=response.data;
  // Handle the API response here
 
} catch (error) {
  // Handle errors here
  setIsBooking(false);
  console.error('Error:', error);
}

if(Number(flighttotal) > Number(limitcheck.credit_data.remaining_amount)){
  toast.info('There is a problem in the payment, Please contact Support or try again later on.', {
    position: toast.POSITION.TOP_RIGHT
  });
  setIsBooking(false);
  return;
  

}else{
  var status=await handlePayment();
      if(status.success===false){
        setIsBooking(false);
        return;
      };
      var adminmarkup='';
    var clientmarkup='';

    for(var i=0;i < FlightMarkup.markups.length;i++){
      if(FlightMarkup.markups[i].services_type==='flight'){
        if(FlightMarkup.markups[i].added_markup=='synchtravel'){
          adminmarkup=FlightMarkup.markups[i];
        }else if(FlightMarkup.markups[i].added_markup=='alhijaz'){
          clientmarkup=FlightMarkup.markups[i];
        }
      }
    };
  var leadpassengerdetail= {
    "title":gestinfo.title,
    "first_name": gestinfo.firstname,
    "last_name": gestinfo.lastname,
    "email": gestinfo.email,
    "date_of_birth":gestinfo.dateofbirth,
    "gender": gestinfo.gender,
    "passport_no": gestinfo.pno,
    "passport_expiry_date": gestinfo.pexpiry,
    "passport_country": gestinfo.country,
   "passenger_nationality_id": gestinfo.nationality,
    "passenger_nationality_code": gestinfo.numbercode,
    "passenger_phone_no": gestinfo.phonenumber,
    "postal_code":gestinfo.postalcode
  };
  

  const retrievedNumber = sessionStorage.getItem('15digitnumber');
  var token=FlightSearchToken();
  var farerequest={
    'token_authorization':token,
'ConversationId':retrievedNumber,
'FareSourceCode':CheckoutFlightData.PricedItineraries[0].AirItineraryPricingInfo.FareSourceCode,
  };
  const customersearch={
    "token":'r9fdvwRyF35JUnD6xXdRiDELANYjtfASzPmyGol4-1PN461EY50LbXcqkfEfISsOJDrnFDJbuMzPuxTz37zFWGWBVemQGhi2SYLrr-MZ75vJSAiV73z94UOVrDz5P6R-0KjFqr9XR6P2857snQbcKTUn9YNqjBOQQIkXENeO7tmjxdTJs2KUVoXqo6fFyT9TTq99eKe288N-wyanZXxOsfABWPjtSom2oKLVz6vJnn1WeQwHSp7VnzPUqq53rn80eFXNBSMIiEXBdDmlsokRYSa0evDrQKluhnIzMYkRiazxtnkb-z5Xj0tQReTTHsLz1sgnit2mRGGzP4EIdBK8TiLuEN7GD1kmOT3CMreL7ELrI4yxmEbnYyflICtG-ySk3aZkk8iM9mRZlA7CS10Zuj-C0HEBOFW8vMzy4Eq2CET5WN62S1xe0HPAOrDVwO6jDvVpKEMwm-NiyyjkU8oTTlgYpN77pXtfFjKPTF0julnAMC6cPzxZOGBIkRv0',
    "city_name":checkoutdetail.destinationName,
    "destination": checkoutdetail.destinationName,
    "room_searching":homesearch.room,
    "child_searching": homesearch.child,
    "adult_searching": homesearch.adult,
    "adult_per_room": homesearch.adults,
    "child_per_room": homesearch.children,
    "country_nationality": homesearch.slc_nationality,
    "check_in": homesearch.check_in,
    "check_out": homesearch.check_out,
    "request_all_data":JSON.stringify(homesearch)
  };
  var adulttotal= Number(gbpPrices.adult)*Number(gbpPrices.adultqty);
  var childtotal=Number(gbpPrices.child)*Number(gbpPrices.childqty);
  var infanttotal=Number(gbpPrices.infant)*Number(gbpPrices.infantqty);
  var total=adulttotal+childtotal+infanttotal;
  var adminmarkupprice=0;
  var clientmarkupprice=0;
  
  FlightMarkup.markups.forEach((markup) => {
    if (markup.services_type === "flight" ) {
      if(markup.added_markup==="alhijaz"){

        if(markup.markup_type==='Percentage'){
          const markupValue = Number(markup.markup_value);
          const markupAmount = (Number(total) * markupValue) / 100;
          clientmarkupprice=markupAmount;
        }else {
          clientmarkupprice =Number(markup.markup_value);
        }

      }else if(markup.added_markup==="synchtravel"){

        if(markup.markup_type==='Percentage'){
          const markupValue = parseFloat(Number(markup.markup_value));
          const markupAmount = (Number(total) * markupValue) / 100;
          adminmarkupprice=markupAmount;
        }else {
          adminmarkupprice= Number(markup.markup_value);
        }

      }
      
    }
  });
  var data={
    'token_authorization':token,
    'ConversationId':retrievedNumber,
     'lead_passenger_details': JSON.stringify(leadpassengerdetail),
     'other_passenger_details': JSON.stringify(guests),
     'child_details': JSON.stringify(childs),
    'infant_details': JSON.stringify(infants),
    'extra_services_details':'',
    'other_extra_services_details':'',
    'child_extra_services_details':'',
    'revalidation_res':JSON.stringify({'Data':CheckoutFlightData}),
    'childs': IndexPageSearchData.child,
    'adults': IndexPageSearchData.adult,
    'infant': IndexPageSearchData.infant,
    'departure_date':IndexPageSearchData.DepartureDate,
    'search_rq':JSON.stringify( IndexPageSearchData),
    'search_rs': JSON.stringify({'Data':Search_response}),
    'farerules_rq': '',
    'farerules_rs':'',
    'revalidation_rq': JSON.stringify(farerequest),
    'revalidation_rs':  JSON.stringify({'Data':CheckoutFlightData}),
    'payment_details': JSON.stringify(status.data),
    'adult_price':Number(totalperson.adult)*AdultAmount,
    'child_price': Number(totalperson.child)*ChildAmount,
    'infant_price': Number(totalperson.infant)*InfantAmount,
    'total_price': ConverterTotalSum,
    'adult_price_markup': CalculateFLightMarkup(Number(totalperson.adult)*AdultAmount),
    'child_price_markup':CalculateFLightMarkup(Number(totalperson.child)*ChildAmount),
    'infant_price_markup': CalculateFLightMarkup(Number(totalperson.infant)*InfantAmount),
    'total_price_markup': MarkupSum,
    'client_commission_amount':exchangemarkup.client,
    'admin_commission_amount': exchangemarkup.admin,
    'currency': ConverterCurrency,
    'client_payable_price':Number(MarkupSum)-Number( exchangemarkup.client),
    'client_markup': clientmarkup.markup_value === undefined ? '' : clientmarkup.markup_value,
        'client_markup_type':clientmarkup.markup_type === undefined ? '' :  clientmarkup.markup_type,
        'client_commision_amount_exchange':clientmarkupprice,
        'client_without_markup_price': total,
        'client_markup_price': clientmarkupprice,
        'client_payable_price_exchange':  Number(total)+Number(clientmarkupprice),
        'client_currency': 'GBP',
        'admin_markup':adminmarkup.markup_value === undefined ? '' : adminmarkup.markup_value,
        'admin_markup_type':adminmarkup.markup_type === undefined ? '' : adminmarkup.markup_type,
        'admin_commision_amount_exchange': adminmarkupprice,
        'admin_without_markup_price': total,
        'admin_markup_price': adminmarkupprice,
        'admin_payable_price_exchange': Number(total)+Number(adminmarkupprice),
        'admin_currency': 'GBP',
    'creditAmount':MarkupSum,
    "hotel_checkout_select":JSON.stringify(checkoutdetail),
    "hotel_customer_search_data":JSON.stringify(customersearch),
  };  
 
      try {
      const response = await Axios.post('https://api.synchtravel.com/api/combine_booking_apis_new',data , {
        headers: {
        // "Access-Control-Allow-Origin": "*",
          // Required for CORS support to work
          //"Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
          // "Access-Control-Allow-Headers":
          // "Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale",
          // "Access-Control-Allow-Methods": "POST"
        } ,
        
      });
      setIsBooking(false);
        if(response.data.message==='success')
        {
            // navigation(`/Flight_invoice/${retrievedNumber}`, {
            //       state: {retrievedNumber}
            //     });
        }else{
          var data=JSON.parse( response.data.error);
          toast.info(data.Message, {
            position: toast.POSITION.TOP_RIGHT
          });
          return;

        }
      // navigate(`/hotel_detail/${id}`,{state:{index}})
    } catch (error) {
      // Handle errors here
      setIsBooking(false);

    console.log(error);
      console.error('Error:', error);
    }
}
};
const CalculateFLightMarkup=(price,check)=>{
  var admin=0;
var client=0;
  if(price !== "NaN"){
  FlightMarkup.markups.forEach((markup) => {
    if (markup.services_type === "flight" ) {
      if(markup.added_markup==="alhijaz"){

        if(markup.markup_type==='Percentage'){
          const markupValue = Number(markup.markup_value);
          const markupAmount = (Number(price) * markupValue) / 100;
          client= markupAmount;
      }else {
        client =Number(markup.markup_value);
      }

      }else if(markup.added_markup==="synchtravel"){

        if(markup.markup_type==='Percentage'){
          const markupValue = parseFloat(Number(markup.markup_value));
          const markupAmount = (Number(price) * markupValue) / 100;
          admin = markupAmount;
        }else {
          admin =Number(markup.markup_value);
        }
      }
      
    }
  });
  if(check===5){
    exchangemarkup.admin=admin;
    exchangemarkup.client=client;
  }
  var total=Number(price)+admin+client;
return total.toFixed(2);
}
};
  return (
    <>
    <Layout>
    <ToastContainer/>
      {/* <div className='contact-img'>
        <img src={bgimage} />
      </div> */}
      <div className='container-fluid'>
        <div className='row mt-5'>
          <div className='col-lg-8 margin-checkout'>
            <div class='row'>
              <div className='hotel-checkout-shadow p-3'>
                <div className='row'>
                  <div>
                    <h4>Lead Guest Information</h4>
                  </div>
                  <div class='form-group mt-2 col-md-6'>
                  <label className='fw-bold'>Title</label>
                    <select id='inputState' name='title' value={gestinfo.title} onChange={handlegestchange} class='form-control mt-2 form-select select-styling'>
                      <option selected>Select Title</option>
                      <option value='MR'>Mr</option>
                      <option value='MRS'>Mrs</option>
                    </select>
                  </div>
                  <div class='form-group mt-2 col-md-6'>
                  <label className='fw-bold'>First Name</label>
                    <input
                      type='text'
                      class='form-control mt-2'
                      value={gestinfo.firstname}
                      name='firstname'
                      onChange={handlegestchange}
                      placeholder='First Name'
                    />
                  </div>
                  <div class='form-group mt-2 col-md-6'>
                  <label className='fw-bold'>Last Name</label>
                    <input
                      type='text'
                      class='form-control mt-2'
                      value={gestinfo.lastname}
                      name='lastname'
                      onChange={handlegestchange}
                      placeholder='Last Name'
                    />
                  </div>
                  <div class='form-group mt-2 col-md-6'>
                  <label className='fw-bold'>Email</label>
                    <input
                      type='email'
                      class='form-control mt-2'
                      value={gestinfo.email}
                      name='email'
                      onChange={handlegestchange}
                      placeholder='Email'
                    />
                  </div>
                  <div class='form-group mt-2 col-md-6'>
                   
                  <label className='fw-bold'> Date Of Birth</label>
                  
                      <input
                        type='date'
                        class='form-control'
                        value={gestinfo.dateofbirth}
                        name='dateofbirth'
                        onChange={handlegestchange}
                        placeholder='DOB'
                      />
                  
                  </div>
                  
                  <div class='form-group field-icon-wrap mt-2 col-md-6'>
                  <label className='fw-bold'>Nationality</label>
                  <Select
                                        options={countryList}
                                        isSearchable={true}
                                        className="mt-2"
                                        onChange={handleCountryChange}
                                        value={selectedCountry}
                                        getOptionLabel={(option) => (
                                            <div>
                                            <img
                                                src={option.flag}
                                                alt={option.label}
                                                style={{ width: '20px', marginRight: '8px' }}
                                            />
                                            {option.label} ({option.phoneCode})
                                            </div>
                                        )}
                                        getOptionValue={(option) => option.value}
                                        />
                  </div>
                  <div class='form-group mt-2 col-md-6'>
                  <label className='fw-bold'>Phone Number</label>
                    <input
                      type='text'
                      class='form-control mt-2'
                      value={gestinfo.phonenumber}
                      name='phonenumber'
                      onChange={handlegestchange}
                      placeholder='Phone Number'
                    />
                  </div>
                  {storedData !==null && (
                    <>
                  <div class='form-group mt-2 col-md-6'>
                  <label className='fw-bold'>Gender</label>
                    <select id='inputState' name='gender' value={gestinfo.gender} onChange={handlegestchange} class='form-control form-select mt-2 select-styling'>
                    <option selected>Select Gender</option>
                            <option value='M'>Male</option>
                            <option value='F'>Female</option>
                    </select>
                  </div>
                  <div class='form-group mt-2 col-md-6'>
                  <label className='fw-bold'>Passport Number</label>
                    <input
                      type='text'
                      class='form-control mt-2'
                      value={gestinfo.pno}
                      name='pno'
                      onChange={handlegestchange}
                      placeholder='Passport Number'
                    />
                  </div>
                  <div class='form-group mt-2 col-md-6'>
                    <label className='fw-bold'>Passport Expiry</label>
                    <input
                      type='date'
                      value={gestinfo.pexpiry}
                      onChange={handlegestchange}
                      class='form-control mt-2'
                      name='pexpiry'
                    />
                  </div>
                  <div class='form-group mt-2 col-md-6'>
                    <label className='fw-bold'>Country</label>
                    <Select
                                        options={countryList}
                                        isSearchable={true}
                                        className="mt-2"
                                        onChange={handleCountryChangeother}
                                        value={selectedCountryother}
                                        getOptionLabel={(option) => (
                                            <div>
                                            <img
                                                src={option.flag}
                                                alt={option.label}
                                                style={{ width: '20px', marginRight: '8px' }}
                                            />
                                            {option.label} ({option.phoneCode})
                                            </div>
                                        )}
                                        getOptionValue={(option) => option.value}
                                        />
                  </div>
                  <div class='form-group mt-2 col-md-6'>
                  <label className='fw-bold'>Pstal Code</label>
                    <input
                      type='number'
                      class='form-control mt-2'
                      value={gestinfo.postalcode}
                      name='postalcode'
                      onChange={handlegestchange}
                      placeholder='Postal Code'
                    />
                  </div>
                  </>
                  )}
                </div>
              </div>
            </div>
            {(adultCount-1 !==0 || childCount !==0 || infantCount !==0) && (
            <div class='row'>
              <div className='hotel-checkout-shadow mt-4 p-3'>
                <div className='d-flex justify-content-between'>
                  <h4>Other Guest Information {storedData !== null ? '' : '(Optional)'}</h4>
                  <span className='mt-auto mb-auto'><FontAwesomeIcon icon={faAngleDown}/></span>
                </div>
                {adultsArray.map((_,index)=>(
                <div key={index} className='row pt-2'>
                  <h5 className='mb-2'>Guest #{index+2}</h5>
                <div className='col-md-3 mt-2'>
                <label className='fw-bold'>Title</label>
                <select value={guests.title} id={`inputState_${index}`} name='title'  onChange={(e) => otherGuestInfo(e, index,1)}  class='form-control mt-2 form-select select-styling'>
                      <option selected>Select Title</option>
                      <option value='MR'>Mr.</option>
                      <option value='MRS'>Mrs.</option>
                    </select>
                </div>
                  <div className='col-md-3 mt-2'>
                  <label className='fw-bold'>First Name</label>
                  <input
                      type='text'
                      class='form-control mt-2'
                      value={guests.firstname}
                      name='firstname'
                      placeholder='First Name'
                      onChange={(e) => otherGuestFirstName(e, index,1)}
                    />
                    </div>
                    <div className='col-md-3 mt-2'>
                    <label className='fw-bold'>Last Name</label>
                  <input
                      type='text'
                      class='form-control mt-2'
                      value={guests.lastname}
                      name='lastname'
                      placeholder='Last Name'
                      onChange={(e) => otherGuestLastName(e, index,1)}
                    />
                    </div>
                    <div className='col-md-3 mt-2'>
                    <label className='fw-bold'>Nationality</label>
                    <select
                      value={guests.nationality} // Set the selected value from the state
                      onChange={(e) => otherGuestNationality(e, index,1)}
                      className='form-control form-select mt-2 select-styling'
                      aria-label='Default select example'
                    >
                      <option selected>Nationality</option>
                      {countryList.map((item, index) => (
                        <option key={item.id} value={item.iso2}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    </div>
                    {storedData !== null && (
                      <>
                    <div className='col-md-3 mt-2'>
                  <label className='fw-bold'>Date of Birth</label>
                  <input
                      type='date'
                      class='form-control mt-2'
                      value={guests.dob}
                      name='dob'
                      onChange={(e) => otherGuestdob(e, index,1)}
                    />
                    </div>
                    <div className='col-md-3 mt-2'>
                          <label className='fw-bold'>Gender:</label>
                          <select
                            value={guests.gender}
                            name='gender'
                            onChange={e => otherGuestGender(e, index,1)}
                            class='form-control  mt-2 form-select select-styling'
                          >
                            <option selected>Select Gender</option>
                            <option value='M'>Male</option>
                            <option value='F'>Female</option>
                          </select>
                        </div>
                        <div className='col-md-3 mt-2'>
                  <label className='fw-bold'>Passport Number</label>
                  <input
                      type='text'
                      class='form-control mt-2'
                      value={guests.pnumber}
                      name='pnumber'
                      placeholder='Passport Number'
                      onChange={(e) => otherGuestPNumber(e, index,1)}
                    />
                    </div>
                    <div className='col-md-3 mt-2'>
                  <label className='fw-bold'>Passport Expiry</label>
                  <input
                      type='date'
                      class='form-control mt-2'
                      value={guests.pexpiry}
                      name='pexpiry'
                      onChange={(e) => otherGuestPExpiry(e, index,1)}
                    />
                    </div>
                    </>
                    )}
                    </div>
                     ))}
                     {childsArray.map((_,index)=>(
                <div key={index} className='row pt-2'>
                  <h5 className='mb-2'>Child #{index+1}</h5>
                <div className='col-md-3 mt-2'>
                <select value={guests.title} id={`inputState_${index}`} name='title'  onChange={(e) => otherGuestInfo(e, index,2)}  class='form-control form-select select-styling'>
                      <option selected>Select Title</option>
                      <option value='MSTR'>Mr.</option>
                      <option value='MSTRS'>Mrs.</option>
                    </select>
                </div>
                  <div className='col-md-3 mt-2'>
                  <input
                      type='text'
                      class='form-control'
                      name='firstname'
                      placeholder='First Name'
                      onChange={(e) => otherGuestFirstName(e, index,2)}

                    />
                    </div>
                    <div className='col-md-3 mt-2'>
                  <input
                      type='text'
                      class='form-control'
                      name='firstname'
                      placeholder='Last Name'
                      onChange={(e) => otherGuestLastName(e, index,2)}
                    />
                    </div>
                    <div className='col-md-3 mt-2'>
                    <select
                      value={childs.nationality} // Set the selected value from the state
                      onChange={(e) => otherGuestNationality(e, index,2)}
                      className='form-control form-select select-styling'
                      aria-label='Default select example'
                    >
                      <option selected>Nationality</option>
                      {countryList.map((item, index) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    </div>
                    {storedData !== null && (
                      <>
                    <div className='col-md-3 mt-2'>
                  <label className='fw-bold'>Date of Birth</label>
                  <input
                      type='date'
                      class='form-control mt-2'
                      value={guests.dob}
                      name='dob'
                      onChange={(e) => otherGuestdob(e, index,2)}
                    />
                    </div>
                    <div className='col-md-3 mt-2'>
                          <label className='fw-bold'>Gender:</label>
                          <select
                            value={guests.gender}
                            name='gender'
                            onChange={e => otherGuestGender(e, index,2)}
                            class='form-control  mt-2 form-select select-styling'
                          >
                            <option selected>Select Gender</option>
                            <option value='M'>Male</option>
                            <option value='F'>Female</option>
                          </select>
                        </div>
                        <div className='col-md-3 mt-2'>
                  <label className='fw-bold'>Passport Number</label>
                  <input
                      type='text'
                      class='form-control mt-2'
                      value={guests.pnumber}
                      name='pnumber'
                      placeholder='Passport Number'
                      onChange={(e) => otherGuestPNumber(e, index,2)}
                    />
                    </div>
                    <div className='col-md-3 mt-2'>
                  <label className='fw-bold'>Passport Expiry</label>
                  <input
                      type='date'
                      class='form-control mt-2'
                      value={guests.pexpiry}
                      name='pexpiry'
                      onChange={(e) => otherGuestPExpiry(e, index,2)}
                    />
                    </div>
                    </>
                    )}
                    </div>
                     ))}
                      {infantsArray.map((_,index)=>(
                <div key={index} className='row pt-2'>
                  <h5 className='mb-2'>Infant #{index+1}</h5>
                <div className='col-md-3 mt-2'>
                <select value={guests.title} id={`inputState_${index}`} name='title'  onChange={(e) => otherGuestInfo(e, index,3)}  class='form-control form-select select-styling'>
                      <option selected>Select Title</option>
                      <option value='MSTR'>Mr.</option>
                      <option value='MSTRS'>Mrs.</option>
                    </select>
                </div>
                  <div className='col-md-3 mt-2'>
                  <input
                      type='text'
                      class='form-control'
                      name='firstname'
                      placeholder='First Name'
                      onChange={(e) => otherGuestFirstName(e, index,3)}

                    />
                    </div>
                    <div className='col-md-3 mt-2'>
                  <input
                      type='text'
                      class='form-control'
                      name='firstname'
                      placeholder='Last Name'
                      onChange={(e) => otherGuestLastName(e, index,3)}
                    />
                    </div>
                    <div className='col-md-3 mt-2'>
                    <select
                      value={infants.nationality} // Set the selected value from the state
                      onChange={(e) => otherGuestNationality(e, index,3)}
                      className='form-control form-select select-styling'
                      aria-label='Default select example'
                    >
                      <option selected>Nationality</option>
                      {countryList.map((item, index) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    </div>
                    {storedData !== null && (
                      <>
                    <div className='col-md-3 mt-2'>
                  <label className='fw-bold'>Date of Birth</label>
                  <input
                      type='date'
                      class='form-control mt-2'
                      value={guests.dob}
                      name='dob'
                      onChange={(e) => otherGuestdob(e, index,3)}
                    />
                    </div>
                    <div className='col-md-3 mt-2'>
                          <label className='fw-bold'>Gender:</label>
                          <select
                            value={guests.gender}
                            name='gender'
                            onChange={e => otherGuestGender(e, index,3)}
                            class='form-control  mt-2 form-select select-styling'
                          >
                            <option selected>Select Gender</option>
                            <option value='M'>Male</option>
                            <option value='F'>Female</option>
                          </select>
                        </div>
                        <div className='col-md-3 mt-2'>
                  <label className='fw-bold'>Passport Number</label>
                  <input
                      type='text'
                      class='form-control mt-2'
                      value={guests.pnumber}
                      name='pnumber'
                      placeholder='Passport Number'
                      onChange={(e) => otherGuestPNumber(e, index,3)}
                    />
                    </div>
                    <div className='col-md-3 mt-2'>
                  <label className='fw-bold'>Passport Expiry</label>
                  <input
                      type='date'
                      class='form-control mt-2'
                      value={guests.pexpiry}
                      name='pexpiry'
                      onChange={(e) => otherGuestPExpiry(e, index,3)}
                    />
                    </div>
                    </>
                    )}
                    </div>
                     ))}
              </div>
              </div>
            )}
              {/* {(otherDiv.child !=='' || otherDiv.adult !==0 || otherDiv.infant !=='') && (
              <div class='row'>
              <div className='hotel-checkout-shadow mt-4 p-3'>
                <div className='d-flex justify-content-between'>
                  <h4>Flight Other Passenger Detail</h4>
                  <span className='mt-auto mb-auto'><FontAwesomeIcon icon={faAngleDown}/></span>
 
                </div>
                <div>
                    {adultsArray.map((_, index) => (
                      <div className='row' key={index}>
                        <div className='mt-4'>
                          <h5>Adult {index + 2} Detail</h5>
                        </div>
                        <input
                          type='hidden'
                          name={`adultType${index}`}
                          value='adults'
                        />
                        <div class='form-group mt-4 col-md-4 col-sm-6 mt-2'>
                    <label className='fw-bold'>Title</label>
                    <select
                      value={adultsData.other_title}
                      onChange={e => otherGuesttitle(e, index)}
                      id='inputState'
                      name='title'
                      class='form-control form-select select-styling mt-2'
                    >
                      <option selected>Select Title</option>
                      <option value='MR'>Mr.</option>
                      <option value='MRS'>Mrs.</option>
                    </select>
                  </div>
                        <div class='form-group mt-4 col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>First Name</label>
                          <input
                            type='text'
                            value={adultsData.other_first_name}
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
                            value={adultsData.other_last_name}
                            name='lastname'
                            placeholder='Last Name'
                            onChange={e => otherGuestLastName(e, index)}
                          />
                        </div>

                        <div class='form-group col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Date Of Birth</label>
                          <input
                            type='date'
                            class='form-control mt-2'
                            value={adultsData.other_date_of_birth}
                            name='dob'
                            onChange={e => otherGuestdob(e, index)}
                            placeholder='First Name'
                          />
                        </div>
                        <div className='form-group col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Gender:</label>
                          <select
                            value={adultsData.other_gender}
                            name='gender'
                            onChange={e => otherGuestInfo(e, index)}
                            class='form-control  mt-2 form-select select-styling'
                          >
                            <option selected>Select Gender</option>
                            <option value='M'>Male</option>
                            <option value='F'>Female</option>
                          </select>
                        </div>
                        <div class='form-group field-icon-wrap  col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Nationality</label>
                          <select
                            value={adultsData.other_passport_country} // Set the selected value from the state
                            onChange={e => otherGuestNationality(e, index)}
                            className='form-control  mt-2 form-select select-styling'
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

                        <div class='form-group col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Passport Number</label>
                          <input
                            type='text'
                            class='form-control  mt-2'
                            value={adultsData.other_passport_no}
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
                            value={adultsData.other_passport_expiry_date}
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
                    <label className='fw-bold'>Title</label>
                    <select
                      value={childrenData.child_title}
                      onChange={e => otherGuesttitle(e, index,true,false)}
                      id='inputState'
                      name='title'
                      class='form-control form-select select-styling mt-2'
                    >
                      <option selected>Select Title</option>
                      <option value='MSTR'>Mr.</option>
                      <option value='MSTRS'>Mrs.</option>
                    </select>
                  </div>
                        <div class='form-group mt-4 col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>First Name</label>
                          <input
                            type='text'
                            value={childrenData.child_first_name}
                            name='firstname'
                            placeholder='First Name'
                            onChange={e => otherGuestFirstName(e, index,true,false)}
                            class='form-control mt-2'
                          />
                        </div>
                        <div class='form-group mt-4 col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Last Name</label>
                          <input
                            type='text'
                            class='form-control mt-2'
                            value={childrenData.child_last_name}
                            name='lastname'
                            placeholder='Last Name'
                            onChange={e => otherGuestLastName(e, index,true,false)}
                          />
                        </div>

                        <div class='form-group  col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Date Of Birth</label>
                          <input
                            type='date'
                            class='form-control mt-2'
                            value={childrenData.child_date_of_birth}
                            name='dob'
                            onChange={e => otherGuestdob(e, index,true,false)}
                            placeholder='First Name'
                          />
                        </div>
                        <div className='form-group col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Gender:</label>
                          <select
                            value={childrenData.child_gender}
                            name='gender'
                            onChange={e => otherGuestInfo(e, index,true,false)}
                            class='form-control  mt-2 form-select select-styling'
                          >
                            <option selected>Select Gender</option>
                            <option value='M'>Male</option>
                            <option value='F'>Female</option>
                          </select>
                        </div>
                        <div class='form-group field-icon-wrap  col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Nationality</label>
                          <select
                            value={childrenData.child_passport_country} // Set the selected value from the state
                            onChange={e => otherGuestNationality(e, index,true,false)}
                            className='form-control form-select  mt-2 select-styling'
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

                        <div class='form-group col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Passport Number</label>
                          <input
                            type='text'
                            class='form-control  mt-2 '
                            value={childrenData.child_passport_no}
                            name='passportno'
                            onChange={e => otherGuestpassportnumber(e, index,true,false)}
                            placeholder='Passport Number'
                          />
                        </div>
                        <div class='form-group col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Passport Expiry</label>
                          <input
                            type='date'
                            class='form-control mt-2'
                            value={childrenData.child_passport_expiry_date}
                            name='passportexpiry'
                            onChange={e => otherGuestpassportexpiry(e, index,true)}
                          />
                        </div>
                      </div>
                    ))}
                      {infantArray.map((_, index) => (
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
                    <label className='fw-bold'>Title</label>
                    <select
                      value={infantData.infant_title}
                      onChange={e => otherGuesttitle(e, index,false,true)}
                      id='inputState'
                      name='title'
                      class='form-control form-select select-styling mt-2'
                    >
                      <option selected>Select Title</option>
                      <option value='MSTR'>Mr.</option>
                      <option value='MSTRS'>Mrs.</option>
                    </select>
                  </div>
                        <div class='form-group mt-4 col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>First Name</label>
                          <input
                            type='text'
                            value={infantData.infant_first_name}
                            name='firstname'
                            placeholder='First Name'
                            onChange={e => otherGuestFirstName(e, index,false,true)}
                            class='form-control mt-2'
                          />
                        </div>
                        <div class='form-group mt-4 col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Last Name</label>
                          <input
                            type='text'
                            class='form-control mt-2'
                            value={infantData.infant_last_name}
                            name='lastname'
                            placeholder='Last Name'
                            onChange={e => otherGuestLastName(e, index,false,true)}
                          />
                        </div>

                        <div class='form-group  col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Date Of Birth</label>
                          <input
                            type='date'
                            class='form-control mt-2'
                            value={infantData.infant_date_of_birth}
                            name='dob'
                            onChange={e => otherGuestdob(e, index,false,true)}
                            placeholder='First Name'
                          />
                        </div>
                        <div className='form-group col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Gender:</label>
                          <select
                            value={infantData.infant_gender}
                            name='gender'
                            onChange={e => otherGuestInfo(e, index,false,true)}
                            class='form-control  mt-2 form-select select-styling'
                          >
                            <option selected>Select Gender</option>
                            <option value='M'>Male</option>
                            <option value='F'>Female</option>
                          </select>
                        </div>
                        <div class='form-group field-icon-wrap  col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Nationality</label>
                          <select
                            value={infantData.infant_passport_country} // Set the selected value from the state
                            onChange={e => otherGuestNationality(e, index,false,true)}
                            className='form-control  mt-2 form-select select-styling'
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

                        <div class='form-group col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Passport Number</label>
                          <input
                            type='text'
                            class='form-control  mt-2'
                            value={infantData.infant_passport_no}
                            name='passportno'
                            onChange={e => otherGuestpassportnumber(e, index,false,true)}
                            placeholder='Passport Number'
                          />
                        </div>
                        <div class='form-group col-md-4 col-sm-6 mt-2'>
                          <label className='fw-bold'>Passport Expiry</label>
                          <input
                            type='date'
                            class='form-control mt-2'
                            value={infantData.infant_passport_expiry_date}
                            name='passportexpiry'
                            onChange={e => otherGuestpassportexpiry(e, index,false,true)}
                          />
                        </div>
                      </div>
                    ))}
                    </div>
              </div>
              </div>
               )} */}
               {checkoutdetail?.rooms_list[0].request_type =='' && (
                  <div class='row mt-4'>
                    <div className='hotel-checkout-shadow p-3'>
                      <div className='row'>
                        <div>
                          <h4>Payment Method</h4>
                        </div>
                        <div class='section-tab check-mark-tab text-center mt-3 pb-4'>
                          <ul class='nav nav-tabs' id='myTab' role='tablist'>
                            <li class='nav-item'>
                              
                                <i class='la la-check icon-element'></i>
                                <img
                                  src={payment}
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
                            class='form-control'
                            name='name'
                          value={cardInfo.name}
                          onChange={handlecarddetail}
                            placeholder='Name'
                          />
                        </div>
                        <div class='form-group mt-2 col-md-6'>
                        <label htmlFor="cardNumber" className="form-label">Card number</label>
                          <CardNumberElement  className="form-control" id="cardNumber" />
                        </div>
                        <div class='form-group mt-2 col-md-6'>
                          <label htmlFor="expiryDate" className="form-label">Expiration date</label>
                          <CardExpiryElement className="form-control" id="expiryDate" />
                        </div>
                        <div class='form-group mt-2 col-md-6'>
                        <label htmlFor="cvc" className="form-label">CVC</label>
                          <CardCvcElement className="form-control" id="cvc" />
                        </div>
                        {error && (
                    <div style={{color:"red"}}  className="error mt-2" role="alert">
                      {error}
                    </div>
                  
                  )}
                      </div>
                    </div>
                  </div>
                )}
            <div class='col-12 mt-3'>
              <div class='form-check'>
                <input
                  class='form-check-input'
                  type='checkbox'
                  checked={isChecked} // Set the checked state
                  onChange={handleCheckboxContinue}
                  id='invalidCheck'
                  required
                />
                <label class='form-check-label' for='invalidCheck'>
                  By continuing, you agree to the{' '}
                  <span style={{ color: 'red' }}> Terms and conditions</span>
                </label>
              </div>
              <button className='btn fw-bold btn-warning'disabled={isBooking} onClick={confirmbooking}>
                {' '}
                {isBooking ? 'Please Wait....' : 'Confirm Booking'}
              </button>
              {/* <button className='btn fw-bold btn-warning'onClick={showdata}>
                {' '}
                Show
              </button> */}
            </div>
          </div>
          <div className='col-lg-4 order-first order-md-last'>
            <div className='checkout-hotel-detail p-3'>
              <div>
                <h4>Booking Detail</h4>
              </div>
              <div className='tour_booking_amount_area'>
                <div className='Hotel-img'>
                  <div class='card-img mt-2 pb-4'>
                    <a href='hotel-single.html' class='d-block'>
                      <img
                        src={hotelimg}
                        alt='tour-img'
                      />
                    </a>
                  </div>
                  <div className='card-body  '>
                    <div class='d-flex justify-content-between'>
                      <div>
                        <h4 class='card-title'>{checkoutdetail?.hotel_name}</h4>
                        <p class='card-meta'>
                          {checkoutdetail?.destinationName}
                        </p>
                      </div>
                      <div></div>
                    </div>
                    <ul class='list-items  list-items-2 py-2'>
                      <li>
                        <span>Check In:</span>
                        {moment(checkoutdetail?.checkIn).format('DD-MM-YYYY')}
                      </li>
                      <li>
                        <span>Check Out:</span>
                        {moment(checkoutdetail?.checkOut).format('DD-MM-YYYY')}
                      </li>
                    </ul>
                    {checkoutdetail?.rooms_list.map((item,index)=>(
                      <div key={index}>
                   <div className='border-line'></div>
                   {item.request_type !=='' &&(
                        <div className=' mt-2 room-request'>
                          <h6>Room on Request</h6>
                        </div>
                      ) }
                    <ul class='list-items list-items-2 py-3'>
                      <li>
                        <span>Room Type:</span>{item.board_id}
                      </li>
                      <li>
                        <span>Room:</span>{item.selected_qty} Room
                      </li>
                      {showPrice ?(
                         <li>
                         <span>Room Price:</span>{CurrencyRates===undefined ? (baseCName):(CurrencyRates.selectedcurrency)} {hotaltotal=Number(renderPrice(calculateMarkup(item.rooms_total_price))).toFixed(2)}
                       </li>
                      ):(
                        <li>
                        <span>Room Price:</span>{checkoutdetail.currency} {hotaltotal=Number(calculateMarkup(item.rooms_total_price)).toFixed(2)}
                      </li>
                      )}
                     
                      <li>
                        <span>Adults:</span>{item.adults}
                      </li>
                      <li>
                        <span> Children :</span>{item.childs}
                      </li>

                      <li>
                        <span>Stay:</span>{daysBetween} Nights{' '}
                      </li>
                    </ul>
                    </div>
                    
                     ))}
                     <div className='border-line mt-2'></div>
                    {storedData !==null && (
                      <>
                    {storedData.PricedItineraries.map((item, index) => (
                  <div key={index}>
                    <div className='flight-checkout-logo'>
                      
                </div>
                  <h4 className='text-center' style={{color:'cadetblue'}}>Flight Detail</h4>
                    
                    <div className='mt-2 text-center'>
                      <h5>{item.DirectionInd} Flight</h5>
                    </div>
                  
                            {item.OriginDestinationOptions.map((item3,index)=>(
                            <div key={index}>
                    {item3.FlightSegments.map(
                      (flight, index) => (
                        <div key={index}>
                          <div className='border-line mt-2'></div>
                          <div class='container3 mt-2'>
                            <h5 class='text3'>
                              {flight.DepartureAirportLocationCode}
                            </h5>
                            <h5>
                              <FontAwesomeIcon icon={faArrowRight} />
                            </h5>
                            <h5 class='text2'>
                              {flight.ArrivalAirportLocationCode}
                            </h5>
                          </div>
                          <div className='border-line mt-2'></div>
                          <div className='tour_booking_amount_area'>
                            <div className='Hotel-img'>
                              <div className='card-body  '>
                                <ul class='list-items  list-items-2 mt-2 py-2'>
                                  <li className='mt-2'>
                                    <span>Airline :</span>
                                    {
                                      Airlinenamesdata[
                                        storedData.PricedItineraries[0]
                                          .ValidatingAirlineCode
                                      ].AirLineName
                                    }
                                  </li>

                                  <li className='mt-2'>
                                    <span>Flight Type :</span>
                                    {
                                      flight.CabinClassType
                                    }
                                  </li>

                                  <li className='mt-2'>
                                    <span>Flight Number :</span>
                                    {flight.FlightNumber}
                                  </li>
                                  <li className='mt-2'>
                                    <span>Stop:</span>
                                    {flight.StopQuantity === 0 ? "Non-stop" : flight.StopQuantity+"Stop"}
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
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
                                    <h4 class='left h4-line'>
                                      {' '}
                                      {moment(flight.DepartureDateTime).format(
                                        'LT'
                                      )}
                                      <br></br>(
                                      {flight.DepartureAirportLocationCode})
                                    </h4>
                                    <h4 class='center fl-width  h4-line text-center'>
                                      <FontAwesomeIcon
                                        color='gray'
                                        icon={faClockFour}
                                      />{' '}
                                     
                                      {Math.floor(flight.JourneyDuration / 60)}h{' '}
                                      {flight.JourneyDuration % 60}m
                                    </h4>
                                    <h4 class='right  h4-line fl-width text-end'>
                                      {moment(flight.ArrivalDateTime).format(
                                        'LT'
                                      )}
                                      <span>
                                        {' '}
                                        ({flight.ArrivalAirportLocationCode})
                                      </span>
                                    </h4>
                                  </div>
                                  <div class='fl-route-direction'>
                                    <div class='fl-route-bar'></div>
                                    <div class='fl-icon'>
                                      <FontAwesomeIcon icon={faPlane} />
                                    </div>
                                  </div>
                                  <div class='fl-route-detail'>
                                    <p
                                      class='left'
                                      style={{ fontSize: '.9em' }}
                                    >
                                      {' '}
                                      <br />{' '}
                                      {moment(flight.DepartureDateTime).format(
                                        'll'
                                      )}
                                    </p>
                                    <p
                                      class='center text-center'
                                      style={{ fontSize: '.9em' }}
                                    >
                                    </p>
                                    <p
                                      class='right text-end'
                                      style={{ fontSize: '.9em' }}
                                    >
                                      <br />{' '}
                                      {moment(flight.ArrivalDateTime).format(
                                        'll'
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                    </div>
                     ))}
                    <div className='border-line mt-2'></div>
                    <div className='tour_booking_amount_area'>
                      <div className='Hotel-img'>
                        <div class='card-img mt-2 pb-4'></div>
                        <div className='card-body  '>
                          <div className='mt-2'>
                            <h4 class='card-title'>Baggage Info:</h4>
                          </div>
                          <div >
                          <ul class='list-items mt-2 list-items-2 py-2'>
                          {item.AirItineraryPricingInfo.PTC_FareBreakdowns.map((item1, index) => (
                        
                           <li key={index} className='mt-2'>
                            {item1.PassengerTypeQuantity.Code==='ADT' && (
                                <div style={{display:'contents'}}>
                              <span>Adult Baggage :</span>  <span>{item1.BaggageInfo[0]}/ {item1.CabinBaggageInfo[0]}</span>
                              </div>
                            
                              )}
                               {item1.PassengerTypeQuantity.Code==='CHD' && (
                                <div style={{display:'contents'}}>
                              <span>Child Baggage :</span>  <span>{item1.BaggageInfo[0]}/ {item1.CabinBaggageInfo[0]}</span>
                              </div>
                            
                              )}
                              {item1.PassengerTypeQuantity.Code==='INF' && (
                                <div style={{display:'contents'}}>
                              <span>Infant Baggage :</span>  <span>{item1.BaggageInfo[0]}/ {item1.CabinBaggageInfo[0]}</span>
                              </div>
                            
                              )}
                            </li>
                             ))}
                          </ul>
                          </div>
                         
                          <div className='border-line'></div>
                          <div className='mt-2'>
                            <h4 class='card-title'>Payment Info:</h4>
                          </div>
                          <div>
                            {showPrice ?(
                              <ul class='list-items mt-2 list-items-2 py-2'>
                              {item.AirItineraryPricingInfo.PTC_FareBreakdowns.map((item1, index) => (
                            
                            <li key={index} className='mt-2'>
                            {item1.PassengerTypeQuantity.Code==='ADT' && (
                                <div style={{display:'contents'}}>
                              <span>Adult Price :</span>  <span>{item1.PassengerTypeQuantity.Quantity} * {CurrencyRates===undefined ? (baseCName):(CurrencyRates.selectedcurrency)} {CalculateFLightMarkup(AdultAmount =renderPrice2(item1.PassengerFare.TotalFare.Amount,item1.PassengerTypeQuantity.Quantity,2))}</span>
                              </div>
                            
                              )}
                              {item1.PassengerTypeQuantity.Code==='CHD' && (
                                <div style={{display:'contents'}}>
                              <span>Child Price :</span>  <span>{item1.PassengerTypeQuantity.Quantity} * {CurrencyRates===undefined ? (baseCName):(CurrencyRates.selectedcurrency)} {CalculateFLightMarkup(ChildAmount=renderPrice2(item1.PassengerFare.TotalFare.Amount,item1.PassengerTypeQuantity.Quantity,3))}</span>
                              </div>
                            
                              )}
                              {item1.PassengerTypeQuantity.Code==='INF' && (
                                <div style={{display:'contents'}}>
                              <span>Infant Price :</span>  <span>{item1.PassengerTypeQuantity.Quantity} * {CurrencyRates===undefined ? (baseCName):(CurrencyRates.selectedcurrency)} {CalculateFLightMarkup(InfantAmount=renderPrice2(item1.PassengerFare.TotalFare.Amount,item1.PassengerTypeQuantity.Quantity,4))}</span>
                              </div>
                            
                              )}
                            
                            </li>
                              
                                ))}
                              </ul>
                              ):(
                                <ul class='list-items mt-2 list-items-2 py-2'>
                                {item.AirItineraryPricingInfo.PTC_FareBreakdowns.map((item1, index) => (
                              
                                <li key={index} className='mt-2'>
                                  {item1.PassengerTypeQuantity.Code==='ADT' && (
                                      <div style={{display:'contents'}}>
                                      <span>Adult Price :</span>  <span>{item1.PassengerTypeQuantity.Quantity} * {item1.PassengerFare.TotalFare.CurrencyCode}  {CalculateFLightMarkup(AdultAmount =item1.PassengerFare.TotalFare.Amount)}</span> </div>
                                  
                                    )}
                                    {item1.PassengerTypeQuantity.Code==='CHD' && (
                                      <div style={{display:'contents'}}>
                                      <span>Child Price :</span>  <span>{item1.PassengerTypeQuantity.Quantity} * {item1.PassengerFare.TotalFare.CurrencyCode}  {CalculateFLightMarkup(ChildAmount=item1.PassengerFare.TotalFare.Amount)}</span></div>
                                  
                                    )}
                                    {item1.PassengerTypeQuantity.Code==='INF' && (
                                      <div style={{display:'contents'}}>
                                    <span>Infant Price :</span>  <span>{item1.PassengerTypeQuantity.Quantity} * {item1.PassengerFare.TotalFare.CurrencyCode}  {CalculateFLightMarkup(InfantAmount=item1.PassengerFare.TotalFare.Amount)}</span>
                                    </div>
                                  
                                    )}
                                  
                                  </li>
                            
                                  ))}
                                </ul>
                          )}
                          </div>
                          <div >
                          <ul class='list-items mt-2 list-items-2 py-2'>
                          {showPrice ?(
                            <>
                            <div className='border-line'></div>
                            <li  className='mt-2 '>
                             <span>Flight Total : </span>{CurrencyRates===undefined ? (ConverterCurrency=baseCName):(ConverterCurrency=CurrencyRates.selectedcurrency)} {flighttotal=MarkupSum=CalculateFLightMarkup(ConverterTotalSum=renderPrice2(Totalsum,1,1),5)}
                            </li><li  className='mt-2 '>
                             <span>Hotel Total : </span> {CurrencyRates===undefined ? (baseCName):(CurrencyRates.selectedcurrency)} {hotaltotal}
                            </li>
                            </>
                            ):(
                              <>
                              <div className='border-line'></div>
                              <li  className='mt-2 '>
                              <span>Flight Total : </span> {ConverterCurrency=Currency} {flighttotal=MarkupSum=CalculateFLightMarkup(ConverterTotalSum=Totalsum)}
                             </li>
                             <li  className='mt-2 '>
                             <span>Hotel Total : </span> {checkoutdetail.currency} {hotaltotal=savemarkup.final.toFixed(2)}
                            </li>
                            </>
                            )}
                          </ul>
                          </div>
                          {/* <div className='border-line'></div> */}
                          {/* <ul class='list-items  list-items-2 py-2'>
                        <li>
                          <span>October Umrah Package Group 1</span>£ 18250
                        </li>
                      </ul> */}
                          <div className='border-line'></div>

                          <div className='text-center'>
                            {/* <button class='btn btn-primary btn-block select-styling search-btn1'>
                          Book Package
                        </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                 </>
                    )}
                    <ul class='list-items list-items-2 pt-3'>
                    {/* {showPrice?(
                         <li>
                         <span>Sub Total:</span> {CurrencyRates===undefined ? (baseCName):(CurrencyRates.selectedcurrency)} {Number(renderPrice(savemarkup.final))+Number(CalculateFLightMarkup(renderPrice(Totalsum,Currency)))}
                       </li>
                      ):(
                        <li>
                        <span>Sub Total:</span>{checkoutdetail.currency} {savemarkup.final.toFixed(2)}
                      </li>
                      )}
                      <li>
                        <span>Taxes And Fees:</span>0
                      </li>
                      {showPrice ?(
                         <li>
                         <span>Total Price:</span>{CurrencyRates===undefined ? (StripeCurrency=baseCName):(StripeCurrency= CurrencyRates.selectedcurrency)} {StripePayment=(Number(renderPrice(savemarkup.final,1))+Number(CalculateFLightMarkup(renderPrice(Totalsum,Currency))))}
                       </li>
                      ):(
                        <li>
                        <span>Total Price:</span>{StripeCurrency=checkoutdetail.currency} {StripePayment=savemarkup.final.toFixed(2)}
                      </li>
                      )} */}
                      {storedData ===null ? (
                        <>
                        {showPrice?(
                         <li>
                         <span>Sub Total:</span> {CurrencyRates===undefined ? (baseCName):(CurrencyRates.selectedcurrency)} {Number(renderPrice(savemarkup.final))}
                       </li>
                      ):(
                        <li>
                        <span>Sub Total:</span>{checkoutdetail.currency} {savemarkup.final.toFixed(2)}
                      </li>
                      )}
                      <li>
                        <span>Taxes And Fees:</span>0
                      </li>
                      {showPrice ?(
                         <li className='fw-bold'>
                         <span>Total Price:</span>{CurrencyRates===undefined ? (StripeCurrency=baseCName):(StripeCurrency= CurrencyRates.selectedcurrency)} {StripePayment=(Number(renderPrice(savemarkup.final,1)))}
                       </li>
                      ):(
                        <li className='fw-bold'>
                        <span>Total Price:</span>{StripeCurrency=checkoutdetail.currency} {StripePayment=savemarkup.final.toFixed(2)}
                      </li>
                      )}
                        </>
                      ):(
                        <>
                         <li>
                        <span>Sub Total:</span>{ConverterCurrency} {Number(hotaltotal)+Number(flighttotal)}
                      </li>
                      <li>
                        <span>Taxes And Fees:</span>0
                      </li>
                      <li className='fw-bold'>
                        <span>Total Price:</span>{StripeCurrency=ConverterCurrency} {StripePayment=Number(hotaltotal)+Number(flighttotal)}
                      </li>
                        {/* {showPrice?(
                       
                     ):(
                       <li>
                       <span>Sub Total:</span>{checkoutdetail.currency} {Number(savemarkup.final)+Number(CalculateFLightMarkup(renderPrice(Totalsum,Currency)))}
                     </li>
                     )} */}
                     {/* <li>
                       <span>Taxes And Fees:</span>0
                     </li> */}
                     {/* <li>
                       <span>Total Price:</span>{StripeCurrency=checkoutdetail.currency} {StripePayment=savemarkup.final.toFixed(2)}
                     </li> */}
                       </>
                      )}
                      
                    </ul>
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
};

export default BookRoom
