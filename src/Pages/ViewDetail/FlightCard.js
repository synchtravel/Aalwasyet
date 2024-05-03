import React from 'react'
import fl1 from "../../Images/View Detail/flight-clr.png"
import { useSelector } from 'react-redux'
import moment from 'moment';
function FlightDetail () {
  const tourDetail = useSelector((state) => state.hotels.viewtourdetail);
  const departureflight=JSON.parse( tourDetail.tours.flights_details);
  const returnflight=JSON.parse( tourDetail.tours.return_flights_details );
  return (
    <>
      <div class='fl-flight-container mt-2 mb-2'>
        <div class='flight-name gradient-green '>
          <span>Airline : {departureflight[0].other_Airline_Name2}</span>
        </div>
        <div class='fl-detail-left'>
          <div class='fl-detail-left-container'>
            {departureflight !==null && (
            <div class='fl-flight-schedual'>
            <h6>Departure Detail</h6>
            {departureflight.map((item,index)=>(
              <div key={index} class='fl-flight-route'>
                <div  class='fl-route-detail'>
                  <h4 class='left'>
                   {moment(item.departure_time).format('LT')}<span></span>
                  </h4>
                  <h4 class='center fl-width text-center'>{item.departure_flight_number}</h4>
                  <h4 class='right fl-width text-end'>
                  {moment(item.arrival_time).format('LT')} <span></span>
                  </h4>
                </div>
                <div class='fl-route-direction'>
                  <div class='fl-route-bar'></div>
                  {/* <div class='fl-icon'>
                  <p class='center text-center'>
                  {departureflight[0].departure_flight_route_type}
                  </p>
                  </div> */}
                </div>
                <div class='fl-route-detail'>
                  <p class='left'>
                    {' '}
                   <b> {item.departure_airport_code}</b> <br />  {moment(item.departure_time).format('dddd')},{moment(item.departure_time).format('ll')}
                  </p>
                  <p class='center text-center'>
                  {item.departure_flight_route_type}
                  </p>
                  <p class='right text-end'>
                  {item.arrival_airport_code} <br />  {moment(item.arrival_time).format('dddd')},{moment(item.arrival_time).format('ll')}

                  </p>
                </div>
              </div>
               ))}
               <div className='border-line'></div>
            </div>
            )}
            
            {returnflight !==null && (
            <div class='fl-flight-schedual'>
              <h6>Return Detail</h6>
              {returnflight.map((item,index)=>(
              <div key={index} class='fl-flight-route'>
                <div class='fl-route-detail'>
                  <h4 class='left'>
                  {moment(item.return_departure_time).format('LT')}<span> </span>
                  </h4>
                  <h4 class='text-center fl-width'>{item.return_departure_flight_number}</h4>
                  <h4 class='right text-end fl-width'>
                  {moment(item.return_arrival_time).format('LT')}<span> </span>
                  </h4>
                </div>
                <div class='fl-route-direction'>
                  <div class='fl-route-bar'></div>
                  {/* <div class='fl-icon'>
                    <img src={fl1} />
                  </div> */}
                </div>
                <div class='fl-route-detail'>
                  <p class='left'>
                    {' '}
                    {item.return_departure_airport_code} <br />  {moment(item.return_departure_time).format('dddd')},{moment(item.return_departure_time).format('ll')}
                  </p>
                  <p class='center text-center'>
                  {/* One Stop (KHI) */}
                 {item.return_flight_route_type}
                  </p>
                  <p class='right text-end'>
                  {item.return_arrival_airport_code} <br />  {moment(item.return_arrival_time).format('dddd')},{moment(item.return_arrival_time).format('ll')}
                  </p>
                </div>
              </div>
                 ))}
            </div>
            )}
          </div>
        </div>
        {/* <div class='fl-detail-right'>
          <div class='fl-booking-buttons'>
            <a href='#inquiry_form' class='btn-default'>
              Book
            </a>
            <button
              type='button'
              class='btn-default detail'
              data-toggle='modal'
              data-target='#myModal_0'
            >
              <span>Detail</span>
            </button>
            <div class='fl-flight-price'>
              <span>Rs. 109749</span>
            </div>
          </div>
        </div> */}
      </div>
    </>
  )
}

export default FlightDetail
