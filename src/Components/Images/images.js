import React, { useState,useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CustomerDomainName } from '../GlobalData/GlobalData';
import { Carousel, Button, Modal } from 'react-bootstrap';
import {
  faSearch,
 
} from '@fortawesome/free-solid-svg-icons'
function Images (props) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [showImage, setShowImage] = useState([]);
    const [showOneimage, setShowOneimage] = useState(true);
    const [showCarousel, setShowCarousel] = useState(false);
    const imageurl=CustomerDomainName();
    var imgaray=[];
    const imageData = props.data;
    const setting = props.setting;
    useEffect(()=>{
      setimages();
    },[]);
    const setimages=()=>{
      if(setting===1){
        var length=imageData.length;
        for(var i=0;i<length;i++){
          var url=imageurl+'public/uploads/package_imgs/'+imageData[i];
          imgaray.push(url);
        }
        setShowImage(imgaray);
      }else{
        setShowImage(imageData);
      }
    };
      const closeImage = () => {
        setSelectedImage(null)
      };
      const handleShowCarousel = () => {
        setShowCarousel(true);
      };
    
      const handleCloseCarousel = () => {
        setShowCarousel(false);
      };
      useEffect(() => {
        const checkWindowSize = () => {
          if(window.innerWidth <= 500){
            setShowOneimage(!showOneimage);
          }
        };
    
        // Initial check
        checkWindowSize();
    
        // Add event listener to check window size on resize
        window.addEventListener('resize', checkWindowSize);
    
        // Clean up the event listener on component unmount
        return () => {
          window.removeEventListener('resize', checkWindowSize);
        };
      }, []);
  return (
    <>
    <div className='imgpreview'>
     <Modal   show={showCarousel} onHide={handleCloseCarousel} dialogClassName='modal-90w'>
        <Modal.Body >
          <Carousel>
          {showImage.map((item,index)=>(
            <Carousel.Item key={index}>
              <img className='d-block w-100' src={item} alt='First slide' />
            </Carousel.Item>
          ))}
            
          </Carousel>
        </Modal.Body>
      </Modal>
      </div>
    {selectedImage && (
          <div className='image-lightbox' onClick={closeImage}>
            <img src={selectedImage} />
          </div>
        )}
        {showOneimage ?(
          <div className='container'>
        <div class='row mt-3 mb-3'>
          <div class='col-md-4 item-from'>
            <div className='image-container hellll'>
              <img
                src={showImage[0]}
                className='inner-img view-detail-img'
                alt='Hotel Image'
              />
              <div class='middle' onClick={handleShowCarousel}>
                <div class='text'>
                  <FontAwesomeIcon
                    className='search-icon-viewdetail'
                    color='#cb9f1c'
                    icon={faSearch}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-8'>
          <div className='row'>
          <div className='column img-grid'>
            <div className='image-container set-detail-img hellll m-1'>
              <img src={showImage[0]} className='inner-img view-detail-img' alt='Hotel Image' />
              <div class='middle'  onClick={handleShowCarousel}>
                <div class='text'>
                  <FontAwesomeIcon
                    className='search-icon-viewdetail'
                    color='#cb9f1c'
                    icon={faSearch}
                  />
                </div>
              </div>
            </div> 
            <div className='image-container set-detail-img hellll m-1'>
              <img src={showImage[1]} className='inner-img view-detail-img' alt='Hotel Image' />
              <div class='middle'  onClick={handleShowCarousel}>
                <div class='text'>
                  <FontAwesomeIcon
                    className='search-icon-viewdetail'
                    color='#cb9f1c'
                    icon={faSearch}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='column img-grid'>
          <div className='image-container set-detail-img hellll m-1'>
              <img src={showImage[2]} className='inner-img view-detail-img' alt='Hotel Image' />
              <div class='middle'  onClick={handleShowCarousel}>
                <div class='text'>
                  <FontAwesomeIcon
                    className='search-icon-viewdetail'
                    color='#cb9f1c'
                    icon={faSearch}
                  />
                </div>
              </div>
            </div>
            <div className='image-container set-detail-img hellll m-1'>
              <img src={showImage[3]} className='inner-img view-detail-img' alt='Hotel Image' />
              <div class='middle'  onClick={handleShowCarousel}>
                <div class='text'>
                  <FontAwesomeIcon
                    className='search-icon-viewdetail'
                    color='#cb9f1c'
                    icon={faSearch}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='column img-grid'>
          <div className='image-container set-detail-img hellll m-1' >
              <img src={showImage[4]} className='inner-img view-detail-img' alt='Hotel Image' />
              <div class='middle'  onClick={handleShowCarousel}>
                <div class='text'>
                  <FontAwesomeIcon
                    className='search-icon-viewdetail'
                    color='#cb9f1c'
                    icon={faSearch}
                  />
                </div>
              </div>
            </div>
            <div className='image-container set-detail-img hellll m-1' >
              <img src={showImage[5]} className='inner-img view-detail-img' alt='Hotel Image' />
              <div class='middle'  onClick={handleShowCarousel}>
                <div class='text'>
                  <FontAwesomeIcon
                    className='search-icon-viewdetail'
                    color='#cb9f1c'
                    icon={faSearch}
                  />
                </div>
              </div>
            </div>
          </div>
          {showImage[6] &&( 
          <div className='column'>
              <div className='image-container set-detail-img hellll m-1' >
              <img src={showImage[6]} className='inner-img view-detail-img' alt='Hotel Image' />
              <div class='middle'  onClick={handleShowCarousel}>
                <div class='text'>
                  <FontAwesomeIcon
                    className='search-icon-viewdetail'
                    color='#cb9f1c'
                    icon={faSearch}
                  />
                </div>
              </div>
            </div>
          {showImage[7] &&(
            <div className='image-container set-detail-img hellll m-1' >
              <img src={showImage[7]} className='inner-img view-detail-img' alt='Hotel Image' />
              <div class='middle'  onClick={handleShowCarousel}>
                <div class='text'>
                  <FontAwesomeIcon
                    className='search-icon-viewdetail'
                    color='#cb9f1c'
                    icon={faSearch}
                  />
                </div>
              </div>
            </div>
          )}
            
          </div>
          )}
        </div>
          </div>
        </div>
      </div>
        ):(
          <div className='image-container hellll'>
              <img
                src={showImage[0]}
                className='inner-img view-detail-img'
                alt='Hotel Image'
              />
              <div class='middle' onClick={handleShowCarousel}>
                <div class='text'>
                  <FontAwesomeIcon
                    className='search-icon-viewdetail'
                    color='#cb9f1c'
                    icon={faSearch}
                  />
                </div>
              </div>
            </div>
        )}
      
    </>
  )
}

export default Images
