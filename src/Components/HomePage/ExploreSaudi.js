import React,{useState,useEffect} from "react";
import img1 from '../../Images/Home/makkah.jpg';
import img2 from '../../Images/Home/madinah.jpg';
import img3 from '../../Images/Home/jeddah.jpeg';
import img4 from '../../Images/Home/riyadh.jpg';
import { ApiEndPoint,ActivityToken,Hotelapitoken } from "../GlobalData/GlobalData";
import moment from "moment";
import Axios from "axios";
import Loading from "../Loading/Loader";
import { ActivitiesListing,fetchHotelsSearh,fetchHotels } from "../../Redux/Actions/actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
function BestCollection(){
  const [isLoading, setIsLoading] = useState(false);
  const navigation=useNavigate();
  const dispatch=useDispatch();
  var endpoint=ApiEndPoint();
  const showExcursions=async(location)=>{
    var token=ActivityToken();
    const currentdate=new Date();
    var data={
      'token':token,
      'location':location,
      'start_dates':moment(currentdate).format('DD-MM-YYYY'),
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


  const Searchhotels = async (name) => {
     setIsLoading(true);
     var token2=Hotelapitoken();
     const currentDate = new Date();
     const twoDaysLater = new Date(currentDate);
     twoDaysLater.setDate(currentDate.getDate() + 2);
     const threeDaysLater = new Date(currentDate);
     threeDaysLater.setDate(currentDate.getDate() + 3);
     var destination_name='';
      var country='';
      var lat='';
      var lon='';
      var pin='';
     if(name==='makkah'){
      destination_name="Makkah";
      country="Saudi Arabia";
      lat=21.478659;
      lon=39.81733639999999;
      pin="SA";
     }else if(name==='madinah'){
      destination_name="Madinah";
      country="Saudi Arabia";
      lat=24.4672132;
      lon=39.6024496;
      pin="SA";
     }else if(name==='jeddah'){
      destination_name="Jeddah";
      country="Saudi Arabia";
      lat=21.5291545;
      lon=39.1610863;
      pin="SA";
     }else if(name==='riyadh'){
      destination_name="Riyadh";
      country="Saudi Arabia";
      lat=24.7135517;
      lon=46.6752957;
      pin="SA";
     }
      
     // Define your API URL, authToken, and dataToSend as shown in the previous example
     const FormData = {
        "token":token2,
       "currency_slc": 'AFN',
       "currency_slc_iso": 'AF',
       "destination_name":destination_name,
       "country":country,
       "lat":  lat,
       "long": lon,
       "pin": pin,
       "cityd":destination_name,
       "country_code": pin,
       "check_in":moment(twoDaysLater).format('YYYY-MM-DD'),
       "check_out":moment(threeDaysLater).format('YYYY-MM-DD'),
       "slc_nationality": "",
       "adult": 2,
       "child": 0,
       "room": 1,
       "Adults": [2],
       "children": [0],
       "child_ages1": [],
       "rooms_counter": [1],
       "child_ages2": [],
      
     };
     try {
     
      dispatch(fetchHotelsSearh(FormData));
       const response = await Axios.post(endpoint+'/api/search/hotels/new',FormData, {
         headers: {
           "Access-Control-Allow-Origin": "*",
         
         } ,
         
       });
       sessionStorage.removeItem('FlightCheckOut');
       navigation('/hotels');
       dispatch(fetchHotels(response.data));
       // Handle the API response here
       setIsLoading(false);
     } catch (error) {
       // Handle errors here
       setIsLoading(false);
       console.error('Error:', error);
     }
   };

    return(
        <>
        {isLoading && (
          <Loading/>
        )}
        <div className="p-3 Best-collection1">
            <h3 style={{color:'#930000'}}>Explore Saudi Arabia</h3>
            <div class="container-fluid mt-4">
              <div class="row">
                <div class="col-md-3 mb-4">
                    <div  style={{position:'relative'}}>
                      <img src={img1} class="img-fluid rounded-top portrait-image" alt="Image 1"/>
                      <div class="img-caption mb-3" >
                        <h4>Makkah</h4>
                      </div>
                      <div className="d-flex m-1 img-btn-city">
                          <button onClick={()=>Searchhotels('makkah')} className="btn w-100 mt-2 btn-success">Hotels</button>
                        
                        </div>
                    </div>
                  </div>
                  <div class="col-md-3 mb-4">
                <div  style={{position:'relative'}}>
                  <img src={img2} class="img-fluid rounded-top portrait-image" alt="Image 2"/>
                  <div class="img-caption mb-3" >
                  <h4>Medina</h4>
                  </div>
                  <div className="d-flex m-1 img-btn-city">

                          <button onClick={()=>Searchhotels('madinah')} className="btn w-100 mt-2 btn-success">Hotels</button>
                         
                        </div>
                </div>
                
                  </div>
                  <div class="col-md-3 mb-4">
                <div  style={{position:'relative'}}>
                  <img src={img3} class="img-fluid rounded-top portrait-image" alt="Image 3"/>
                  <div class="img-caption mb-3" >
                
                  <h4>Jeddah</h4>
                  </div>
                  <div className="d-flex m-1 img-btn-city">
                          <button onClick={()=>Searchhotels('jeddah')} className="btn w-100 mt-2 btn-success">Hotels</button>
                         
                        </div>
                </div>
              
                  </div>
                  <div class="col-md-3 mb-4">
                <div  style={{position:'relative'}}>
                  <img src={img4} class="img-fluid rounded-top portrait-image" alt="Image 4" />
                  <div class="img-caption mb-3" >
                    <h4>Riyadh</h4>
                  </div>
                  <div className="d-flex m-1 img-btn-city">
                          <button onClick={()=>Searchhotels('riyadh')} className="btn w-100 mt-2 btn-success">Hotels</button>
                          
                        </div>
                </div>
              
                  </div>
              </div>
            </div>
        </div>

        </>
    );
}

export default BestCollection;