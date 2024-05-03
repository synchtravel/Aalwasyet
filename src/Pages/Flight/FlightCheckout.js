import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layout/Layout';
import Axios from 'axios';
import img1 from '../../Images/Flight/1.jpg'
import { useParams,useNavigate } from 'react-router-dom'
import { Stripe } from 'stripe';
import { useStripe, useElements,CardNumberElement, CardExpiryElement, CardCvcElement} from '@stripe/react-stripe-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faClock,
  faClockFour,
  faPlane
} from '@fortawesome/free-solid-svg-icons';

import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { AirLineNames } from '../../Components/Data/AirLineNames';
import { FlightSearchToken,ApiEndPoint,StripeClientSecret } from '../../Components/GlobalData/GlobalData';
import Loading from '../../Components/Loading/Loader';
var Totalsum=0;
var StripePayment=0;
var Currency='';
var MarkupSum=0;
var ConverterCurrency='';
var ConverterTotalSum=0;
function FlightCheckout () {
  let AdultAmount=0;
  let ChildAmount=0;
  let InfantAmount=0;
  var endpoint=ApiEndPoint();
  const navigation=useNavigate();
  const [baseCName, setBaseCName] = useState('GBP');
  const CurrencyRates = useSelector(state => state.hotels.Currency);
  const GBPCurrencyRates = useSelector(state => state.hotels.AllCurrency);
  const FlightCurrencyRates = useSelector(state => state.hotels.FlightCurrency);
  const [countryList, setCountryList] = useState([]);
  const [showPrice, setShowPrice] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [exchangemarkup, setExchangemarkup] = useState({admin:0,client:0});
  const [totalperson, setTotalperson] = useState({adult:'',child:'',infant:'',adultprice:'',childprice:'',infantprice:''});
  const [otherDiv, setOtherDiv] = useState({adult:'',child:'',infant:''});
  const [gbpPrices, setGbpPrices] = useState({adult:'',child:'',infant:'',adultqty:'',childqty:'',infantqty:''});
  const [personData, setPersonData] = useState({
    title: '',
    fname: '',
    lname: '',
    country:'',
    phcode:'',
    email: '',
    dob: '',
    gender: '',
    nationality: '',
    phno: '',
    pasportno: '',
    pcode: '',
    pasportexpiry: ''
  });
  const [cardInfo, setCardInfo] = useState({
    name: '',
  });
  var FlightMarkup=JSON.parse( localStorage.getItem('FlightMarkup'));
  var Secretkey=StripeClientSecret();
  const stripe = new Stripe(Secretkey);
  const elements = useElements();
  const stripeInstance = useStripe();
  const [error, setError] = useState(null);

    const handlePayment = async () => {
      
      if(cardInfo.name===""){
        setError("Enter Card Holder Name.");
        return { success: false};
      };
      
      const response = await stripe.paymentIntents.create({
        amount: Number(MarkupSum)*100, // Amount in cents
        currency: ConverterCurrency,
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
          return { success: false};
        } else {
          return { success: true,data:paymentIntent};
        }
      } catch (error) {
        console.error('Error:', error);
        return { success: false};
      }
    };
  
  
  var Airlinenamesdata = AirLineNames;
  const Search_response = useSelector( state => state.hotels.OneWayFlight);
  const IndexPageSearchData = useSelector( state => state.hotels.OneWayFlightSearchData);
  const CheckoutFlightData = useSelector( state => state.hotels.OneWayFlightcheckout);
  const Priceinfo = useSelector( state => state.hotels.OneWayFlightcheckout.PricedItineraries[0].AirItineraryPricingInfo.PTC_FareBreakdowns[0].PassengerFare.TotalFare.CurrencyCode);
  useEffect(() => {
    fetchData();
    Totalsum=calculateSum();
  }, []);

  const  fetchData=async ()=> {
    Axios.get(endpoint+'/api/countries/fetch')
      .then(response => {
        setCountryList(response.data.countries)
      
      })
      .catch(error => {
        console.error('Error:', error)
      })
  };
  const handleSelectChange = (e, selectedIndex,condition) => {
    e.preventDefault();
    if(condition===true){
      var selectcountry = countryList[selectedIndex - 1]
      setPersonData(prevdata => ({
        ...prevdata,
        nationality: e.target.value,
        phno: '+' + selectcountry.phonecode,
        phcode:selectcountry.phonecode

      }))
    }else if(condition===false){
     
      var selectcountry = countryList[selectedIndex - 1]
      setPersonData(prevdata => ({
        ...prevdata,
        country: e.target.value,
      }))
    }
   
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
  const calculateSum = () => {
    
    const pricedItinerary = CheckoutFlightData.PricedItineraries[0];
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
        return accumulator + (Number(item.PassengerFare.TotalFare.Amount)*item.PassengerTypeQuantity.Quantity)
        ;
      }, 0);
      return sum.toFixed(2);
    } else {
      return 0; // Handle the case where the data is missing or empty
    }
  };
  const handlecarddetail=(e)=>{
    const {value,name}=e.target;
    setCardInfo(prevcardinfo=>({...prevcardinfo,
    [name]:value,
    }));
  };
  const childsArray = Array.from({ length: totalperson.child });
  const adultsArray = Array.from({ length: totalperson.adult - 1 });
  const infantArray = Array.from({ length: totalperson.infant });
  const [adultsData, setAdultsData] = useState(
    Array(totalperson.adult).fill()
  );
  const [childrenData, setChildrenData] = useState(
    Array(totalperson.child).fill()
  );
  const [infantData, setInfantData] = useState(
    Array(totalperson.infant).fill()
  );

  const otherGuestInfo = (e, guestIndex, isChild,infant) => {
    const selectedValue = e.target.value
    if (isChild) {
      setChildrenData(prevChilds => {
        const updatedChilds = [...prevChilds]
        updatedChilds[guestIndex] = {
          ...updatedChilds[guestIndex],
          child_gender: selectedValue
        }
        return updatedChilds
      })
    }else if(infant){
      setInfantData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          infant_gender: selectedValue
        }
        return updatedGuests
      })
    }else {
      setAdultsData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          other_gender: selectedValue
        }
        return updatedGuests
      })
    }
  };
  const otherGuesttitle=(e, guestIndex, isChild,infant)=>{
    e.preventDefault();
    const title = e.target.value
    if (isChild) {
      setChildrenData(prevChilds => {
        const updatedChilds = [...prevChilds]
        updatedChilds[guestIndex] = {
          ...updatedChilds[guestIndex],
          child_title: title
        }
        return updatedChilds
      })
    }else if(infant){
      setInfantData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          infant_title: title
        }
        return updatedGuests
      })
    } else {
      setAdultsData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          other_title: title
        }
        return updatedGuests
      })
    }
  };
  const otherGuestFirstName = (e, guestIndex, isChild,infant) => {
    e.preventDefault();
    // Handle the first name input and update the state
    const firstName = e.target.value

    if (isChild) {
      setChildrenData(prevChilds => {
        const updatedChilds = [...prevChilds]
        updatedChilds[guestIndex] = {
          ...updatedChilds[guestIndex],
          child_first_name: firstName
        }
        return updatedChilds
      })
    }else if(infant){
      setInfantData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          infant_first_name: firstName
        }
        return updatedGuests
      })
    } else {
      setAdultsData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          other_first_name: firstName
        }
        return updatedGuests
      })
    }
  };
  const otherGuestLastName = (e, guestIndex, isChild,infant) => {
    e.preventDefault();
    // Handle the last name input and update the state
    const lastName = e.target.value
    if (isChild) {
      setChildrenData(prevChilds => {
        const updatedChilds = [...prevChilds]
        updatedChilds[guestIndex] = {
          ...updatedChilds[guestIndex],
          child_last_name: lastName
        }
        return updatedChilds
      })
    }else if(infant){
      setInfantData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          infant_last_name: lastName
        }
        return updatedGuests
      })
    } else {
      setAdultsData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          other_last_name: lastName
        }
        return updatedGuests
      })
    }
  };
  const otherGuestNationality = (e, guestIndex, isChild,infant) => {
    e.preventDefault();
    // Handle the last name input and update the state
    const newvalue = e.target.value
    if (isChild) {
      setChildrenData(prevChilds => {
        const updatedChilds = [...prevChilds]
        updatedChilds[guestIndex] = {
          ...updatedChilds[guestIndex],
          child_passport_country: newvalue
        }
        return updatedChilds
      })
    }else if(infant){
      setInfantData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          infant_passport_country: newvalue
        }
        return updatedGuests
      })
    } else {
      setAdultsData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          other_passport_country: newvalue
        }
        return updatedGuests
      })
    }
  };
  const otherGuestdob = (e, guestIndex, isChild,infant) => {
    e.preventDefault();
    // Handle the last name input and update the state
    const newvalue = e.target.value
    if (isChild) {
      setChildrenData(prevChilds => {
        const updatedChilds = [...prevChilds]
        updatedChilds[guestIndex] = {
          ...updatedChilds[guestIndex],
          child_date_of_birth: newvalue
        }
        return updatedChilds
      })
    }else if(infant){
      setInfantData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          infant_date_of_birth: newvalue
        }
        return updatedGuests
      })
    } else {
      setAdultsData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          other_date_of_birth: newvalue
        }
        return updatedGuests
      })
    }
  };
  const otherGuestpassportnumber = (e, guestIndex, isChild,infant) => {
    e.preventDefault();
    // Handle the last name input and update the state
    const newvalue = e.target.value
    if (isChild) {
      setChildrenData(prevChilds => {
        const updatedChilds = [...prevChilds]
        updatedChilds[guestIndex] = {
          ...updatedChilds[guestIndex],
          child_passport_no: newvalue
        }
        return updatedChilds
      })
    }else if(infant){
      setInfantData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          infant_passport_no: newvalue
        }
        return updatedGuests
      })
    } else {
      setAdultsData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          other_passport_no: newvalue
        }
        return updatedGuests
      })
    }
  };
  const otherGuestpassportexpiry = (e, guestIndex, isChild,infant) => {
    // Handle the last name input and update the state
    e.preventDefault();
    const newvalue = e.target.value
    if (isChild) {
      setChildrenData(prevChilds => {
        const updatedChilds = [...prevChilds]
        updatedChilds[guestIndex] = {
          ...updatedChilds[guestIndex],
          child_passport_expiry_date: newvalue
        }
        return updatedChilds
      })
    }else if(infant){
      setInfantData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          infant_passport_expiry_date: newvalue
        }
        return updatedGuests
      })
    } else {
      setAdultsData(prevGuests => {
        const updatedGuests = [...prevGuests]
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          other_passport_expiry_date: newvalue
        }
        return updatedGuests
      })
    }
  };
  const BookFlight=async()=>{

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
  var check=checkvalidation();
  
   if(check==1){
    return;
   }
   check=0;
  
   if(totalperson.adult-1 !==0){
   for (let i = 0; i < adultsData.length; i++) {
    if (!validateAdultData(adultsData[i], i)) {
      // Validation failed for at least one adult, handle accordingly
      check=1;
      return;
    }
  }
}
  if(check==1){
    return;
   }
  check=0;
  if(totalperson.child !==''){
  for (let i = 0; i < childrenData.length; i++) {
    if (!validateChildData(childrenData[i], i)) {
      // Validation failed for at least one adult, handle accordingly
      check=1;
      return;
    }
  }
}
  if(check==1){
    return;
   }
   check=0;
   if(totalperson.infant !==''){
  for (let i = 0; i < infantData.length; i++) {
    if (!validateInfantData(infantData[i], i)) {
      // Validation failed for at least one adult, handle accordingly
      check=1;
      return;
    }
  }
}
  if(check==1){
    return;
   }
    
    var token=FlightSearchToken();
    var limit={
      'token':token
    }
    setIsLoading(true);
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
     
      console.error('Error:', error);
    }
    if(Number(Totalsum) > Number(limitcheck.credit_data.remaining_amount)){
      toast.info('There is a problem in the payment, Please contact Support or try again later on.', {
        position: toast.POSITION.TOP_RIGHT
      });
      setIsLoading(false);
      return;
      

    }else{
      // var status=true;
      var status=await handlePayment();
      if(status.success===false){
        setIsLoading(false);
        return;
      }
      const retrievedNumber = sessionStorage.getItem('15digitnumber');
      var leadpassengerdetail= {
        "title":personData.title,
        "first_name": personData.fname,
        "last_name": personData.lname,
        "email": personData.email,
        "date_of_birth": personData.dob,
        "gender": personData.gender,
        "passport_no": personData.pasportno,
        "passport_expiry_date": personData.pasportexpiry,
        "passport_country": personData.country,
        "passenger_nationality_id": personData.nationality,
        "passenger_nationality_code": personData.phcode,
        "passenger_phone_no": personData.phno,
        "postal_code": personData.pcode
      };
      var farerequest={
        'token_authorization':token,
    'ConversationId':retrievedNumber,
    'FareSourceCode':CheckoutFlightData.PricedItineraries[0].AirItineraryPricingInfo.FareSourceCode,
      }
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
         'other_passenger_details': JSON.stringify(adultsData),
         'child_details': JSON.stringify(childrenData),
        'infant_details': JSON.stringify(infantData),
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
        'adult_price': Number(totalperson.adult)*Number(AdultAmount).toFixed(2),
        'child_price':  Number(totalperson.child)*Number(ChildAmount).toFixed(2),
        'infant_price':  Number(totalperson.infant)*Number(InfantAmount).toFixed(2),
        'total_price': Number(ConverterTotalSum).toFixed(2),
        'adult_price_markup': CalculateFLightMarkup(Number(totalperson.adult)*AdultAmount).toFixed(2),
        'child_price_markup':CalculateFLightMarkup(Number(totalperson.child)*ChildAmount).toFixed(2),
        'infant_price_markup': CalculateFLightMarkup(Number(totalperson.infant)*InfantAmount),
        'total_price_markup':MarkupSum,
        'client_commission_amount': exchangemarkup.client.toFixed(2),
        'admin_commission_amount':exchangemarkup.admin.toFixed(2),
        'currency': ConverterCurrency,
        'client_payable_price':(Number(MarkupSum)-Number( exchangemarkup.client)).toFixed(2),
        'client_markup': clientmarkup.markup_value === undefined ? '' : clientmarkup.markup_value,
        'client_markup_type':clientmarkup.markup_type === undefined ? '' :  clientmarkup.markup_type,
        'client_commision_amount_exchange': clientmarkupprice.toFixed(2),
        'client_without_markup_price': total.toFixed(2),
        'client_markup_price': clientmarkupprice.toFixed(2),
        'client_payable_price_exchange':  (Number(total)+Number(clientmarkupprice)+Number(adminmarkupprice)).toFixed(2),
        'client_currency': 'GBP',
        'admin_markup':adminmarkup.markup_value === undefined ? '' : adminmarkup.markup_value,
        'admin_markup_type':adminmarkup.markup_type === undefined ? '' : adminmarkup.markup_type,
        'admin_commision_amount_exchange': adminmarkupprice.toFixed(2),
        'admin_without_markup_price': total.toFixed(2),
        'admin_markup_price': adminmarkupprice.toFixed(2),
        'admin_payable_price_exchange': (Number(total)+Number(adminmarkupprice)).toFixed(2),
        'admin_currency': 'GBP',
        'creditAmount':MarkupSum,
      };
      try {
      const response = await Axios.post(endpoint+'/api/flight_booking_confirm_Live', data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        } ,
        
      });
    
     if(response.data.message==='success')
     {
      setIsLoading(false);
        navigation(`/Flight_invoice/${retrievedNumber}`, {
              state: {retrievedNumber}
            });
     }else{
      var data=JSON.parse( response.data.error);
      setIsLoading(false);
      toast.info(data.Message, {
        position: toast.POSITION.TOP_RIGHT
      });
      return;

     }
    
      // Handle the API response here
     
    } catch (error) {
      // Handle errors here
      setIsLoading(false);
      console.error('Error:', error);
    }
    }
    
  };
