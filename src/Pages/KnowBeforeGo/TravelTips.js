import React from "react";
import Layout from '../../Components/Layout/Layout';
import bgimage from '../../Images/BeforeGo/background1.PNG';
import img1 from '../../Images/BeforeGo/travel-safety_crop-1160x650.jpg';
import img2 from '../../Images/BeforeGo/card-02-303.jpg';
import img3 from '../../Images/BeforeGo/light-understand.jpg';
function TravelTips(){
    return (
        <>
            <Layout>
            <div className='contact-img'>
                <img src={bgimage} />
            </div>

            <div className="container p-5 mt-4 mb-3">
            <h2>Travel Advice</h2>
            <p style={{fontSize:'1.2em'}} className="mt-4">
            The traveler within us is always planning that next trip. Across Saudi, hotels, restaurants and tourist attractions are open and ready to be enjoyed. Of course, the best way to make the most of any trip is to stay up to speed on the latest health and travel advice, and to take practical precautions. So, whether you’re planning a luxury getaway or a cross-country road trip, here are some tips to make your Saudi adventure worry- and stress-free.
            </p>
            <img className="mt-4" src={img1}/>

            <h2 className="mt-4">Is Saudi Safe?</h2>
            <p style={{fontSize:'1.2em'}} className="mt-4">
            Yes, Saudi is safe for male and female tourists. (For more information pertaining to women in Saudi, click here.) Saudi has opened its doors wide to receive tourists from countries all over the world. In fact, in light of the new openness, the Saudia Group of airlines recently announced flights to 25 international destinations. Of course, as with travel to any other country in the world, be respectful of local laws and culture, including specific customs around Ramadan, and be mindful of your surroundings. Also be sure to consult travel advisories before your trip.            
            </p>

            <h2 className="mt-4">Stay Informed</h2>
            <p style={{fontSize:'1.2em'}} className="mt-4">
            Following government guidelines can provide the latest advice about travel to and within Saudi. The Saudi Ministry of Health has a dedicated mobile app, Mawid, which offers current healthcare recommendations, as well as a hotline available at 937. You can also visit the ministry’s website for the most recent news on travel policies.
            </p>

            <h2 className="mt-4">What to Do in Case of Emergency When You’re in Saudi</h2>
            <p style={{fontSize:'1.2em'}} className="mt-4">
            In case of an emergency, dial 999 for the police. For an ambulance, dial 997. Looking for something else? Here are some other useful contacts, including the Highway Patrol.
            </p>
            </div>
            
            </Layout>
        </>
    );
}

export default TravelTips;