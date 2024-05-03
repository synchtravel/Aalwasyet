import React, { useEffect, useState } from 'react'
import bgimage from '../../Images/Pages/banner.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLocation,
  faCheck,
  faClock,
  faCalendarCheck,
  faCalendarAlt,
  faStar,
  faCalendar,
  faMapLocation,
  faCalendarTimes
} from '@fortawesome/free-solid-svg-icons'
import Layout from '../../Components/Layout/Layout'
import {Modal, ModalHeader, ModalBody} from 'reactstrap'
import Carousel from 'react-bootstrap/Carousel'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Loading from '../../Components/Loading/Loader'
import { ToastContainer, toast } from 'react-toastify'
import {
  ApiEndPoint,
  ActivityToken,
  CustomerDomainName
} from '../../Components/GlobalData/GlobalData'
function ActivityDetail () {
  const navigate=useNavigate();
  const [activityDetail, setActivityDetail] = useState(null)
  const [availibalityDays, setAvailibalityDays] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [whatExpect, setWhatExpect] = useState(null)
  const [faqs, setFaqs] = useState(null)
  const [activeIndex, setActiveIndex] = useState(null)
  const [activeIndex1, setActiveIndex1] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedServices, setSelectedServices] = useState([]);
  const [additionalServices, setAdditionalServices] = useState(null)
  const [selectAdults, setSelectAdults] = useState('')
  const [selectChilds, setSelectChilds] = useState('')
  const [imageArray, setImageArray] = useState([])
  const [isModal, setIsModal] = useState(false)
  const DomainURL=CustomerDomainName();
  useEffect(() => {
    GetDetail()
  }, [])

  const GetDetail = async () => {
    var currentURL = window.location.href
    // Extract the last part of the URL
    var urlParts = currentURL.split('/')
    var lastPart = urlParts[urlParts.length - 1]

    var endpoint = ApiEndPoint()
    var token = ActivityToken()
    var data = {
      token: token,
      id: lastPart
    }
    setIsLoading(true)
    try {
      const response = await Axios.post(
        endpoint + '/api/activity-details-react',
        data,
        {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
      setIsLoading(false)
      // console.log(response);
      setActivityDetail(response.data.data)
      setWhatExpect(JSON.parse(response.data.data.what_expect));
      setFaqs(JSON.parse(response.data.data.faqs_arr));
      setAdditionalServices(JSON.parse(response.data.data.addtional_service_arr));
      setImageArray(JSON.parse(response.data.data.gallery_images));
      if (response !== undefined) {
        const start = new Date(response.data.data.start_date) // Example start date
        const end = new Date(response.data.data.end_date) // Example end date
        var resultDates = getDatesBetween(
          start,
          end,
          JSON.parse(response.data.data.Availibilty)
        )
        setAvailibalityDays(resultDates)
      }
      //   console.log(resultDates);
      // dispatch(ActivitiesListing(response.data));
      // navigation('/activities');
    } catch (error) {
      // Handle errors here
      setIsLoading(false)
      console.error('Error:', error)
    }
  };
  const toggleModal=()=>{
    setIsModal(!isModal);
  }
  function getDatesBetween (start, end, daysArray) {
    const enabledDays = []
    const startDateNum = start.getDay()
    let currentDate = new Date(start)

    while (currentDate <= end) {
      const dayNum = currentDate.getDay()

      // Handle Sunday correctly:
      const dayData = dayNum === 0 ? daysArray['7'] : daysArray[dayNum]

      if (dayData && dayData.enable) {
        enabledDays.push({
          date: new Date(currentDate),
          from: dayData.from,
          to: dayData.to
        })
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }
    return enabledDays
  }
  const enabledDates = [
    new Date('2024-01-01'),
    new Date('2024-01-15'),
    new Date('2024-01-10')
    // Add more dates as needed
  ]

  // Custom function to filter dates
  const filterDate = date => {
    // Return true if the date is in the enabledDates array, false otherwise
    return availibalityDays.some(
      enabledDate =>
        date.getDate() === enabledDate.date.getDate() &&
        date.getMonth() === enabledDate.date.getMonth() &&
        date.getFullYear() === enabledDate.date.getFullYear()
    )
  };
  const handleCheckboxChange = (checkboxName,servicetype,serviceprice) => {
    const updatedCheckboxes = [...selectedServices];

    // Check if the checkbox is already in the array
    const existingCheckboxIndex = updatedCheckboxes.findIndex(item => item.name === checkboxName);

    if (existingCheckboxIndex !== -1) {
      // If it is, remove it
      updatedCheckboxes.splice(existingCheckboxIndex, 1);
    } else {
      // If it is not, add it
      updatedCheckboxes.push({ name: checkboxName ,type:servicetype,price:serviceprice});
    }

    setSelectedServices(updatedCheckboxes);
    
  };
  const handleAdditionalServicePerson=(event,serviceName)=>{
    const newAdultValue = parseInt(event.target.value, 10); // Assuming you get the adult value from the event
     addAdultToService(serviceName,newAdultValue);

  };

  const addAdultToService = (serviceName,newAdultValue) => {
    setSelectedServices(prevServices => {
      return prevServices?.map(service => ({
        ...service,
        ...(service.name === serviceName ? { adult: newAdultValue } : {}),
      }));
    });
  };


  const handleAdult=(event)=>{
    setSelectAdults(event.target.value);
  };
  const handleChild=(event)=>{
    setSelectChilds(event.target.value);
  };

  const show = index => {
    const buttons = document.getElementsByClassName('accordion')
    const panel = buttons[index].nextElementSibling
    buttons[index].classList.toggle('active-2')

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px'
    }

    // Remove "active" class from other buttons
    for (let i = 0; i < buttons.length; i++) {
      if (i !== index) {
        buttons[i].classList.remove('active-2')
        buttons[i].nextElementSibling.style.maxHeight = null
      }
    }
  };

  const show1 = index => {
    const buttons = document.getElementsByClassName('accordion2')
    const panel = buttons[index].nextElementSibling
    buttons[index].classList.toggle('active-2')

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px'
    }

    // Remove "active" class from other buttons
    for (let i = 0; i < buttons.length; i++) {
      if (i !== index) {
        buttons[i].classList.remove('active-2')
        buttons[i].nextElementSibling.style.maxHeight = null
      }
    }
  };
  const SaveData=()=>{
    if(selectedDate===''){
      toast.info('Please select a date.', {
        position: toast.POSITION.TOP_RIGHT
      })
      return;
    };

    var newdata={
      'date':selectedDate,
      'adults':selectAdults,
      'childs':selectChilds,
      'adultPrice':activityDetail?.sale_price,
      'childrenPrice':activityDetail?.child_sale_price,
      'currency':activityDetail?.currency_symbol,
    }
    sessionStorage.setItem("AdditionalServices", JSON.stringify(selectedServices));
    sessionStorage.setItem("ActivityData", JSON.stringify(newdata));
    sessionStorage.setItem("ActivityDetail", JSON.stringify(activityDetail));

    navigate('/activity_checkout');
  };
  return (
    <>
    <ToastContainer/>
      {isLoading && <Loading />}
      <Layout>
        <div className='contact-img bor-bottom'>
          <img src={bgimage} />
        </div>
        <div className='container mt-2'>
          <h3>{activityDetail?.title}</h3>
          <div className='row'>
            <div>
              <i class='awe-icon fa tc fa-check' aria-hidden='true'>
                <FontAwesomeIcon icon={faLocation} />
              </i>{' '}
              {activityDetail?.location}
            </div>
          </div>
          <div className='row mt-3'>
            <div className='col-md-8'>
              <div className="row">
                <div className='col-sm-6'>
                    <Carousel className='carousel-container'>
                    {imageArray.map((item,index)=>(
                        <Carousel.Item key={index}>
                        <img
                          className='d-block w-100'
                          src={DomainURL+'/public/images/activites/'+item}
                          alt='First slide'
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </div>
                <div className='col-sm-6'>
                <div className='row activity-top mt-2 mb-2 p-2'>
                <div className=' col-6 mt-1'>
                  <div class='single-tour-feature d-flex align-items-center mb-3'>
                    <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                      <i class='fas fa-check'>
                        <FontAwesomeIcon icon={faCheck} />
                      </i>
                    </div>
                    <div class='single-feature-titles'>
                      <p class='title fw-bold'>
                        Rating
                      </p>
                      <p
                        className='mt-0 card-star'
                        style={{ fontSize: '14px', color: '#f3ba1a' }}
                      >
                        {activityDetail?.starts_rating === '' ? (
                          <span className='fw-bold'>No Rating</span>
                        ) : (
                          Array(activityDetail?.starts_rating)
                            .fill(0)
                            .map((_, index) => (
                              <i key={index} className='fa fa-star'>
                                <FontAwesomeIcon icon={faStar} />
                              </i>
                            ))
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=' col-6 mt-1'>
                  <div class='single-tour-feature d-flex align-items-center mb-3'>
                    <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                      <i class='fas fa-check'>
                        <FontAwesomeIcon icon={faClock} />
                      </i>
                    </div>
                    <div class='single-feature-titles'>
                      <p  class='title fw-bold'>
                        Duration
                      </p>
                      <p
                        className='mt-0'
                        style={{ fontSize: '13px' }}
                        class='title '
                      >
                        {activityDetail?.duration} hours
                      </p>
                    </div>
                  </div>
                </div>
                <div className=' col-6 mt-1'>
                  <div class='single-tour-feature d-flex align-items-center mb-3'>
                    <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                      <i class='fas fa-check'>
                        <FontAwesomeIcon icon={faCalendarCheck} />
                      </i>
                    </div>
                    <div class='single-feature-titles'>
                      <p  class='title fw-bold'>
                        Start Date
                      </p>
                      <p
                        className='mt-0'
                        style={{ fontSize: '13px' }}
                        class='title '
                      >
                        {moment(activityDetail?.start_date).format(
                          'DD-MM-YYYY'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=' col-6 mt-1'>
                  <div class='single-tour-feature d-flex align-items-center mb-3'>
                    <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                      <i class='fas fa-check'>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </i>
                    </div>
                    <div class='single-feature-titles'>
                      <p class='title fw-bold'>
                        End Date
                      </p>
                      <p
                        className='mt-0'
                        style={{ fontSize: '13px' }}
                        class='title '
                      >
                        {moment(activityDetail?.end_date).format('DD-MM-YYYY')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=' col-6 mt-1'>
                  <div class='single-tour-feature d-flex align-items-center mb-3'>
                    <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                      <i class='fas fa-check'>
                        <FontAwesomeIcon icon={faMapLocation} />
                      </i>
                    </div>
                    <div class='single-feature-titles'>
                      <p class='title fw-bold'>
                        Location
                      </p>
                      <p
                        className='mt-0'
                        style={{ fontSize: '13px' }}
                        class='title '
                      >
                        {activityDetail?.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>     
                </div>
              </div>
              
              
              
              <div className='row '>
                <div className=' p-3'>
                  <h3 className=''>Overview</h3>
                  <p className='mt-2 text-justify'>
                    {activityDetail?.activity_content}{' '}
                  </p>
                </div>
              </div>
              {activityDetail?.video_link !==null && (
          <div className='text-center mt-3'>
          <iframe width="100%" height="400"  src={activityDetail?.video_link} frameborder="0" allowfullscreen></iframe>

        </div>
        )}
        {(whatExpect !==null && whatExpect?.length !==0)  &&  (
        <section id='section-2'>
                <h4 className='mt-3 view-detail-heading'>What Expect</h4>
                
                {whatExpect?.map((item, index) => (
                  <div key={index}>
                    <button
                      className={`accordion  ${
                        activeIndex === index  ? 'active' : ''
                      }`}
                      onClick={() => show(index)}
                    >
                      {item.title} 
                    </button>
                    <div class='panel'>
                      <p>{item.expect_content}</p>
                    </div>
                  </div>
                ))}
              </section>
              )}
            </div>
            <div className='col-md-4'>
              <div className='checkout-hotel-detail p-3'>
              <div>
                  <h4>Availability</h4>
                </div>
              <table class='table'>
                  <thead>
                    <tr>
                      <th>Day of Week</th>
                      <th>Open</th>
                      <th>Close</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availibalityDays?.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {moment(item.date).format('dddd')} -{' '}
                          {moment(item.date).format('DD-MM-YYYY')}
                        </td>
                        <td>{item.from}</td>
                        <td>{item.to}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='checkout-hotel-detail p-3 mt-3'>
                <div>
                  <h4>Select Activity</h4>
                </div>
                <div class='d-flex justify-content-between mt-2'>
                  <div>
                    <h6 class='card-title'>Start Date:</h6>
                  </div>
                  <div>
                    {' '}
                    {moment(activityDetail?.start_date).format('DD-MM-YYYY')}
                  </div>
                </div>
                <div class='d-flex justify-content-between mt-2'>
                  <div>
                    <h6 class='card-title'>End Date:</h6>
                  </div>
                  <div>
                    {' '}
                    {moment(activityDetail?.end_date).format('DD-MM-YYYY')}
                  </div>
                </div>
                <div class='mt-2'>
                  <div>
                    <h6 class='card-title'>When are you traveling?</h6>
                    <div className='field-icon-wrap mt-2'>
                      <span className='form-control-feedback'>
                        <FontAwesomeIcon icon={faCalendar} />{' '}
                      </span>
                      <DatePicker
                        selected={selectedDate}
                        onChange={date => setSelectedDate(date)}
                        placeholderText='Select Date'
                        filterDate={filterDate}
                        minDate={new Date()}
                        dateFormat='dd/MM/yyyy' // Customize date format as needed
                        className='form-control text-start select-styling ps-5'
                      />
                    </div>
                  </div>
                </div>
                <div class='d-flex justify-content-between mt-2'>
                  <div>
                    <h6 class='card-title'>Adult Price:</h6>
                  </div>
                  <div>
                    {' '}
                    {activityDetail?.currency_symbol} {activityDetail?.sale_price}
                  </div>
                </div>
                {activityDetail?.child_sale_price !==null && (
                  <div class='d-flex justify-content-between mt-2'>
                  <div>
                    <h6 class='card-title'>Child Price:</h6>
                  </div>
                  <div>
                    {' '}
                    {activityDetail?.currency_symbol} {activityDetail?.child_sale_price}
                  </div>
                </div>
                )}
                <div className='row'>
                <div className='col-md-6'>
                <div class="form-group mt-2">
                    <label for="exampleFormControlSelect1">Select Adults</label>
                    <select onChange={handleAdult}  value={selectAdults} className="form-control form-select select-styling" id="exampleFormControlSelect1">
                    <option selected value='0'>0</option>
                      <option value='1'>1</option>
                      <option value='2'>2</option>
                      <option value='3'>3</option>
                      <option value='4'>4</option>
                      <option value='5'>5</option>
                      <option value='6'>6</option>
                      <option value='7'>7</option>
                      <option value='8'>8</option>
                      <option value='9'>9</option>
                      <option value='10'>10</option>
                    </select>
                  </div>
                </div>
                <div className='col-md-6'>
                <div class="form-group mt-2">
                    <label for="exampleFormControlSelect1">Select Child</label>
                    <select value={selectChilds} onChange={handleChild} className="form-control form-select select-styling" id="exampleFormControlSelect1">
                    <option selected value='0'>0</option>
                    <option value='1'>1</option>
                      <option value='2'>2</option>
                      <option value='3'>3</option>
                      <option value='4'>4</option>
                      <option value='5'>5</option>
                      <option value='6'>6</option>
                      <option value='7'>7</option>
                      <option value='8'>8</option>
                      <option value='9'>9</option>
                      <option value='10'>10</option>
                    </select>
                  </div>
                </div>
                </div>
                {additionalServices?.length !==0 && (
                <div className='mt-2'>
                  <h4>Additional Services</h4>
                </div>
                )}
                {additionalServices?.map((item,index)=>(
                        <div key={index}>
                          <div class="form-group" data-toggle="buttons">
                            <label class="btn btn-default w-100 fw-bold mt-2  umrah-package-modal-checkbox2 select-room--checkbox info">
                              <i class="fa fa-fw"></i>
                              <input id="0" autocomplete="off"  
                                checked={
                                  selectedServices.length > 0 &&
                                  selectedServices.some(data => data.name === item.service_name)
                                }                               
                                onChange={() => handleCheckboxChange(item.service_name,item.service_type,item.service_price)} class="room-check" type="checkbox"/>
                              {item.service_name}
                              </label>
                              </div>
                       
                        <div class='d-flex justify-content-between mt-2'>
                          <div>
                            <h6 class='card-title'>Price:</h6>
                          </div>
                          <div>
                            {' '}
                            {activityDetail?.currency_symbol} {item.service_price}
                          </div>
                        </div>
                        <div class='d-flex justify-content-between mt-2'>
                          <div>
                            <h6 class='card-title'>Service Type:</h6>
                          </div>
                          <div>
                            {' '}
                            {item.service_type}
                          </div>
                        </div>
                        {item.service_type==='Per Person' && (
                          <div class="form-group mt-2">
                                <h6 class='card-title'>Select Person:</h6>                    
                                <select value={
                                        selectedServices.length > 0
                                          ? selectedServices.find(data => data.name === item.service_name)?.adult || '0'
                                          : '0'
                                      }
                                   onChange={(event) => handleAdditionalServicePerson(event, item.service_name)} disabled={
                                  !(selectedServices.length > 0 &&
                                  selectedServices.some(data => data.name === item.service_name))
                                }  
                                className="form-control form-select select-styling" id="exampleFormControlSelect1">
                                <option selected value='0'>0</option>
                                {Array.from({ length: selectAdults }, (_, index) => index + 1)?.map((optionValue) => (
                                      <option key={optionValue} value={optionValue}>
                                        {optionValue}
                                      </option>
                                    ))}
                                </select>
                         </div>
                        )}
                       
                        </div>
                ))}
                 
                <div className='mt-2'>
                <a onClick={toggleModal} className='activity_booking-Box' >
                  <FontAwesomeIcon icon={faCalendarTimes}/> Cancellation Policy ?
                  </a>
                  <a onClick={SaveData} class="btn btn-primary select-styling search-btn1 form-control mt-2">Book Now</a>
                </div>
              </div>
            </div>
          </div>
         
          <div class='tour_details_boxed'>
          <div class='row'>
            <div class='col-md-6'>
              {/* class='tour_details_boxed ' */}
              <div>
                <h3 class='heading_theme'>Included</h3>
                <h6>
                  {' '}
                  <i class='fa-solid fa-person-circle-plus'></i> Whats Included?
                </h6>
                <p>{activityDetail?.whats_included}</p>
              </div>
            </div>
            <div class='col-md-6'>
              {/* class='tour_details_boxed' */}
              <div>
                <h3 class='heading_theme'>Excluded</h3>

                <h6>
                  <i class='fa-solid fa-person-circle-minus'></i> Whats
                  Excluded?
                </h6>
                <p>{activityDetail?.whats_excluded}</p>
              </div>
            </div>
          </div>
          {(faqs !==null && faqs?.length !==0) &&(
          <div className=''>
         <h4 className='mt-5 flight-heading '>Frequently Asked Questions</h4>
         {faqs?.map((item, index) => (
                  <div key={index}>
                    <button
                      className={`accordion2  ${
                        activeIndex1 === index  ? 'active' : ''
                      }`}
                      onClick={() => show1(index)}
                    >
                      {item.title} 
                    </button>
                    <div class='panel'>
                      <p>{item.content}</p>
                    </div>
                  </div>
                ))}                        
         </div>
           )}
          </div>
        </div>
        <Modal isOpen={isModal} className='t-0' toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Cancellation Policy</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <p>{activityDetail?.cancellation_policy}</p>
          </div>
        </ModalBody>
      </Modal>
      </Layout>
    </>
  )
}

export default ActivityDetail
