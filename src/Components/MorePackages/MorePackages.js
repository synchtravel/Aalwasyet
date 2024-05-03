import React,{useState,useEffect} from 'react'
import alaqsa from '../../Images/Packages/AlAqsa-package.jpg'
import turky from '../../Images/Packages/Turky-packages.jpg'
import umrah from '../../Images/Packages/umrah-package.jpg'
import Axios from 'axios'

import { Hotelapitoken,ApiEndPoint } from '../GlobalData/GlobalData'
function MorePackages () {
  const [packages,setPackages]=useState([]);
  useEffect(()=>{
    GetPackages();
  },[]);

  const GetPackages = async () => {
    var token = Hotelapitoken();
    var apiendpoint=ApiEndPoint();
    var data = {
      token: token
    }
    try {
      const response = await Axios.post(
        apiendpoint + '/api/latest_packages',
        data,
        {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
      var packagesCount;
      if (response.data.latest_packages.length !== 0) {
        var umrah = response.data.latest_packages[0].length
        var alaqsa = response.data.latest_packages[1].length
        var turkey = response.data.latest_packages[2].length
        packagesCount = {
          umrahs: umrah,
          alaqsas: alaqsa,
          turkeys: turkey
        }
      }
      setPackages(packagesCount);
    
    } catch (error) {
      console.error('Error:', error)
    }
  };

  return (
    <>
      <div className='container '>
        <div className='row'>
          <div className='section-title'>
            <h2 className='wow animate__animated animate__fadeInUp' data-wow-duration="1s" data-wow-delay="0.3s">
              More than <span>100 Packages</span>
            </h2>
          </div>
        </div>
        <div className='grid-wrapper'>
          <div className='wow animate__animated animate__slideInLeft wide image-container morepackages-image-container' data-wow-duration="1s" data-wow-delay="0.3s">
            <img src={alaqsa} alt='' />
            <div className='overlay'>
              {' '}
              <div>
                <h5>Al-Aqsa</h5>
              </div>
              <div className='bottom-right'>
                <h5>Available Packages {packages.alaqsas}</h5>
              </div>
            </div>
          </div>

          <div className='wow animate__animated animate__slideInRight tall image-container morepackages-image-container'data-wow-duration="1s" data-wow-delay="0.3s" >
            <img src={umrah} alt='' />
            <div className='overlay'>
              {' '}
              <div>
                <h5>Umrah Packages</h5>
              </div>
              <div className='bottom-right'>
                <h5>Available Packages {packages.umrahs}</h5>
              </div>
            </div>
          </div>

          <div className='wow animate__animated animate__slideInLeft wide image-container morepackages-image-container' data-wow-duration="1s" data-wow-delay="0.3s">
            <img src={turky} alt='' />
            <div className='overlay'>
              {' '}
              <div>
                <h5>Turkey</h5>
              </div>
              <div className='bottom-right'>
                <h5>Available Packages {packages.turkeys}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MorePackages
