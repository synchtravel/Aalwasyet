import React, { useState, useEffect } from 'react'
import OwlCarousel from 'react-owl-carousel';
import img2 from '../../Images/Flight/car.png'
import img1 from '../../Images/Home/bmw.png'
import img3 from '../../Images/Home/Fortuner.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
function FeaturedCars () {
    const [itemsToShow, setItemsToShow] = useState(4)
    useEffect(() => {
      // Add an event listener to track window width changes
      function handleResize () {
        if (window.innerWidth > 1000) {
          setItemsToShow(4) // For smaller screens, show 1 item
        } else if (window.innerWidth > 768 && window.innerWidth < 1000) {
          setItemsToShow(3) // For smaller screens, show 1 item
        } else if (window.innerWidth > 470 && window.innerWidth < 768) {
          setItemsToShow(2) // For smaller screens, show 1 item
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
  return (
    <>
      <div className='p-3 Best-collection1'>
        <div className='text-center'>
          <h3 style={{ color: 'green' }}>Featured Cars in Our Fleet</h3>
        </div>
        <div className='text-center'>
          <p className='fw-bold'>
            BestSellers,discounts, and all new cars in our fleet
          </p>
        </div>
        <div class='container-fluid mt-4'>
          <div class='row'>
          <OwlCarousel
            className='owl-theme custom-owl-carousel'
            items={itemsToShow}
            margin={8}
            nav
          >
             <div class=' mb-4' style={{ position: 'relative' }}>
              <div class='card h-100 shadow-sm'>
                <img
                  src={img1}
                  class='card-img-top'
                  alt='...'
                />
                <div class='label-top shadow-sm'>Discount 10%</div>
                <div class='card-body'>
                  <div class='clearfix mb-3'>
                    <h5 class='card-title'>BMW X1 2024</h5>
                    <span style={{color:'#920fd5'}} class='float-start fs-l'>
                      <h6>Price</h6>
                    </span>
                    <span style={{color:'#920fd5'}} class='float-end'>
                      <h6>
                        316 SAR <sup className='feature-discount'>550 SAR</sup>
                      </h6>
                    </span>
                  </div>
                  <p className='featurecar-msg'>
                    *Price Includes Online Payments Discount (10%)
                  </p>
                  <div class='text-center featurecar-book-btn'>
                  <button className='btn btn-success'>Book Now</button>
                  </div>
                </div>
              </div>
            </div>

            <div class=' mb-4' style={{ position: 'relative' }}>
              <div class='card h-100 shadow-sm'>
                <img
                  src={img2}
                  class='card-img-top'
                  alt='...'
                />
                <div class='card-body'>
                  <div class='clearfix mb-3'>
                    <h5 class='card-title'>Changan Uni V 2024</h5>
                    <span style={{color:'#920fd5'}} class='float-start fs-l'>
                      <h6>Price</h6>
                    </span>
                    <span style={{color:'#920fd5'}} class='float-end'>
                      <h6>
                        316 SAR
                      </h6>
                    </span>
                  </div>
                  <p className='featurecar-msg'>
                    *Price Includes Online Payments Discount (10%)
                  </p>
                  <div class='text-center featurecar-book-btn'>
                  <button className='btn btn-success'>Book Now</button>

                  </div>
                </div>
              </div>
            </div>

            <div class=' mb-4' style={{ position: 'relative' }}>
              <div class='card h-100 shadow-sm'>
                <img
                  src={img3}
                  class='card-img-top'
                  alt='...'
                />
                <div class='label-top shadow-sm'>Discount 10%</div>
                <div class='card-body'>
                  <div class='clearfix mb-3'>
                    <h5 class='card-title'>Fortuner 2023</h5>
                    <span style={{color:'#920fd5'}} class='float-start fs-l'>
                      <h6>Price</h6>
                    </span>
                    <span style={{color:'#920fd5'}} class='float-end'>
                      <h6>
                        316 SAR <sup className='feature-discount'>550 SAR</sup>
                      </h6>
                    </span>
                  </div>
                  <p className='featurecar-msg'>
                    *Price Includes Online Payments Discount (10%)
                  </p>
                  <div class='text-center featurecar-book-btn'>
                  <button className='btn btn-success'>Book Now</button>

                  </div>
                </div>
              </div>
            </div>

            <div class=' mb-4' style={{ position: 'relative' }}>
              <div class='card h-100 shadow-sm'>
                <img
                  src={img1}
                  class='card-img-top'
                  alt='...'
                />
                <div class='label-top shadow-sm'>Discount 10%</div>
                <div class='card-body'>
                  <div class='clearfix mb-3'>
                    <h5 class='card-title'>BMW X1 2024</h5>
                    <span style={{color:'#920fd5'}} class='float-start fs-l'>
                      <h6>Price</h6>
                    </span>
                    <span style={{color:'#920fd5'}} class='float-end'>
                      <h6>
                        316 SAR <sup className='feature-discount'>550 SAR</sup>
                      </h6>
                    </span>
                  </div>
                  <p className='featurecar-msg'>
                    *Price Includes Online Payments Discount (10%)
                  </p>
                  <div class='text-center featurecar-book-btn'>
                  <button className='btn btn-success'>Book Now</button>

                  </div>
                </div>
              </div>
            </div>


            <div class=' mb-4' style={{ position: 'relative' }}>
              <div class='card h-100 shadow-sm'>
                <img
                  src={img2}
                  class='card-img-top'
                  alt='...'
                />
                <div class='card-body'>
                  <div class='clearfix mb-3'>
                    <h5 class='card-title'>Changan Uni V 2024</h5>
                    <span style={{color:'#920fd5'}} class='float-start fs-l'>
                      <h6>Price</h6>
                    </span>
                    <span style={{color:'#920fd5'}} class='float-end'>
                      <h6>
                        316 SAR
                      </h6>
                    </span>
                  </div>
                  <p className='featurecar-msg'>
                    *Price Includes Online Payments Discount (10%)
                  </p>
                  <div class='text-center featurecar-book-btn'>
                  <button className='btn btn-success'>Book Now</button>

                  </div>
                </div>
              </div>
            </div>
            <div class=' mb-4' style={{ position: 'relative' }}>
              <div class='card h-100 shadow-sm'>
                <img
                  src={img3}
                  class='card-img-top'
                  alt='...'
                />
                <div class='label-top shadow-sm'>Discount 10%</div>
                <div class='card-body'>
                  <div class='clearfix mb-3'>
                    <h5 class='card-title'>Fortuner 2023</h5>
                    <span style={{color:'#920fd5'}} class='float-start fs-l'>
                      <h6>Price</h6>
                    </span>
                    <span style={{color:'#920fd5'}} class='float-end'>
                      <h6>
                        316 SAR <sup className='feature-discount'>550 SAR</sup>
                      </h6>
                    </span>
                  </div>
                  <p className='featurecar-msg'>
                    *Price Includes Online Payments Discount (10%)
                  </p>
                  <div class='text-center featurecar-book-btn'>
                  <button className='btn btn-success'>Book Now</button>

                  </div>
                </div>
              </div>
            </div>
            <div class=' mb-4' style={{ position: 'relative' }}>
              <div class='card h-100 shadow-sm'>
                <img
                  src={img1}
                  class='card-img-top'
                  alt='...'
                />
                <div class='label-top shadow-sm'>Discount 10%</div>
                <div class='card-body'>
                  <div class='clearfix mb-3'>
                    <h5 class='card-title'>BMW X1 2024</h5>
                    <span style={{color:'#920fd5'}} class='float-start fs-l'>
                      <h6>Price</h6>
                    </span>
                    <span style={{color:'#920fd5'}} class='float-end'>
                      <h6>
                        316 SAR <sup className='feature-discount'>550 SAR</sup>
                      </h6>
                    </span>
                  </div>
                  <p className='featurecar-msg'>
                    *Price Includes Online Payments Discount (10%)
                  </p>
                  <div class='text-center featurecar-book-btn'>
                  <button className='btn btn-success'>Book Now</button>

                  </div>
                </div>
              </div>
            </div>
          </OwlCarousel>
           
          </div>
        </div>
        <div className='text-center feature-explore mt-3 mb-3'>
        <button className='btn btn-success'>Explore All Cars  <FontAwesomeIcon icon={faArrowRight}/> </button>
        </div>
      </div>
    </>
  )
}

export default FeaturedCars
