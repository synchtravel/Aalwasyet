import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar,
  faSearch,
  faArrowRight,
  faAngleDown,
  faBowlFood,
  faFilter,
  faDollar
} from '@fortawesome/free-solid-svg-icons'
import bgimage from '../../Images/Hotels/bg.jpg'
import noUiSlider from 'nouislider'
import { RangeSlider } from 'rsuite'
import HotelCard from '../../Components/HotelCard/Hotelcard'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import HotelSearch from '../../Components/SearchBar/HotelSearch'
import Layout from '../../Components/Layout/Layout'
import moment from 'moment'
function Hotels () {
  var hotels1 = useSelector(state => state.hotels.hotels)
  const [hotels, sethotels] = useState(hotels1)
  var hotelsSearchindex = useSelector(state => state.hotels.hsearch)
  var minamounts = hotels.hotels_list.map(hotel => Number(hotel.min_price))
  var minValue2 = Math.min(...minamounts)
  var maxValue2 = Math.max(...minamounts)
  const [minValue, setMinValue] = useState(minValue2)
  const [maxValue, setMaxValue] = useState(maxValue2)
  const [hotelsSearchData, sethotelsSearchData] = useState(hotelsSearchindex)
  const [hotelNameFilter, setHotelNameFilter] = useState(null)
  const [baseCName, setBaseCName] = useState('GBP')
  const [rangeValue, setRangeValue] = useState([minValue2, maxValue2])
  const [ShowPriceFilter, setShowPriceFilter] = useState(false)
  const [ShowMealTYpeFilter, setShowMealTYpeFilter] = useState(false)
  const [ShowRatingFilter, setShowRatingFilter] = useState(false)
  const [ShowFacilityFilter, setShowFacilityFilter] = useState(false)
  const [showModifySearch, setShowModifySearch] = useState(false)
  const [baseCurrency, setBaseCurrency] = useState([])
  const [hotelid, setHotelid] = useState('')
  const [showfilter, setShowfilter] = useState({
    rating: false,
    meal: false,
    facility: false
  })
  const [starRating, setStarRating] = useState({
    rating5: '0',
    rating4: '0',
    rating3: '0',
    rating2: '0',
    rating1: '0',
    type: 'Stars'
  })
  const [mealRating, setMealRating] = useState({
    meal1: '',
    meal2: '',
    meal3: '',
    meal4: '',
    type: 'meal'
  })
  const [selectedFacilities, setSelectedFacilities] = useState({
    type: 'facility'
  }) // Initialize an empty array for selected items
  const CurrencyRates = useSelector(state => state.hotels.Currency)
  const GBPCurrencyRates = useSelector(state => state.hotels.AllCurrency)
  const handleCheckboxChange = event => {
    const { name, value } = event.target
    setStarRating(prevDetails => {
      const updatedStarRating = { ...prevDetails }
      if (updatedStarRating[name] !== '0') {
        updatedStarRating[name] = '0'
      } else {
        updatedStarRating[name] = value
      }

      return updatedStarRating
    })
  }
  useEffect(() => {
    sethotelsSearchData(hotelsSearchindex)
    sethotels(hotels1)
    // hotels=hotels;
  }, [hotelsSearchindex, hotels1])
  const handleMealTypeChange = event => {
    const { name, value } = event.target

    setMealRating(prevDetails => {
      const updatedStarRating = { ...prevDetails }
      if (updatedStarRating[name] !== '') {
        updatedStarRating[name] = ''
      } else {
        updatedStarRating[name] = value
      }

      return updatedStarRating
    })
  }

  const handleFacilityChange = event => {
    const { name, value } = event.target
    const isSelected = selectedFacilities[name] === value

    if (isSelected) {
      // If selected, remove it from the object
      const updatedFacilities = { ...selectedFacilities }
      delete updatedFacilities[name]
      setSelectedFacilities(updatedFacilities)
    } else {
      // If not selected, add it to the object
      setSelectedFacilities({ ...selectedFacilities, [name]: value })
    }
  }
  useEffect(() => {}, [hotelsSearchData, hotels1])
  const sliderRef = useRef(null)

  useEffect(() => {
    const slider = sliderRef.current

    // Check if the slider element exists
    if (slider) {
      noUiSlider.create(slider, {
        start: [minValue, maxValue],
        connect: true,
        range: {
          min: minValue2,
          max: maxValue2
        }
      })

      slider.noUiSlider.on('update', (values, handle) => {
        if (handle === 0) {
          setMinValue(parseInt(values[handle]))
        } else {
          setMaxValue(parseInt(values[handle]))
        }
      })

      return () => slider.noUiSlider.destroy()
    }

    // If the slider element doesn't exist, do nothing
  }, [minValue, maxValue, minValue2, maxValue2])
  const handleHotelFilter = inputValue => {
    setHotelid(inputValue.value)
    setHotelNameFilter(inputValue)
  }
  const StarFilter = () => {
    setShowRatingFilter(false)
    setHotelid(starRating)
  }
  const PriceFilter = () => {
    setShowPriceFilter(false)
    var data = { type: 'price', min: minValue, max: maxValue }
    setHotelid(data)
  }
  const MealFilter = () => {
    setShowMealTYpeFilter(false)
    setHotelid(mealRating)
  }

  const FacilityFilter = () => {
    setShowFacilityFilter(false)
    setHotelid(selectedFacilities)
  }
  const DisplayModifySearch = () => {
    setShowModifySearch(!showModifySearch)
  }
  const Showfilter = num => {
    if (num === 1) {
      setShowfilter(prevData => ({ ...prevData, rating: !prevData.rating }))
    }
    if (num === 2) {
      setShowfilter(prevData => ({ ...prevData, meal: !prevData.meal }))
    }
    if (num === 3) {
      setShowfilter(prevData => ({ ...prevData, facility: !prevData.facility }))
    }
  }

  const TogglePriceFilter = () => {
    setShowPriceFilter(!ShowPriceFilter)
  }
  const ToggleMealTypeFilter = () => {
    setShowMealTYpeFilter(!ShowMealTYpeFilter)
  }
  const ToggleRatingFilter = () => {
    setShowRatingFilter(!ShowRatingFilter)
  }
  const ToggleFacilityFilter = () => {
    setShowFacilityFilter(!ShowFacilityFilter)
  }
  const handleChange = newRangeValue => {
    setRangeValue(newRangeValue)
    setMinValue(newRangeValue[0])
    setMaxValue(newRangeValue[1])
  }

  return (
    <>
      <Modal isOpen={ShowPriceFilter} toggle={TogglePriceFilter}>
        <ModalHeader toggle={TogglePriceFilter}>Price Filter</ModalHeader>
        <ModalBody>
          <div className='widget widget_price_filter'>
            <div className='mb-0'>
              {/* <h3 className='form-label'>Price Level</h3> */}
              <RangeSlider
                value={rangeValue}
                onChange={handleChange}
                min={minValue2}
                tooltip={false}
                max={maxValue2}
                step={1}
              />{' '}
              <div className='pt-2'>
                <div className='fw-bold mb-2'>
                  Min:{' '}
                  <span id='kt_slider_basic_min'>{minValue.toFixed(0)} </span>
                </div>
                <div className='fw-bold mb-2'>
                  Max:{' '}
                  <span id='kt_slider_basic_max'>{maxValue.toFixed(0)}</span>
                </div>
              </div>
              <button onClick={PriceFilter} className='btn btn-warning m-2'>
                Apply
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal isOpen={ShowMealTYpeFilter} toggle={ToggleMealTypeFilter}>
        <ModalHeader toggle={ToggleMealTypeFilter}>
          Meal Type Filter
        </ModalHeader>
        <ModalBody>
          <div className='widget widget_has_radio_checkbox'>
            <div className='filter-show-hide'>
              {/* <h3>Meal Type</h3> */}
              {/* <FontAwesomeIcon icon={faAngleDown}/> */}
            </div>
            <div>
              <ul>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleMealTypeChange}
                      name='meal1'
                      value='ROOM ONLY'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'> Room Only</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleMealTypeChange}
                      name='meal2'
                      value='BED AND BREAKFAST'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'> BED AND BREAKFAST </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleMealTypeChange}
                      name='meal3'
                      value='HALF BOARD'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'> HALF BOARD</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleMealTypeChange}
                      name='meal4'
                      value='Full BOARD'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'> Full BOARD</span>
                  </label>
                </li>
              </ul>
              <button onClick={MealFilter} className='btn btn-warning m-2'>
                Apply
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal isOpen={ShowRatingFilter} toggle={ToggleRatingFilter}>
        <ModalHeader toggle={ToggleRatingFilter}>
          Star Rating Filter
        </ModalHeader>
        <ModalBody>
          <div className='widget widget_has_radio_checkbox'>
            <div className='filter-show-hide' onClick={() => Showfilter(1)}>
              {/* <h3>Filter by Rating</h3> */}
              {/* <FontAwesomeIcon icon={faAngleDown}/> */}
            </div>
            <div>
              <ul>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleCheckboxChange}
                      name='rating5'
                      value='5'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'>
                      <i className='fa fa-star'>
                        {' '}
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                      <i className='fa fa-star'>
                        {' '}
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                      <i className='fa fa-star'>
                        {' '}
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                      <i className='fa fa-star'>
                        {' '}
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                      <i className='fa fa-star'>
                        {' '}
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleCheckboxChange}
                      name='rating4'
                      value='4'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'>
                      <i className='fa fa-star'>
                        {' '}
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                      <i className='fa fa-star'>
                        {' '}
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                      <i className='fa fa-star'>
                        {' '}
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                      <i className='fa fa-star'>
                        {' '}
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleCheckboxChange}
                      name='rating3'
                      value='3'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'>
                      <i className='fa fa-star'>
                        {' '}
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                      <i className='fa fa-star'>
                        {' '}
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                      <i className='fa fa-star'>
                        {' '}
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleCheckboxChange}
                      name='rating2'
                      value='2'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'>
                      <i className='fa fa-star'>
                        {' '}
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                      <i className='fa fa-star'>
                        {' '}
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleCheckboxChange}
                      name='rating1'
                      value='1'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'>
                      <i className='fa fa-star'>
                        {' '}
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                    </span>
                  </label>
                </li>
              </ul>
              <button onClick={StarFilter} className='btn btn-warning m-2'>
                Apply
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal isOpen={ShowFacilityFilter} toggle={ToggleFacilityFilter}>
        <ModalHeader toggle={ToggleFacilityFilter}>Facility Filter</ModalHeader>
        <ModalBody>
          <div className='widget widget_has_radio_checkbox'>
            <div className='filter-show-hide' onClick={() => Showfilter(3)}>
              {/* <h3>Facilities</h3> */}
              {/* <FontAwesomeIcon icon={faAngleDown}/> */}
            </div>
            <div>
              <ul>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleFacilityChange}
                      name='facility1'
                      value='Wi-fi'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'> Wi-fi</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleFacilityChange}
                      name='facility2'
                      value='Internet access'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'> Internet access </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleFacilityChange}
                      name='facility3'
                      value='TV'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'> TV</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleFacilityChange}
                      name='facility4'
                      value='Wake-up service'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'> Wake-up service</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleFacilityChange}
                      name='facility4'
                      value='Smoking rooms'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'> Smoking rooms</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleFacilityChange}
                      name='facility6'
                      value='Wheelchair-accessible'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'> Wheelchair-accessible</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleFacilityChange}
                      name='facility7'
                      value='Laundry service'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'> Laundry service</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleFacilityChange}
                      name='facility8'
                      value='Banquet hall'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'> Banquet hall</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleFacilityChange}
                      name='facility9'
                      value='Non-smoking establishment'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'> Non-smoking establishment</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type='checkbox'
                      className='custom-textbox'
                      onChange={handleFacilityChange}
                      name='facility10'
                      value='Safe'
                    />
                    <i className='awe-icon awe-icon-check'></i>
                    <span className='rating'> Safe</span>
                  </label>
                </li>
              </ul>
              <div>
                <button
                  onClick={FacilityFilter}
                  className='btn btn-warning m-2'
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Layout>
        <div className='container-fluid'>
          <div className='mt-2'>
            <div
              style={{ cursor: 'pointer' }}
              className='d-flex mt-3 flight-modify-responsive p-2 hotel-top'
              onClick={DisplayModifySearch}
            >
              <div className='d-flex align-items-center flight-new-search'>
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <div className='d-flex align-items-center w-100 justify-content-between'>
                <div className=' ms-2'>
                  <h5 className='title font-size-24 tc' id='tours_result'>
                    {hotelsSearchData.destination_name} -{' '}
                    {hotelsSearchData.country}
                  </h5>
                  <h6 className='title font-size-24 tc' id='tours_result'>
                    {hotelsSearchData.adult !== 0 && (
                      <>{hotelsSearchData.adult} adult </>
                    )}
                    {hotelsSearchData.child !== 0 && (
                      <>- {hotelsSearchData.child} child</>
                    )}
                  </h6>
                </div>
                <div className=' ms-2'>
                  <h5 className='title font-size-24 tc' id='tours_result'>
                    {hotels.hotel_beds_counts} Hotels Available
                  </h5>
                  <h6 className='title font-size-24 tc' id='tours_result'>
                    {moment(hotelsSearchData.check_in).format('MMM Do ')}{' '}
                    <FontAwesomeIcon icon={faArrowRight} />{' '}
                    {moment(hotelsSearchData.check_out).format('MMM Do ')}
                  </h6>
                </div>
              </div>
            </div>
            {showModifySearch && (
              <div className='mt-1 p-3  modify-flight-search'>
                <HotelSearch />
              </div>
            )}
          </div>
        </div>
        <div className='container'>
          <div className='row mt-5'>
            <div className='col-md-3 col-md-pull-9 '>
              <div class='mobile-Filter-info mb-3'>
                <ul>
                  <li>
                    <p onClick={TogglePriceFilter}>
                      <FontAwesomeIcon icon={faDollar} /> Price
                    </p>
                  </li>
                  <li>
                    <p onClick={ToggleMealTypeFilter}>
                      <FontAwesomeIcon icon={faBowlFood} />
                      <span> Meal Type</span>
                    </p>
                  </li>
                  <li>
                    <p onClick={ToggleRatingFilter}>
                      <FontAwesomeIcon icon={faStar} />
                      <span> Rating</span>
                    </p>
                  </li>
                  <li>
                    <p onClick={ToggleFacilityFilter}>
                      <FontAwesomeIcon icon={faFilter} />
                      <span> Facilities</span>
                    </p>
                  </li>
                </ul>
              </div>
              <div className='page-sidebar'>
                <div className='widget widget_price_filter'>
                  <h3 className='form-label'>Search Hotel By Name</h3>
                  <Select
                    value={hotelNameFilter}
                    onChange={handleHotelFilter}
                    options={hotels.hotels_list.map(option => ({
                      value: option.hotel_id,
                      label: option.hotel_name
                    }))}
                  />
                </div>
              </div>
              <div className='page-sidebar hide-page_filter'>
                <div className='widget widget_price_filter'>
                  <div className='mb-0'>
                    <div className='filter-show-hide'>
                      <h3>Price Filter</h3>
                      <FontAwesomeIcon icon={faAngleDown} />
                    </div>
                    <RangeSlider
                      value={rangeValue}
                      onChange={handleChange}
                      min={minValue2}
                      tooltip={false}
                      max={maxValue2}
                      step={1}
                    />{' '}
                    <div className='pt-2'>
                      <div className='fw-bold mb-2'>
                        Min:{' '}
                        <span id='kt_slider_basic_min'>
                          {minValue.toFixed(0)}{' '}
                        </span>
                      </div>
                      <div className='fw-bold mb-2'>
                        Max:{' '}
                        <span id='kt_slider_basic_max'>
                          {maxValue.toFixed(0)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={PriceFilter}
                      className='btn btn-warning m-2'
                    >
                      Apply
                    </button>
                  </div>
                </div>
                <div className='widget widget_has_radio_checkbox'>
                  <div
                    className='filter-show-hide'
                    onClick={() => Showfilter(1)}
                  >
                    <h3>Filter by Rating</h3>
                    <FontAwesomeIcon icon={faAngleDown} />
                  </div>
                  {showfilter.rating && (
                    <div>
                      <ul>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleCheckboxChange}
                              name='rating5'
                              value='5'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'>
                              <i className='fa fa-star'>
                                {' '}
                                <FontAwesomeIcon icon={faStar} />
                              </i>
                              <i className='fa fa-star'>
                                {' '}
                                <FontAwesomeIcon icon={faStar} />
                              </i>
                              <i className='fa fa-star'>
                                {' '}
                                <FontAwesomeIcon icon={faStar} />
                              </i>
                              <i className='fa fa-star'>
                                {' '}
                                <FontAwesomeIcon icon={faStar} />
                              </i>
                              <i className='fa fa-star'>
                                {' '}
                                <FontAwesomeIcon icon={faStar} />
                              </i>
                            </span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleCheckboxChange}
                              name='rating4'
                              value='4'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'>
                              <i className='fa fa-star'>
                                {' '}
                                <FontAwesomeIcon icon={faStar} />
                              </i>
                              <i className='fa fa-star'>
                                {' '}
                                <FontAwesomeIcon icon={faStar} />
                              </i>
                              <i className='fa fa-star'>
                                {' '}
                                <FontAwesomeIcon icon={faStar} />
                              </i>
                              <i className='fa fa-star'>
                                {' '}
                                <FontAwesomeIcon icon={faStar} />
                              </i>
                            </span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleCheckboxChange}
                              name='rating3'
                              value='3'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'>
                              <i className='fa fa-star'>
                                {' '}
                                <FontAwesomeIcon icon={faStar} />
                              </i>
                              <i className='fa fa-star'>
                                {' '}
                                <FontAwesomeIcon icon={faStar} />
                              </i>
                              <i className='fa fa-star'>
                                {' '}
                                <FontAwesomeIcon icon={faStar} />
                              </i>
                            </span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleCheckboxChange}
                              name='rating2'
                              value='2'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'>
                              <i className='fa fa-star'>
                                {' '}
                                <FontAwesomeIcon icon={faStar} />
                              </i>
                              <i className='fa fa-star'>
                                {' '}
                                <FontAwesomeIcon icon={faStar} />
                              </i>
                            </span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleCheckboxChange}
                              name='rating1'
                              value='1'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'>
                              <i className='fa fa-star'>
                                {' '}
                                <FontAwesomeIcon icon={faStar} />
                              </i>
                            </span>
                          </label>
                        </li>
                      </ul>
                      <button
                        onClick={StarFilter}
                        className='btn btn-warning m-2'
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                <div className='widget widget_has_radio_checkbox'>
                  <div
                    className='filter-show-hide'
                    onClick={() => Showfilter(2)}
                  >
                    <h3>Meal Type</h3>
                    <FontAwesomeIcon icon={faAngleDown} />
                  </div>
                  {showfilter.meal && (
                    <div>
                      <ul>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleMealTypeChange}
                              name='meal1'
                              value='ROOM ONLY'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'> Room Only</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleMealTypeChange}
                              name='meal2'
                              value='BED AND BREAKFAST'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'> BED AND BREAKFAST </span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleMealTypeChange}
                              name='meal3'
                              value='HALF BOARD'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'> HALF BOARD</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleMealTypeChange}
                              name='meal4'
                              value='Full BOARD'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'> Full BOARD</span>
                          </label>
                        </li>
                      </ul>
                      <button
                        onClick={MealFilter}
                        className='btn btn-warning m-2'
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                <div className='widget widget_has_radio_checkbox'>
                  <div
                    className='filter-show-hide'
                    onClick={() => Showfilter(3)}
                  >
                    <h3>Facilities</h3>
                    <FontAwesomeIcon icon={faAngleDown} />
                  </div>
                  {showfilter.facility && (
                    <div>
                      <ul>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleFacilityChange}
                              name='facility1'
                              value='Wi-fi'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'> Wi-fi</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleFacilityChange}
                              name='facility2'
                              value='Internet access'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'> Internet access </span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleFacilityChange}
                              name='facility3'
                              value='TV'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'> TV</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleFacilityChange}
                              name='facility4'
                              value='Wake-up service'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'> Wake-up service</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleFacilityChange}
                              name='facility4'
                              value='Smoking rooms'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'> Smoking rooms</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleFacilityChange}
                              name='facility6'
                              value='Wheelchair-accessible'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'>
                              {' '}
                              Wheelchair-accessible
                            </span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleFacilityChange}
                              name='facility7'
                              value='Laundry service'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'> Laundry service</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleFacilityChange}
                              name='facility8'
                              value='Banquet hall'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'> Banquet hall</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleFacilityChange}
                              name='facility9'
                              value='Non-smoking establishment'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'>
                              {' '}
                              Non-smoking establishment
                            </span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input
                              type='checkbox'
                              className='custom-textbox'
                              onChange={handleFacilityChange}
                              name='facility10'
                              value='Safe'
                            />
                            <i className='awe-icon awe-icon-check'></i>
                            <span className='rating'> Safe</span>
                          </label>
                        </li>
                      </ul>
                      <button
                        onClick={FacilityFilter}
                        className='btn btn-warning m-2'
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
                {/* <button className='btn select-styling search-btn1'>Filter</button> */}
              </div>
            </div>
            <div className='col-md-9 col-md-push-3'>
              <HotelCard hotelid={hotelid} hotelDataNew={hotels} />
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Hotels
