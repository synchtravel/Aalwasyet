import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBowlFood,
  faCalendar,
  faHeadset,
  faPersonWalkingLuggage,
  faPlaneDeparture,
  faSackDollar,
  faUmbrellaBeach,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
function SmallCard(){
    const [itemsToShow, setItemsToShow] = useState(3)
    useEffect(() => {
      // Add an event listener to track window width changes
      function handleResize () {
        if (window.innerWidth > 1000) {
          setItemsToShow(3) // For smaller screens, show 1 item
        } else if (window.innerWidth > 768 && window.innerWidth < 1000) {
          setItemsToShow(2) // For smaller screens, show 1 item
        } else if (window.innerWidth > 470 && window.innerWidth < 768) {
          setItemsToShow(1) // For smaller screens, show 1 item
        } else if (window.innerWidth < 470) {
          setItemsToShow(1) // For larger screens, show 4 items (you can adjust this)
        }
      }
  
      // Initialize the number of items based on the current window width
      handleResize()
  
      // Attach the event listener
      window.addEventListener('resize', handleResize)
  
      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, []);
  
    return(
        <>
        <div className='m-3 Small_Card_div'>
         <OwlCarousel
            className='owl-theme custom-owl-carousel'
            items={itemsToShow}
            margin={8}
            nav
          >
            <div class=" mt-5 mb-5">
                    <div class="row align-items-center justify-content-between g-4">

                      <div class="">
                        <div class="featuresBox-wrap">
                          <div class="featuresBox-icons mb-3">
                            <div>
                            <i class="fa-solid fa-sack-dollar fs-1 text-primary"></i>
                            <FontAwesomeIcon icon={faSackDollar}/>
                            </div>
                          </div>
                          <div class="featuresBox-captions p-2">
                            <h5 class="fw-bold  lh-base mb-0">Flexible Bookings</h5>
                            <p class="m-0"> Plans change. That’s why we offer free cancellation on most hotels. </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class=" mt-5 mb-5">
                    <div class="row align-items-center justify-content-between g-4">

                      <div class="">
                        <div class="featuresBox-wrap">
                          <div class="featuresBox-icons mb-3">
                            <div>
                            <i class="fa-solid fa-sack-dollar fs-1 text-primary"></i>
                            <FontAwesomeIcon icon={faHeadset}/>
                            </div>
                          </div>
                          <div class="featuresBox-captions p-2">
                            <h5 class="fw-bold  lh-base mb-0">Help 24/7</h5>
                            <p class="m-0"> We’re always here for you – reach us 24 hours a day, 7 days a week. </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class=" mt-5 mb-5">
                    <div class="row align-items-center justify-content-between g-4">

                      <div class="">
                        <div class="featuresBox-wrap">
                          <div class="featuresBox-icons mb-3">
                            <div>
                            <i class="fa-solid fa-sack-dollar fs-1 text-primary"></i>
                            <FontAwesomeIcon icon={faCalendar}/>
                            </div>
                          </div>
                          <div class="featuresBox-captions p-2">
                            <h5 class="fw-bold  lh-base mb-0">Incredible Deals</h5>
                            <p class="m-0"> Check out with confidence. We always provide best price to our customers. </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
          </OwlCarousel>
          </div>
      
          {/* <div class="col-xl-3 col-lg-3 col-md-6 col-sm-5">
            <div class="featuresBox-wrap">
              <div class="featuresBox-icons mb-3">
                <i class="fa-solid fa-umbrella-beach fs-1 text-primary"></i>
                <FontAwesomeIcon icon={faUmbrellaBeach}/>
              </div>
              <div class="featuresBox-captions">
                <h4 class="fw-bold fs-5 lh-base mb-0">Best Destinations</h4>
                <p class="m-0">Immerse yourself in unparalleled beauty and discover top-rated locations that promise memorable moments.Whether you seek relaxation, adventure, or cultural enrichment , our best destinations guarantee an extraordinary journey.</p>
              </div>
            </div>
          </div> */}

          {/* <div class="col-xl-3 col-lg-3 col-md-6 col-sm-5">
            <div class="featuresBox-wrap">
              <div class="featuresBox-icons mb-3">
                <i class="fa-solid fa-person-walking-luggage fs-1 text-primary"></i>
                <FontAwesomeIcon icon={faPersonWalkingLuggage}/>
              </div>
              <div class="featuresBox-captions">
                <h4 class="fw-bold fs-5 lh-base mb-0">Travel Guides</h4>
                <p class="m-0">Dive into rich cultural insights, dining recommendations, and must-see attractions, ensuring every trip is infused with authenticity and excitement. Let our Travel Guides be your trusted companion in exploring the world.</p>
              </div>
            </div>
          </div> */}

          {/* <div class="col-xl-3 col-lg-3 col-md-6 col-sm-5">
            <div class="featuresBox-wrap">
              <div class="featuresBox-icons mb-3">
                <i class="fa-solid fa-headset fs-1 text-primary"></i>
                <FontAwesomeIcon icon={faHeadset}/>
              </div>
              <div class="featuresBox-captions">
                <h4 class="fw-bold fs-5 lh-base mb-0">Friendly Support</h4>
                <p class="m-0">Experience the warmth of our dedicated support team ready to assist you at every step. Our commitment to providing friendly support.Whether you need guidance, or seek assistance, our team is here.</p>
              </div>
            </div>
          </div> */}
        </>
    );
}
export default SmallCard;