const checkvalidation=()=>{
  
  if(personData.title === ''){
    toast.info('Please Select Title.', {
      position: toast.POSITION.TOP_RIGHT
    });
    return 1;
  }else if(personData.fname.length < 4){
    toast.info('First Name should be at least 4 characters long.', {
      position: toast.POSITION.TOP_RIGHT
    });
    return 1;
  }else if(personData.lname.length < 4){
    toast.info('Last Name should be at least 4 characters long.', {
      position: toast.POSITION.TOP_RIGHT
    });
    return 1;
  }else if(!isValidEmail(personData.email)){
    toast.info('Please Enter a valid Email.', {
      position: toast.POSITION.TOP_RIGHT
    });
    return 1;
  }else if(personData.dob === '' ){
    toast.info('Please Select Date of Birth.', {
      position: toast.POSITION.TOP_RIGHT
    });
    return 1;
  }else if(calculateAge(personData.dob) < 18  ){
    toast.info('Age must be 18 or older.', {
      position: toast.POSITION.TOP_RIGHT
    });
    return 1;
  }else if(personData.gender === ''){
    toast.info('Please Select Gender.', {
      position: toast.POSITION.TOP_RIGHT
    });
    return 1;
  }else if(personData.nationality === ''){
    toast.info('Please Select Nationality.', {
      position: toast.POSITION.TOP_RIGHT
    });
    return 1;
  }else if(personData.pasportno.length < 10){
    toast.info('Passport Number should be at least 10 characters long.', {
      position: toast.POSITION.TOP_RIGHT
    });
    return 1;
  }else if(personData.pasportexpiry === ''){
    toast.info('Please Select Passport Expiry.', {
      position: toast.POSITION.TOP_RIGHT
    });
    return 1;
  }else if(!isPassportExpiryValid(personData.pasportexpiry)){
    toast.info('Passport expiry date must be greater than 6 months from now.', {
      position: toast.POSITION.TOP_RIGHT
    });
    return 1;
  }else if(personData.country === ''){
    toast.info('Please Select Country.', {
      position: toast.POSITION.TOP_RIGHT
    });
    return 1;
  }else if(personData.pcode===''){
    toast.info('Please Enter Postal Code.', {
      position: toast.POSITION.TOP_RIGHT
    });
    return 1;
  }


};
const validateAdultData = (adultData, index) => {
  if(adultData===undefined){
    toast.info(`Please Enter Adult ${index + 2} Detail .`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(adultData.other_title ===undefined ){
    toast.info(`Please Select Title for Adult ${index + 2}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(adultData.other_first_name ===undefined || adultData.other_first_name.length < 4 ){
    toast.info(`First Name should be at least 4 characters long for Adult ${index + 2}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(adultData.other_last_name ===undefined || adultData.other_last_name.length < 4){
    toast.info(`Last Name should be at least 4 characters long for Adult ${index + 2}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(adultData.other_date_of_birth ===undefined ){
    toast.info(`Please Select Date of Birth for Adult ${index + 2}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(calculateAge(adultData.other_date_of_birth) < 18  ){
    toast.info(`Age must be 18 or older for Adult ${index + 2}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(adultData.other_gender ===undefined ){
    toast.info(`Please Select Gender for Adult ${index + 2}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(adultData.other_passport_country===undefined || adultData.other_passport_country === ''){
    toast.info(`Please Select Nationality for Adult ${index + 2}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(adultData.other_passport_no===undefined || adultData.other_passport_no.length < 10){
    toast.info(`Passport Number should be at least 10 characters long for Adult ${index + 2}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(adultData.other_passport_expiry_date===undefined ){
    toast.info(`Please Select Passport Expiry for Adult ${index + 2}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(!isPassportExpiryValid(adultData.other_passport_expiry_date)){
    toast.info(`Passport expiry date must be greater than 6 months from now for Adult ${index + 2}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }
  return true;
};
const validateChildData = (childData, index) => {
  if(childData===undefined){
    toast.info(`Please Enter Child ${index + 1} Detail .`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(childData.child_title ===undefined ){
    toast.info(`Please Select Title for Child ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(childData.child_first_name ===undefined || childData.child_first_name.length < 4 ){
    toast.info(`First Name should be at least 4 characters long for Child ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(childData.child_last_name ===undefined || childData.child_last_name.length < 4){
    toast.info(`Last Name should be at least 4 characters long for Child ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(childData.child_date_of_birth ===undefined ){
    toast.info(`Please Select Date of Birth for Child ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(calculateAge(childData.child_date_of_birth ) < 12  ){
    toast.info(`Age must be 12 or older for Child ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(childData.child_gender ===undefined ){
    toast.info(`Please Select Gender for Child ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(childData.child_passport_country===undefined ){
    toast.info(`Please Select Nationality for Child ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(childData.child_passport_no===undefined || childData.child_passport_no.length < 10){
    toast.info(`Passport Number should be at least 10 characters long for Child ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(childData.child_passport_expiry_date===undefined ){
    toast.info(`Please Select Passport Expiry for Child ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(!isPassportExpiryValid(childData.child_passport_expiry_date)){
    toast.info(`Passport expiry date must be greater than 6 months from now for Child ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }
  return true; 
};
const validateInfantData = (infantData, index) => {
  if(infantData===undefined){
    toast.info(`Please Enter Infant ${index + 1} Detail .`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(infantData.infant_title ===undefined ){
    toast.info(`Please Select Title for Infant ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(infantData.infant_first_name ===undefined || infantData.infant_first_name.length < 4 ){
    toast.info(`First Name should be at least 4 characters long for Infant ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(infantData.infant_last_name ===undefined || infantData.infant_last_name.length < 4){
    toast.info(`Last Name should be at least 4 characters long for Infant ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(infantData.infant_date_of_birth ===undefined ){
    toast.info(`Please Select Date of Birth for Infant ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(calculateAge(infantData.infant_date_of_birth ) < 2  ){
    toast.info(`Age must be 2 or older for Infant ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(infantData.infant_gender ===undefined ){
    toast.info(`Please Select Gender for Infant ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(infantData.infant_passport_country===undefined ){
    toast.info(`Please Select Nationality for Infant ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(infantData.infant_passport_no===undefined || infantData.infant_passport_no.length < 10){
    toast.info(`Passport Number should be at least 10 characters long for Infant ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(infantData.infant_passport_expiry_date===undefined ){
    toast.info(`Please Select Passport Expiry for Infant ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }else if(!isPassportExpiryValid(infantData.infant_passport_expiry_date)){
    toast.info(`Passport expiry date must be greater than 6 months from now for Infant ${index + 1}.`, {
      position: toast.POSITION.TOP_RIGHT
    });
    return false;
  }
  return true;
};
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
function calculateAge(dob) {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

function isPassportExpiryValid(passportExpiry) {
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

  const passportExpiryDate = new Date(passportExpiry);

  return passportExpiryDate > sixMonthsFromNow;
};
  const renderPrice = (price,qty,check) =>{
    if(price !== undefined){
    if(FlightCurrencyRates !==undefined){
              if(CurrencyRates===undefined){
                const gbpprice = FlightCurrencyRates[baseCName]; // Use square brackets to access the property
                var baseprice = (Number(gbpprice) * Number(price));
               
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
                
              }else{
              var select123 = CurrencyRates.selectedcurrency;
              const gbpprice = FlightCurrencyRates[baseCName];
              var baseprice1 = (Number(gbpprice) * Number(price));
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
             
              const gbpprice2 = GBPCurrencyRates.conversion_rates[select123]; // Use square brackets to access the property
              var baseprice = (Number(gbpprice2) * Number(baseprice1));
              }
    }else{
      setShowPrice(false);
    };
    
    if(check===1){
      StripePayment=baseprice;
    }
   
    return baseprice
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
  return total;
  }
  };
  
  return (
    <>
    {isLoading && (<Loading/>)}
    <ToastContainer/>
      <Layout>
      <div className='contact-img'>
        <img src={img1} />
      </div>
        <div className='container mt-5'>
          <div className='row mt-3'>
            <div className='col-lg-8 margin-checkout '>
              <div className='hotel-checkout-shadow p-3 '>
                <div className='row'>
                  <div className='d-flex' style={{justifyContent:'space-between'}}>
                    <h4 style={{ color: 'cadetblue' }}>Customer information</h4>
                    {/* <button className='btn btn-success fw-bold'>Fare Rules</button> */}
                  </div>
                  <div className='border-line mt-4 mb-4'></div>
                  <div>
                    <h4>Let us know who you are...?</h4>
                  </div>
                  <div class='form-group mt-4 col-md-4 col-sm-6 '>
                    <label className='fw-bold'>Title</label>
                    <select
                      value={personData.title}
                      onChange={handletitlechange}
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
                            <option value='M'>Male</option>
                            <option value='F'>Female</option>
                          </select>
                        </div>
                  <div class='form-group field-icon-wrap  col-md-4 col-sm-6 mt-2'>
                    <label className='fw-bold'>Nationality</label>
                    <select
                      value={personData.nationality} // Set the selected value from the state
                      onChange={e =>
                        handleSelectChange(e, e.target.selectedIndex,true)
                      }
                      className='form-control mt-2 form-select select-styling'
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
                    <label className='fw-bold'>Phone Number</label>
                    <input
                      type='text'
                      class='form-control  mt-2'
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
                      class='form-control  mt-2'
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
                  <div class='form-group field-icon-wrap  col-md-4 col-sm-6 mt-2'>
                    <label className='fw-bold'>Country</label>
                    <select
                      value={personData.country} // Set the selected value from the state
                      onChange={(e) =>
                        handleSelectChange(e, e.target.selectedIndex,false)
                      }
                      className='form-control mt-2 form-select select-styling'
                      aria-label='Default select example'
                    >
                      <option selected>Select Country</option>
                      {countryList.map(item => (
                        <option key={item.id} value={item.iso2}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div class='form-group col-md-4 col-sm-6 mt-2'>
                    <label className='fw-bold'>Postal Code</label>
                    <input
                      type='text'
                      value={personData.pcode}
                      onChange={handledata}
                      class='form-control mt-2'
                      placeholder='Postal Code'
                      name='pcode'
                    />
                  </div>
                </div>
                {(otherDiv.child !=='' || otherDiv.adult !==0 || otherDiv.infant !=='') && (
                <div className='row mt-4 '>
                <div className='border-line'></div>
                    <div className='d-flex justify-content-center mt-2 mb-2'>
                      <h4  className=''>Other Passenger Detail</h4>
                    </div>
                    <div className='border-line'></div>

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
                  )}
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
                      class='form-control'
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
                  <button className='btn fw-bold btn-warning mt-2' onClick={BookFlight }>
                    {' '}
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
            <div className='col-lg-4 order-first order-md-last'>
              <div className='checkout-hotel-detail p-3'>
                {CheckoutFlightData.PricedItineraries.map((item, index) => (
                  <div key={index}>
                    <div className='flight-checkout-logo'>
                    <div className={`p-card-title  logo-${item.ValidatingAirlineCode}`} style={{marginLeft:'auto',marginRight:'auto',backgroundSize:'contain'}}></div>
                </div>
                    <div className='border-line mt-2'></div>
                    <div className='mt-2 text-center'>
                      <h5>{item.DirectionInd} Flight</h5>
                    </div>
                    <div className='border-line mt-2'></div>
                    <div>
                              <h4 class='card-title mt-2 mb-2'>Booking Detail</h4>
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
                                    {Airlinenamesdata[CheckoutFlightData.PricedItineraries[0].ValidatingAirlineCode]
                                ? `${
                                    Airlinenamesdata[CheckoutFlightData.PricedItineraries[0].ValidatingAirlineCode]
                                      .AirLineName
                                  } `
                                : `Unknown Airline`}
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
                                      {/* {moment(flight.ArrivalDateTime).diff(moment(flight.DepartureDateTime), 'hours')}h{' '}
                            {moment(flight.ArrivalDateTime).diff(moment(flight.DepartureDateTime), 'minutes') % 60}m */}
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
                                      {/* Direct */}
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
                                  <span>Adult Price :</span>  <span>{item1.PassengerTypeQuantity.Quantity} * {CurrencyRates===undefined ? (baseCName):(CurrencyRates.selectedcurrency)} {CalculateFLightMarkup(AdultAmount =renderPrice(item1.PassengerFare.TotalFare.Amount,item1.PassengerTypeQuantity.Quantity,2)).toFixed(2)}</span>
                                  </div>
                                
                                  )}
                                  {item1.PassengerTypeQuantity.Code==='CHD' && (
                                    <div style={{display:'contents'}}>
                                  <span>Child Price :</span>  <span>{item1.PassengerTypeQuantity.Quantity} * {CurrencyRates===undefined ? (baseCName):(CurrencyRates.selectedcurrency)} {CalculateFLightMarkup(ChildAmount=renderPrice(item1.PassengerFare.TotalFare.Amount,item1.PassengerTypeQuantity.Quantity,3)).toFixed(2)}</span>
                                  </div>
                                
                                  )}
                                  {item1.PassengerTypeQuantity.Code==='INF' && (
                                    <div style={{display:'contents'}}>
                                  <span>Infant Price :</span>  <span>{item1.PassengerTypeQuantity.Quantity} * {CurrencyRates===undefined ? (baseCName):(CurrencyRates.selectedcurrency)} {CalculateFLightMarkup(InfantAmount=renderPrice(item1.PassengerFare.TotalFare.Amount,item1.PassengerTypeQuantity.Quantity,4)).toFixed(2)}</span>
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
                                    <span>Adult Price :</span>  <span>{item1.PassengerTypeQuantity.Quantity} * {item1.PassengerFare.TotalFare.CurrencyCode} {CalculateFLightMarkup(AdultAmount = item1.PassengerFare.TotalFare.Amount).toFixed(2)}</span>
                                    </div>
                                  
                                    )}
                                    {item1.PassengerTypeQuantity.Code==='CHD' && (
                                      <div style={{display:'contents'}}>
                                    <span>Child Price :</span>  <span>{item1.PassengerTypeQuantity.Quantity} * {item1.PassengerFare.TotalFare.CurrencyCode} {CalculateFLightMarkup(ChildAmount=item1.PassengerFare.TotalFare.Amount).toFixed(2)}</span>
                                    </div>
                                  
                                    )}
                                    {item1.PassengerTypeQuantity.Code==='INF' && (
                                      <div style={{display:'contents'}}>
                                    <span>Infant Price :</span>  <span>{item1.PassengerTypeQuantity.Quantity} * {item1.PassengerFare.TotalFare.CurrencyCode} {CalculateFLightMarkup(InfantAmount=item1.PassengerFare.TotalFare.Amount).toFixed(2)}</span>
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
                            <li  className=' fw-bold'>
                             <span>Total Price : </span> {CurrencyRates===undefined ? (ConverterCurrency=baseCName):(ConverterCurrency=CurrencyRates.selectedcurrency)} {MarkupSum=CalculateFLightMarkup(ConverterTotalSum=renderPrice(Totalsum,1,1),5).toFixed(2)}
                             
                            </li>):(
                              <li  className=' fw-bold'>
                              <span>Total Price : </span> {ConverterCurrency=Currency} {MarkupSum=CalculateFLightMarkup(ConverterTotalSum=Totalsum,5). toFixed(2)}
                              
                             </li>
                            )}
                          </ul>
                          </div>
                          {/* <div className='border-line'></div> */}
                          {/* <ul class='list-items  list-items-2 py-2'>
                        <li>
                          <span>October Umrah Package Group 1</span>£ 18250
                        </li>
                      </ul> */}
                          {/* <div className='border-line'></div> */}

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
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default FlightCheckout
