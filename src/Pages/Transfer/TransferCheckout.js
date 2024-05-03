import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Layout from '../../Components/Layout/Layout'
import bgimage from '../../Images/Transfer/transfercover.jfif'
import Select from 'react-select'
import Axios from 'axios'
import { Checkbox } from 'rsuite'
import { Stripe } from 'stripe'
import Loading from '../../Components/Loading/Loader'
import {
  ApiEndPoint,
  TransferCheckoutToken,
  CustomerDomainName
} from '../../Components/GlobalData/GlobalData'
import { ToastContainer, toast } from 'react-toastify'
import payment from '../../Images/Logo/payment-img.png'
import { useNavigate } from 'react-router-dom'
import { StripeClientSecret } from '../../Components/GlobalData/GlobalData'
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js'
var StripePayment = 0
var StripeCurrency = ''
var exchangeRate = 0
function TransferCheckout () {
  const CurrencyRates = useSelector(state => state.hotels.Currency)
  const GBPCurrencyRates = useSelector(state => state.hotels.AllCurrency)
  const navigate = useNavigate()
  const endpoint = ApiEndPoint()
  const token = TransferCheckoutToken()
  const Transferid = sessionStorage.getItem('TransferID')
  const TransferDetail = useSelector(state => state.hotels.TrSeResponse)
  const NewSelectedTransfer = TransferDetail?.transfers_list.filter(
    item => Number(item.destination_id) === Number(Transferid)
  )
  var Secretkey = StripeClientSecret()
  const stripe = new Stripe(Secretkey)
  const elements = useElements()
  const stripeInstance = useStripe()
  const [error, setError] = useState(null)
  const [isChecked, setIsChecked] = useState(false)
  const [countryList, setCountryList] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [isBooking, setIsBooking] = useState(false)
  const [cardInfo, setCardInfo] = useState({ name: '' })
  const [checkedItems, setCheckedItems] = useState([])
  const [extraTransferTotal, setExtraTransferTotal] = useState({ total: 0 })
  const extraData = JSON.parse(sessionStorage.getItem('Extradata'))
  const [selectedTransfer, setSelectedTransfer] = useState(
    NewSelectedTransfer[0]
  )
  var moreDestin = []
  var ziyarat = []
  if (NewSelectedTransfer[0].more_destination_details !== '') {
    moreDestin = JSON.parse(NewSelectedTransfer[0].more_destination_details)
  }
  if (NewSelectedTransfer[0].ziyarat_City_details !== '') {
    ziyarat = JSON.parse(NewSelectedTransfer[0].ziyarat_City_details)
  }
  const [moreDestination, setMoreDestination] = useState(moreDestin)
  const [mazarat, setMazarat] = useState(ziyarat)
  const [selectedNationality, setSelectedNationality] = useState('')
  const [gestinfo, setGestinfo] = useState({
    title: '',
    firstname: '',
    lastname: '',
    dateofbirth: '',
    numbercode: '',
    email: '',
    phonenumber: '',
    pno: '',
    country: '',
    nationality: ''
  })
  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData () {
    Axios.get(
      'https://restcountries.com/v3.1/all?fields=name,flags,cca2,cca3,idd'
    )
      .then(response => {
        const countryOptions = response?.data.map(country => ({
          value: country.name.common,
          label: country.name.common,
          flag: country.flags.png,
          phoneCode: country.idd.root + country.idd.suffixes[0]
        }))
        setCountryList(countryOptions)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }
  const handlegestchange = e => {
    const { value, name } = e.target
    setGestinfo(prevgestinfo => ({ ...prevgestinfo, [name]: value }))
  }
  const handleCountryChange = selectedOption => {
    setSelectedCountry(selectedOption)
    setSelectedNationality(selectedOption.value)
    setGestinfo(prevdata => ({
      ...prevdata,
      phonenumber: selectedOption.phoneCode,
      numbercode: selectedOption.phoneCode,
      nationality: selectedOption.value
    }))
  }

  const handlecarddetail = e => {
    const { value, name } = e.target
    setCardInfo(prevcardinfo => ({ ...prevcardinfo, [name]: value }))
  }

  const handlePayment = async () => {
    if (cardInfo.name === '') {
      setError('Enter Card Holder Name.')
      return { success: false }
    }
    const response = await stripe.paymentIntents.create({
      amount: (Number(StripePayment) * 100).toFixed(0), // Amount in cents
      currency: StripeCurrency,
      description: 'Example payment',
      payment_method_types: ['card']
    })
    var Client_Secret = response.client_secret

    try {
      // Confirm the payment intent with the payment method
      const { paymentIntent, error } = await stripeInstance.confirmCardPayment(
        Client_Secret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: cardInfo.name
            }
          }
        }
      )

      if (error) {
        setError(error.message)

        console.error(error)
        setIsBooking(false)
        return { success: false }
      } else {
        return { success: true, data: paymentIntent }
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT
      })
      setIsBooking(false)

      return { success: false }
    }
  }

  const BookTransfer = async newdata => {
    var status = await handlePayment()
    if (status.success === false) {
      setIsBooking(false)
      return
    }
    const LeadPassengerData = {
      lead_passenger_details: {
        lead_title: gestinfo.title,
        lead_first_name: gestinfo.firstname,
        lead_last_name: gestinfo.lastname,
        lead_email: gestinfo.email,
        lead_date_of_birth: gestinfo.dateofbirth,
        lead_country: gestinfo.numbercode,
        lead_phone: gestinfo.phonenumber,
        passport_img: ''
      },
      other_passenger_details: [],
      transfer_price_details: {
        original_price_transfer: selectedTransfer?.total_fare_markup,
        original_price_total_transfer:
          selectedTransfer?.search_passenger *
          selectedTransfer?.total_fare_markup,
        original_curreny_transfer: selectedTransfer?.sale_currency,
        exchange_price_transfer: StripePayment,
        exchange_price_total_transfer: StripePayment,
        exchange_curreny_transfer: StripeCurrency,
        destination_avail_id: selectedTransfer?.destination_id,
        no_of_paxs_transfer: selectedTransfer?.search_passenger
      }
    }

    const extraData = sessionStorage.getItem('Extradata')
    selectedTransfer.total_fare_markup =
      Number(selectedTransfer.total_fare_markup) +
      Number(extraTransferTotal.total)
    var bookingdata = {
      token: token,
      extras_Data: extraData,
      extras_Price: JSON.stringify(checkedItems),
      slc_pyment_method: JSON.stringify(status.data),
      transfer_data: JSON.stringify(LeadPassengerData),
      transfer_destination_data: JSON.stringify(selectedTransfer),
      booking_From: selectedTransfer.booking_From,
      response_confirm_booking: JSON.stringify(newdata)
    }

    try {
      const response = await Axios.post(
        endpoint + '/api/transfer_checkout_submit_react',
        bookingdata,
        {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
      setIsBooking(false)
      if (response.data.status === 'success') {
        navigate(`/transfer_invoice/${response.data.Invoice_no}`)
      } else {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT
        })
        return
      }
    } catch (error) {
      setIsBooking(false)
      console.error('Error:', error)
    }
  }

  const ThrirdPartyTransfer = async () => {
    if (isChecked) {
      if (gestinfo.title === '') {
        toast.error('Please Select Lead Guest Title.', {
          position: toast.POSITION.TOP_RIGHT
        })
        return
      } else if (gestinfo.firstname === '') {
        toast.error('Please Enter Lead Guest First Name.', {
          position: toast.POSITION.TOP_RIGHT
        })
        return
      } else if (gestinfo.lastname === '') {
        toast.error('Please Enter Lead Guest Last Name.', {
          position: toast.POSITION.TOP_RIGHT
        })
        return
      } else if (gestinfo.email === '') {
        toast.error('Please Enter Lead Guest Email.', {
          position: toast.POSITION.TOP_RIGHT
        })
        return
      } else if (selectedNationality === '') {
        toast.error('Please Select Lead Guest Nationality.', {
          position: toast.POSITION.TOP_RIGHT
        })
        return
      } else if (gestinfo.phonenumber.length <= 5) {
        toast.error('Please Enter Phone Number.', {
          position: toast.POSITION.TOP_RIGHT
        })
        return
      }
      setIsBooking(true)
      if (selectedTransfer.booking_From !== '3rd Party API') {
        BookTransfer()
      }
      const TransectionNumber = sessionStorage.getItem(
        'TransferTransectionNumber'
      )
      var bookingData = {
        country: selectedTransfer.country,
        propertyname: gestinfo.firstname,
        j1propertyname: gestinfo.lastname,
        accomodationaddress: 'H#10 St#9 etc',
        deppoint: selectedTransfer.pickup_api_City,
        depinfo: selectedTransfer.pickup_City,
        transactionnumber: TransectionNumber,
        title: gestinfo.title,
        firstname: gestinfo.firstname,
        lastname: gestinfo.lastname,
        email: gestinfo.email,
        RetPoint: selectedTransfer.dropof_api_City,
        RetInfo: selectedTransfer.dropof_City,
        phone: gestinfo.phonenumber,
        mobile: gestinfo.phonenumber
      }

      var data = {
        token: token,
        confirm_Booking_Arr: JSON.stringify(bookingData)
      }

      try {
        const response = await Axios.post(
          endpoint + '/api/confbook_Transfer_Api',
          data,
          {
            headers: {
              'Access-Control-Allow-Origin': '*'
            }
          }
        )
        if (!response.data.error) {
          BookTransfer(response.data)
        } else {
          setIsBooking(false)
          toast.error(response.data.error, {
            position: toast.POSITION.TOP_RIGHT
          })
          return
        }
      } catch (error) {
        setIsBooking(false)
        console.error('Error:', error)
        toast.error(error.message, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    } else {
      toast.error('Please Agree with Terms and Conditions.', {
        position: toast.POSITION.TOP_RIGHT
      })
    }
  }

  const handleCheckboxContinue = () => {
    setIsChecked(!isChecked)
  }

  const renderPrice = price => {
    if (CurrencyRates === undefined) {
      var baseprice = price
    } else {
      const conversionrate =
        GBPCurrencyRates.conversion_rates[CurrencyRates.selectedcurrency]
      exchangeRate = conversionrate
      var newprice = (Number(conversionrate) * Number(price)).toFixed(0)
      var baseprice = newprice
    }
    return baseprice
  }

  const handleChange = item => {
    const isChecked = checkedItems.some(
      checkedItem => checkedItem.ExtrasID === item.ExtrasID
    )
    const { ExtrasID, Price } = item

    if (isChecked) {
      setCheckedItems(prevItems =>
        prevItems.filter(checkedItem => checkedItem.ExtrasID !== ExtrasID)
      )
      setExtraTransferTotal(prevTransfer => ({
        ...prevTransfer,
        total: prevTransfer.total - Number(item.Price)
      }))
    } else {
      setCheckedItems(prevItems => [...prevItems, item])
      setExtraTransferTotal(prevTransfer => ({
        ...prevTransfer,
        total: prevTransfer.total + Number(item.Price)
      }))
    }
  }
  return (
    <>
      {isBooking && <Loading />}
      <ToastContainer />
      <Layout>
        <div className='container'>
          <div className='row mt-5'>
            <div className='col-lg-8 margin-checkout'>
              <div className='row'>
                <div className='hotel-checkout-shadow p-3'>
                  <div className='row'>
                  {extraData !== null && extraData.length !== 0 && (
                      <div>
                        <div>
                          <h4>Extra Services</h4>
                        </div>
                        {extraData.map(item => (
                          <div key={item.ExtrasID}>
                            <Checkbox
                              checked={checkedItems.some(
                                checkedItem =>
                                  checkedItem.ExtrasID === item.ExtrasID
                              )}
                              onChange={() => handleChange(item)}
                            >
                              {item.Extras_Description} -{' '}
                              {CurrencyRates === undefined
                                ? selectedTransfer.sale_currency
                                : CurrencyRates.selectedcurrency}{' '}
                              {renderPrice(Number(item.Price))}
                            </Checkbox>
                          </div>
                        ))}
                      </div>
                    )}
                    <div>
                      <h4>Customer Information</h4>
                    </div>
                    <div class='form-group mt-2 col-md-6'>
                      <label className='fw-bold'>Title</label>
                      <select
                        id='inputState'
                        name='title'
                        value={gestinfo.title}
                        onChange={handlegestchange}
                        class='form-control mt-2 form-select select-styling'
                      >
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
                    {/* <div class='form-group mt-4 row'>
                      <label
                        for='inputEmail3'
                        class='col-sm-2 col-4 col-form-label'
                      >
                        Date Of Birth
                      </label>
                      <div class='col-sm-10 col-8'>
                        <input
                          type='date'
                          class='form-control'
                          value={gestinfo.dateofbirth}
                          name='dateofbirth'
                          onChange={handlegestchange}
                          placeholder='Email'
                        />
                      </div>
                    </div> */}

                    <div class='form-group field-icon-wrap mt-2 col-md-6'>
                      <label className='fw-bold'>Nationality</label>
                      <Select
                        options={countryList}
                        isSearchable={true}
                        className='mt-2'
                        onChange={handleCountryChange}
                        value={selectedCountry}
                        getOptionLabel={option => (
                          <div>
                            <img
                              src={option.flag}
                              alt={option.label}
                              style={{ width: '20px', marginRight: '8px' }}
                            />
                            {option.label} ({option.phoneCode})
                          </div>
                        )}
                        getOptionValue={option => option.value}
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
                  </div>
                </div>
              </div>
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
                          <img src={payment} alt='' />
                          <span class='d-block pt-2'>
                            Payment with credit card
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div class='form-group mt-2 col-md-6'>
                      <label htmlFor='cardNumber' className='form-label'>
                        Card Holder Name
                      </label>
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
                      <label htmlFor='cardNumber' className='form-label'>
                        Card number
                      </label>
                      <CardNumberElement
                        className='form-control'
                        id='cardNumber'
                      />
                    </div>
                    <div class='form-group mt-2 col-md-6'>
                      <label htmlFor='expiryDate' className='form-label'>
                        Expiration date
                      </label>
                      <CardExpiryElement
                        className='form-control'
                        id='expiryDate'
                      />
                    </div>
                    <div class='form-group mt-2 col-md-6'>
                      <label htmlFor='cvc' className='form-label'>
                        CVC
                      </label>
                      <CardCvcElement className='form-control' id='cvc' />
                    </div>
                    {error && (
                      <div
                        style={{ color: 'red' }}
                        className='error mt-2'
                        role='alert'
                      >
                        {error}
                      </div>
                    )}
                  </div>
                  <div class='form-check mt-2'>
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
                      <span style={{ color: 'red' }}>
                        {' '}
                        Terms and conditions
                      </span>
                    </label>
                  </div>
                  <button
                    className='btn select-styling search-btn1 set-page-ntm-width detail-view-btn btn-success'
                    onClick={ThrirdPartyTransfer}
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
            <div className='col-lg-4 margin-checkout'>
              <div className='checkout-hotel-detail p-3 tour_booking_amount_area'>
                <div className='Hotel-img'>
                  <div class='card-img mt-2 pb-2 item-from'>
                    <img src={selectedTransfer.vehicle_image} alt='' />
                  </div>

                  <div className='card-body '>
                    <h4 class='card-title'>{selectedTransfer.name}</h4>
                    <h6 className='mt-2'>Pick-up Location</h6>
                    <p>{selectedTransfer.pickup_City}</p>
                    <h6 className='mt-2'>Drop-off Location</h6>
                    <p>{selectedTransfer.dropof_City}</p>
                    {moreDestination.map((Loc, index) => (
                      <div key={index}>
                        <div className='border-line mt-2'></div>
                        <div class='container3 justify-content-center mt-2'>
                          <h5 class='text3 '>Destination {index + 2}</h5>
                        </div>
                        <div>
                          <h6>Pick-up Location </h6>
                          <p>{Loc.subLocationPic}</p>
                          <h6>Drop-off Location </h6>
                          <p>{Loc.subLocationdrop}</p>
                        </div>
                      </div>
                    ))}
                    <div className='border-line mt-2'></div>
                    {mazarat.length !== 0 && (
                      <div>
                        <div class='container3 justify-content-center mt-2'>
                          <h5 class='text3 '>Mazarat</h5>
                        </div>
                        <ul class='list-items  list-items-2  mt-2 py-2'>
                          {mazarat.map((item, index) => (
                            <li key={index}>{item.ziyarat_City}</li>
                          ))}
                        </ul>
                        <div className='border-line mt-2'></div>
                      </div>
                    )}

                    <ul class='list-items  list-items-2  mt-2 py-2'>
                      <li>
                        <span>Vehicle Class:</span>
                        {selectedTransfer.vehicle_Name}
                      </li>
                      <li>
                        <span>Transfer Type:</span>
                        {selectedTransfer.transfer_type}
                      </li>
                      <li>
                        <span>Pickup Date:</span>
                        {selectedTransfer.pickup_date}
                      </li>
                      <li>
                        <span>Duration:</span>
                        {selectedTransfer.duration}
                      </li>
                      <li>
                        <span>Passenger:</span>
                        {selectedTransfer.search_passenger}
                      </li>
                      <li>
                        <span>Vehicles:</span>
                        {selectedTransfer.no_of_vehicles}
                      </li>
                    </ul>
                  </div>
                  <div class='border-line'></div>
                  <ul class='list-items  list-items-2  mt-2 py-2'>
                    <li>
                      <span>Sub Total:</span>
                      {CurrencyRates === undefined
                        ? selectedTransfer.sale_currency
                        : CurrencyRates.selectedcurrency}{' '}
                      {renderPrice(
                        Number(
                          Number(selectedTransfer.total_fare_markup) +
                            Number(extraTransferTotal.total)
                        )
                      )}
                    </li>
                    <li>
                      <span>Tax:</span>0
                    </li>
                    <li>
                      <span>Total:</span>
                      {
                        (StripeCurrency =
                          CurrencyRates === undefined
                            ? selectedTransfer.sale_currency
                            : CurrencyRates.selectedcurrency)
                      }{' '}
                      {
                        (StripePayment = renderPrice(
                          Number(
                            Number(selectedTransfer.total_fare_markup) +
                              Number(extraTransferTotal.total)
                          )
                        ))
                      }
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

export default TransferCheckout
