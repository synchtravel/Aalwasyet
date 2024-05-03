import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar,
  faAngleDown,
  faDollar,
  faPlaneDeparture
} from '@fortawesome/free-solid-svg-icons'
import Layout from '../../Components/Layout/Layout'
import noUiSlider from 'nouislider'
import PackageDetailCard from '../../Components/PackageDetailCard/PackageDetailCard'
import bgimage from '../../Images/Packages/kabapic.jpg'
import { RangeSlider } from 'rsuite';
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { useSelector } from 'react-redux';
import Helmet from 'react-helmet';
function SearchTour () {
  const ToursDetail = useSelector((state) => state.hotels.toursdetail);
  const amounts = ToursDetail.tours.map(tour => tour.quad_grand_total_amount);
  
      var minValue1=0;
      var maxValue1 = 0;
      if(amounts.length !==0){
        minValue1 = Math.min(...amounts);
         maxValue1 = Math.max(...amounts);
      };
      const [showfilter, setShowfilter] = useState({departure:true,rating:true});
  const [minValue, setMinValue] = useState(minValue1);
  const [maxValue, setMaxValue] = useState(maxValue1);
  const [rangeValue, setRangeValue] = useState([minValue1, maxValue1]);
  const [ShowPriceFilter, setShowPriceFilter] = useState(false);
    const [ShowAirportFilter, setShowAirportFilter] = useState(false);
    const [ShowRatingFilter, setShowRatingFilter] = useState(false);
  const [filterData, setFilterData] = useState('');
  const [filterAirports, setFilterAirports] = useState([]);
  const [airportFilter, setAirportFilter] = useState({type:'airport'});
  const [starRating, setStarRating] = useState({rating5:'0',rating4:'0',rating3:'0',rating2:'0',rating1:'0',type:'Stars'});
  const sliderRef = useRef(null);
  useEffect(() => {
    getdepartureairports();
    const slider = sliderRef.current
    noUiSlider.create(slider, {
      start: [minValue, maxValue],
      connect: true, // Initial values
      range: {
        min: minValue1, // Minimum value
        max: maxValue1 // Maximum value
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
  }, []);

  const handlefilter =()=>{
    setShowPriceFilter(false);
    var data={min:minValue,max:maxValue,type:'price'};
    setFilterData(data);
  };
 
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
  const StarFilter=()=>{
    setShowRatingFilter(false);
    setFilterData(starRating)
  };
const getdepartureairports=()=>{
  var airports=[];
  ToursDetail.tours.forEach(element => {
     var flightdetail=JSON.parse(element.flights_details);

     var departureAirportCode = flightdetail[0].departure_airport_code;

     // Check if the departure airport code is not already in the array
     if (!airports.includes(departureAirportCode)) {
       airports.push(departureAirportCode);
     }

  });
  
  setFilterAirports(airports);
};

const handleairportsvheckbox=(event)=>{
  const {name,value}=event.target;
  setAirportFilter(prevData => {
    const updatedData = { ...prevData };
  
    if (updatedData.hasOwnProperty(name)) {
      // If the key already exists, remove it
      delete updatedData[name];
    } else {
      // If the key doesn't exist, add it
      updatedData[name] = value;
    }
  
    return updatedData;
  });
};

const Showfilter=(num)=>{
  if(num===1){
    setShowfilter(prevData => ({ ...prevData, departure: !prevData.departure }));
  }
  if(num===2){
    setShowfilter(prevData => ({ ...prevData, rating: !prevData.rating }));
  }
};

const filterAirportscall =()=>{
  setShowAirportFilter(false);
  setFilterData(airportFilter);
};
const TogglePriceFilter=()=>{
  setShowPriceFilter(!ShowPriceFilter);
};
const ToggleAirportFilter=()=>{
  setShowAirportFilter(!ShowAirportFilter);
};
const ToggleRatingFilter=()=>{
  setShowRatingFilter(!ShowRatingFilter);
};

const handleChange = (newRangeValue) => {
  setRangeValue(newRangeValue);
  setMinValue(newRangeValue[0]);
    setMaxValue(newRangeValue[1]);
};
  return (
    <>
    <Modal isOpen={ShowPriceFilter} toggle={TogglePriceFilter}>
          <ModalHeader toggle={TogglePriceFilter}>Price Filter</ModalHeader>
          <ModalBody>
          <div className='widget widget_price_filter'>
                <div className='mb-0'>
                  {/* <label className='form-label'>Price Level</label> */}
                  {/* <div ref={sliderRef} /> */}
                  <RangeSlider
                      value={rangeValue}
                      onChange={handleChange}
                      min={minValue1}
                      tooltip={false}
                      max={maxValue1}
                      step={1}
                    />
                  <div className='pt-5'>
                    <div className='fw-bold mb-2'>
                      Min: <span id='kt_slider_basic_min'>{rangeValue[0]}</span>
                    </div>
                    <div className='fw-bold mb-2'>
                      Max: <span id='kt_slider_basic_max'>{rangeValue[1]}</span>
                    </div>
                  </div>
                  <button onClick={handlefilter} className='btn select-styling search-btn1 mb-1'>Filter</button>
                </div>
              </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={ShowAirportFilter} toggle={ToggleAirportFilter}>
          <ModalHeader toggle={ToggleAirportFilter}>Departure Airport Filter</ModalHeader>
          <ModalBody>
          <div className='widget widget_has_radio_checkbox'>
               
                <div className='filter-show-hide'>                
                {/* <h3>Filter by Departure Airport</h3> */}
                {/* <FontAwesomeIcon icon={faAngleDown}/> */}
                </div>
                  <div>
                <ul>
                  {filterAirports.map((item,index)=>(
                  <li key={index}>
                    <label>
                      <input type='checkbox' className='custom-textbox' onChange={handleairportsvheckbox}  name={`item${index+1}`} value={item} />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'>{' '}
                      {item}
                      </span>
                    </label>
                  </li>
                   ))}
                  </ul>
                  <button onClick={filterAirportscall} className='btn select-styling search-btn1 mb-1'>Filter</button>
                  </div>

                </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={ShowRatingFilter} toggle={ToggleRatingFilter}>
          <ModalHeader toggle={ToggleRatingFilter}>Star Rating Filter</ModalHeader>
          <ModalBody>
          <div className='widget widget_has_radio_checkbox'>
                
                <div className='filter-show-hide' >                
                {/* <h3>Star Rating</h3>                 */}
                {/* <FontAwesomeIcon icon={faAngleDown}/> */}
                </div>
               <div>
                <ul>
                  <li>
                    <label>
                      <input type='checkbox' className='custom-textbox' onChange={handleCheckboxChange} name='rating5' value='5' />
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
                      <input type='checkbox' className='custom-textbox' onChange={handleCheckboxChange} name='rating2' value='2' />
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
                      <input type='checkbox' className='custom-textbox' onChange={handleCheckboxChange} name='rating1' value='1' />
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
                <button onClick={StarFilter} className='btn select-styling search-btn1'>Filter</button>
                </div>
               
              </div>
          </ModalBody>
        </Modal>
      <Helmet>
      <meta property="og:title" content="Book Umrah Package | Select From Available All-Inclusive Umrah Deals & Luxury Umrah Offers to Cheapest Umrah Packages"/>
          <title>Book Umrah Package | Select From Available All-Inclusive Umrah Deals & Luxury Umrah Offers to Cheapest Umrah Packages</title>
           <meta name="keywords" content="Umrah Packages, Low Cost Umrah Packages, Umrah Packages from Birmingham, 5 star Umrah packages, Makkah Hotels, Medina Hotels, Umrah visa, tourist visa, Umrah with flights, book hotels,Umrah 2024, Umrah 2023" />
           <meta property="og:description" content="Al Hijaz Tours Ltd offers huge range of cautiously devised Umrah packages for families, groups, couples, ladies & individual pilgrims. Select from all-inclusive Umrah deals with 5 star amenities, affordable Umrah packages with 4 star facilities or cheapest Umrah offers designed specifically with flights from UK airports & close to Haram hotels. Avail assistance from expert travel advisors to customize these Umrah packages that suits your requirements & get fast visa processing." />
          <meta name="description" content="Al Hijaz Tours Ltd offers huge range of cautiously devised Umrah packages for families, groups, couples, ladies & individual pilgrims. Select from all-inclusive Umrah deals with 5 star amenities, affordable Umrah packages with 4 star facilities or cheapest Umrah offers designed specifically with flights from UK airports & close to Haram hotels. Avail assistance from expert travel advisors to customize these Umrah packages that suits your requirements & get fast visa processing." />
      </Helmet>
    <Layout>
      
      <div className='contact-img'>
        <img src={bgimage} />
      </div>
      
      <div className='container'>
      <div className='row mt-3 hotel-top'>
            <div className='col-md-6 '>
              <h3 className='title font-size-24 tc' id='tours_result'>
              {ToursDetail.tours.length} Result found
              </h3>
            </div>
          </div>
        {/* <div class='col-md-12'>
          <div className='row mt-5'>
            <div className='col-md-6 hotel-top'>
              <h3 className='title font-size-24 tc' id='tours_result'>
              {ToursDetail.tours.length} Result found
              </h3>
            </div>

            <div class=' col-md-6 page-top'>
              <div class='awe-select-wrapper'>
                <select class='awe-select'>
                  <option>Best Match</option>
                  <option>Best Rate</option>
                </select>
                <i class='fa fa-caret-down'></i>
              </div>
            </div>
          </div>
        </div> */}
        <div className='row'>
          <div className='col-md-12 p-2'>
            {/* <h4 style={{ te: 'center' }}>Umrah Packages</h4> */}
          </div>

          <div className='col-md-3 col-md-pull-9'>
          <div class="mobile-Filter-info">
                                <ul>
                                    <li><p onClick={TogglePriceFilter}><FontAwesomeIcon icon={faDollar}/> Price</p></li>
                                    <li><p onClick={ToggleAirportFilter}><FontAwesomeIcon icon={faPlaneDeparture}/><span > Departure</span></p>
                                    </li>
                                    <li><p onClick={ToggleRatingFilter}><FontAwesomeIcon icon={faStar}/><span > Rating</span></p>
                                    </li>
                                </ul>
                               
                            </div>
            <div className='page-sidebar hide-page_filter'>
              <div className='widget widget_price_filter'>
                <div className='mb-0'>
                  <label className='form-label'>Price Level</label>
                  <div ref={sliderRef} />
                  <div className='pt-5'>
                    <div className='fw-bold mb-2'>
                      Min: <span id='kt_slider_basic_min'>{minValue}</span>
                    </div>
                    <div className='fw-bold mb-2'>
                      Max: <span id='kt_slider_basic_max'>{maxValue}</span>
                    </div>
                  </div>
                  <button onClick={handlefilter} className='btn select-styling search-btn1 mb-1'>Filter</button>
                </div>
              </div>
              <div className='widget widget_has_radio_checkbox'>
               
                <div className='filter-show-hide' onClick={()=>Showfilter(1)}>                
                <h3>Filter by Departure Airport</h3>
                <FontAwesomeIcon icon={faAngleDown}/>
                </div>
                {showfilter.departure && (
                  <div>
                <ul>
                  {filterAirports.map((item,index)=>(
                  <li key={index}>
                    <label>
                      <input type='checkbox' className='custom-textbox' onChange={handleairportsvheckbox}  name={`item${index+1}`} value={item} />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'>{' '}
                      {item}
                      </span>
                    </label>
                  </li>
                   ))}
                  </ul>
                  <button onClick={filterAirportscall} className='btn select-styling search-btn1 mb-1'>Filter</button>
                  </div>
                    )}
                </div>
              <div className='widget widget_has_radio_checkbox'>
                
                <div className='filter-show-hide' onClick={()=>Showfilter(2)}>                
                <h3>Star Rating</h3>                
                <FontAwesomeIcon icon={faAngleDown}/>
                </div>
                {showfilter.rating && (
               <div>
                <ul>
                  <li>
                    <label>
                      <input type='checkbox' className='custom-textbox' onChange={handleCheckboxChange} name='rating5' value='5' />
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
                      <input type='checkbox' className='custom-textbox' onChange={handleCheckboxChange} name='rating2' value='2' />
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
                      <input type='checkbox' className='custom-textbox' onChange={handleCheckboxChange} name='rating1' value='1' />
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
                <button onClick={StarFilter} className='btn select-styling search-btn1'>Filter</button>
                </div>
                 )}
              </div>

              {/* <div className='widget widget_has_radio_checkbox'>
                <h3>Included services</h3>
                <ul>
                  <li>
                    <label>
                      <input type='checkbox' name='rating_starts' value='5' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'> Halal Food</span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type='checkbox' name='rating_starts' value='5' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'> facilities 1</span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type='checkbox' name='rating_starts' value='5' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'> Wifi</span>
                    </label>
                  </li>
                </ul>
              </div> */}


              <div className='widget widget_product_tag_cloud mt-2'>
                <h3>Tags</h3>
                <div className='tagcloud'>
                  <a href='#'>Hotel</a>
                  <a href='#'>Motel</a>
                  <a href='#'>Hostel</a>
                  <a href='#'>Homestay</a>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-9 col-md-push-3'>
            {ToursDetail.tours.length == 0 ?(
              <div className='text-center'>
              <h3>Sorry! No Package Available.</h3>
              </div>
            ):(
              <PackageDetailCard filterData={filterData} />
            )}
          </div>
        </div>
      </div>
      </Layout>
    </>
  )
}

export default SearchTour
