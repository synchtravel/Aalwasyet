import React,{useState} from "react";
import Layout from "../../Components/Layout/Layout";
import bgimage from '../../Images/Pages/banner.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import ActivityCard from "../../Components/Activity/ActivityCard";
import { useSelector } from "react-redux";
function Activities (){
  const [ShowRatingFilter, setShowRatingFilter] = useState(false);
  const [starRating, setStarRating] = useState({rating5:'0',rating4:'0',rating3:'0',rating2:'0',rating1:'0',type:'Stars'});
  const ActivityListing=useSelector((state) => state.hotels.ActivityListing);
const[newActivityListing,setNewActivityListing]=useState(ActivityListing.tours);
const[FilterActivityListing,setFilterActivityListing]=useState(ActivityListing.tours);
const handleCheckboxChange = (event) => {
  const { name, value } = event.target;

        setStarRating((prevDetails) => {
          const updatedStarRating = { ...prevDetails };
          if (updatedStarRating[name] !=="0") {
            updatedStarRating[name]="0";
          } else {
            updatedStarRating[name] =value;
          }

          return updatedStarRating;
        });
      };
      
      const filterbyStars=()=>{
        setShowRatingFilter(false);
        if(starRating.rating1==='0' && starRating.rating2==='0' && starRating.rating3==='0' && starRating.rating4==='0' && starRating.rating5==='0'){
          setFilterActivityListing(newActivityListing);
          
        }else{
          console.log(newActivityListing);
        const filteredTours = newActivityListing.filter((tour) => {
          const hotelRating = tour.starts_rating;
          if(hotelRating !=='')
          {
            return Object.keys(starRating).some((ratingKey) => Number(hotelRating) === Number(starRating[ratingKey]));

          }
        });
        setFilterActivityListing(filteredTours);
        
      }

      };

      const ToggleRatingFilter=()=>{
        setShowRatingFilter(!ShowRatingFilter);
      };
    return(
        <>
         <Modal isOpen={ShowRatingFilter} toggle={ToggleRatingFilter}>
          <ModalHeader toggle={ToggleRatingFilter}>Star Rating Filter</ModalHeader>
          <ModalBody>
          <div>
                <ul>
                  <li>
                    <label>
                      <input type='checkbox' 
                      className='custom-textbox' 
                      onChange={handleCheckboxChange} name='rating5' value='5' />
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
                      <input type='checkbox' className='custom-textbox' onChange={handleCheckboxChange} name='rating4' value='4' />
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
                      <input type='checkbox' className='custom-textbox' onChange={handleCheckboxChange} name='rating3' value='3' />
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
                      <input type='checkbox'className='custom-textbox' onChange={handleCheckboxChange} name='rating2' value='2' />
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
                      <input type='checkbox'className='custom-textbox'  onChange={handleCheckboxChange} name='rating1' value='1' />
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
                <button onClick={filterbyStars} className='btn btn-warning m-2'>Apply</button>
                </div>
                  
          </ModalBody>
        </Modal>
        <Layout>
        <div className='contact-img'>
        <img src={bgimage} />
      </div>
      <div className='container'>
      <div className='row mt-3 hotel-top'>
            <div className='col-md-6 '>
              <h3 className='title font-size-24 tc' id='tours_result'>
              {ActivityListing.tours.length} Result found
              </h3>
            </div>
          </div>
      </div>
      <div className='container'>
        <div className='row mt-2'>
        <div className='col-md-3 col-md-pull-9 '>
        <div class="mobile-Filter-info">
                                <ul>
                                    <li><p onClick={ToggleRatingFilter}><FontAwesomeIcon icon={faStar}/><span > Rating</span></p>
                                    </li>
                                </ul>
                               
                            </div>
            <div className='page-sidebar hide-page_filter'>
              <div className='widget widget_has_radio_checkbox'>
                <div className='filter-show-hide' >                
                  <h3>Filter by Rating</h3>
                </div>
               
                  <div>
                <ul>
                  <li>
                    <label>
                      <input type='checkbox' 
                      className='custom-textbox' 
                      onChange={handleCheckboxChange} name='rating5' value='5' />
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
                      <input type='checkbox' className='custom-textbox' onChange={handleCheckboxChange} name='rating4' value='4' />
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
                      <input type='checkbox' className='custom-textbox' onChange={handleCheckboxChange} name='rating3' value='3' />
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
                      <input type='checkbox'className='custom-textbox' onChange={handleCheckboxChange} name='rating2' value='2' />
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
                      <input type='checkbox'className='custom-textbox'  onChange={handleCheckboxChange} name='rating1' value='1' />
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
                <button style={{width:'96%'}} onClick={filterbyStars} className='btn btn-warning  m-2'>Apply</button>
                </div>
                  
              </div>

              {/* <button className='btn select-styling search-btn1'>Filter</button> */}
            </div>
          </div>
          <div className='col-md-9 col-md-push-3'>
            <ActivityCard newActivityListing={FilterActivityListing}/>
            {/* <HotelCard hotelid={hotelid}/> */}
        </div>
        </div>

      </div>
        </Layout>
        </>
    );
}

export default Activities;