import React from "react";
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLocationDot, faMobileScreenButton} from '@fortawesome/free-solid-svg-icons'
import logo from '../../Images/Logo/logo.png'
function Footer(){
    return(
    <>
       <section className="footer">
        <div className="opacity">
          <div className="container">
                <div className="row input">
                    <div className="col-8">
                      <div className="image p-1 ">
                        {/* <img className="mb-1 mt-1 footer-logo"  src={logo}  alt="Logo" /> */}
                      </div>
                    </div>
                      <div className="col-md-4 col-sm-6 mt-5 input">
                          <input className="mt-5 pt-1 pb-1 footer-input"  type="email" placeholder="Enter Your Email" />
                      </div>
                   </div>
                <div className="row text-dark">
                    <div className="col-md-8">
                      <div className="row mt-4">
                          <div className="col-md-4">
                              <h4>Company</h4>
                              <p>About </p>
                              <p>Jobs</p>
                              <p>List your property</p>
                              <p>Partnerships </p>
                          </div>
                          <div className="col-md-4">
                              <h4>Explore</h4>
                              <p>Hotels </p>
                              <p>Flights</p>
                              <p>Car Rentals </p>
                              <p>Package Bookings </p>
                              <p>Activities</p>
                          </div>
                          <div className="col-md-4" >
                              <h4>Policies</h4>
                                <ul className="courses-link-list">
                                      <li><NavLink className='nav-link' to='/terms_and_conditions'>
                                      {/* <i className="fas fa-long-arrow-alt-right"><FontAwesomeIcon icon={faArrowRight}/></i> */}
                                      Term and conditions</NavLink></li>
                                      <li><NavLink className='nav-link' to='/privacy_policy'>
                                      {/* <i className="fas fa-long-arrow-alt-right"><FontAwesomeIcon icon={faArrowRight}/></i> */}
                                      Privacy Policy</NavLink></li>
                                      <li><NavLink className='nav-link' to='/faqs'>
                                      {/* <i className="fas fa-long-arrow-alt-right"><FontAwesomeIcon icon={faArrowRight}/></i> */}
                                      Faqs</NavLink></li>
                                     
                                    </ul>
                                      {/* <li><NavLink className='nav-link' to='/contact-us'>
                                      <i className="fas fa-long-arrow-alt-right"><FontAwesomeIcon icon={faArrowRight}/></i>
                                      Contact Us</NavLink></li> */}
                          </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="col-12">
                        <br />
                        <p><i><FontAwesomeIcon icon={faLocationDot}/></i> 1a Nansen Road Sparkhill Birmingham B11 4DR UK </p>
                        <br />
                        <p> <i><FontAwesomeIcon icon={faMobileScreenButton}/></i>+966 50 978 6777</p>
                        <br />
                        <p> <i><FontAwesomeIcon icon={faEnvelope}/></i> www.Alwasyet.com</p>
                        </div>
                    </div>
                </div>
          </div>
          <div className="col-12 text-center mt-4">
                  <span>info@Alwasyet.com | Copyright 2024 All Right Reserved</span>
          </div>
        </div>
      </section>
    </>        
    );
}

export default Footer;