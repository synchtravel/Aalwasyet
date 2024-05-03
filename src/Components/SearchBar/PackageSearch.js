import React, { useState,useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Autocomplete from 'react-google-autocomplete';
import {Hotelapitoken,ApiEndPoint} from '../GlobalData/GlobalData';
import DatePicker from 'react-datepicker';
import { useDispatch } from 'react-redux';
import {
    faGlobe,
    faCalendar,
  } from '@fortawesome/free-solid-svg-icons';
  import { ToastContainer, toast } from 'react-toastify';
import Axios from "axios";
import moment from "moment";
import Loader from "../Loading/Loader";
import { useNavigate } from 'react-router-dom';
import { SearchToursDetail } from '../../Redux/Actions/actions';

function PackageSearch() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    var endpoint=ApiEndPoint();
    
    const [loading, setLoading] = useState(false);
    const [umrahPackageId,setUmrahPackageId]=useState('');
    const [allcateogries, setAllCateogries] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [tourdestination, setTourdestination] = useState(null);
    const [selectedTourDate, setSelectedTourDate] = useState(null);
    useEffect(()=>{
        GetPackages();
    },[]);

    const GetPackages= async()=>{
        var token=Hotelapitoken();
        const fullURL = window.location.href;
        var data={
          'token':token,
          'currentURL':fullURL,
          'limit':6
        };
        try {
           const response = await Axios.post(endpoint+'/api/get_website_index_data',data, {
             headers: {
               "Access-Control-Allow-Origin": "*",
             } ,
             
           });
           setUmrahPackageId(response.data.all_cateogries[0].id);
           setAllCateogries(response.data.all_cateogries);
         } catch (error) {
          
           console.error('Error:', error);
         };
    
       };

    const handleSelectUmrahPackage=event=>{
        setUmrahPackageId(event.target.value);
      };
      const handlePlaceSelected = (place) => {
        setTourdestination(place);
      };
      const ToursDestination = (e) => {
        setInputValue(e.target.value);
      };
      const handleTourDateChange = date => {
        setSelectedTourDate(date)
      };
      const ToursSearchbtn=async()=>{
        if(umrahPackageId !=='' && selectedTourDate !==null){
        var token=Hotelapitoken();
        
        var data={
          'token':token,
          'category':umrahPackageId,
          'start_date':moment(selectedTourDate).format('YYYY-MM-DD'),
          'search_for':'tour'
        };
       
        setLoading(true)
       try {
           const response = await Axios.post(endpoint+'/api/search_pakages',data, {
             headers: {
               "Access-Control-Allow-Origin": "*",
             } ,
             
           })
           setLoading(false)
          //  console.log(response.data)
           dispatch(SearchToursDetail(response.data));
           navigate('/search-tour');
         } catch (error) {
            setLoading(false);
           console.error('Error:', error);
         };
        }else{
            toast.error('Please Select Data Again!', {
                position: 'top-right', // You can customize the position
                autoClose: 3000, // Auto close the notification after 3 seconds
              });
        }
    
      };
    return (
        <>
        {loading && (
            <Loader/>
        )}
        <ToastContainer/>
         <div className='block-32'>
                <div className='row'>
                    <div className='col-md-6 mb-3 mb-lg-0 col-lg-3'>
                        <label
                            htmlFor='checkin_date'
                            className='font-weight-bold text-black mb-2'
                        >
                            Select Package
                        </label>
                        <div className='field-icon-wrap'>
                            <select

                                value={umrahPackageId}
                                onChange={handleSelectUmrahPackage}
                                className='form-select select-styling'
                                aria-label='Default select example'
                            >
                                {allcateogries.map((item, index) => (
                                    <option key={item.id} selected={index === 0} value={item.id}>{item.title}</option>
                                ))}

                            </select>
                        </div>
                    </div>
                    <div className='col-md-6 mb-3 mb-lg-0 col-lg-3'>
                        <label
                            htmlFor='checkin_date'
                            className='font-weight-bold text-black mb-2'
                        >
                            Departure From
                        </label>
                        <div className='field-icon-wrap'>
                            <span className='form-control-feedback'>
                                <FontAwesomeIcon icon={faGlobe} />{' '}
                            </span>
                            <div>
                                <Autocomplete
                                    className='form-control search-form-control text-start select-styling'
                                    placeholder='Enter Location'
                                    apiKey='AIzaSyBmwlQFQKwxZ4D8nRbsWVRTBFUHMO-lUOY'
                                    onPlaceSelected={handlePlaceSelected}
                                    options={{
                                        types: ['(regions)'],
                                        componentRestrictions: null,
                                    }}
                                    onChange={ToursDestination}

                                />
                            </div>
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
                                selected={selectedTourDate}
                                onChange={handleTourDateChange}
                                placeholderText='Select Date'
                                dateFormat='dd/MM/yyyy' // Customize date format as needed
                                className='form-control text-start select-styling ps-5'
                            />
                        </div>
                    </div>
                    <div className='col-md-6 col-lg-3 text-center align-self-end'>
                        {/* <NavLink to='/search-tour'> */}
                        {' '}
                        <button onClick={(event) => ToursSearchbtn(event)} className='btn btn-primary btn-block select-styling search-btn1'>
                            Search
                        </button>
                        {/* </NavLink> */}
                    </div>
                </div>
           
        </div>
        </>
    );
}

export default PackageSearch;
