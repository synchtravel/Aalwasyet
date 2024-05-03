import React, { useState, useEffect } from 'react'
import Autocomplete from 'react-google-autocomplete'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { TransferApiToken, ApiEndPoint } from '../GlobalData/GlobalData'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Loading from '../Loading/Loader'
import { TransferSearchResponse } from '../../Redux/Actions/actions'
import Axios from 'axios'
function TransferSearch () {
  const [pickUp, setPickUp] = useState(null)
  const [dropOf, setDropOf] = useState(null)
  const [otherData, setOtherData] = useState({
    pickupDate: null,
    pickupTime: '',
    DropOffDate: null,
    DropOffTime: ''
  })
  const [tripType, setTripType] = useState('One-Way')
  const [Passenger, setPassenger] = useState('1')
  const [Vehicles, setVehicles] = useState('1')
  const [isLoading, setIsLoading] = useState(false)
  const tokenApi = TransferApiToken()
  const endpoint = ApiEndPoint()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleOtherData = event => {
    const { value, name } = event.target
    setOtherData({ ...otherData, [name]: value })
  }
  const handlePickupDate = date => {
    setOtherData({ ...otherData, pickupDate: date, DropOffDate: date })
  }
  const handleDropoffDate = date => {
    setOtherData({ ...otherData, DropOffDate: date })
  }
  const handleSelectTripType = event => {
    setTripType(event.target.value)
  }

  const handlePassenger = event => {
    setPassenger(event.target.value)
  }
  const handleVehicles = event => {
    setVehicles(event.target.value)
  }
  const searchTransfer = async () => {
    if (pickUp === null) {
      toast.info('Please Select Pickup Location.', {
        position: toast.POSITION.TOP_RIGHT
      })
      return
    } else if (Object.keys(pickUp).length === 0) {
      toast.info('Please Select Pickup Location.', {
        position: toast.POSITION.TOP_RIGHT
      })
      return
    } else if (dropOf === null) {
      toast.info('Please Select DropOff Location.', {
        position: toast.POSITION.TOP_RIGHT
      })
      return
    } else if (Object.keys(dropOf).length === 0) {
      toast.info('Please Select DropOff Location.', {
        position: toast.POSITION.TOP_RIGHT
      })
      return
    } else if (otherData.pickupDate === '' || otherData.pickupDate === null) {
      toast.info('Please Select Pickup Date.', {
        position: toast.POSITION.TOP_RIGHT
      })
      return
    } else if (otherData.pickupTime === '') {
      toast.info('Please Select Pickup Time.', {
        position: toast.POSITION.TOP_RIGHT
      })
      return
    } else if (otherData.DropOffDate === '') {
      toast.info('Please Select Dropoff Date.', {
        position: toast.POSITION.TOP_RIGHT
      })
      return
    } else if (otherData.DropOffTime === '') {
      toast.info('Please Select Dropoff Time.', {
        position: toast.POSITION.TOP_RIGHT
      })
      return
    } else if (Passenger === '') {
      toast.info('Please Enter Passenger.', {
        position: toast.POSITION.TOP_RIGHT
      })
      return
    } else if (Vehicles === '') {
      toast.info('Please Enter Vehicle.', {
        position: toast.POSITION.TOP_RIGHT
      })
      return
    }

    var PickupCountry
    if (
      pickUp.address_components.filter(
        f =>
          JSON.stringify(f.types) === JSON.stringify(['country', 'political'])
      )[0]
    ) {
      PickupCountry = pickUp.address_components.filter(
        f =>
          JSON.stringify(f.types) === JSON.stringify(['country', 'political'])
      )[0]?.long_name
    }

    var PickData = document.getElementsByName('Pickup')
    var PickupLocation = PickData[0].value
    var Picklatitude = pickUp.geometry.location.lat()
    var Picklongitude = pickUp.geometry.location.lng()
    const PickupAddress = pickUp.formatted_address

    var DropOffCountry
    if (
      dropOf.address_components.filter(
        f =>
          JSON.stringify(f.types) === JSON.stringify(['country', 'political'])
      )[0]
    ) {
      DropOffCountry = dropOf.address_components.filter(
        f =>
          JSON.stringify(f.types) === JSON.stringify(['country', 'political'])
      )[0]?.long_name
    }

    var DropData = document.getElementsByName('Dropoff')
    var DropoffLocation = DropData[0].value
    var Dropoflatitude = dropOf.geometry.location.lat()
    var Dropoflongitude = dropOf.geometry.location.lng()
    const DropofAddress = dropOf.formatted_address
    var data = {
      site_URL: 'https://system.alhijaztours.net/public/uploads/package_imgs',
      token: tokenApi,
      name_pickup_location_plc: PickupLocation,
      name_drop_off_location_plc: DropoffLocation,
      pick_up_date: moment(otherData.pickupDate).format('YYYY-MM-DD'),
      trip_type: tripType,
      passenger: String(Passenger),
      no_of_vehicles: String(Vehicles),
      pick_up_location_country: PickupCountry,
      startName: String(Picklatitude + ',' + Picklongitude),
      startplacename: PickupAddress,
      startplacecountrycode: PickupCountry,
      destinationName: String(Dropoflatitude + ',' + Dropoflongitude),
      destinationplacename: DropofAddress,
      destinationplacenamecountrycode: DropOffCountry,
      arrtime: formatTimeWithAMPM(otherData.pickupTime),
      retdate: moment(otherData.DropOffDate).format('YYYY-MM-DD'),
      rettime: formatTimeWithAMPM(otherData.DropOffTime)
    }
    setIsLoading(true)
    try {
      const response = await Axios.post(
        endpoint + '/api/transfers_search_react',
        data,
        {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
      setIsLoading(false)
      if (response.data.message === 'Success') {
        dispatch(TransferSearchResponse(response.data))
        navigate('/transfer-search')
      } else {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error:', error)
    }
  }

  function formatTimeWithAMPM (timeString) {
    const time = moment(timeString, 'HH:mm')
    return time.format('hh:mma')
  }

  return (
    <>
      <ToastContainer />
      {isLoading && <Loading />}
      <div className='tab-content'>
        <div className='tab-pane fade show active'>
          <div className='row check-availabilty'>
            <div className='row'>
              <div className='col-md-6  mb-lg-0  mt-2 col-lg-3'>
                <label
                  htmlFor='checkin_date'
                  className='font-weight-bold text-black mb-2'
                >
                  PICK-UP LOCATION
                </label>
                <div className='field-icon-wrap'>
                  <span className='form-control-feedback'>
                    <FontAwesomeIcon icon={faGlobe} />{' '}
                  </span>
                  <Autocomplete
                    className='form-control search-form-control text-start select-styling '
                    placeholder='Enter Location'
                    name='Pickup'
                    apiKey='AIzaSyBmwlQFQKwxZ4D8nRbsWVRTBFUHMO-lUOY'
                    onPlaceSelected={place => {
                      setPickUp(place)
                    }}
                    options={{
                      types: ['establishment', 'geocode'],
                      componentRestrictions: null
                    }}
                  />

                  {/* <input type="text" 
                                  id="location-input"
                                  name="pick-up"
                                    className='form-control search-form-control text-start select-styling '
                                    placeholder='Pick-up Location'
                                  /> */}
                </div>
              </div>
              <div className='col-md-6  mb-lg-0  mt-2 col-lg-3'>
                <label
                  htmlFor='checkin_date'
                  className='font-weight-bold text-black mb-2'
                >
                  DROP-OFF LOCATION
                </label>
                <div className='field-icon-wrap'>
                  <span className='form-control-feedback'>
                    <FontAwesomeIcon icon={faGlobe} />{' '}
                  </span>
                  <Autocomplete
                    className='form-control search-form-control text-start select-styling '
                    placeholder='Enter Location'
                    name='Dropoff'
                    apiKey='AIzaSyBmwlQFQKwxZ4D8nRbsWVRTBFUHMO-lUOY'
                    onPlaceSelected={place => {
                      setDropOf(place)
                    }}
                    options={{
                      types: ['establishment', 'geocode'],
                      componentRestrictions: null
                    }}
                  />
                </div>
              </div>
              <div className='col-md-6  mb-lg-0  mt-2 col-lg-3'>
                <label
                  htmlFor='checkin_date'
                  className='font-weight-bold text-black mb-2'
                >
                  PICK-UP DATE
                </label>
                <div className='field-icon-wrap'>
                  <span className='form-control-feedback'>
                    <FontAwesomeIcon icon={faCalendar} />{' '}
                  </span>
                  <DatePicker
                    onChange={handlePickupDate}
                    selected={otherData.pickupDate}
                    placeholderText='Select Date'
                    name='pickupDate'
                    minDate={new Date()}
                    dateFormat='dd/MM/yyyy' // Customize date format as needed
                    className='form-control text-start select-styling ps-5'
                  />
                </div>
              </div>
              <div className='col-md-6  mb-lg-0  mt-2 col-lg-3'>
                <label
                  htmlFor='checkin_date'
                  className='font-weight-bold text-black mb-2'
                >
                  PICK-UP Time
                </label>
                <div className='field-icon-wrap'>
                  <input
                    type='time'
                    className='form-select select-styling'
                    name='pickupTime'
                    value={otherData.pickupTime}
                    onChange={handleOtherData}
                  />
                </div>
              </div>
              <div className='col-md-6  mb-lg-0  mt-2 col-lg-3'>
                <label
                  htmlFor='checkin_date'
                  className='font-weight-bold text-black mb-2'
                >
                  Drop-of DATE
                </label>
                <div className='field-icon-wrap'>
                  <span className='form-control-feedback'>
                    <FontAwesomeIcon icon={faCalendar} />{' '}
                  </span>
                  <DatePicker
                    onChange={handleDropoffDate}
                    selected={otherData.DropOffDate}
                    placeholderText='Select Date'
                    minDate={new Date()}
                    name='dropoffDate'
                    dateFormat='dd/MM/yyyy' // Customize date format as needed
                    className='form-control text-start select-styling ps-5'
                  />
                </div>
              </div>
              <div className='col-md-6  mb-lg-0  mt-2 col-lg-3'>
                <label
                  htmlFor='checkin_date'
                  className='font-weight-bold text-black mb-2'
                >
                  Drop-of Time
                </label>
                <div className='field-icon-wrap'>
                  <input
                    type='time'
                    className='form-select select-styling'
                    name='DropOffTime'
                    value={otherData.DropOffTime}
                    onChange={handleOtherData}
                  />
                </div>
              </div>
              <div className='col-md-6  mb-lg-0  mt-2 col-lg-3'>
                <label
                  htmlFor='checkin_date'
                  className='font-weight-bold text-black mb-2'
                >
                  TRIP TYPE
                </label>
                <div className='field-icon-wrap'>
                  <select
                    value={tripType}
                    onChange={handleSelectTripType}
                    className='form-select select-styling'
                    aria-label='Default select example'
                  >
                    <option selected value='One-Way'>
                      One-Way
                    </option>
                    <option value='Return'>Return</option>
                    <option value='All_Round'>All_Round</option>
                  </select>
                </div>
              </div>
              <div className='col-md-6  mb-lg-0  mt-2 col-lg-3'>
                <label
                  htmlFor='checkin_date'
                  className='font-weight-bold text-black mb-2'
                >
                  PASSENGER
                </label>
                <div className='field-icon-wrap'>
                  <input
                    type='number'
                    min={1}
                    onChange={handlePassenger}
                    value={Passenger}
                    placeholder='Passenger'
                    className='form-control select-styling'
                  />
                </div>
              </div>
              <div className='col-md-6  mb-lg-0  mt-2 col-lg-3'>
                <label
                  htmlFor='checkin_date'
                  className='font-weight-bold text-black mb-2'
                >
                  Vehicles
                </label>
                <div className='field-icon-wrap'>
                  <input
                    type='number'
                    min={0}
                    onChange={handleVehicles}
                    value={Vehicles}
                    placeholder='Vehicles'
                    className='form-control select-styling'
                  />
                </div>
              </div>
              <div className='col-md-6 col-lg-3 text-center align-self-end'>
                <button
                  onClick={searchTransfer}
                  className='btn btn-primary btn-block select-styling search-btn1'
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TransferSearch
