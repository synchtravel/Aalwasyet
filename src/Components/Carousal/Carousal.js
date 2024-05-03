import React from 'react'
// import img1 from '../../Images/carousal1.jpeg'
// import img2 from '../../Images/carousal2.jpeg'
// import img3 from '../../Images/carousal3.jpeg'
// import img4 from '../../Images/carousal4.jpeg'
import home from '../../Images/Home/homebg1.jpeg'
import Carousel from 'react-bootstrap/Carousel'

function Carousal () {
  return (
    <>
      {/* <Carousel className='carousel-container'>
        <Carousel.Item>
          <img className='d-block w-100' src={img1} alt='First slide' />
        </Carousel.Item>
        <Carousel.Item>
          <img className='d-block w-100' src={img2} alt='First slide' />
        </Carousel.Item>
        <Carousel.Item>
          <img className='d-block w-100' src={img3} alt='First slide' />
        </Carousel.Item>
        <Carousel.Item>
          <img className='d-block w-100' src={img4} alt='First slide' />
        </Carousel.Item>
      </Carousel> */}
      <div className='home-top-bg-img'>
        <img  src={home}/>
      </div>
    </>
  )
}

export default Carousal
