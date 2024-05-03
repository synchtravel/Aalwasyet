import React,{useState,useEffect,useRef} from 'react'
import noUiSlider from 'nouislider';
import Layout from '../../Components/Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollar, faPlaneDeparture,faStar} from '@fortawesome/free-solid-svg-icons'
import PackageDetailCard2 from '../../Components/PackageDetailCard/PackageCard2';
import Axios from 'axios';
import Loading from '../../Components/Loading/Loader';
import { useLocation } from 'react-router-dom';
import { RangeSlider } from 'rsuite';
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { useSelector } from 'react-redux';
import Helmet from 'react-helmet';
import bgimage from '../../Images/Packages/kabapic.jpg';
import wow from 'wowjs';
import { Hotelapitoken,ApiEndPoint } from '../../Components/GlobalData/GlobalData';
function UmrahPackage2(){
      var minValue1=0;
      var maxValue1 = 0;
    const [minValue, setMinValue] = useState(minValue1);
    const [maxValue, setMaxValue] = useState(maxValue1);
    const [rangeValue, setRangeValue] = useState([minValue1, maxValue1]);
    const [ShowPriceFilter, setShowPriceFilter] = useState(false);
    const [ShowAirportFilter, setShowAirportFilter] = useState(false);
    const [ShowRatingFilter, setShowRatingFilter] = useState(false);
    const [value, setvalue] = useState({min:100,max:1000});
    const [displayTour,setDisplayTour]=useState([]);
    const [starRating, setStarRating] = useState({rating5:'0',rating4:'0',rating3:'0',rating2:'0',rating1:'0',type:'Stars'});
    const [isLoading,setIsLoading]=useState(false);
    const [showFilter, setShowFilter] = useState(true);
    const [FilterData, setFilterData] = useState([]);
    const sliderRef = useRef(null);
    const [filterAirports, setFilterAirports] = useState([]);
    const [airportFilter, setAirportFilter] = useState({type:'airport'});
    const location = useLocation();
    const id = location.state;
   
    useEffect(() => {
      const slider = sliderRef.current;
  
      noUiSlider.create(slider, {
        start: [minValue, maxValue],
        connect: true,
        range: {
          min: value.min,
          max: value.max, // Set your desired max value here
        },
      });
  
      slider.noUiSlider.on('update', (values, handle) => {
        const [newMinValue, newMaxValue] = values.map(parseFloat);
  
        if (handle === 0) {
          setMinValue(newMinValue);
        } else {
          setMaxValue(newMaxValue);
        }
      });
  
      return () => slider.noUiSlider.destroy();
    }, [minValue, maxValue]);
    
    const setValues = () => {
      // Set initial values for the slider
      const slider = sliderRef.current;
      slider.noUiSlider.set([minValue, maxValue]);
    };
      useEffect(() => {
        new wow.WOW().init();
        GetPackages();
        }, [id]);

       const GetPackages= async()=>{
        setIsLoading(true);
        var endpoint=ApiEndPoint();
        var token=Hotelapitoken();
        if(id === null){
          var otherid=0;
          const url = window.location.href; // Get the current URL
          const urlParts = url.split('/'); // Split the URL by '/'
          const lastPart = urlParts[urlParts.length - 1]; 
          const nameparts=lastPart.split('_');
          const targetWord = nameparts[0];
          var request = {
            token: token
          };
        
          try {
            const response = await Axios.post(
              endpoint + '/api/get_all_catigories_list_apis_new',
              request,
              {
                headers: {
                  'Access-Control-Allow-Origin': '*'
                }
              }
            )
            const filteredData = response.data.categories.filter(item => {
              // Split the name into words
              const words = item.title.split(' ');
  
              // Check if the first word matches the target word
              return words.length > 0 && words[0].toLowerCase() === targetWord.toLowerCase();
            });
            otherid=filteredData[0].id;
          } catch (error) {
            setIsLoading(false);
            console.error('Error:', error)
          }

            var data={
              'token':token,
              'cat_id':otherid,
            };
        }else{
          var data={
            'token':token,
            'cat_id':id,
          };
        };
          
        try {
           const response = await Axios.post(endpoint+'/api/get_all_tour_list_apis_new',data, {
             headers: {
               "Access-Control-Allow-Origin": "*",
             } ,
             
           });
           setIsLoading(false);
           setDisplayTour(response.data.tours);
           setFilterData(response.data.tours);
            getdepartureairports(response.data);
            sessionStorage.setItem('packagesdetail',JSON.stringify(response.data.tours));
          setvalues();
         } catch (error) {
          setIsLoading(false);
           console.error('Error:', error);
         };
    
        };
        const getdepartureairports=(TourData)=>{
          var airports=[];
          TourData.tours.forEach(element => {
             var flightdetail=JSON.parse(element.flights_details);
        
             var departureAirportCode = flightdetail[0].departure_airport_code;
        
             // Check if the departure airport code is not already in the array
             if (!airports.includes(departureAirportCode)) {
               airports.push(departureAirportCode);
             }
        
          });
          
          setFilterAirports(airports);
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
        
        const setvalues=()=>{
          var data= JSON.parse(sessionStorage.getItem('packagesdetail'));
          var minValue1=0;
          var maxValue1 = 0;
          var amounts;
          if(data !== null){
            amounts = data.map(tour => tour.quad_grand_total_amount);
            if(amounts.length !==0){
              minValue1 = Math.min(...amounts);
               maxValue1 = Math.max(...amounts);
            };
          };
          setMinValue(minValue1);
            setMaxValue(maxValue1);
           value.max=maxValue1;
           value.min=minValue1;
            
        };
        const filterbyStars=()=>{
          setShowRatingFilter(false);
          if(starRating.rating1==='0' && starRating.rating2==='0' && starRating.rating3==='0' && starRating.rating4==='0' && starRating.rating5==='0'){
            setFilterData(displayTour);
            
          }else{
          const filteredTours = displayTour.filter((tour) => {
            const hotelRating = tour.starts_rating;
            if(hotelRating !=='')
            {
              return Object.keys(starRating).some((ratingKey) => Number(hotelRating) === Number(starRating[ratingKey]));

            }
          });
          setFilterData(filteredTours);
          
        }

        };

        const filterbyPrice=()=>{
          setShowPriceFilter(false);
          const filteredTours = displayTour.filter(tour => {
            const price = tour.quad_grand_total_amount;
            return price >= minValue && price <= maxValue;
          });
          setFilterData(filteredTours);
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
        const filterAirportscall =()=>{
          setShowAirportFilter(false);
          setFilterData(airportFilter);
          var length= Object.keys(airportFilter).length;
          if(length === 1){
            setFilterData(displayTour)
          }else{
            const filteredTours = displayTour.filter(tour => {
              var flightdetail=JSON.parse(tour.flights_details);
             
              var name=flightdetail[0].departure_airport_code;
    
              return Object.keys(airportFilter).some(
                ratingKey =>
                name === airportFilter[ratingKey]
              )        })
            setFilterData(filteredTours)
            setShowFilter(false)
          }
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
                  <label className='form-label'>Price Level</label>
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
                      Min: <span id='kt_slider_basic_min'>{minValue.toFixed(0)}</span>
                    </div>
                    <div className='fw-bold mb-2'>
                      Max: <span id='kt_slider_basic_max'>{maxValue.toFixed(0)}</span>
                    </div>
                  </div>
                  <button className='btn select-styling search-btn1 mb-2' onClick={filterbyPrice}>Filter</button>

                </div>
              </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={ShowAirportFilter} toggle={ToggleAirportFilter}>
          <ModalHeader toggle={ToggleAirportFilter}>Departure Airport Filter</ModalHeader>
          <ModalBody>
          <div className='widget widget_has_radio_checkbox'>
                <h4>Filter by Departure Airport</h4>
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
          </ModalBody>
        </Modal>
        <Modal isOpen={ShowRatingFilter} toggle={ToggleRatingFilter}>
          <ModalHeader toggle={ToggleRatingFilter}>Star Rating Filter</ModalHeader>
          <ModalBody>
          <div className='widget widget_has_radio_checkbox'>
                <h3>Star Rating</h3>
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
                      <input type='checkbox' className='custom-textbox'  onChange={handleCheckboxChange} name='rating4' value='4' />
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
                <button className='btn select-styling search-btn1' onClick={filterbyStars}>Filter</button>
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
        {isLoading && (<Loading/>)}
    <Layout>
    <div>
        <img src={bgimage}/>
    </div>
    <div className='container'>
        <div className='row'>
          <div className='col-md-12 p-2'>
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
                      Min: <span id='kt_slider_basic_min'>{minValue.toFixed(0)}</span>
                    </div>
                    <div className='fw-bold mb-2'>
                      Max: <span id='kt_slider_basic_max'>{maxValue.toFixed(0)}</span>
                    </div>
                  </div>
                  <button className='btn select-styling search-btn1 mb-2' onClick={filterbyPrice}>Filter</button>

                </div>
              </div>
              <div className='widget widget_has_radio_checkbox'>
                <h3>Filter by Departure Airport</h3>
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
              <div className='widget widget_has_radio_checkbox'>
                <h3>Star Rating</h3>
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
                      <input type='checkbox' className='custom-textbox'  onChange={handleCheckboxChange} name='rating4' value='4' />
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
              </div>

              {/* <div className='widget widget_has_radio_checkbox'>
                <h3>Included services</h3>
                <ul></ul>
              </div> */}

              <button className='btn select-styling search-btn1' onClick={filterbyStars}>Filter</button>

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
            {/* <PackageDetailCard/> */}
            {displayTour.length !==0 ?(
            <PackageDetailCard2 displayTour={FilterData}/>
            ):(
              <h4 className='text-center'>Sorry! No Package available .</h4>
            )}
          </div>
        </div>
        <div className="col-md-12 mb-5">
                        <p className='text-justify'> 
                            Alhijaz Tours team has the experience and it provides the most reliable and economical Umrah packages. Our large range of Umrah Packages allows us to meet the needs of various range of budgets and durations. All the umrah packages offered at <a href="https://alhijaztours.net/" style={{color:'#d39d00'}}><b> Alhijaz Tours </b></a> are tailored to meet the specific requirements of the individuals. We have the best resources and personnel to meet your expectations. Make your umrah journey, a memorable one through our unmatched umrah packages.
                            All our low cost umrah packages include return tickets and we offer economical accommodations ranging from 4 and 5 star hotels at a walking distance from Haramain Shirafain. Air conditioned transportation for your travel requirements is also part of the service. Our low cost umrah packages are available throughout the year other than the hajj season. We always have busy days being one of the top umrah services providers with umrah packages in United Kingdom.
                            Alhijaz Tours team works with an objective to be as much flexible as we can in the umrah packages. We have a thorough understanding that everyone has his/her own desires and financial circumstances. So, we offer cheap umrah packages for different budgets and durations. Haramayn ltd also let you choose most appropriate hotel according to your requirements from a wide range of hotel accommodations available with us. All the services in our umrah packages are remarkable for UK residents. We are trusted by Muslim Community due to our umrah packages.
                        </p>
                    </div>
      </div>
    </Layout>
        </>
    )
}

export default UmrahPackage2;