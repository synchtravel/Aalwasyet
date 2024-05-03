import React,{useState,useEffect} from "react";
import Layout from "../../Components/Layout/Layout";
import FlightCard from "../../Components/Flight/FlightCard";
import { useSelector } from 'react-redux';
import img1 from '../../Images/Flight/1.jpg';
import moment from "moment";
import Axios from "axios";
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import FlightSearch from "../../Components/SearchBar/FlightSearch";
import { CurrencyConverter } from "../../Components/GlobalData/GlobalData";
import { airportcode } from "../../Components/Data/AirportCodes";
import carimage from '../../Images/Flight/car.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Slider, RangeSlider } from 'rsuite';
import { AirLineNames } from "../../Components/Data/AirLineNames";
import { faClock, faDollarSign,faStar,  faLock,  faEnvelope,  faPhone,
  faDollar,
  faHeadphones,
  faSearch,
  faStopCircle,
  faFilter,
  faPlane, } from "@fortawesome/free-solid-svg-icons";
function FlightListing(){
  const SearchFlights1 = useSelector((state) => state.hotels.OneWayFlight.PricedItineraries);
  const FlightSearchData1 = useSelector(state => state.hotels.OneWayFlightSearchData);
  const [SearchFlights,setSearchFlights]=useState(SearchFlights1);
  const [FlightSearchData,setFlightSearchData]=useState(FlightSearchData1);
  const [ShowStopFilter, setShowStopFilter] = useState(false);
  const [ShowAllFilter, setShowAllFilter] = useState(false);
  const [ShowAirlineFilter, setShowAirlineFilter] = useState(false);
  const [filterData,setFilterData]=useState('');
  const [flightStop,setFlightStop]=useState({type:"Stop"});
  const [priceFilter,setPriceFilter]=useState('');
  const [findHotel,setFindHotel]=useState('5');
  const [showPrice, setShowPrice] = useState(true);
  const [showModifySearch, setShowModifySearch] = useState(false);
  const [SortFastestData,setSortFastestData]=useState({time:'',price:'',currency:''});
  const [SortCheepestData,setSortCheepestData]=useState({time:'',price:'',currency:''});
  const [JourneyDuration,setJourneyDuration]=useState({min:0,max:0});
  const [airlinesCount,setAirlinesCount]=useState({type:"Airline"});
  const [airlinesClass,setAirlinesClass]=useState({type:"Class"});
  const [ArivalCity,setArivalCity]=useState('');
  const [flightInfo,setFlightinfo]=useState({arivalcityname:'',arivalcitycode:'',departurename:'',departurecode:''});
  const [durationFilter,setDurationFiltert]=useState({type:"Journey"});
  const [departureTime,setDepartureTime]=useState({type:"DepartureTime"});
  const [AarlineFilter,setAirlineFilter]=useState({});
  const [baseCurrency, setBaseCurrency] = useState([]);
  const [baseCName, setBaseCName] = useState('GBP');
  var Airlinenamesdata2=AirLineNames;
  const [sliderValue, setSliderValue] = useState(0);
  const [rangeValues, setRangeValues] = useState(['00:00', '23:59']);
  const [selectedFilter, setSelectedFilter] = useState('');
  const CurrencyRates = useSelector(state => state.hotels.Currency);

  const GBPCurrencyRates = useSelector(state => state.hotels.AllCurrency);
  var FlightMarkup = JSON.parse(localStorage.getItem('FlightMarkup'));

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    if(filter=='BestRate'){
      var num='3';
      setPriceFilter(num);
    }else if(filter=='CheapestFirst'){
      var num='1';
      setPriceFilter(num);

    }else if(filter=='FastestFirst'){
      var num='2';
      setPriceFilter(num);

    }
  };
  const GoHotels =()=>{
    setPriceFilter(findHotel);
    if(findHotel===5){
      var num=Number(findHotel)+1;
      setFindHotel(String(num));
    }else{
      var num=Number(findHotel)-1;
      setFindHotel(String(num));
    }
  };
  useEffect(()=>{
    setSearchFlights(SearchFlights1);
    CalculateSortFilterData();
    setFlightSearchData(FlightSearchData1)
  },[SearchFlights1,FlightSearchData1])
  const handleRangeChange = (values) => {
    setRangeValues(values);
  };

  const handleRangeRelease = (values) => {
    setDepartureTime({ ...departureTime, time: values });
    // Add your logic here
  };

  // Function to format time in HH:mm format
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  // Function to convert time to minutes
  const timeToMinutes = (time) => {
    const [hours, mins] = time.split(':').map(Number);
    return hours * 60 + mins;
  };

  // Create an array of time values in 30-minute intervals
  const timeOptions = [];
  for (let i = 0; i <= 24 * 60; i += 30) {
    timeOptions.push(formatTime(i));
  }
  // const handleSliderChange = (event) => {
  //   const value = event.target.value;
  //   setSliderValue(value);
  // };


