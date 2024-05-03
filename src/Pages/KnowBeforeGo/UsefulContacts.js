import React from "react";
import Layout from '../../Components/Layout/Layout';
import bgimage from '../../Images/BeforeGo/background1.PNG';
import img1 from '../../Images/BeforeGo/women-using-mobile.jpeg';
import img2 from '../../Images/BeforeGo/card-02-303.jpg';
import img3 from '../../Images/BeforeGo/light-understand.jpg';
function UsefulContacts(){
    return (
        <>
            <Layout>
            <div className='contact-img'>
                <img src={bgimage} />
            </div>

            <div className="container-md mt-4 mb-3">
            <div className="row mt-3">
                <div className="col-md-6 ">
                    <img className="card-img-top1" src={img1}/>
                </div>
                <div style={{background:'#005c32',color:'white'}} className="col-md-6 flight-text-center  aboutsaudi_1">
                    <div className="ms-5 mt-2 mb-2 me-5">
                    <h4 >Emergency numbers</h4>
                    <p className="mt-3">Police:- Makkah, Riyadh and Eastern provinces: 911 <br></br>- All other provinces of the Kingdom: 999 <br/>Saudi Ambulance: 997<br/>Civil Defense: 998<br/>For traffic accidents: 993<br/>Highway Patrol: 996<br/>Border Guard: 994</p>
                    </div>
                </div>
            </div>
            <h2 className="mt-5">Useful numbers</h2>
            <div className="row mt-3">
                <div className="col-md-4">
                <div class='card h-100 shadow-sm'>
                    <div style={{background:'#005c32'}}>
                        <h4 className="m-2 text-center " style={{color:'white'}}>Tourism</h4>
                    </div>
                    <div>
                        <p className="m-5"><span className="fw-bold">Tourism Call Center:</span> 930<br/><span className="fw-bold">Tourism International:</span> +966920000890<br/><span className="fw-bold">Najm Company:</span> 920000560<br/><span className="fw-bold">General Directorate of Passports:</span> 992
                        </p>
                    </div>
                    </div>
                </div>
                <div className="col-md-4">
                <div class='card h-100 shadow-sm'>
                    <div style={{background:'#005c32'}}>
                        <h4 className="m-2 text-center " style={{color:'white'}}>Consumer services</h4>
                    </div>
                    <div>
                    <p className="m-5"><span className="fw-bold">Municipal services:</span> 940<br/><span className="fw-bold">Electricity company emergency:</span> 933<br/><span className="fw-bold">Ministry of Transport emergency:</span> 938<br/><span className="fw-bold">Ministry of Hajj and Umrah, Customer Service:</span> +966920002814<br/><span className="fw-bold">Consumer protection:</span>  935
                        </p>
                    </div>
                    </div>
                </div>
                <div className="col-md-4">
                <div class='card h-100 shadow-sm'>
                    <div style={{background:'#005c32'}}>
                        <h4 className="m-2 text-center " style={{color:'white'}}>Public security</h4>
                    </div>
                    <div>
                    <p className="m-5"><span className="fw-bold">Saudi Public Security:</span>  989<br/><span className="fw-bold">General enquiries:</span> 905<br/><span className="fw-bold">Emergency medical consultation:</span> 937<br/><span className="fw-bold">General Directorate of Narcotics Control:</span> 995
                        </p>
                    </div>
                    </div>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-md-6 ">
                    <img className="card-img-top1" src={img3}/>
                </div>
                <div className="col-md-6 flight-text-center  aboutsaudi_1">
                    <div className="ms-5 mt-2 mb-2 me-5">
                    <h4 >Telephone code and providers</h4>
                    <p className="mt-3 mb-3">Saudi Arabia’s country code is 00966 There are three mobile network providers in Saudi Arabia. These are:</p>
                    <h6>- STC</h6>
                    <h6>- Mobily</h6>
                    <h6>- Zain</h6>
                    </div>
                </div>
            </div>
            </div>
            
            </Layout>
        </>
    );
}

export default UsefulContacts;