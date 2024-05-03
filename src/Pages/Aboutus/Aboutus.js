import React,{useEffect} from 'react';
import image from '../../Images/Pages/about.png';
import img2 from '../../Images/Pages/about-us.jpg';
import Layout from '../../Components/Layout/Layout';
import wow from 'wowjs';

function About () {

useEffect(()=>{
    new wow.WOW().init();
},[]);

  return (
    <>
    <Layout>
      
    <div className="contact-img" >
                <img src={img2}/>
               
            </div>
      <section className='about-us-section mt-5'>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-12 wow animate__animated animate__slideInLeft' data-wow-duration="1s" data-wow-delay="0.2s">
              <h1>Welcome to Alwasyet</h1>
              <p>
              Discover the World Differently <br/>
            AtAlwasyet, we're more than just a travel agency; we're your gateway to the world. Founded in 2015 in Saudia Arabia, our mission has always been to create unforgettable travel experiences that go beyond the ordinary. With a passion for exploration and a deep commitment to our travelers, we've been bringing dream vacations to life for 10 years.
              </p>
            </div>
           
          </div>
          <div className="" data-wow-duration="1s" data-wow-delay="0.2s">
          <h3 className='mt-3'>Our Goals!</h3>
          <p>
          It all started with Saudia vision 2030  to make travel more accessible, personal, and deeply enriching. Frustrated by the one-size-fits-all approach to tourism, We set out to create a travel agency that prioritizes unique experiences tailored to each traveler's desires. From our humble beginnings, we've grown into a trusted partner for adventurers, explorers, and seekers of the unknown, all while staying true to our core values of personalized service, quality, and sustainability.
          </p>
          <h3 className='mt-5'>Why Choose Us?</h3>
          <p>Personalized Itineraries<br/>
          Your journey should be as unique as you are. Our travel experts take the time to understand your preferences and craft itineraries that match your interests, pace, and style. Whether you're seeking relaxation, adventure, culture, or all of the above, we're here to make it happen.</p>
          </div>
          <h3 className='mt-5'>Expert Knowledge</h3>
          <p>Our team is made up of passionate travelers, seasoned explorers, and local experts who know the destinations inside and out. We leverage our knowledge to ensure you get the most out of every trip, including hidden gems and off-the-beaten-path experiences.</p>
          <h3 className='mt-5'>Unwavering Support</h3>
          <p>Travel with peace of mind knowing that we're here for you every step of the way. From the moment you reach out until you return home, our dedicated support team is available to assist with any questions or needs that may arise.</p>
          <h3 className='mt-5'>Responsible Travel</h3>
          <p>We believe in traveling responsibly and sustainably. We're committed to promoting ethical tourism practices, supporting local communities, and minimizing our environmental footprint to preserve the beauty of our planet for future generations.</p>
          <h3 className='mt-5'>Join Our Community</h3>
          <p>Whether you're planning your first trip or your fiftieth, we're here to make it extraordinary. Join the [Your Travel Agency Name] family and discover the difference of traveling with a team that cares deeply about your experience and the world we share.</p>
        <p className='mt-3'>Thank you for choosing Alwasyet. Let's embark on this journey together.</p>
        </div>
      </section>
      </Layout>
    </>
  )
}

export default About
