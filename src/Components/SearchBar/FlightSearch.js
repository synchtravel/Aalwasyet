import React, { useState, useCallback, useEffect } from 'react'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import Axios from 'axios'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faRightLeft,
  faSearch,
  faMinus,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { FlightSearchToken, ApiEndPoint } from '../GlobalData/GlobalData'
import { airportcode } from '../Data/AirportCodes'
import {
  OneWayFlightSearchData,
  OneWayFlightIndexSearchData
} from '../../Redux/Actions/actions'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loading/Loader'
import { ToastContainer, toast } from 'react-toastify'
const optionsPerPage = 10
function FlightSearch () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  var endpoint = ApiEndPoint()
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleOptions, setVisibleOptions] = useState(optionsPerPage)
  const [isClearable, setIsClearable] = useState(true)
  const [onewayDDate, setOnewayDDate] = useState('')
  const [onewayRDate, setOnewayRDate] = useState('')
  const [detailModal, setDetailModal] = useState(false)
  const [onewaySelectChangeto, setOnewaySelectChangeto] = useState(null)
  const [onewaySelectChangefrom, setOnewaySelectChangefrom] = useState(null)
  const [onewaySelectChangecabin, setOnewaySelectChangecabin] = useState('')
  const [onewaySelectChangestop, setOnewaySelectChangestop] = useState('')
  const AirportCode = airportcode.items
  const [onewayPData, setOnewayPData] = useState({
    adults: 1,
    childs: 0,
    infants: 0
  })
  const [activeTab, setActiveTab] = useState('tab1')
  const [tripType, setTripType] = useState('oneway') // 'option2' is the default value for 'One Way'

  const handleRadioChange = event => {
    setTripType(event.target.value)
  }
  const tabs = [
    { id: 'tab1', label: 'OneWay', content: 'Content for Tab 1' },
    { id: 'tab2', label: 'Return', content: 'Content for Tab 2' }
  ]
  useEffect(() => {
    GetFlighMarkup()
  }, [])
  const handleTabChange = tab => {
    setActiveTab(tab)
  }
  const toggleDetailModal = () => {
    setDetailModal(!detailModal)
  }
  const handleOnewayDDate = date => {
    setOnewayDDate(date)
  }
  const handlePersonOnchange = (catogry, action) => {
    var num = 0
    if (catogry === 1) {
      num = onewayPData.adults
      if (action === 1) {
        if (Number(num - 1 <= 0)) {
          return
        }
        setOnewayPData(prevdata => ({
          ...prevdata,
          adults: Number(onewayPData.adults) - 1
        }))
      } else if (action === 2) {
        setOnewayPData(prevdata => ({
          ...prevdata,
          adults: Number(onewayPData.adults) + 1
        }))
      }
    } else if (catogry === 2) {
      num = onewayPData.childs
      if (action === 1) {
        if (Number(num - 1 < 0)) {
          return
        }
        setOnewayPData(prevdata => ({
          ...prevdata,
          childs: Number(onewayPData.childs) - 1
        }))
      } else if (action === 2) {
        setOnewayPData(prevdata => ({
          ...prevdata,
          childs: Number(onewayPData.childs) + 1
        }))
      }
    } else if (catogry === 3) {
      num = onewayPData.infants
      if (action === 1) {
        if (Number(num - 1 < 0)) {
          return
        }
        setOnewayPData(prevdata => ({
          ...prevdata,
          infants: Number(onewayPData.infants) - 1
        }))
      } else if (action === 2) {
        setOnewayPData(prevdata => ({
          ...prevdata,
          infants: Number(onewayPData.infants) + 1
        }))
      }
    }
  }
  const handleOnewayRDate = date => {
    setOnewayRDate(date)
  }

  const handleOneWaySelectchangeto = selectedOption => {
    setOnewaySelectChangeto(selectedOption)
  }
  const handleOneWaySelectchangefrom = selectedOption => {
    setOnewaySelectChangefrom(selectedOption)
  }
  const handleOneWaySelectchangecabin = event => {
    setOnewaySelectChangecabin(event.target.value)
  }
  const handleOneWaySelectchangestop = event => {
    setOnewaySelectChangestop(event.target.value)
  }
  const handleInputChange = inputValue => {
    const lowerCaseInput = inputValue.toLowerCase()
    setSearchTerm(lowerCaseInput)
    setVisibleOptions(optionsPerPage) // Reset visible options when searching
  }

  const filteredOptions = airportcode.items.filter(
    option =>
      option.airportCode.toLowerCase().includes(searchTerm) ||
      option.cityCode.toLowerCase().includes(searchTerm)
  )

  // const rowRenderer = ({ key, index, style }) => {
  //   const option = filteredOptions[index]
  //   return (
  //     <div key={key} style={style}>
  //       {option.cityName}
  //     </div>
  //   )
  // };

  // const loadMoreOptions = useCallback(() => {
  //   if (visibleOptions < filteredOptions.length) {
  //     setVisibleOptions(prev => prev + optionsPerPage)
  //   }
  // }, [filteredOptions]);
  function generateRandomNumber () {
    const min = Math.pow(10, 14) // Minimum 15-digit number
    const max = Math.pow(10, 15) - 1 // Maximum 15-digit number
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  const OneWayapicall = async type => {
  
    if (onewaySelectChangefrom === null) {
      toast.info('Please Select Departure From.', {
        position: toast.POSITION.TOP_RIGHT
      })
      return
    }
    if (onewaySelectChangeto === null) {
      toast.info('Please Select Departure To.', {
        position: toast.POSITION.TOP_RIGHT
      })
      return
    } else if (onewayDDate === '') {
      toast.info('Please Select Departure Date.', {
        position: toast.POSITION.TOP_RIGHT
      })
      return
    }

    if (tripType !== '' && tripType === 'return') {
      if (onewayRDate === '') {
        toast.info('Please Select Return Date.', {
          position: toast.POSITION.TOP_RIGHT
        })
        return
      }
    }
    const random15DigitNumber = generateRandomNumber();
    var token = FlightSearchToken();
    const data = {
      token_authorization: token,
      case: 'search_flights',
      MaxStopsQuantity:
        onewaySelectChangestop === '' ? 'All' : onewaySelectChangestop,
      DepartureDate: moment(onewayDDate).format('YYYY-MM-DD'),
      DepartureCode: onewaySelectChangefrom.value,
      ArrivalCode: onewaySelectChangeto.value,
      AirTripType: tripType === 'return' ? 'Return' : 'OneWay',
      AirlinesCode: 'EK',
      adult: onewayPData.adults,
      child: onewayPData.childs,
      infant: onewayPData.infants,
      ConversationId: random15DigitNumber,
      CabinType: onewaySelectChangecabin === '' ? 'no' : onewaySelectChangecabin
    }
    if (tripType !== '' && tripType === 'return') {
      data['return_date'] = moment(onewayRDate).format('YYYY-MM-DD')
    }
    dispatch(OneWayFlightIndexSearchData(data))
    setLoading(true)
    try {
      const response = await Axios.post(
        endpoint + '/api/flight_search_Live',
        data,
        {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
      setLoading(false)
      dispatch(OneWayFlightSearchData(response.data.Data))
      sessionStorage.setItem('15digitnumber', random15DigitNumber.toString())
      navigate('/Flight_search')
      //  console.log(response);
      if (response.data.Success === false) {
        toast.warning(response.data.Message, {
          position: toast.POSITION.TOP_RIGHT
        })
      } else {
        dispatch(OneWayFlightSearchData(response.data.Data))
        sessionStorage.setItem('15digitnumber', random15DigitNumber.toString())
        navigate('/Flight_search')
      }

      // Handle the API response here
    } catch (error) {
      // Handle errors here
      setLoading(false)
      console.error('Error:', error)
    }
  }

  const GetFlighMarkup = async () => {
    var token = FlightSearchToken()
    var data = {
      token: token
    }
    try {
      const response = await Axios.post(
        endpoint + '/api/get_markup_flight_new_Live',
        data,
        {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
      localStorage.setItem('FlightMarkup', JSON.stringify(response.data))
    } catch (error) {
      console.error('Error', error)
    }
  }

  return (
    <>
      {loading && <Loader />}
      <ToastContainer />
      <Modal isOpen={detailModal} centered={true} toggle={toggleDetailModal}>
        <ModalHeader toggle={toggleDetailModal}>Select Detail</ModalHeader>
        <ModalBody>
          <div className='p-3'>
            <div>
              <div>
                <div className='select-child'>
                  <div class='f4878764f1'>
                    <label class='a984a491d9 fw-bold' for='group_adults'>
                      Adults
                    </label>
                  </div>
                  <div class='d-flex fff'>
                    <button
                      className='adult-modal-btn'
                      onClick={() => handlePersonOnchange(1, 1)}
                    >
                      <i class='fas fa-minus'>
                        <FontAwesomeIcon size='sm' icon={faMinus} />
                      </i>
                    </button>
                    <span className='d723d73d5f fw-bold' id='input'>
                      {onewayPData.adults}
                    </span>
                    <button
                      className='adult-modal-btn'
                      onClick={() => handlePersonOnchange(1, 2)}
                      id='increment'
                    >
                      <i class='fas fa-plus'>
                        <FontAwesomeIcon size='sm' icon={faPlus} />
                      </i>
                    </button>
                  </div>
                </div>
                <div className='select-child'>
                  <div class='f4878764f1'>
                    <label class='a984a491d9 fw-bold' for='group_adults'>
                      Children
                    </label>
                  </div>
                  <div class='d-flex fff'>
                    <button
                      className='adult-modal-btn'
                      onClick={() => handlePersonOnchange(2, 1)}
                      id='decrement'
                    >
                      <i class='fas fa-minus'>
                        <FontAwesomeIcon size='sm' icon={faMinus} />
                      </i>
                    </button>
                    <span className='d723d73d5f fw-bold' id='input'>
                      {onewayPData.childs}
                    </span>
                    <button
                      className='adult-modal-btn'
                      onClick={() => handlePersonOnchange(2, 2)}
                      id='increment'
                    >
                      <i class='fas fa-plus'>
                        <FontAwesomeIcon size='sm' icon={faPlus} />
                      </i>
                    </button>
                  </div>
                </div>
                <div className='select-child'>
                  <div class='f4878764f1'>
                    <label class='a984a491d9 fw-bold' for='group_adults'>
                      Infant
                    </label>
                  </div>
                  <div class='d-flex fff'>
                    <button
                      className='adult-modal-btn'
                      onClick={() => handlePersonOnchange(3, 1)}
                      id='decrement'
                    >
                      <i class='fas fa-minus'>
                        <FontAwesomeIcon size='sm' icon={faMinus} />
                      </i>
                    </button>
                    <span className='d723d73d5f fw-bold' id='input'>
                      {onewayPData.infants}
                    </span>
                    <button
                      className='adult-modal-btn'
                      onClick={() => handlePersonOnchange(3, 2)}
                      id='increment'
                    >
                      <i class='fas fa-plus'>
                        <FontAwesomeIcon size='sm' icon={faPlus} />
                      </i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={toggleDetailModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <div>
        <div className='tab-content'>
          <div class='row justify-content-center align-items-center'>
            <div class='col-xl-12 col-lg-12 col-md-12 col-sm-12'>
              <div class='search-wrap bg-white rounded-3  pb-1'>
                <div class='search-upper'>
                  <div class='d-flex align-items-center justify-content-between flex-wrap'>
                    <div class='flx-start mb-sm-0 mb-2'>
                      <div class='form-check form-check-inline'>
                        <input
                          class='form-check-input'
                          type='radio'
                          name='trip'
                          id='oneway'
                          value='oneway'
                          checked={tripType === 'oneway'}
                          onChange={handleRadioChange}
                        />
                        <label class='form-check-label' for='oneway'>
                          One Way
                        </label>
                      </div>
                      <div class='form-check form-check-inline'>
                        <input
                          class='form-check-input'
                          type='radio'
                          name='trip'
                          id='return'
                          value='return'
                          checked={tripType === 'return'}
                          onChange={handleRadioChange}
                        />
                        <label class='form-check-label' for='return'>
                          Return
                        </label>
                      </div>
                    </div>
                    <div class='flx-end d-flex align-items-center flex-wrap'>
                      <div class='px-sm-2 pb-3 pt-0 ps-0 mob-full'>
                        <button
                          onClick={toggleDetailModal}
                          className='btn new-search-pdetail-btn text-left btn-primary btn-block select-styling button-2 search-btn1'
                          style={{
                            color: 'black',
                            background: 'none',
                            borderRadius: '21px'
                          }}
                        >
                          {onewayPData.adults} Adults . {onewayPData.childs}{' '}
                          Children . {onewayPData.infants} Infant
                        </button>
                      </div>
                      {/* <div class="ps-1 pb-3 pt-0  mob-full">
                       <select
                            value={onewaySelectChangestop}
                            onChange={handleOneWaySelectchangestop}
                            className='form-control new-search-pdetail-select  form-select select-styling'
                            aria-label='Default select example'
                          >
                            <option selected value=''>Stop Type</option>
                            <option  value='All'>All</option>
                            <option value='Direct'>Direct</option>
                            <option value='OneStop'>OneStop</option>
                          </select>
                        </div> */}
                      <div class=' pb-3 pt-0 mob-full'>
                        <select
                          value={onewaySelectChangecabin}
                          onChange={handleOneWaySelectchangecabin}
                          className='form-control new-search-pdetail-select form-select select-styling'
                          aria-label='Default select example'
                        >
                          <option selected value=''>
                            Cabin Class
                          </option>
                          <option value='no'>All</option>
                          <option value='Y'>Economy</option>
                          <option value='C'>Business</option>
                          <option value='F'>First</option>
                          <option value='S'>Premium Economy</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class='row gx-lg-2 g-3'>
                  <div class='col-xl-6 col-lg-6 col-md-12'>
                    <div class='row gy-3 gx-lg-2 gx-3'>
                      <div class='col-xl-6 col-lg-6 col-md-6 col-sm-6 position-relative'>
                        <div class='form-group hdd-arrow mb-0'>
                          <Select
                            value={onewaySelectChangefrom}
                            className='new-select'
                            onChange={handleOneWaySelectchangefrom}
                            onInputChange={handleInputChange}
                            options={filteredOptions
                              .slice(0, visibleOptions)
                              .map(option => ({
                                value: option.airportCode,
                                label:
                                  option.airportCode +
                                  '-' +
                                  option.cityName +
                                  '-' +
                                  option.countryName
                              }))}
                            isClearable={true}
                            placeholder='From'
                          />
                        </div>
                        <div class='btn-flip-icon mt-md-0'>
                          <button
                            style={{ color: '#505050 ' }}
                            class='p-0 m-0 '
                          >
                            <FontAwesomeIcon icon={faRightLeft} />
                          </button>
                        </div>
                      </div>
                      <div class='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
                        <div class='form-groupp hdd-arrow mb-0'>
                          <Select
                            value={onewaySelectChangeto}
                            className='new-select'
                            onChange={handleOneWaySelectchangeto}
                            onInputChange={handleInputChange}
                            options={filteredOptions
                              .slice(0, visibleOptions)
                              .map(option => ({
                                value: option.airportCode,
                                label:
                                  option.airportCode +
                                  '-' +
                                  option.cityName +
                                  '-' +
                                  option.countryName
                              }))}
                            isClearable={true}
                            placeholder='To'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class='col-xl-4 col-lg-4 col-md-12'>
                    <div class='row gy-3 gx-lg-2 gx-3'>
                      <div class='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
                        <div class='form-group mb-0'>
                          <DatePicker
                            selected={onewayDDate}
                            onChange={handleOnewayDDate}
                            minDate={new Date()}
                            placeholderText='Depart'
                            dateFormat='dd/MM/yyyy' // Customize date format as needed
                            className='form-control text-start fw-700 select-styling '
                          />
                        </div>
                      </div>
                      <div class='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
                        <div class='form-group mb-0'>
                          <DatePicker
                            selected={onewayRDate}
                            onChange={handleOnewayRDate}
                            minDate={new Date()}
                            placeholderText='Return'
                            disabled={tripType === 'oneway'}
                            dateFormat='dd/MM/yyyy' // Customize date format as needed
                            className='form-control text-start fw-700 select-styling '
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class='col-xl-2 col-lg-2 col-md-12'>
                    <div class='form-group mb-0'>
                      <button
                        onClick={() => OneWayapicall(1)}
                        type='button'
                        class='btn btn-primary search-btn1 full-width fw-medium'
                      >
                        <FontAwesomeIcon icon={faSearch} /> Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FlightSearch
