import React, { useState,useEffect } from 'react';
import London from '../../Images/Cheepflight/london.jpg';
import London1 from '../../Images/Cheepflight/london1.jpg';
import dubai from '../../Images/Cheepflight/dubai.jpg';
import dubai1 from '../../Images/Cheepflight/dubai1.jpg';
import istambol from '../../Images/Cheepflight/istambol.jpg';
import istambol1 from '../../Images/Carousal/4.jpg';
import newyork from '../../Images/Cheepflight/newyork.jpg';
import newyork1 from '../../Images/Cheepflight/newyork1.jpg';
import jeddah from '../../Images/Home/jeddah.jpg';
import rid from '../../Images/Home/riyad.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faPlane } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loader';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import Axios from 'axios';
import { ApiEndPoint,FlightSearchToken } from '../GlobalData/GlobalData';
import { OneWayFlightSearchData, OneWayFlightIndexSearchData } from '../../Redux/Actions/actions';
function TopHotels () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  var endpoint = ApiEndPoint();
  const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    GetFlighMarkup()
  }, []);


  const OneWayapicall = async (departure,arrival) => {
    const random15DigitNumber = generateRandomNumber();
    var token = FlightSearchToken();
    const currentDate = new Date();
     const twoDaysLater = new Date(currentDate);
     twoDaysLater.setDate(currentDate.getDate() + 2);
    const data = {
      token_authorization: token,
      case: 'search_flights',
      MaxStopsQuantity:'All',
      DepartureDate: moment(twoDaysLater).format('YYYY-MM-DD'),
      DepartureCode: departure,
      ArrivalCode: arrival,
      AirTripType:'OneWay',
      AirlinesCode: 'EK',
      adult: 1,
      child: 0,
      infant: 0,
      ConversationId: random15DigitNumber,
      CabinType: 'no'
    }
    dispatch(OneWayFlightIndexSearchData(data))
    setIsLoading(true)
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
      setIsLoading(false)
      if (response.data.Success === false) {
        return;
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        dispatch(OneWayFlightSearchData(response.data.Data))
        sessionStorage.setItem('15digitnumber', random15DigitNumber.toString())
        navigate('/Flight_search')
      }
    } catch (error) {
      
      setIsLoading(false)
      console.error('Error:', error)
    }
  };

  function generateRandomNumber () {
    const min = Math.pow(10, 14) 
    const max = Math.pow(10, 15) - 1 
    return Math.floor(Math.random() * (max - min + 1) + min)
  };

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
  };


  return (
    <>
    {isloading && (
      <Loading />
    )}
      <div className='p-3 Best-collection1'>
        <div class="container">
          <div class="row">
              <div class="col-sm-6">
              <h3 style={{ color: '#930000' }}>Travel to Jeddah</h3>
                  <div class='row'>
            <div class='col-md-6 mb-4'>
              <div onClick={()=>OneWayapicall('LHR','JED')} class='card h-100 shadow-sm dropdown'>
                <div style={{ position: 'relative' }}>
                  <img
                    src={London}
                    class='img-fluid rounded-top portrait-image2'
                    alt='Image 1'
                  />
                  {/* <div className='black_Layer'></div>
                  <div className='d-flex m-1 justify-content-between img-btn-city'>
                    <h4 className=' mt-2 '>Alicante</h4>
                    <h4 className=' mt-2 '>£ 125</h4>
                  </div> */}
                </div>
                <div class='card-body'>
                  <div class='clearfix'>
                    <div className='select-child m-0'>
                      <h5 className='card-title text-center'>London</h5>
                      <FontAwesomeIcon icon={faPlane} />
                      <h5 className=' card-title text-center'>Jeddah</h5>
                    </div>
                    <div class='border-line mt-3 mb-3'></div>
                    <span style={{ color: '#930000' }} class='float-start fs-l'>
                      <h6>See Price</h6>
                    </span>
                    <span style={{ color: '#930000' }} class='float-end'>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class='col-md-6 mb-4'>
              <div onClick={()=>OneWayapicall('IST','JED')} class='card h-100 shadow-sm dropdown'>
                <div style={{ position: 'relative' }}>
                  <img
                    src={istambol}
                    class='img-fluid rounded-top portrait-image2'
                    alt='Image 1'
                  />
                </div>
                <div class='card-body'>
                  <div class='clearfix'>
                    <div className='select-child m-0'>
                      <h5 className='card-title text-center'>Istanbul</h5>
                      <FontAwesomeIcon icon={faPlane} />
                      <h5 className=' card-title text-center'>Jeddah</h5>
                    </div>
                    <div class='border-line mt-3 mb-3'></div>
                    <span   style={{ color: '#930000' }} class='float-start fs-l '>
                      <h6>See Price</h6>
                    </span>
                    <span style={{ color: '#930000' }} class='float-end'>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class='col-md-6 mb-4'>
              <div onClick={()=>OneWayapicall('NYC','JED')} class='card h-100 shadow-sm dropdown'>
                <div style={{ position: 'relative' }}>
                  <img
                    src={newyork}
                    class='img-fluid rounded-top portrait-image2'
                    alt='Image 1'
                  />
                </div>
                <div class='card-body'>
                  <div class='clearfix'>
                    <div className='select-child m-0'>
                      <h5 className='card-title text-center'>New York</h5>
                      <FontAwesomeIcon icon={faPlane} />
                      <h5 className=' card-title text-center'>Jeddah</h5>
                    </div>
                    <div class='border-line mt-3 mb-3'></div>
                    <span style={{ color: '#930000' }} class='float-start fs-l'>
                      <h6>See Price</h6>
                    </span>
                    <span style={{ color: '#930000' }} class='float-end'>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class='col-md-6 mb-4'>
              <div onClick={()=>OneWayapicall('DXB','JED')} class='card h-100 shadow-sm dropdown'>
                <div style={{ position: 'relative' }}>
                  <img
                    src={dubai}
                    class='img-fluid rounded-top portrait-image2'
                    alt='Image 1'
                  />
                </div>
                <div class='card-body'>
                  <div class='clearfix'>
                    <div className='select-child m-0'>
                      <h5 className='card-title text-center'>Dubai</h5>
                      <FontAwesomeIcon icon={faPlane} />
                      <h5 className=' card-title text-center'>Jeddah</h5>
                    </div>
                    <div class='border-line mt-3 mb-3'></div>
                    <span style={{ color: '#930000' }} class='float-start fs-l'>
                      <h6>See Price</h6>
                    </span>
                    <span style={{ color: '#930000' }} class='float-end'>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
              </div>
               <div class="col-sm-6">
               
               <img
                    src={jeddah}
                    class='img-fluid mt-5 '
                    alt='Image 1'
                  />
              </div>
              <div class="col-sm-6">
             
               <img
                    src={rid}
                    class='img-fluid mt-5 '
                    alt='Image 1'
                  />
              </div>
      





              <div class="col-sm-6">
              <h3 style={{ color: '#930000' }}>Travel to Riyadh</h3>
                <div class='row'>
            <div class='col-md-6 mb-4'>
              <div onClick={()=>OneWayapicall('LHR','RUH')} class='card h-100 shadow-sm dropdown'>
                <div style={{ position: 'relative' }}>
                  <img
                    src={London1}
                    class='img-fluid rounded-top portrait-image2'
                    alt='Image 1'
                  />
                  {/* <div className='black_Layer'></div>
                  <div className='d-flex m-1 justify-content-between img-btn-city'>
                    <h4 className=' mt-2 '>Alicante</h4>
                    <h4 className=' mt-2 '>£ 125</h4>
                  </div> */}
                </div>
                <div class='card-body'>
                  <div class='clearfix'>
                    <div className='select-child m-0'>
                      <h5 className='card-title text-center'>London</h5>
                      <FontAwesomeIcon icon={faPlane} />
                      <h5 className=' card-title text-center'>Riyadh</h5>
                    </div>
                    <div class='border-line mt-3 mb-3'></div>
                    <span style={{ color: '#930000' }} class='float-start fs-l'>
                      <h6>See Price</h6>
                    </span>
                    <span style={{ color: '#930000' }} class='float-end'>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class='col-md-6 mb-4'>
              <div onClick={()=>OneWayapicall('IST','RUH')} class='card h-100 shadow-sm dropdown'>
                <div style={{ position: 'relative' }}>
                  <img
                    src={istambol1}
                    class='img-fluid rounded-top portrait-image2'
                    alt='Image 1'
                  />
                </div>
                <div class='card-body'>
                  <div class='clearfix'>
                    <div className='select-child m-0'>
                      <h5 className='card-title text-center'>Istanbul</h5>
                      <FontAwesomeIcon icon={faPlane} />
                      <h5 className=' card-title text-center'>Riyadh</h5>
                    </div>
                    <div class='border-line mt-3 mb-3'></div>
                    <span style={{ color: '#930000' }} class='float-start fs-l'>
                      <h6>See Price</h6>
                    </span>
                    <span style={{ color: '#930000' }} class='float-end'>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class='col-md-6 mb-4'>
              <div onClick={()=>OneWayapicall('NYC','RUH')} class='card h-100 shadow-sm dropdown'>
                <div style={{ position: 'relative' }}>
                  <img
                    src={newyork1}
                    class='img-fluid rounded-top portrait-image2'
                    alt='Image 1'
                  />
                </div>
                <div class='card-body'>
                  <div class='clearfix'>
                    <div className='select-child m-0'>
                      <h5 className='card-title text-center'>New York</h5>
                      <FontAwesomeIcon icon={faPlane} />
                      <h5 className=' card-title text-center'>Riyadh</h5>
                    </div>
                    <div class='border-line mt-3 mb-3'></div>
                    <span style={{ color: '#930000' }} class='float-start fs-l'>
                      <h6>See Price</h6>
                    </span>
                    <span style={{ color: '#930000' }} class='float-end'>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class='col-md-6 mb-4'>
              <div onClick={()=>OneWayapicall('DXB','RUH')} class='card h-100 shadow-sm dropdown'>
                <div style={{ position: 'relative' }}>
                  <img
                    src={dubai1}
                    class='img-fluid rounded-top portrait-image2'
                    alt='Image 1'
                  />
                </div>
                <div class='card-body'>
                  <div class='clearfix'>
                    <div className='select-child m-0'>
                      <h5 className='card-title text-center'>Dubai</h5>
                      <FontAwesomeIcon icon={faPlane} />
                      <h5 className=' card-title text-center'>Riyadh</h5>
                    </div>
                    <div class='border-line mt-3 mb-3'></div>
                    <span style={{ color: '#930000' }} class='float-start fs-l'>
                      <h6>See Price</h6>
                    </span>
                    <span style={{ color: '#930000' }} class='float-end'>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </span>
                  </div>
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

export default TopHotels
