import React from "react";
import Layout from "../../Components/Layout/Layout";
import img from './faq.jpg'
function PrivacyPolicy(){
    return(
        <>
        <Layout>
        <div>
                <img src={img} className='image-100'/>
            </div>
        <div className="container">
            <div className="row mt-3 text-center">
                <h3>Privacy and Security Policy</h3>
            </div>
            <div className="row mt-4 ">
                <p className="FontSize15">At Alwasyet, we are committed to protecting your privacy. This Privacy Policy outlines the types of personal information we collect, how it's used, and the measures we take to ensure your data is safe with us. By using our services, you agree to the collection and use of information in accordance with this policy.</p>
            </div>
            <div className="row mt-4 ">
                <h4>Information Collection and Use?</h4>
                <p className="FontSize15">
                We collect information to provide better services to all our users. This may include:                
                </p>
                <ul style={{listStyle:'disc'}}>
                              <li>
                                  <p>
                                  Personal Identification Information: Name, email address, telephone number, and payment information.                                  </p>
                              </li>
                              
                              <li>
                                  <p>
                                  Travel Preferences: Destinations, accommodation preferences, and travel dates to personalize your travel experience.                                  </p>
                              </li>
                              <li>
                                  <p>
                                  Data Security
                                  </p>
                              </li>
                              <li>
                                  <p>
                                  We employ a variety of security measures to protect the safety of your personal information. Your data is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.                                  </p>
                              </li>
                          </ul>
            </div>
            <div className="row mt-4 ">
                <h4>
                Sharing of Information                   
                 </h4>
                <p className="FontSize15">
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except to provide products or services you've requested.
                </p>
            </div>
            <div className="row mt-4 ">
                <h4>
                Cookies               </h4>
                <p className="FontSize15">
                Our website uses "cookies" to enhance User experience. You may choose to set your web browser to refuse cookies, or to alert you when cookies are being sent.                          </p>
                        
            </div>

            <div className="row mt-4 ">
                <h4>
                Changes to This Privacy Policy                 
                </h4>
                <p className="FontSize15">We may update our Privacy Policy periodically. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
            </div>
            <div className="row mt-4 ">
                <h4>
                How Does We Protect Your Information?                 </h4>
                <p className="FontSize15">
                Your personal information will not be passed on by us for use by third parties in any form whatsoever, unless we have obtained your consent or are legally required to do so. We have procedures in place to prevent unauthorized access to, and the misuse of, personal data. We use appropriate business systems and procedures to protect and safeguard the personal data you give us. We also use security procedures and technical and physical restrictions for accessing and using the personal data on our servers. Only authorized personnel and your required service providers are permitted to access personal data in the course of their work.
                </p >
            </div>
            <div className="row mt-4 ">
                <h4>
                Contact Us                </h4>
                <p className="FontSize15">
                If you have any questions about this Privacy Policy, please contact us through the contact information provided on our website.
                         </p>
            </div>
            
        </div>
        </Layout>
        </>
    )
}

export default PrivacyPolicy;