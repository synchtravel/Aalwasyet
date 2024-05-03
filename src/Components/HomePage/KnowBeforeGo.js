import React from "react";
import img1 from '../../Images/Home/beforeGo1.jpg'
import img2 from '../../Images/Home/beforeGo2.jpg'
import img3 from '../../Images/Home/beforeGo3.jpg'
import img4 from '../../Images/Home/excursions4.jpg'
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
function Excursions(){
const navigation=useNavigate();
  const NavigateTo=(id)=>{
    if(id==='1'){
      navigation("/about_saudi");
    }else if(id==='2'){
      navigation("/travel_safety_tips");
    }else if(id==='3'){
      navigation("/useful_contacts");
    }
  };
    return(
        <>
        <div className="p-3 Best-collection1">
            <h3 style={{color:'#930000'}}>Know Before You Go</h3>
            <div class="container-fluid mt-4">
            <div class="row">
            <div class="col-md-3 mb-4 dropdown" onClick={()=>NavigateTo('1')}>
                <div class=' mb-4' style={{ position: 'relative' }}>
              <div class='card h-100 shadow-sm' >
                <img
                  src={img3}
                  class='card-img-top1'
                  alt='...'
                />
                <div class='card-body'>
                  <div class='clearfix'>
                    <h5 class='card-title'>About Saudi</h5>
                    <div class="border-line mt-3 mb-3"></div>
                    <span style={{color:'#930000'}} class='float-start fs-l'>
                      <h6>Learn More</h6>
                    </span>
                    <span style={{color:'#930000'}} class='float-end'>
                     <FontAwesomeIcon icon={faAngleRight}/>
                    </span>
                  </div>
                </div>
              </div>
            </div>

                </div>
                <div class="col-md-3 mb-4 dropdown" onClick={()=>NavigateTo('2')}>
                <div class=' mb-4' style={{ position: 'relative' }}>
              <div class='card h-100 shadow-sm'>
                <img
                  src={img1}
                  class='card-img-top1'
                  alt='...'
                />
                <div class='card-body'>
                  <div class='clearfix'>
                    <h5 class='card-title'>Safety Travel Tips</h5>
                    <div class="border-line mt-3 mb-3"></div>
                    <span style={{color:'#930000'}} class='float-start fs-l'>
                      <h6>Learn More</h6>
                    </span>
                    <span style={{color:'#930000'}} class='float-end'>
                     <FontAwesomeIcon icon={faAngleRight}/>
                    </span>
                  </div>
                </div>
              </div>
            </div>

                </div>
                <div class="col-md-3 mb-4 dropdown" onClick={()=>NavigateTo('3')}>
                <div class=' mb-4' style={{ position: 'relative' }}>
              <div class='card h-100 shadow-sm'>
                <img
                  src={img2}
                  class='card-img-top1'
                  alt='...'
                />
                <div class='card-body'>
                  <div class='clearfix'>
                    <h5 class='card-title'>Useful Contacts</h5>
                    <div class="border-line mt-3 mb-3"></div>
                    <span style={{color:'#930000'}} class='float-start fs-l'>
                      <h6>Learn More</h6>
                    </span>
                    <span style={{color:'#930000'}} class='float-end'>
                     <FontAwesomeIcon icon={faAngleRight}/>
                    </span>
                  </div>
                </div>
              </div>
            </div>

                </div>
                <div class="col-md-3 mb-4 dropdown">
                <div class=' mb-4' style={{ position: 'relative' }}>
              <div class='card h-100 shadow-sm'>
                <img
                  src={img4}
                  class='card-img-top1'
                  alt='...'
                />
                <div class='card-body'>
                  <div class='clearfix'>
                    <h5 class='card-title'>Travel Regulations</h5>
                    <div class="border-line mt-3 mb-3"></div>
                    <span style={{color:'#930000'}} class='float-start fs-l'>
                      <h6>Learn More</h6>
                    </span>
                    <span style={{color:'#930000'}} class='float-end'>
                     <FontAwesomeIcon icon={faAngleRight}/>
                    </span>
                  </div>
                </div>
              </div>
            </div>

                </div>
                
            </div>
</div>

        </div>

        </>
    );
}

export default Excursions;