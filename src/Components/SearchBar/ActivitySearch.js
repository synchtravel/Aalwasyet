import React,{useState,useEffect} from "react";
import { ActivityToken,ApiEndPoint } from "../GlobalData/GlobalData";
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loader";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendar,
  } from '@fortawesome/free-solid-svg-icons'
  import { ActivitiesListing } from "../../Redux/Actions/actions";
  import { useDispatch } from "react-redux";
import Axios from 'axios';
function ActivitySearch(){
  const navigation=useNavigate();
  const dispatch=useDispatch();
    const [selectedActivityDate, setSelectedActivityDate] = useState(null);
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedCity, setSelectedCity] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleActivityDateChange = date => {
        setSelectedActivityDate(date)
      };

      let debounceTimeout;

      const fetchOptionsFromAPI = async (inputValue) => {
        var endpoint=ApiEndPoint();
        var token=ActivityToken();
        var data={
            'token':token,
            'location':inputValue,
        }
        try {
         
          const response = await Axios.post(endpoint+'/api/cites_suggestions',data, {
            headers: {
              "Access-Control-Allow-Origin": "*",
            } ,
            
          });      
          return response.data.locations;
        } catch (error) {
          console.error('Error fetching options:', error);
        }
      };
    
      const debouncedFetchOptions = (value) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
          const result = await fetchOptionsFromAPI(value);
          const transformedLocations = result.map((item, index) => ({
            label: item.location,
            value: index, // You can use a unique identifier as the value, for example, item.id if available
          }));
          setOptions(transformedLocations);
        }, 300);
      };
    
      useEffect(() => {
        // Cleanup the debounce function on component unmount
        return () => {
          clearTimeout(debounceTimeout);
        };
      }, []);
    
      const handleInputChange = (newValue) => {
        setInputValue(newValue);
        debouncedFetchOptions(newValue);
      };
    
      const handleChange = (selectedOption) => {
        setSelectedCity(selectedOption);
      };


    const show=async()=>{
      var endpoint=ApiEndPoint();
      var token=ActivityToken();
      var data={
        'token':token,
        'location':selectedCity?.label,
        'start_dates':moment(selectedActivityDate).format('DD-MM-YYYY'),
      }
      setIsLoading(true);
      try {
        
        const response = await Axios.post(endpoint+'/api/search_activities_react',data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
          } ,
          
        });
        setIsLoading(false);
        dispatch(ActivitiesListing(response.data));
        navigation('/activities');
      
      } catch (error) {
        // Handle errors here
        setIsLoading(false);
        console.error('Error:', error);
      }
      
    };
    return(
        <>
        {isLoading &&(
          <Loading/>
        )}
 <div className='block-32'>
                <div className='row'>
                    <div className='col-md-6 mb-3 mb-lg-0 col-lg-3'>
                        <label
                            htmlFor='checkin_date'
                            className='font-weight-bold text-black mb-2'
                        >
                            Select City
                        </label>
                        <div className='field-icon-wrap'>
                        <Select
                            options={options}
                            onInputChange={handleInputChange}
                            onChange={handleChange}
                            placeholder="Type to search..."
                            isSearchable
                            isClearable={true}
                            value={selectedCity}
                            />
                        </div>
                    </div>
                    <div className='col-md-6 mb-3 mb-lg-0 col-lg-3'>
                        <label
                            htmlFor='checkin_date'
                            className='font-weight-bold text-black mb-2'
                        >
                            Departure Date
                        </label>
                        <div className='field-icon-wrap'>
                            <span className='form-control-feedback'>
                                <FontAwesomeIcon icon={faCalendar} />{' '}
                            </span>
                            <DatePicker
                                selected={selectedActivityDate}
                                onChange={handleActivityDateChange}
                                placeholderText='Select Date'
                                dateFormat='dd/MM/yyyy' // Customize date format as needed
                                className='form-control  text-start select-styling ps-5'
                            />
                        </div>
                    </div>
                    <div className='col-md-6 col-lg-3 text-center align-self-end'>
                
                        <button  onClick={show} className='btn btn-primary btn-block select-styling search-btn1'>
                            Search
                        </button>
                       
                    </div>
                </div>
           
        </div>
        </>
    );
}

export default ActivitySearch;