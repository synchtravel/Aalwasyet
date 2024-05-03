import React from "react";
import Layout from "../../Components/Layout/Layout";
import img from './faq.jpg'
function TermsConditions(){
    return(
        <>
        <Layout>
        <div>
                <img src={img} className='image-100'/>
            </div>
        <div className="container">
            <div className="row mt-3 text-center">
                <h3>Terms & Conditions</h3>
            </div>
            <div className="row mt-4 ">
            <p className="FontSize15">
            Welcome to Alwasyet By accessing and using our website, you agree to comply with the following terms and conditions. Please read them carefully.
               </p>           
                </div>
            <div className="row mt-4 ">
                <h4> 1-Use of Service </h4>
                <p>Our website provides travel-related information and a platform for booking travel services. These services are intended for personal, non-commercial use. You agree not to misuse the service in any way that interrupts or attempts to interrupt the operation of the site.</p>          
                <h4 className='mt-3'> 2-Bookings and Payments </h4>
                <p>When you make a booking through our website, you agree to provide accurate and complete information. Full payment is required at the time of booking unless otherwise specified. We accept various forms of payment as indicated on our website.</p>
                <h4 className='mt-3'> 3-Cancellations and Refunds </h4>
               <p>Cancellations and changes to bookings may be subject to fees and penalties, depending on the terms provided at the time of booking. Refund policies vary by service provider and will be communicated at the time of booking.</p>
               <h4 className='mt-3'> 4-Liability </h4>
               <p>Alwasyet acts as an intermediary between you and various travel service providers. We are not liable for the acts, errors, omissions, representations, warranties, breaches, or negligence of any service providers or for any personal injuries, death, property damage, or other damages resulting therefrom.</p>
               <h4 className='mt-3'> 5-Intellectual Property </h4>
                <p>The content, layout, design, data, databases, and graphics on this website are protected by intellectual property laws. You may not copy, reproduce, republish, or distribute any content without our prior written consent.</p>
                <h4 className='mt-3'> 6-Changes to Terms</h4>
                <p>We reserve the right to modify these terms at any time. Your continued use of our website after any changes signifies your acceptance of these changes.</p>
                <h4 className='mt-3'> 7-Contact Us</h4>
                <p>If you have any questions or concerns about these terms and conditions, please contact us at +966 50 978 6777 or info@Alwasyet.com</p>
                </div>
        </div>
        </Layout>
        </>
    )
}

export default TermsConditions;