import React from "react";
import Layout from '../../Components/Layout/Layout';
import bgimage from '../../Images/BeforeGo/background1.PNG';
import img1 from '../../Images/BeforeGo/card-01-319.jpg';
import img2 from '../../Images/BeforeGo/card-02-303.jpg';
import img3 from '../../Images/BeforeGo/light-understand.jpg';
function AboutSaudi(){
    return (
        <>
            <Layout>
            <div className='contact-img'>
                <img src={bgimage} />
            </div>

            <div className="container-md mt-4 mb-3">
            <h2>Traditions of Saudi Arabia</h2>
            <div className="row mt-3">
                <div className="col-md-6 ">
                    <img className="card-img-top1" src={img1}/>
                </div>
                <div  className="col-md-6 flight-text-center  aboutsaudi_1">
                    <div className="ms-5 mt-2 mb-2 me-5">
                    <h4 >Language</h4>
                    <p className="mt-3">Arabic is the official language of Saudi Arabia and the primary language used in all dealings and public transactions. English serves as an informal second language in the Kingdom and is spoken by a large section of its society. All road signs are bilingual, showing information in both Arabic and English.&nbsp;</p>
                    </div>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-6 flight-text-center  aboutsaudi_1">
                    <div className="ms-5 mt-2 mb-2 me-5">
                    <h4 >Culture</h4>
                    <p className="mt-3">Saudi Arabia’s rich heritage and traditions have been shaped by its position as a historic trade hub and the birthplace of Islam. In recent years, the Kingdom has undergone a significant cultural transformation, evolving centuy-old customs to fit the contemporary world we live in today.</p>
                    </div>
                </div>
                <div className="col-md-6 ">
                    <img className="card-img-top1" src={img2}/>
                </div>
            </div>
            <h2 className="mt-2">Currency & Payments</h2>
            <div className="row mt-3">
                <div className="col-md-6 ">
                    <img className="card-img-top1" src={img3}/>
                </div>
                <div className="col-md-6 flight-text-center  aboutsaudi_1">
                    <div className="ms-5 mt-2 mb-2 me-5">
                    <h4 >Exchange and transactions</h4>
                    <p className="mt-3">Currency exchange and transactions are easy in Saudi Arabia. Saudi Arabia’s national currency is the Saudi riyal (ر.س SAR), which is subdivided into 100 halala.</p>
                    <p className="mt-3">You’ll receive notes in denominations of five riyals, ten riyals, 50 riyals, 100 riyals and 500 riyals; and coins in one riyal, two riyals, 50 halala, 25 halala, 10 halala, 5 halala and 1 halala.</p>
                    </div>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-md-4">
                <div class='card h-100 shadow-sm'>
                    <div style={{background:'#005c32'}}>
                        <h4 className="m-2 text-center " style={{color:'white'}}>Currency Exchange</h4>
                    </div>
                    <div>
                        <p className="m-5">
                        All banks in the kingdom offer currency exchange services. Exchange bureaus are located at airports, some shopping centers and various other locations throughout the country. Credit card, such as Visa, MasterCard and American Express are accepted throughout the kingdom. ATMs are also widely available.
                        </p>
                    </div>
                    </div>
                </div>
                <div className="col-md-4">
                <div class='card h-100 shadow-sm'>
                    <div style={{background:'#005c32'}}>
                        <h4 className="m-2 text-center " style={{color:'white'}}>Send and receive money</h4>
                    </div>
                    <div>
                        <p className="m-5">
                        You can send or receive money in Saudi Arabia by transferring funds online or through a bank that offers fast money transfer services, all of which are subject to the rules and regulations of the Saudi Arabian Monetary Authority (SAMA).
                        </p>
                    </div>
                    </div>
                </div>
                <div className="col-md-4">
                <div class='card h-100 shadow-sm'>
                    <div style={{background:'#005c32'}}>
                        <h4 className="m-2 text-center " style={{color:'white'}}>Taxes</h4>
                    </div>
                    <div>
                        <p className="m-5">
                        Saudi Arabia imposes an indirect tax of 15% (VAT) on all goods and services purchased and sold by enterprises. There are some exceptions.
                        </p>
                    </div>
                    </div>
                </div>
            </div>
            </div>
            
            </Layout>
        </>
    );
}

export default AboutSaudi;