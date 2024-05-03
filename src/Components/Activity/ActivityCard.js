import React,{useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faInfoCircle,
    faStar,
  faGlobe,
  faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import { CustomerDomainName,ApiEndPoint,ActivityToken } from "../GlobalData/GlobalData";
function ActivityCard({newActivityListing}){
  const [isLoading, setIsLoading] = useState(false);
  var Domainpath=CustomerDomainName();
  var navigation=useNavigate();
const showDetail=(id)=>{
  navigation(`/activity_details/${id}`);
};
 
    return (
        <>
        <div className='filter-page__content'>
            <div className='filter-item-wrapper' id='tours_filter'>
            <div className='row'>
             {newActivityListing.map((item,index)=>(
                  <div key={index} style={{padding:'1em'}} className='col-md-6 mb-2 '>
                    <div style={{height:'100%'}} className='row parent_row bg-package-list'>
                      <div className='col-md-12 item-from'>
                          <div>
                            <img
                              className='tour-img'
                              src={Domainpath+'/public/images/activites/'+item.featured_image}
                              alt=''
                            />
                          </div>
                      </div>
                      <div className='col-md-12'>
                        <h5 className='card-title mt-2'>
                          <a
                           onClick={()=>showDetail(item.id)}
                            className='p-card-title'
                          >
                           {item.title}
                          </a>
                        </h5>
                        <h6 className='departure-date mb-0'>
                         {' '}
                          <FontAwesomeIcon icon={faGlobe} />{' '}
                         {item.location}
                        </h6>
                        <p className='card-star'>
                          {item.starts_rating === '' ? (
                            <span className='fw-bold'>No Rating</span>
                          ) : (
                            Array(item.starts_rating )
                              .fill(0)
                              .map((_, index) => (
                                <i key={index} className='fa fa-star'>
                                  <FontAwesomeIcon icon={faStar} />
                                </i>
                              ))
                          )}
                          (Activity Hours : {item.duration})
                        </p>
                        {/* {hotelDetails[item.hotel_id] && (
                          <div class='item-address'>
                            <i class='awe-icon awe-icon-marker-2'>
                              <FontAwesomeIcon icon={faGlobe} />
                            </i>{' '}
                            {hotelDetails[item.hotel_id].details_data.address}{' '}
                          </div>
                        )} */}
                     
                          <div class='row'>
                          <div class='single-feature-titles'>
                                    <p style={{fontSize:'13px'}}>{item.activity_content}</p>
                                  </div>
                              {/* <div
                                
                                className=' col-sm-4 col-4 col-md-4 col-lg-4 mt-1'
                              >
                                <div class='single-tour-feature d-flex align-items-center mb-3'>
                                  <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                                    <i class='fas fa-check'>
                                      <FontAwesomeIcon icon={faCheck} />
                                    </i>
                                  </div>
                                  <div class='single-feature-titles'>
                                    <p class='title fw-bold'>23423</p>
                                  </div>
                                </div>
                              </div> */}
                            
                          </div>
                       
                        
                        <div class='item-address' style={{ color: 'green' }}>
                          <i class='awe-icon awe-icon-marker-2'>
                            <FontAwesomeIcon icon={faCalendarCheck} />
                          </i>{' '}
                        {item.activity_date}{' '}
                        </div>
                      </div>
                      <div className='col-md-12 text-center card-price-section  pt-2'>
                       
                        <div className='price text-center p-card-price'>
                        <h6 className="mt-1 mb-1">
                              <super>
                                {item.currency_symbol} {item.sale_price}
                              </super>
                            </h6>
                          {/* {showPrice ? (
                            <h6>
                              <super>
                                {CurrencyRates === undefined
                                  ? baseCName
                                  : CurrencyRates.selectedcurrency}{' '}
                                {renderPrice(
                                  calculateMarkup(
                                    item.min_price,
                                    item.admin_markup,
                                    item.admin_markup_type,
                                    item.customer_markup,
                                    item.customer_markup_type
                                  )
                                )}
                              </super>
                            </h6>
                          ) : (
                            <h6>
                              <super>
                                {item.hotel_curreny}{' '}
                                {calculateMarkup(
                                  item.min_price,
                                  item.admin_markup,
                                  item.admin_markup_type,
                                  item.customer_markup,
                                  item.customer_markup_type
                                ).toFixed(2)}
                              </super>
                            </h6>
                          )} */}
                        </div>
                        {/* <div className='time_length'>
                          <i className='fa fa-moon-o' aria-hidden='true'></i>
                          2-Adults, 2-Children
                          <span className='tour_length'>12 Night</span>
                        </div> */}

                        <button
                        onClick={()=>showDetail(item.id)}
                          className='btn mt-3 btn-primary select-styling search-btn1 form-control'
                        >
                          Book Now
                        </button>

                        <div style={{ fontSize: '11px' }}>
                          <FontAwesomeIcon
                            color='#bd1c1cc9'
                            icon={faInfoCircle}
                          />{' '}
                          Inclusive of VAT and Taxes
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
               </div>
            </div>
          </div>
        </>
    )
}

export default ActivityCard;