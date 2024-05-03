import React, { useState, useEffect } from 'react'
import img1 from '../../Images/Packages/umrah-package.jpg'
import img2 from '../../Images/Packages/AlAqsa-package.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendar,
  faHeadset,
  faMoon,
  faPersonWalkingLuggage,
  faPlaneArrival,
  faPlaneDeparture,
  faSackDollar,
  faUmbrellaBeach,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import CIcon from '@coreui/icons-react'
import { cilMoon } from '@coreui/icons'
import { Tooltip, Whisper } from 'rsuite'
import Loading from '../Loading/Loader'
import moment from 'moment/moment'
import { useNavigate } from 'react-router-dom'
import { ViewTourDetail } from '../../Redux/Actions/actions'
import { useDispatch } from 'react-redux'
import {
  Hotelapitoken,
  CustomerDomainName,
  ApiEndPoint
} from '../GlobalData/GlobalData'
import OwlCarousel from 'react-owl-carousel'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'
import Axios from 'axios'
function Packages () {
  const [isloading, setLoading] = useState(false)
  const [packagescard, setPackagescard] = useState([])
  const [allcateogries, setAllCateogries] = useState([])
  const [allTours, setAllTours] = useState([])
  const [showTours, setShowTours] = useState([])
  const [itemsToShow, setItemsToShow] = useState(4)
  var url = CustomerDomainName()
  const Dispatch = useDispatch()
  const navigation = useNavigate()
  const [activeItem, setActiveItem] = useState(0) // Initialize activeItem with the default value (0).
  var apiendpoint = ApiEndPoint()
  const handleCategorySelect = index => {
    setActiveItem(index)
    var filter = allTours.filter(
      tour => Number(tour.categories) === allcateogries[index].id
    )
    setShowTours(filter)
    // Set the selected category as the active one.
  }
  useEffect(() => {
    GetPackages()
  }, [])

  useEffect(() => {
    // Add an event listener to track window width changes
    function handleResize () {
      if (window.innerWidth > 1000) {
        setItemsToShow(4) // For smaller screens, show 1 item
      } else if (window.innerWidth > 768 && window.innerWidth < 1000) {
        setItemsToShow(3) // For smaller screens, show 1 item
      } else if (window.innerWidth > 470 && window.innerWidth < 768) {
        setItemsToShow(2) // For smaller screens, show 1 item
      } else if (window.innerWidth < 470) {
        setItemsToShow(1) // For larger screens, show 4 items (you can adjust this)
      }
    }

    // Initialize the number of items based on the current window width
    handleResize()

    // Attach the event listener
    window.addEventListener('resize', handleResize)

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []);


  const GetPackages = async () => {
    var token = Hotelapitoken();

    var data = {
      token: token
    }
    try {
      const response = await Axios.post(
        apiendpoint + '/api/latest_packages',
        data,
        {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
      setAllCateogries(response.data.all_cateogries)
      var filter = response.data.latest_packages[0].filter(
        tour =>
          Number(tour.categories) ===
          response.data.all_cateogries[activeItem].id
      )
      setShowTours(filter)
      setAllTours(response.data.latest_packages[0])
    } catch (error) {
      console.error('Error:', error)
    }
  };

  const fetchViewDetail = async (event, id,name) => {
    event.preventDefault()
    var apitoken = Hotelapitoken()
    setLoading(true)
    var data = {
      token: apitoken,
      id: id,
      type: 'tour',
      provider_token: ''
    }
    try {
      const response = await Axios.post(
        apiendpoint + '/api/get_tour_details',
        data,
        {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
      Dispatch(ViewTourDetail(response.data))
      const result = name.split(' ').join('-');
      navigation(`/umrah-package/${result}`)
      setLoading(true)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <>
      {isloading && <Loading />}
      <div className='container'>
        <div className='row'>
          <div className='section-title mt-5'>
            {/* <h4 className=' wow animate__animated animate__fadeInRight'  data-wow-duration="1.5s" data-wow-delay="0.3s">Welcome to Alhijaz Tours</h4> */}
            <h2 className=' new_color wow animate__animated animate__fadeInUp'  data-wow-duration="1.5s" data-wow-delay="0.3s">
               Packages
            </h2>
          </div>
        </div>

        <div className='row justify-content-center'>
          {allcateogries.map((item, index) => (
            <div
              key={item.id}
              className='package-filter wow animate__animated animate__slideInRight text-center w-auto col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-2'
              data-wow-duration="1s" data-wow-delay="0.5s"
            >
              <button
                onClick={() => handleCategorySelect(index)} // Call a function to handle category selection
                className={`btn btn-success ${
                  activeItem === index ? 'activefilter' : ''
                } btn-block btn-md text-start center-vertically`}
              >
                <img
                  src={url + '/public/uploads/package_imgs/' + item.image}
                  width='50'
                  height='50'
                />{' '}
                <span className='ms-2 me-2'>{item.title}</span>
              </button>
            </div>
          ))}
         
        </div>
        <hr className=' dashed hr-devider'></hr>
        {/* {showTours.length > 0 && (
          <OwlCarousel
            className='owl-theme custom-owl-carousel'
            items={itemsToShow}
            margin={8}
            nav
          >
            {showTours.map((tour, index) => (
              <div key={index} class='item'>
                <div className=' mt-2'>
                  <div className='card-sl'>
                  <div className='text-center card-heading'>
                      <h6>{tour.title}</h6>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div className='card-text'>
                        Number of Nights
                        </div>
                        <div className='card-text'>{tour.time_duration}</div>
                      </div>
                    <div className='card-image'>
                      <img
                        src={
                          url +
                          '/public/uploads/package_imgs/' +
                          tour.tour_banner_image
                        }
                      />
                    </div>
                    <div className='row'>
                      <div className='d-flex justify-content-between'>
                        <div className='card-text'>
                          Start Date :
                        </div>
                        <div className='card-text'>
                          {moment(tour.start_date).format('DD-MM-YYYY')}
                        </div>
                      </div>
                      <div className='d-flex justify-content-between'>
                        <div className='card-text'>
                          End Date :
                        </div>
                        <div className='card-text'>
                          {moment(tour.end_date).format('DD-MM-YYYY')}
                        </div>
                      </div>
                      <div className='d-flex justify-content-between'>
                        <div className='card-text'>
                        Seats Available :
                        </div>
                        <div className='card-text'>{tour.no_of_pax_days}</div>
                      </div>

                      <div className='d-flex justify-content-between'>
                        <div className='card-text text-right'>
                          Price :
                        </div>
                        <div className='card-text text-right'>
                          <b>
                            {tour.currency_symbol}{' '}
                            {tour.quad_grand_total_amount !== null
                              ? tour.quad_grand_total_amount
                              : tour.triple_grand_total_amount !== null
                              ? tour.triple_grand_total_amount
                              : tour.double_grand_total_amount !== null
                              ? tour.double_grand_total_amount
                              : 'N/A'}
                          </b>
                        </div>
                      </div>
                    </div>

                    <a
                      onClick={event => fetchViewDetail(event, tour.id,tour.title)}
                      className='card-button index-package-card'
                    >
                      {' '}
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </OwlCarousel>
        )} */}
        
       {showTours.length > 0 && (
          <div >
            <div  className='row '>
            {showTours.map((tour, index) => (
                <div key={index} className='col-md-6 p-1 '>
              <div className='card-wrap new-color mt-2 mb-2'>
                <div className='row m-1'>
                <div className='text-center m-1'>
                      <h5>{tour.title}</h5>
                    </div>
                  <div className='col-lg-4 col-sm-12  col-12 card-price-section '>
                  
                    <div className='card-img'>
                    <div class="bagde-flag-wrap">
                      <h5  class="bagde-flag">
                      {tour.currency_symbol}{' '}
                            {tour.quad_grand_total_amount !== null
                              ? tour.quad_grand_total_amount
                              : tour.triple_grand_total_amount !== null
                              ? tour.triple_grand_total_amount
                              : tour.double_grand_total_amount !== null
                              ? tour.double_grand_total_amount
                              : 'N/A'}
                         </h5>
                    </div>
                      <img src={url +'/public/uploads/package_imgs/' + tour.tour_banner_image} />
                    </div>
                  </div>
                  <div className='col-lg-8 col-sm-12 col-12'>
                  <Whisper placement='top' speaker={ <Tooltip>Number of Nights</Tooltip> }>
                    <div className='d-flex justify-content-between mt-2'>
                      <div>
                        <h6><FontAwesomeIcon icon={faMoon}/> Number of Nights</h6>
                      </div>
                      <div>
                        <h6>{tour.time_duration}</h6>
                      </div>
                    </div>
                    </Whisper>
                    <Whisper placement='top' speaker={ <Tooltip>Start Date</Tooltip> }>
                    <div className='date-flex'>
                      <div className='mt-2'>
                        <h6 style={{color:'brown'}}><FontAwesomeIcon icon={faCalendar}/> Start Date</h6>
                      </div>
                      <div className='mt-2'>
                        <h6>{moment(tour.start_date).format('ll')}</h6>
                      </div>
                    </div>
                    </Whisper>
                    <Whisper placement='top'speaker={<Tooltip>End Date</Tooltip>}>
                    <div className='d-flex justify-content-between mt-2'>
                      <div>
                        <h6 style={{color:'darkslateblue'}}><FontAwesomeIcon icon={faCalendar}/> End Date</h6>
                      </div>
                      <div className='d-flex'>
                        <h6>{moment(tour.end_date).format('ll')}</h6>
                      </div>
                    </div>
                    </Whisper>
                    <div className='text-center'>
                      <button  onClick={event => fetchViewDetail(event, tour.id,tour.title)}  className='btn btn-success m-2 '>
                        View Detail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            
            ))}
            </div>
          </div>
        )} 
        <div className='row'>
          {packagescard.map((item, index) => (
            <div
              key={index}
              className='col-lg-3 col-md-4 col-sm-6 col-xs-12 mt-2'
            >
              <div className='card-sl'>
                <div className='card-image'>
                  <img src={img2} />
                </div>

                <div className='text-center card-heading'>
                  <h6>{item.name}</h6>
                </div>
                <div className='row'>
                  <div className='d-flex justify-content-around'>
                    <div className='card-text'>
                      <FontAwesomeIcon icon={faUser} /> {item.seats} Seats
                      Available{' '}
                    </div>
                    <div className='card-text'>Adults Price</div>
                  </div>

                  <div className='d-flex justify-content-around'>
                    <div className='card-text text-right'>
                      <CIcon className='moon-icon' icon={cilMoon} />{' '}
                      {item.nights} Nights{' '}
                    </div>
                    <div className='card-text text-right'>
                      <b>$ {item.price}</b>
                    </div>
                  </div>
                </div>

                <div className='card-button'> Book Now</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Packages
