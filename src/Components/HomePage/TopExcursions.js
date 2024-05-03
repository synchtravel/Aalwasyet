import React,{useEffect,useState} from "react";
import img from '../../Images/Home/homebg1.jpeg'
import taif from '../../Images/Home/Taif.jpg'
import jeddah from '../../Images/Home/jeddah.jpg'
import { ApiEndPoint,ActivityToken,CustomerDomainName } from "../GlobalData/GlobalData";
import Axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationPin } from "@fortawesome/free-solid-svg-icons";
function MoreOffer(){
    var navigation=useNavigate();
    var Domainpath=CustomerDomainName();
const  [topactivities,setTopActivities]= useState([]);
        useEffect(()=>{
            show();
        },[]);

    const show=async()=>{
        var endpoint=ApiEndPoint();
        var token=ActivityToken();
        const currentDate = new Date();
        var data={
          'token':token,
          'location':'',
          'start_dates':moment(currentDate).format('DD-MM-YYYY'),
        }
        try {
          
          const response = await Axios.post(endpoint+'/api/search_activities_react',data, {
                            headers: {
                            "Access-Control-Allow-Origin": "*",
                            } ,
                            
                        });

          if(response.data.status==='success'){
            const firstThreeRecords = response.data.tours.slice(0, 3);
            setTopActivities(firstThreeRecords);
          }
        
        } catch (error) {
          // Handle errors here
        
          console.error('Error:', error);
        }
        
      };

      const showDetail=(id)=>{
        navigation(`/activity_details/${id}`);
      };
       

    return(
        <>
        <div className=" more-offer2">
            <div className="text-center ">
                <h3 style={{color:'#930000'}} >Top Excursions</h3>
            </div>
        <div className="row mt-3">
            {topactivities.map((item,index)=>(
                     <div key={index} className=" col-md-4 more-offer1 text-center">
                      <div className="top_excursions_label">
                     <img className="dropdown "  onClick={()=>showDetail(item.id)} src={Domainpath+'/public/images/activites/'+item.featured_image} />
                     <div class='label-top shadow-sm fw-bold'><FontAwesomeIcon icon={faLocationPin}/> {item.location}</div>
                     </div>
                     <h5  onClick={()=>showDetail(item.id)} className="mt-2 dropdown"> {item.title}</h5>
                 </div>
            ))}
        </div>
        </div>

        </>
    );
}
export default MoreOffer;