useEffect(()=>{
  CalculateSortFilterData();
  FilterFlightDuration();
  arrivalcountryname();
  GetFlightInfo();
  AllCurrency(SearchFlights[0]?.AirItineraryPricingInfo.PTC_FareBreakdowns[0]?.PassengerFare.TotalFare.CurrencyCode);
},[SearchFlights1,FlightSearchData1]);
useEffect(() => {
  // Your code to be executed every time hotelsSearchData changes
  // For example:

  // Add your logic here based on the updated hotelsSearchData
}, [FlightSearchData])
const DisplayModifySearch=()=>{
  setShowModifySearch(!showModifySearch);
};
  const FilterFlightDuration = () => {
    const durations = [];
    SearchFlights.forEach((item) => {
      var sum=0
      item.OriginDestinationOptions[0].FlightSegments.forEach((item2) => {
        sum=sum+item2.JourneyDuration;
      });
      durations.push(sum);
    });
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    const minhour=Math.floor(minDuration / 60);
    const maxhour=Math.floor(maxDuration / 60);
    setJourneyDuration({min:minhour+1,max:maxhour+1});
    setSliderValue(maxhour+1);

  };
  const arrivalcountryname=()=>{
    if(SearchFlights !== null && SearchFlights !==''){
      const length=SearchFlights[0].OriginDestinationOptions[0].FlightSegments.length;
      const filteredOptions = airportcode.items.filter(option =>
        option.airportCode.includes(SearchFlights[0].OriginDestinationOptions[0].FlightSegments[Number(length)-1].ArrivalAirportLocationCode )
      );
      if(filteredOptions.length !== 0){
        setArivalCity(filteredOptions[0].cityName);
      }
    };
    
  };

  const GetFlightInfo =()=>{
    if(SearchFlights !== null && SearchFlights !==''){
      const filteredOptions = airportcode.items.filter(option =>
        option.airportCode.includes(FlightSearchData.DepartureCode )
      );
      const arivaloptions = airportcode.items.filter(option =>
        option.airportCode.includes(FlightSearchData.ArrivalCode)
      );
      if(filteredOptions.length !== 0){
       setFlightinfo({
        departurecode:filteredOptions[0]?.airportCode,
        departurename:filteredOptions[0]?.cityName,
        arivalcitycode:arivaloptions[0]?.airportCode,
        arivalcityname:arivaloptions[0]?.cityName
        
      });
      }
    };
    
    
  };
  const CalculateSortFilterData=()=>{
    var Indirectflight = SearchFlights.filter(flight => {
      // Check if the first element of FlightSegments array has an index greater than one
      return flight.OriginDestinationOptions[0].FlightSegments.length > 1;
    });
  var sotFlight = Indirectflight.sort(
          (a, b) =>
            Number(a.AirItineraryPricingInfo.PTC_FareBreakdowns[0]?.PassengerFare.TotalFare.Amount) -
            Number(b.AirItineraryPricingInfo.PTC_FareBreakdowns[0]?.PassengerFare.TotalFare.Amount)
        );

        const durations = [];
      SearchFlights.forEach((item) => {
        var sum = 0;
        item.OriginDestinationOptions[0].FlightSegments.forEach((item2) => {
          sum = sum + item2.JourneyDuration;
        });
        durations.push(sum);
      });
      
      // Now, sort the SearchFlights array based on the durations
      const Shorttest = SearchFlights.slice(); // Create a copy of the array to avoid mutating the original array
      
      Shorttest.sort((a, b) => {
        const durationA = durations[SearchFlights.indexOf(a)];
        const durationB = durations[SearchFlights.indexOf(b)];
      
        return durationA - durationB;
      });
      // var BestFlight= SearchFlights.sort((flight1, flight2) => {
      //   const score1 = calculateOverallScore(flight1);
      //   const score2 = calculateOverallScore(flight2);
      
      //   // Sort in descending order (higher score comes first)
      //   return score2 - score1;
      // });
      
      if(Shorttest !== null){
        var sum=0
        Shorttest[0].OriginDestinationOptions[0].FlightSegments.forEach((item3) => {
          sum = sum + item3.JourneyDuration;
        });
        var time=`${Math.floor( sum / 60)}h ${sum % 60}m`
        var price= Shorttest[0].AirItineraryPricingInfo.PTC_FareBreakdowns[0].PassengerFare.TotalFare.Amount; ;
        var curr=Shorttest[0].AirItineraryPricingInfo.PTC_FareBreakdowns[0].PassengerFare.TotalFare.CurrencyCode;
        setSortFastestData({time:time,currency:curr,price:price});
      }
      if(sotFlight !== null){
        var sum=0
        sotFlight[0].OriginDestinationOptions[0].FlightSegments.forEach((item3) => {
          sum = sum + item3.JourneyDuration;
        });
        var time2=`${Math.floor( sum / 60)}h ${sum % 60}m` ;
        var currency=sotFlight[0].AirItineraryPricingInfo.PTC_FareBreakdowns[0].PassengerFare.TotalFare.CurrencyCode;
        var price2=sotFlight[0].AirItineraryPricingInfo.PTC_FareBreakdowns[0].PassengerFare.TotalFare.Amount;
        setSortCheepestData({price:price2,currency:currency,time:time2})
      }
  };


  const handleAirlineStopChange = (event) => {
    setShowStopFilter(false);
    const { name, value } = event.target;
    
    const isSelected = flightStop[name] === value;
    
    if (isSelected) {
      // If selected, remove it from the object
      const updatedFacilities = { ...flightStop };
      delete updatedFacilities[name];
      setFlightStop(updatedFacilities);
    } else {
      // If not selected, add it to the object
      setFlightStop({ ...flightStop, [name]: value });
    }
  };

  const handleAirlineNameChange = (event) => {
    setShowAirlineFilter(false);
    const { name, value } = event.target;
    
    const isSelected = airlinesCount[name] === value;
    
    if (isSelected) {
      // If selected, remove it from the object
      const updatedFacilities = { ...airlinesCount };
      delete updatedFacilities[name];
      setAirlinesCount(updatedFacilities);
    } else {
      // If not selected, add it to the object
      setAirlinesCount({ ...airlinesCount, [name]: value });
    }
  };

  const handleAirlineClassChange = (event) => {
    setShowAllFilter(false);
    const { name, value } = event.target;
    
    const isSelected = airlinesClass[name] === value;
    
    if (isSelected) {
      // If selected, remove it from the object
      const updatedFacilities = { ...airlinesClass };
      delete updatedFacilities[name];
      setAirlinesClass(updatedFacilities);
    } else {
      // If not selected, add it to the object
      setAirlinesClass({ ...airlinesClass, [name]: value });
    }
  };

  const handleSliderRelease = (value) => {
    setDurationFiltert({ ...durationFilter, time: value });
  };

  useEffect(()=>{
    Airlinefilter();
  },[SearchFlights]);

  useEffect(()=>{
    setFilterData(flightStop);
  },[flightStop]);

  useEffect(()=>{
    setFilterData(departureTime);
  },[departureTime]);

  useEffect(()=>{
    setFilterData(durationFilter);
  },[durationFilter]);

  useEffect(()=>{
    setFilterData(airlinesCount);
  },[airlinesCount]);

  useEffect(()=>{
    setFilterData(airlinesClass);
  },[airlinesClass]);

  useEffect(()=>{
    setFilterData(priceFilter);
  },[priceFilter]);

  const Airlinefilter=()=>{

    const airlineCodeCount = {};

    // Iterate through the flight list
    for (const flight of SearchFlights) {
      const validatingAirlineCode = flight.ValidatingAirlineCode;
  
      // Check if the airline code exists in the count object
      if (airlineCodeCount.hasOwnProperty(validatingAirlineCode)) {
        airlineCodeCount[validatingAirlineCode]++;
      } else {
        airlineCodeCount[validatingAirlineCode] = 1;
      }
    }
    setAirlineFilter(airlineCodeCount)
  };
  const CalculateFLightMarkup = price => {
    var admin = 0
    var client = 0
    if (price !== 'NaN') {
      FlightMarkup.markups.forEach(markup => {
        if (markup.services_type === 'flight') {
          if (markup.added_markup === 'alhijaz') {
            if (markup.markup_type === 'Percentage') {
              const markupValue = Number(markup.markup_value)
              const markupAmount = (Number(price) * markupValue) / 100
              client = markupAmount
            } else {
              client = Number(markup.markup_value)
            }
          } else if (markup.added_markup === 'synchtravel') {
            if (markup.markup_type === 'Percentage') {
              const markupValue = parseFloat(Number(markup.markup_value))
              const markupAmount = (Number(price) * markupValue) / 100
              admin = markupAmount
            } else {
              admin = Number(markup.markup_value)
            }
          }
        }
      })

      var total = Number(price) + admin + client
      return total.toFixed(2)
    }
  };
  // const handlePriceFilterChange=(event)=>{
  //   var num=event.target.value;
  //   setPriceFilter(num);
  // };

  const AllCurrency = c => {
    var token = CurrencyConverter()
    const config = {
      method: 'get',
      url: 'https://v6.exchangerate-api.com/v6/' + token + '/latest/' + c, // Replace with your API URL
      maxBodyLength: Infinity,
      headers: {}
    }

    Axios.request(config)
      .then(response => {
        // Handle the response data here
        setBaseCurrency(response.data.conversion_rates)
      })
      .catch(error => {
        // Handle errors here
        setShowPrice(false)
        console.error(error)
      })
  };

   

  const renderPrice = price => {
    if (CurrencyRates === undefined) {
      const gbpprice = baseCurrency[baseCName] // Use square brackets to access the property
      var baseprice = (Number(gbpprice) * Number(price))
    } else {
      var select123 = CurrencyRates.selectedcurrency
      const gbpprice = baseCurrency[baseCName]
      var baseprice1 = (Number(gbpprice) * Number(price))
      const gbpprice2 = GBPCurrencyRates.conversion_rates[select123] // Use square brackets to access the property
      var baseprice = (Number(gbpprice2) * Number(baseprice1))
    }
    return baseprice
  };

  const ToggleStopFilter=()=>{
    setShowStopFilter(!ShowStopFilter);
  };
  const ToggleAllFilter=()=>{
    setShowAllFilter(!ShowAllFilter);
  };
  const ToggleAirlineFilter=()=>{
    setShowAirlineFilter(!ShowAirlineFilter);
  };
  return(
        <>
        <Modal isOpen={ShowStopFilter} toggle={ToggleStopFilter}>
          <ModalHeader toggle={ToggleStopFilter}>Flight Stop Filter</ModalHeader>
          <ModalBody>
          <div className='widget widget_price_filter'>
                <div className='mb-0'>
                  {/* <h3 className='form-label'>Flight Stop</h3> */}
                  <ul>
                  <li>
                    <label>
                      <input className="custom-textbox" type='checkbox' onChange={handleAirlineStopChange} name='OneStop' value='OneStop' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'> OneStop</span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type='checkbox'className="custom-textbox"onChange={handleAirlineStopChange} name='Direct' value='Direct' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'> Direct </span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type='checkbox' className="custom-textbox" onChange={handleAirlineStopChange} name='All' value='All' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'> All</span>
                    </label>
                  </li>
                  </ul>
                  
                </div>
              </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={ShowAllFilter} toggle={ToggleAllFilter}>
          <ModalHeader toggle={ToggleAllFilter}>Flight Filters</ModalHeader>
          <ModalBody>
          <div className='widget widget_price_filter'>
                <div className='mb-0'>
                  <h4 className='form-label'>Departure Times</h4>
                  <span><b>Outbound</b> <br/>{rangeValues[0]} - {rangeValues[1]}</span>
                  <RangeSlider
                  min={0}
                  max={24 * 60}
                  step={30}
                  tooltip={false}
                  className="mt-2"
                  value={[timeToMinutes(rangeValues[0]), timeToMinutes(rangeValues[1])]}
                  renderMark={(mark) => formatTime(mark)}
                  onChange={(values) => handleRangeChange([formatTime(values[0]), formatTime(values[1])])}
                  onChangeCommitted={(values) => handleRangeRelease([formatTime(values[0]), formatTime(values[1])])}

                />
                    </div>
              </div>
              <div className='widget widget_price_filter'>
                <div className='mb-0'>
                  <h4 className='form-label'>Journey Duration</h4>
                  <span>{JourneyDuration.min}:00 hours- {sliderValue} Hours</span>  
                  
                    <Slider
                      progress
                      className="mt-2"
                      min={JourneyDuration.min}
                      max={JourneyDuration.max}
                      value={sliderValue}
                      step={0.5}
                      tooltip={false}
                      onChangeCommitted={(value, event) => {
                        handleSliderRelease(value, event);
                      }}
                      onChange={value => {
                        setSliderValue(value);
                      }}
                    />
                    </div>
              </div>
              <div className='widget widget_has_radio_checkbox mt-4'>
                <h4>Flight Type</h4>
                <ul>
                  <li>
                    <label>
                      <input type='checkbox' className="custom-textbox" onChange={handleAirlineClassChange} name='class1' value='Y' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'> Economy</span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type='checkbox' className="custom-textbox" onChange={handleAirlineClassChange} name='class2' value='C' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'> Business </span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type='checkbox' className="custom-textbox" onChange={handleAirlineClassChange} name='class3' value='F' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'> First</span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type='checkbox' className="custom-textbox" onChange={handleAirlineClassChange} name='class4' value='S' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'> Premium Economy</span>
                    </label>
                  </li>
                </ul>
              </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={ShowAirlineFilter} toggle={ToggleAirlineFilter}>
          <ModalHeader toggle={ToggleAirlineFilter}>Airlines Filter</ModalHeader>
          <ModalBody>
          <div className='widget widget_has_radio_checkbox'>
                {/* <h3>AIRLINES</h3> */}
                <ul>
                {Object.entries(AarlineFilter).map(([code, count]) => (
                      <li key={code}>
                        <label>
                          <input
                            type='checkbox'
                            className="custom-textbox"
                            onChange={handleAirlineNameChange}
                            name={code}
                            value={code}
                          />
                          <i className='awe-icon awe-icon-check'></i>
                          <span className='rating'>{' '}
                            {Airlinenamesdata2[code] ? (
                              `${Airlinenamesdata2[code].AirLineName} (${count})`
                            ) : (
                              `Unknown Airline (${count})`
                            )}
                          </span>
                        </label>
                      </li>
                    ))}

                </ul>
              </div>
          </ModalBody>
        </Modal>
        <Layout>
        <div className='contact-img'>
        <img src={img1} />
      </div>
      <div className='container-fluid'>
      <div className='mt-2'>
  <div style={{cursor:'pointer'}} className='d-flex mt-3 flight-modify-responsive p-2 hotel-top'onClick={DisplayModifySearch}>
    <div className="d-flex align-items-center flight-new-search">
      <FontAwesomeIcon icon={faSearch}/>
    </div>
    <div  className="d-flex align-items-center w-100 justify-content-between">
    <div className=' ms-2'>
      <h5 className='title font-size-24 tc' id='tours_result'>
        {flightInfo.departurename} ({flightInfo.departurecode}) - {flightInfo.arivalcityname} ({flightInfo.arivalcitycode}) 
      </h5>
      <h6 className='title font-size-24 tc' id='tours_result'>
      {FlightSearchData.adult !== 0 && (
        <>
          {FlightSearchData.adult} adult 
        </>
      )}
       {FlightSearchData.child !== 0 && (
        <>
           - {FlightSearchData.child} child
        </>
      )}
      {FlightSearchData.infant !== 0 && (
        <>
           - {FlightSearchData.infant} infant
        </>
      )} | {FlightSearchData.CabinType === 'no' ? 'All' : FlightSearchData.CabinType === 'y' ? 'Economy' : FlightSearchData.CabinType === 'c' ? 'Business' : FlightSearchData.CabinType === 'F' ? 'First' :  FlightSearchData.CabinType === 'S' ? 'Premium Economy' : ''}
      </h6>
    </div>
    <div className=' ms-2'>
      <h5 className='title font-size-24 tc' id='tours_result'>
      {SearchFlights.length} Results Found 
      </h5>
      <h6 className='title font-size-24 tc' id='tours_result'>
        {moment(FlightSearchData.DepartureDate).format('DD-MM-YYYY')}
      </h6>
    </div>
    </div>
  </div>
  {showModifySearch &&(
    <div className="mt-1 p-3  modify-flight-search">
    <FlightSearch/>
    </div>
  )}
  
</div>
      </div>

        {/* <div className='container-fluid'>
      <div className=''>
          <div className='row mt-3 hotel-top'>
            <div className='col-md-6 '>
              <h3 className='title font-size-24 tc' id='tours_result'>
            {SearchFlights.length} Results Found
              </h3>
            </div>
          </div>
        </div>
      </div> */}

      <div className='container-fliud m-4'>
            <div className='row'>
           <div className='col-md-3 col-md-pull-9 '>
           <div class="mobile-Filter-info">
                                <ul>
                                    <li><p onClick={ToggleStopFilter}><FontAwesomeIcon icon={faStopCircle}/> Flight Stop</p></li>
                                    <li><p onClick={ToggleAllFilter}><FontAwesomeIcon icon={faFilter}/><span > Filter</span></p>
                                    </li>
                                    <li><p onClick={ToggleAirlineFilter}><FontAwesomeIcon icon={faPlane}/><span > Airlines</span></p>
                                    </li>
                                </ul>
                               
                            </div>
            <div className='page-sidebar hide-page_filter'>
              <div className='widget widget_price_filter'>
                <div className='mb-0'>
                  <h3 className='form-label'>Flight Stop</h3>
                  <ul>
                  <li>
                    <label>
                      <input className="custom-textbox" type='checkbox' onChange={handleAirlineStopChange} name='OneStop' value='OneStop' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'> OneStop</span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type='checkbox'className="custom-textbox"onChange={handleAirlineStopChange} name='Direct' value='Direct' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'> Direct </span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type='checkbox' className="custom-textbox" onChange={handleAirlineStopChange} name='All' value='All' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'> All</span>
                    </label>
                  </li>
                  </ul>
                  
                </div>
              </div>
              <div className='widget widget_price_filter'>
                <div className='mb-0'>
                  <h3 className='form-label'>Departure Times</h3>
                  <span><b>Outbound</b> <br/>{rangeValues[0]} - {rangeValues[1]}</span>
                  <RangeSlider
                  min={0}
                  max={24 * 60}
                  step={30}
                  tooltip={false}
                  className="mt-2"
                  value={[timeToMinutes(rangeValues[0]), timeToMinutes(rangeValues[1])]}
                  renderMark={(mark) => formatTime(mark)}
                  onChange={(values) => handleRangeChange([formatTime(values[0]), formatTime(values[1])])}
                  onChangeCommitted={(values) => handleRangeRelease([formatTime(values[0]), formatTime(values[1])])}

                />
                    </div>
              </div>
              <div className='widget widget_price_filter'>
                <div className='mb-0'>
                  <h3 className='form-label'>Journey Duration</h3>
                  <span>{JourneyDuration.min}:00 hours- {sliderValue} Hours</span>  
                   {/* <input
                    type="range"
                    className="form-range"
                    id="customRange1"
                    min={JourneyDuration.min}
                    max={JourneyDuration.max}
                    step={0.5}
                    value={sliderValue}
                    onMouseUp={handleSliderRelease} 
                    onChange={handleSliderChange}
                  /> */}
                    <Slider
                      progress
                      className="mt-2"
                      min={JourneyDuration.min}
                      max={JourneyDuration.max}
                      value={sliderValue}
                      step={0.5}
                      tooltip={false}
                      onChangeCommitted={(value, event) => {
                        handleSliderRelease(value, event);
                      }}
                      onChange={value => {
                        setSliderValue(value);
                      }}
                    />
                    </div>
              </div>

              <div className='widget widget_has_radio_checkbox'>
                <h3>AIRLINES</h3>
                <ul>
                {Object.entries(AarlineFilter).map(([code, count]) => (
                      <li key={code}>
                        <label>
                          <input
                            type='checkbox'
                            className="custom-textbox"
                            onChange={handleAirlineNameChange}
                            name={code}
                            value={code}
                          />
                          <i className='awe-icon awe-icon-check'></i>
                          <span className='rating'>{' '}
                            {Airlinenamesdata2[code] ? (
                              `${Airlinenamesdata2[code].AirLineName} (${count})`
                            ) : (
                              `Unknown Airline (${count})`
                            )}
                          </span>
                        </label>
                      </li>
                    ))}

                </ul>
              </div>

              <div className='widget widget_has_radio_checkbox'>
                <h3>Flight Type</h3>
                <ul>
                  <li>
                    <label>
                      <input type='checkbox' className="custom-textbox" onChange={handleAirlineClassChange} name='class1' value='Y' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'> Economy</span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type='checkbox' className="custom-textbox" onChange={handleAirlineClassChange} name='class2' value='C' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'> Business </span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type='checkbox' className="custom-textbox" onChange={handleAirlineClassChange} name='class3' value='F' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'> First</span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type='checkbox' className="custom-textbox" onChange={handleAirlineClassChange} name='class4' value='S' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'> Premium Economy</span>
                    </label>
                  </li>
                </ul>
              </div>

              {/* <button  className='btn select-styling search-btn1'>Filter</button> */}
            </div>
          </div>
          <div className='col-md-9 col-md-push-3'>
          <div className="row mb-3">
              <div
                className={`col-md-4 col-sm-4 flight-filter12 ${selectedFilter === 'BestRate' ? 'flight-filter12-active' : ''}`}
                onClick={() => handleFilterClick('BestRate')}
              >
                <h6><FontAwesomeIcon  className={`${selectedFilter === 'BestRate' ? 'filter-logo-color' : ''}`} icon={faStar} /> Best Rate </h6>
                <div className='d-flex justify-content-between'>
                {showPrice ? (
                <h6 className={`m-2 ${selectedFilter === 'BestRate' ? '' : 'flight-filter-color'}  `}>{CurrencyRates === undefined? baseCName: CurrencyRates.selectedcurrency} {CalculateFLightMarkup(renderPrice(Number(SortCheepestData.price)))}</h6>
                ):(
                  <h6 className={`m-2 ${selectedFilter === 'BestRate' ? '' : 'flight-filter-color'}  `}>{SortCheepestData.currency} {CalculateFLightMarkup(Number(SortCheepestData.price))}</h6>
                )}
                <h6 style={{fontSize:'13px'}} className="mt-2">{SortCheepestData.time}</h6>
                </div>
              </div>
              <div
                className={`col-md-4 col-sm-4 flight-filter12 ${selectedFilter === 'CheapestFirst' ? 'flight-filter12-active' : ''}`}
                onClick={() => handleFilterClick('CheapestFirst')}
              >
                <h6><FontAwesomeIcon className={`${selectedFilter === 'CheapestFirst' ? 'filter-logo-color' : ''}`} icon={faDollarSign} /> Cheapest</h6>
                <div className='d-flex justify-content-between'>
                {showPrice ? (
                <h6 className={`m-2 ${selectedFilter === 'CheapestFirst' ? '' : 'flight-filter-color'}  `}>{CurrencyRates === undefined? baseCName: CurrencyRates.selectedcurrency} {CalculateFLightMarkup(renderPrice(Number(SortCheepestData.price)))}</h6>
                ):(
                  <h6 className={`m-2 ${selectedFilter === 'CheapestFirst' ? '' : 'flight-filter-color'}  `}>{SortCheepestData.currency} {CalculateFLightMarkup(Number(SortCheepestData.price))}</h6>
                )}
                <h6 style={{fontSize:'13px'}} className="mt-2">{SortCheepestData.time}</h6>
                </div>
              </div>
              <div
                className={`col-md-4 col-sm-4 flight-filter12 ${selectedFilter === 'FastestFirst' ? 'flight-filter12-active' : ''}`}
                onClick={() => handleFilterClick('FastestFirst')}
              >
                <h6><FontAwesomeIcon className={`${selectedFilter === 'FastestFirst' ? 'filter-logo-color' : ''}`} icon={faClock} /> Fastest</h6>
                <div className='d-flex justify-content-between'>
                {showPrice ? (
                <h6   className={`m-2 ${selectedFilter === 'FastestFirst' ? '' : 'flight-filter-color'}  `}> {CurrencyRates === undefined? baseCName: CurrencyRates.selectedcurrency} {CalculateFLightMarkup(renderPrice(Number(SortFastestData.price)))}</h6>
                ):(
                  <h6  className={`m-2 ${selectedFilter === 'FastestFirst' ? '' : 'flight-filter-color'}  `}>{SortFastestData.currency} {CalculateFLightMarkup(Number(SortFastestData.price))}</h6>
                )}
                <h6 style={{fontSize:'13px'}} className="mt-2">{SortFastestData.time}</h6>
                </div>
              </div>
            </div>
                    <FlightCard filterData={filterData} NewData={SearchFlights1}/>
          </div>
          {/* <div className="col-md-3">
          <div className=' book-package-2 mt-0'>
            <div className="text-center p-4">
            <h5 style={{color:'#d39d00'}}>Found Flight? Now Find a Hotel</h5>
            <p className="mt-2">Choose From a Wide Range of Properties Which alhijaztours.net Offers. Search Now!</p>
           <button onClick={GoHotels} className="btn search-btn1 btn-success mt-4 w-100 ">Explore hotels</button>
            </div>
            </div>
          <div className=' book-package-2 mt-3'>
                <h6>Why Book with us?</h6>
              <ul class='list-items book-package-3  list-items-2 mt-2 py-2'>
              <li className=' fs-6'>
                  <span className='book-package-side-box'><FontAwesomeIcon icon={faDollar}/></span>No-hassle best price guarantee
                </li>
                <div className='border-line'></div>
                <li className='mt-2 fs-6'>
                  <span className='book-package-side-box'><FontAwesomeIcon icon={faHeadphones}/></span>Customer care available 24/7
                </li>
                <div className='border-line'></div>
                <li className='mt-2 fs-6'>
                  <span className='book-package-side-box'><FontAwesomeIcon icon={faStar}/></span>Picked Packages to your Need
                </li>
                <div className='border-line'></div>
                <li className='mt-2 fs-6'>
                  <span className='book-package-side-box'><FontAwesomeIcon icon={faLock}/></span>Secure Payment & Privacy
                </li>
              </ul>
              </div>
              <div className='book-package-4'>
                <h3 >Got a Question?</h3>
                <div>
                  <p  className='mt-3'>Do not hesitate to give us a call. Our expert team would be happy to help you.</p>
                  <h5  className='mt-3'><FontAwesomeIcon icon={faPhone}/> +966 50 978 6777</h5>
                  <h5  className='mt-3'><FontAwesomeIcon icon={faEnvelope}/> info@Alwasyet.com</h5>
                </div>
              </div>
          </div> */}
            </div>
         </div>
      </Layout>
        </>
    );
}


export default FlightListing;