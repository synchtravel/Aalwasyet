import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar,
  faPlaneDeparture,
  faPlaneArrival,
  faCheck
} from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import Axios from 'axios'
import { ViewTourDetail } from '../../Redux/Actions/actions'
import { useSelector, useDispatch } from 'react-redux'
import Loading from '../Loading/Loader'
import {
  CustomerDomainName,
  Hotelapitoken,
  ApiEndPoint
} from '../GlobalData/GlobalData'
function PackageDetailCard ({ filterData }) {
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(true);
  const [FilterData, setFilterData] = useState([]);
  const Dispatch = useDispatch();
  const navigation = useNavigate();
  const imageurl = CustomerDomainName();
  const TourData = useSelector(state => state.hotels.toursdetail);
  const ToursDetail =TourData.tours.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  var apiendpoint = ApiEndPoint();

  const fetchViewDetail = async (event, id, otherprovider,name) => {
    event.preventDefault()
    var apitoken = Hotelapitoken()
    setLoading(true)
    if (otherprovider === 0) {
      var data = {
        token: apitoken,
        id: id,
        type: 'tour',
        provider_token: ''
      }
    } else {
      var data = {
        token: apitoken,
        id: id,
        type: 'tour',
        provider_token: otherprovider
      }
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
      Dispatch(ViewTourDetail(response.data));
      const result = name.split(' ').join('-');
      navigation(`/umrah-package/${result}`)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    DataFilter()
  }, [filterData])

  const DataFilter = () => {
    if (filterData !== '') {
      if (filterData.type === 'price') {
        const filteredTours = ToursDetail.filter(tour => {
          const price = tour.quad_grand_total_amount
          return price >= filterData.min && price <= filterData.max
        })
        setFilterData(filteredTours)
        setShowFilter(false)
      } else if (filterData.type === 'Stars') {
        if (
          filterData.rating1 === '0' &&
          filterData.rating2 === '0' &&
          filterData.rating3 === '0' &&
          filterData.rating4 === '0' &&
          filterData.rating5 === '0'
        ) {
          setFilterData(ToursDetail)
          setShowFilter(false)
        } else {
          const filteredTours = ToursDetail.filter(tour => {
            const hotelRating = tour.starts_rating
            if (hotelRating !== '') {
              return Object.keys(filterData).some(
                ratingKey =>
                  Number(hotelRating) === Number(filterData[ratingKey])
              )
            }
          })
          setFilterData(filteredTours)
          setShowFilter(false)
        }
      }else if (filterData.type === 'airport') {
        var length= Object.keys(filterData).length;
        if(length === 1){
          setFilterData(ToursDetail)
          setShowFilter(false)
        }else{
          const filteredTours = ToursDetail.filter(tour => {
            var flightdetail=JSON.parse(tour.flights_details);
           
            var name=flightdetail[0].departure_airport_code;
  
            return Object.keys(filterData).some(
              ratingKey =>
              name === filterData[ratingKey]
            )        })
          setFilterData(filteredTours)
          setShowFilter(false)
        }
       
      }
    }
  };
  
  return (
    <>
      {loading && <Loading />}
      {showFilter ? (
        <div className='filter-page__content'>
          <div className='filter-item-wrapper' id='tours_filter'>
            <div className='row'>
              <div className='col-md-12 mb-4'>
                {ToursDetail.map((item, index) => {
                  const flightDetails = JSON.parse(item.flights_details)
                  return (
                    <div key={index} className='wow animate__animated animate__slideInRight mt-2'
                    data-wow-duration="1s"
                    data-wow-delay="0.2s">
                      <div className='row parent_row  bg-package-list'>
                        <div className='col-md-4'>
                          <div className=''>
                            <img
                              className='tour-img mb-1'
                              src={
                                imageurl +
                                'public/uploads/package_imgs/' +
                                item.tour_banner_image
                              }
                              alt=''
                            />
                           
                          </div>
                        </div>
                        <div className='col-md-5'>
                          <h5 className='card-title'>
                            <a  onClick={event => fetchViewDetail(event, item.id,0,item.title)} className='p-card-title'>
                              {item.title}
                            </a>
                          </h5>
                          <h6 className='departure-date'>
                            <i className='fa-solid fa-plane-departure'>
                              <FontAwesomeIcon icon={faPlaneDeparture} />{' '}
                            </i>
                            {moment(item.start_date).format('LL')}{' '}
                          </h6>

                          <p className='card-star'>
                            {item.starts_rating === 'No_Rating' ? (
                              <span className='fw-bold'>No Rating</span>
                            ) : (
                              <>
                                {item.starts_rating}.0
                                {Array.from({
                                  length: parseInt(item.starts_rating, 10)
                                }).map((_, index) => (
                                  <i key={index} className='fa fa-star'>
                                    {' '}
                                    <FontAwesomeIcon icon={faStar} />
                                  </i>
                                ))}
                              </>
                            )}
                          </p>
                        
                         
                          <hr />
                          <div className='row f-13'>
                            <div className='col-md-5 col-5 col-sm-5 mt-1 p-car-departure'>
                              <p>
                                <i className='fa-solid fa-plane-departure'>
                                  <FontAwesomeIcon icon={faPlaneDeparture} />
                                </i>{' '}
                                Departure From{' '}
                              </p>
                            </div>
                            <div className='col-md-7 col-7 col-sm-7 mt-1 p-car-departure'>
                              <p>
                                {' '}
                                {flightDetails[0].departure_airport_code} &nbsp;
                              </p>
                            </div>
                            <div className='col-md-5 col-5 col-sm-5 mt-1 p-car-departure'>
                              <p>
                                <i className='fa-solid fa-plane-arrival'>
                                  <FontAwesomeIcon icon={faPlaneArrival} />
                                </i>{' '}
                                Return Date{' '}
                              </p>
                            </div>
                            <div className='col-md-7 col-7 col-sm-7 mt-1 p-car-departure'>
                              <p>
                                {' '}
                                {moment(item.end_date).format('LL')} &nbsp;
                              </p>
                            </div>
                            <div className='col-md-5 col-5 col-sm-5 mt-1  p-car-departure'>
                              <p>
                                <i className='fa-solid fa-check'>
                                  <FontAwesomeIcon icon={faCheck} />
                                </i>{' '}
                                Available Spaces{' '}
                              </p>
                            </div>
                            <div className='col-md-7 col-7 col-sm-7 mt-1 p-car-departure'>
                              <p> {item.no_of_pax_days} &nbsp;</p>
                            </div>
                          </div>
                        </div>
                        <div className='col-md-3 text-center card-price-section pt-2'>
                        <div className='price text-center p-card-price mt-2'>
                            <h6>
                              {item.currency_symbol}
                              <super>
                              {item.quad_grand_total_amount !== null
                              ? item.quad_grand_total_amount
                              : item.triple_grand_total_amount !== null
                              ? item.triple_grand_total_amount
                              : item.double_grand_total_amount !== null
                              ? item.double_grand_total_amount
                              : 'N/A'}  
                                </super> {/* <sub>PP</sub> */}
                            </h6>
                          </div>
                          <div className='time_length mt-2'>
                            <i className='fa fa-moon-o' aria-hidden='true'></i>
                            Tour Length{' '}
                            <span className='tour_length'>
                              {item.time_duration} Night
                            </span>
                          </div>
                         
                          <a
                            onClick={event => fetchViewDetail(event, item.id,0,item.title)}
                            className='btn btn-primary select-styling search-btn1 form-control mt-2'
                          >
                            Book Now
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div className='mt-3'>
                  <h5 className='flight-heading'>
                    Packages From Other Providers
                  </h5>
                </div>
                {TourData.other_providers_tours.map((provider, index) => (
                  <div key={index}>
                    {provider[0].map((item, index) => {
                      const flightDetails = JSON.parse(item.flights_details)
                      return (
                        <div key={index} className='mt-2'>
                          <div className='row parent_row  bg-package-list'>
                            <div className='col-md-4'>
                              <div className=''>
                                <img
                                  className='tour-img mb-1'
                                  src={
                                    provider[1].webiste_Address +
                                    '/public/uploads/package_imgs/' +
                                    item.tour_banner_image
                                  }
                                  alt=''
                                />
                              
                              </div>
                            </div>

                            <div className='col-md-5'>
                              <h5 className='card-title'>
                                <a href='#' className='p-card-title'>
                                  {item.title}
                                </a>
                              </h5>
                              <h6 className='departure-date'>
                                <i className='fa-solid fa-plane-departure'>
                                  <FontAwesomeIcon icon={faPlaneDeparture} />{' '}
                                </i>
                                {moment(item.start_date).format('LL')}{' '}
                              </h6>

                              <p className='card-star'>
                                {item.starts_rating === 'No_Rating' ? (
                                  <span className='fw-bold'>No Rating</span>
                                ) : (
                                  <>
                                    {item.starts_rating}.0
                                    {Array.from({
                                      length: parseInt(item.starts_rating, 10)
                                    }).map((_, index) => (
                                      <i key={index} className='fa fa-star'>
                                        {' '}
                                        <FontAwesomeIcon icon={faStar} />
                                      </i>
                                    ))}
                                  </>
                                )}
                              </p>
                             
                              <hr />
                              <div className='row f-13'>
                                <div className='col-md-5 col-6 mt-1 p-car-departure'>
                                  <p>
                                    <i className='fa-solid fa-plane-departure'>
                                      <FontAwesomeIcon
                                        icon={faPlaneDeparture}
                                      />
                                    </i>{' '}
                                    Departure From{' '}
                                  </p>
                                </div>
                                <div className='col-md-7 col-6 mt-1 p-car-departure'>
                                  <p>
                                    {' '}
                                    {
                                      flightDetails[0].departure_airport_code
                                    }{' '}
                                    &nbsp;
                                  </p>
                                </div>
                                <div className='col-md-5 col-6 mt-1 p-car-departure'>
                                  <p>
                                    <i className='fa-solid fa-plane-arrival'>
                                      <FontAwesomeIcon icon={faPlaneArrival} />
                                    </i>{' '}
                                    Return Date{' '}
                                  </p>
                                </div>
                                <div className='col-md-7 col-6 mt-1 p-car-departure'>
                                  <p>
                                    {' '}
                                    {moment(item.end_date).format('LL')} &nbsp;
                                  </p>
                                </div>
                                <div className='col-md-5 col-6 mt-1  p-car-departure'>
                                  <p>
                                    <i className='fa-solid fa-check'>
                                      <FontAwesomeIcon icon={faCheck} />
                                    </i>{' '}
                                    Available Spaces{' '}
                                  </p>
                                </div>
                                <div className='col-md-7 col-6 mt-1 p-car-departure'>
                                  <p> {item.no_of_pax_days} &nbsp;</p>
                                </div>
                              </div>
                            </div>
                            <div className='col-md-3 text-center card-price-section pt-2'>
                              <div className='price text-center p-card-price mt-2'>
                                <h6>
                                  {item.currency_symbol}
                                  <super>
                                    {item.double_grand_total_amount}
                                  </super>{' '}
                                  <sub>PP</sub>
                                </h6>
                              </div>
                              <div className='time_length mt-2'>
                                <i
                                  className='fa fa-moon-o'
                                  aria-hidden='true'
                                ></i>
                                Tour Length{' '}
                                <span className='tour_length'>
                                  {item.time_duration} Night
                                </span>
                              </div>
                              <h6 className='text-center p-view-detail mt-2'>
                                <NavLink className='nav-link' to='/view-detail'>
                                  View Details
                                </NavLink>
                              </h6>
                              <a className='btn mt-2 btn-primary select-styling search-btn1 form-control'>
                                Book Now
                              </a>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='filter-page__content'>
          <div className='filter-item-wrapper' id='tours_filter'>
            <div className='row'>
              <div className='col-md-12 mb-4'>
                {FilterData.map((item, index) => {
                  const flightDetails = JSON.parse(item.flights_details)
                  return (
                    <div key={index} className='mt-2'>
                      <div className='row parent_row  bg-package-list'>
                        <div className='col-md-4'>
                          <div className=''>
                            <img
                              className='tour-img mb-1'
                              src={
                                imageurl +
                                'public/uploads/package_imgs/' +
                                item.tour_banner_image
                              }
                              alt=''
                            />
                        
                          </div>
                        </div>
                        <div className='col-md-5'>
                          <h5 className='card-title'>
                            <a onClick={event => fetchViewDetail(event, item.id,0,item.title)} className='p-card-title'>
                              {item.title}
                            </a>
                          </h5>
                          <h6 className='departure-date'>
                            <i className='fa-solid fa-plane-departure'>
                              <FontAwesomeIcon icon={faPlaneDeparture} />{' '}
                            </i>
                            {moment(item.start_date).format('LL')}{' '}
                          </h6>

                          <p className='card-star'>
                            {item.starts_rating === 'No_Rating' ? (
                              <span className='fw-bold'>No Rating</span>
                            ) : (
                              <>
                                {item.starts_rating}.0
                                {Array.from({
                                  length: parseInt(item.starts_rating, 10)
                                }).map((_, index) => (
                                  <i key={index} className='fa fa-star'>
                                    {' '}
                                    <FontAwesomeIcon icon={faStar} />
                                  </i>
                                ))}
                              </>
                            )}
                          </p>
                         
                          <hr />
                          <div className='row f-13'>
                            <div className='col-md-5 col-6 mt-1 p-car-departure'>
                              <p>
                                <i className='fa-solid fa-plane-departure'>
                                  <FontAwesomeIcon icon={faPlaneDeparture} />
                                </i>{' '}
                                Departure From{' '}
                              </p>
                            </div>
                            <div className='col-md-7 col-6 mt-1 p-car-departure'>
                              <p>
                                {' '}
                                {flightDetails[0].departure_airport_code} &nbsp;
                              </p>
                            </div>
                            <div className='col-md-5 col-6 mt-1 p-car-departure'>
                              <p>
                                <i className='fa-solid fa-plane-arrival'>
                                  <FontAwesomeIcon icon={faPlaneArrival} />
                                </i>{' '}
                                Return Date{' '}
                              </p>
                            </div>
                            <div className='col-md-7 col-6 mt-1 p-car-departure'>
                              <p>
                                {' '}
                                {moment(item.end_date).format('LL')} &nbsp;
                              </p>
                            </div>
                            <div className='col-md-5 col-6 mt-1  p-car-departure'>
                              <p>
                                <i className='fa-solid fa-check'>
                                  <FontAwesomeIcon icon={faCheck} />
                                </i>{' '}
                                Available Spaces{' '}
                              </p>
                            </div>
                            <div className='col-md-7 col-6 mt-1 p-car-departure'>
                              <p> {item.no_of_pax_days} &nbsp;</p>
                            </div>
                          </div>
                        </div>
                        <div className='col-md-3 text-center card-price-section pt-2'>
                        <div className='price text-center p-card-price mt-2'>
                            <h6>
                              {item.currency_symbol}
                              <super> {item.quad_grand_total_amount}</super> {/* <sub>PP</sub> */}
                            </h6>
                          </div>
                          <div className='time_length mt-2'>
                            <i className='fa fa-moon-o' aria-hidden='true'></i>
                            Tour Length{' '}
                            <span className='tour_length'>
                              {item.time_duration} Night
                            </span>
                          </div>
                          <h6
                            onClick={event => fetchViewDetail(event, item.id,0,item.title)}
                            className='text-center  p-view-detail mt-2'
                          >
                            View Details
                          </h6>
                          <a
                          onClick={event => fetchViewDetail(event, item.id,0,item.title)}
                            className='btn btn-primary select-styling search-btn1 form-control mt-2'
                          >
                            Book Now
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {/* <div className='mt-3'>
                <h5 className='flight-heading'>
                  Packages From Other Providers
                </h5>
              </div>
              {ToursDetail.other_providers_tours.map((provider, index) => (
                <div key={index}>
                  {provider[0].map((item, index) => {
                    const flightDetails = JSON.parse(item.flights_details)
                    return (
                      <div key={index} className='mt-2'>
                        <div className='row parent_row  bg-package-list'>
                          <div className='col-md-3'>
                            <div className=''>
                              <img
                                className='tour-img mb-1'
                                src={provider[1].webiste_Address+'/public/uploads/package_imgs/' +item.tour_banner_image}  alt=''
                              />
                              <div
                                id='map-container-google-2'
                                className='z-depth-1-half map-container'
                                style={{ height: '500' }}
                              >
                                <iframe
                                  src='https://maps.google.com/maps?q=chicago&t=&z=13&ie=UTF8&iwloc=&output=embed'
                                  frameborder='0'
                                  allowfullscreen
                                ></iframe>
                              </div>
                            </div>
                          </div>

                          <div className='col-md-6'>
                            <h5 className='card-title'>
                              <a href='#' className='p-card-title'>
                                {item.title}
                              </a>
                            </h5>
                            <h6 className='departure-date'>
                              <i className='fa-solid fa-plane-departure'>
                                <FontAwesomeIcon icon={faPlaneDeparture} />{' '}
                              </i>
                              {moment(item.start_date).format('LL')}{' '}
                            </h6>

                            <p className='card-star'>
                              {item.starts_rating === 'No_Rating' ? (
                                <span className='fw-bold'>No Rating</span>
                              ) : (
                                <>
                                  {item.starts_rating}.0
                                  {Array.from({
                                    length: parseInt(item.starts_rating, 10)
                                  }).map((_, index) => (
                                    <i key={index} className='fa fa-star'>
                                      {' '}
                                      <FontAwesomeIcon icon={faStar} />
                                    </i>
                                  ))}
                                </>
                              )}
                            </p>
                            <p></p>
                            <p className='tour-description'>{item.content}</p>
                            <hr />
                            <div className='row f-13'>
                              <div className='col-md-5 mt-1 p-car-departure'>
                                <p>
                                  <i className='fa-solid fa-plane-departure'>
                                    <FontAwesomeIcon icon={faPlaneDeparture} />
                                  </i>{' '}
                                  Departure From{' '}
                                </p>
                              </div>
                              <div className='col-md-7 mt-1 p-car-departure'>
                                <p>
                                  {' '}
                                  {flightDetails[0].departure_airport_code}{' '}
                                  &nbsp;
                                </p>
                              </div>
                              <div className='col-md-5 mt-1 p-car-departure'>
                                <p>
                                  <i className='fa-solid fa-plane-arrival'>
                                    <FontAwesomeIcon icon={faPlaneArrival} />
                                  </i>{' '}
                                  Return Date{' '}
                                </p>
                              </div>
                              <div className='col-md-7 mt-1 p-car-departure'>
                                <p>
                                  {' '}
                                  {moment(item.end_date).format('LL')} &nbsp;
                                </p>
                              </div>
                              <div className='col-md-5 mt-1  p-car-departure'>
                                <p>
                                  <i className='fa-solid fa-check'>
                                    <FontAwesomeIcon icon={faCheck} />
                                  </i>{' '}
                                  Available Spaces{' '}
                                </p>
                              </div>
                              <div className='col-md-7 mt-1 p-car-departure'>
                                <p> {item.no_of_pax_days} &nbsp;</p>
                              </div>
                            </div>
                          </div>
                          <div className='col-md-3 text-center card-price-section pt-2'>
                            <div className='price text-center p-card-price mt-2'>
                              <h6>
                                {item.currency_symbol}
                                <super>
                                  {item.double_grand_total_amount}
                                </super>{' '}
                                <sub>PP</sub>
                              </h6>
                            </div>
                            <div className='time_length mt-2'>
                              <i
                                className='fa fa-moon-o'
                                aria-hidden='true'
                              ></i>
                              Tour Length{' '}
                              <span className='tour_length'>
                                {item.time_duration} Night
                              </span>
                            </div>
                            <h6 className='text-center p-view-detail mt-2'>
                              <NavLink className='nav-link' to='/view-detail'>
                                View Details
                              </NavLink>
                            </h6>
                            <a
                                
                              className='btn mt-2 btn-primary select-styling search-btn1 form-control'
                            >
                              Book Now
                            </a>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))} */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PackageDetailCard
