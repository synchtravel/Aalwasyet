import React from "react";
import Layout from "../../Components/Layout/Layout";
import img from './faq.jpg'
function ComplaintPolicy(){
    return(
        <>
        <Layout>
        <div>
                <img src={img} className='image-100'/>
            </div>
        <div className="container">
            <div className="row mt-3 text-center">
                <h3>Complaints Policy & Procedures</h3>
            </div>
            <div className="row mt-4 ">
            <p className="FontSize15">Alhijaz Tours is well known within the Hajj and Umrah industry. We have a highly experienced team who know the ins and outs of Umrah and Hajj. We have immense experience on how traveling and accommodation work within Makkah and Medinah so we can make it easier for all pilgrims. Additionally, we have an abundance of knowledge on how one needs to perform their Hajj or Umrah and what they will need to take with them on their journey. We provide all the necessary information and keep our pilgrims updated at all times to make your travels easier. Our highly experienced and well versatile team is ready to take your queries.</p>            </div>
           
        </div>
        </Layout>
        </>
    )
}

export default ComplaintPolicy;