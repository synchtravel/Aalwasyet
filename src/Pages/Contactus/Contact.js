import React,{useEffect} from 'react';
import Googlemap from '../../Components/Googlemap/Googlemap';
import img2 from '../../Images/Pages/about-us.jpg';
import Layout from '../../Components/Layout/Layout';
import wow from 'wowjs';
const Contact = () => {
    useEffect(()=>{
        new wow.WOW().init();
    },[]);
    
    return (
        <>
        <Layout>
            <div className="contact-img" >
                <img src={img2}/>
               
            </div>
            <div className="col-12 mt-2 mb-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-12">
                            <div className="wrapper">
                                <div className="wow animate__animated animate__fadeInUp mb-5 mt-5 text-center" data-wow-duration="1s" data-wow-delay="0.2s">
                                    {/* <h1 className="text-capitalize fw-bold" style={{color:'#363d48'}}>Contact<span style={{ color: '#ffb606', fontWeight: 'bold' }} > Us</span></h1> */}
                                    {/* <p className="mt-4" style={{ fontSize: "18px" }}><b>Experience the power of a single partner for all your industrial supply chain and engineered solutions.</b></p> */}
                                    <p>Alwasyet is the pioneer tour operation in United Kingdom to offer Hajj and Umrah services from United Kingdom. Make use of our fantastic hajj and umrah packages which are tailored to suit the needs of pilgrims visiting Saudi Arabia for their all important sacred journey.</p>
                                </div>
                                <div className="row no-gutters">
                                    <div className="col-lg-8 col-md-7 order-md-last d-flex align-items-stretch wow animate__animated animate__fadeInRight" data-wow-duration="1s" data-wow-delay="0.2s">
                                        <div className="contact-wrap w-100  p-4">

                                            <form id="contactForm" name="contactForm" className="contactForm " >
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group p-3">
                                                            <label className="label_text">You Name</label>
                                                            <input type="text" placeholder='Name' className="form-control" name="first_name" required />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group p-3">
                                                            <label className="label_text">Your Email</label>
                                                            <input type="email" placeholder='Email'  className="form-control" name="email"  required />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group p-3">
                                                            <label className="label_text">Your Subject</label>
                                                            <input type="text" placeholder='Subject'  className="form-control" name="email"  required />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group p-3">
                                                            <label className="label_text">Phone Number</label>
                                                            <input type="text" placeholder='Number' className="form-control" name="phone_no"  required />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group p-3">
                                                            <label className="label_text">Message</label>
                                                            <textarea name="message" placeholder='Message'  className="form-control" cols="30" rows="4" required></textarea>
                                                            <div className="mb-2">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                    <div className="form-group p-3">
                                                                <button type="submit" className="btn btn-primary select-styling search-btn1"> Submit</button>
                                                            </div>
                                                    </div>
                                                
                                                </div>
                                            </form>
                                           
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-5 d-flex align-items-stretch wow animate__animated animate__fadeInLeft" data-wow-duration="1s" data-wow-delay="0.2s">
                                        <div className="info-wrap bg-primary w-100  p-4">
                                            <div className="mapviewport">
                                                <div id="mapgyver_holder"  >
                                                    <h4 className="h4-contact text-center mt-3"><span style={{ color: '#ffb606', fontWeight: 'bold' }} >Alwasyet</span></h4>
                                                    <div className="content-behind-map Contact_Us_Right_Div">
                                                        <h4 className="h4-contact h4-contact-gap"> Location</h4>
                                                        <p className="p-contact"> <strong className="strong_text"> Address:</strong> <b class="fa fa-map-marker" aria-hidden="true"> </b>1a Nansen Road Sparkhill Birmingham B11 4DR United Kingdom <br /> <br />  </p>
                                                          <h4 className="h4-contact h4-contact-gap">Call Us:</h4>
                                                            
                                                        <p className="p-contact">  <strong className="strong_text"> Phone:</strong> <b className="fa fa-phone" aria-hidden="true"> </b>+966 50 978 6777</p>
                                                        <h4 className="h4-contact  h4-contact-gap"> Email</h4>
                                                       
                                                        <p className="p-contact mail" style={{ color: 'white' }}>info@Alwasyet.com</p>
                                                        {/* <p className="p-contact mail"> <a href="mailto:hamza.shakeel@dynamissolutionz.com" style={{ color: 'white' }} >hamza.shakeel@dynamissolutionz.com</a></p> */}

                                                    </div>
                                                </div>
                                                {/* <div className="social-icons mt-5">
                                                    <a className="logo_hover" href="https://www.facebook.com/profile.php?id=100092518425376&is_tour_completed=true" target="_blank"> <img src="fb_logo.png" alt="Facebook Logo" width="38px" /></a>
                                                    <a className="logo_hover" href="https://instagram.com/decs324?igshid=ZGUzMzM3NWJiOQ==" target="_blank"> <img src="insta.png" alt="Insta Logo" height="50px" width="50px" /></a>
                                                    <a className="logo_hover" href="https://www.linkedin.com/company/dynamis-engineering-and-construction-solution/about/?viewAsMember=true" target="_blank"> <img src="linkedin_logo.png" alt="LinkedIn Logo" height="40px" width="40px" /></a>
                                                    <a className="logo_hover" href="https://api.whatsapp.com/send?phone=971542130049&text=decs" target="_blank"> <img src="whatsapp_logo.png" alt="Facebook Logo" width="38px" /></a>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Googlemap/> */}
            </Layout>
        </>
    );

}
export default Contact;