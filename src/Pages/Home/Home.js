import React, { useEffect, useState } from 'react'
import '../../Components/Carousal/style.css'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import SearchBar from '../../Components/SearchBar/Searchbar'
import agentpic from '../../Images/Home/agentpic.png'
import Layout from '../../Components/Layout/Layout'
import Loader from '../../Components/Loading/Loader'
import Helmet from 'react-helmet'
import Carousal from '../../Components/Carousal/Carousal'
import MoreOffer from '../../Components/HomePage/TopExcursions'
import SmallCard from '../../Components/HomePage/SmallCard'
import Excursions from '../../Components/HomePage/KnowBeforeGo'
import FeaturedCars from '../../Components/HomePage/FeatureCar'
import Packages from '../../Components/Packages/Packages';
import BestCollection from '../../Components/HomePage/ExploreSaudi'
import TopHotels from '../../Components/HomePage/CheepFlights'
import wow from 'wowjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faEnvelope, faHeadphones, faMoneyBill, faPhone, faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
function Home () {
  const [isLoading, setIsLoading] = useState(true)
  const [bottomAdd, setShowbottomAdd] = useState(true)
  const [modalOpen,setModalOpen]=useState(true);
  useEffect(() => {
    new wow.WOW().init()
    // setIsLoading(true);
    // // Display loading for 1 second when navigating between pages
    // const loadingTimeout = setTimeout(() => {
    //   setIsLoading(false);
    // }, 500);

    // return () => {
    //   clearTimeout(loadingTimeout);
    // };
    const fetchData = async () => {
      // Replace this with your actual data fetching logic or any other asynchronous tasks
      // await new Promise(resolve => setTimeout(resolve, 2000))
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Once data is fetched or tasks are completed, set loading to false
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const toggleModal=()=>{
    setModalOpen(!modalOpen);
  };

  const hideadd = () => {
    setShowbottomAdd(false)
  };
  return (
    <>
      <Helmet>
        <title>Explore Saudi Arabia | Alwasyet  - Alwasyet Official Website</title>
      </Helmet>
      {isLoading && <Loader />}
      <Layout>
        <div className='overlay-container'>
          <Carousal/>
          <SearchBar />
        </div>
        <Packages/>
        <MoreOffer/>
        <SmallCard/>
        <BestCollection/>
        <TopHotels/>
        <Excursions/>
        {/* <FeaturedCars/> */}
      </Layout>
      {bottomAdd && (
        <div class='phone-only'>
          <div class='container position-relative'>
            <div class='phone-only-img'>
              <img
                class='phone-only-agent'
                width='68'
                height='68'
                alt='Call us at +966 50 978 6777'
                src={agentpic}
              />
            </div>
            <b>
              Looking for last-minute deals? Just give us a call to get
              phone-only deals!
            </b>
            <br />
            Call us at
            <a
              title='+966 50 978 6777'
              role='button'
              class='phonelink px-1'
              href='tel:+966 50 978 6777'
            >
              <span class='phone-number'>+966 50 978 6777</span>
            </a>
            and get assistance.
            <span class='cross-icon' onClick={hideadd}>
              ╳
            </span>
          </div>
        </div>
      )}
      <Modal isOpen={modalOpen} className='ad-modal' toggle={toggleModal}>
        {/* <ModalHeader toggle={toggleModal}></ModalHeader> */}
        <ModalBody>
          <div className='form-group'>
            <div class="modal-body booking-option-wrapper">
              <div class="modal-close-icon" onClick={toggleModal} tabindex="0" aria-label="close">
              <FontAwesomeIcon icon={faTimes}/>
                </div>
                <div class="expert-wrapper">
                  <div class="expert-image">
                    </div>
                    <div class="expert-availability">Available now</div>
                    </div>
                    <div class="booking-option-details">
                      <div class="booking-option-title" tabindex="0" aria-label="Let Us Help You Book!">Let Us Help You Book!</div>
                      <div class="booking-option-subtitle" tabindex="0" aria-label="[object Object]"><span><b>Speak with a travel expert and get assistance 24/7 </b></span></div>
                      <div class="booking-mobile"><a href="tel:0121 777 2522" title="Phone number" role="button" tabindex="0" aria-label="0121 777 2522">
                       <FontAwesomeIcon icon={faPhone}/> +966 50 978 6777</a></div></div></div>
          </div>
          <div class="container content-section mb-0 popup-benefits">
          <h2 class="wHeding">Why to Book with Call Center</h2>
          <div class="row mt-2">
            <div class="col-lg-6 col-sm-6 content-section__main">
              <div class="row">
                <span class="col-3 pr-0">
                  <FontAwesomeIcon size='2x' className='st1' icon={faHeadphones}/>
                  </span>
                  <span class="col-9 pt-0"><h3 class="mb-2 font-weight-normal">Expert guidance by our <b class="d-block">Travel experts</b></h3></span></div></div>
                  <div class="col-lg-6 col-sm-6 content-section__main"><div class="row"><span class="col-3 pr-0">
                  <FontAwesomeIcon size='2x' className='st1' icon={faEnvelope}/>

                    </span>
                    <span class="col-9 pt-0"><h3 class="mb-2 font-weight-normal">Immediate <b class="d-block">booking confirmation</b></h3></span></div></div>
                    <div class="col-lg-6 col-sm-6 content-section__main"><div class="row"><span class="col-3 pr-0">
                    <FontAwesomeIcon size='2x' className='st1' icon={faClock}/>
                      </span><span class="col-9 pt-0"><h3 class="mb-2 font-weight-normal"><b class="d-block">24-hour </b>cancellation</h3></span></div></div>
                      <div class="col-lg-6 col-sm-6 content-section__main">
                        <div class="row"><span class="col-3 pr-0">
                        <FontAwesomeIcon size='2x' className='st1' icon={faMoneyBill}/>
                          </span><span class="col-9 pt-0"><h3 class="mb-2 font-weight-normal"><b class="d-block">Flexible payment</b> plans</h3></span></div></div></div>
          </div>
        </ModalBody>
        {/* <ModalFooter>
          <Button color='secondary' onClick={() => toggleModal(1)}>
            Close
          </Button>
          <button
            className=' btn btn-warning modal-btn1'
            onClick={() => toggleModal(1)}
          >
            Submit
          </button>
        </ModalFooter> */}
      </Modal>
    </>
  )
}

export default Home
