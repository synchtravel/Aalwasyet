import React, { useState, useEffect } from 'react';
import logo from './logo.png';
import Axios from 'axios';
import ReactDOM from 'react-dom';
import { json, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Hotelapitoken, ApiEndPoint,CurrencyConverter } from '../GlobalData/GlobalData';
import { CurrencyRates, AllCurrencyRates } from '../../Redux/Actions/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faSignIn,
  faBars,
  faTimes,
  faChevronDown,
  faCross,
  faClose,
  faAngleRight,
  faArrowDown,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import LanguageSwitcher from '../Translation/TranslationTrigger';
import { set } from 'date-fns';
import { useTranslation } from 'react-i18next';
function Navbar () {
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const navigation = useNavigate()
  var token = Hotelapitoken()
  var endpoint = ApiEndPoint()
  const [modalOpen, setModalOpen] = useState(false)
  const [countryList, setCountryList] = useState([])
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)
  const [userCountry, setUserCountry] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [dropdownCat, setDropdownCat] = useState([])
  const [isDropdownOpen2, setDropdownOpen] = useState(false)

  const [selectedCurrency, setSelectedCurrency] = useState('GBP')

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen2)
  }

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen)
  }
  const buttonIconClass = isMobileNavOpen
    ? 'navbar-toggler-icon-cross'
    : 'navbar-toggler-icon'
  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }
  useEffect(() => {
    GetCatagories();
    fetchData();
    AllCurrency();
    const storedCurrency = localStorage.getItem('selectedCurrency')
    if (storedCurrency) {
      setSelectedCurrency(storedCurrency)
    }
  }, []);

  const SearchValue = e => {
    var filteredList = countryList.filter(item =>
      item.currency.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setUserCountry(filteredList)
    setSearchValue(e.target.value)
  };

  async function fetchData () {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      // 'Authorization': 'Bearer YourAccessToken', // Replace with your authorization token
      'Content-Type': 'application/json' // Specify content type if needed
    }
    try {
      const response = await Axios.get(
        endpoint + '/api/countries/fetch',
        headers
      )
      setCountryList(response.data.countries)
    } catch (error) {
      // Handle any errors
      console.error('Error:', error)
    }
  }
  const handleCurrencyDivClick = (index, currency) => {
    toggleModal();
    setActiveIndex(index);
    setSelectedCurrency(currency);
    CurrencyCalucaltion(currency);
    localStorage.setItem('selectedCurrency', currency)

    // Perform other calculations or actions here
  }

  const CurrencyCalucaltion = c => {
    var token = CurrencyConverter();
    
    const config = {
      method: 'get',
      url: 'https://v6.exchangerate-api.com/v6/' + token + '/latest/' + c, // Replace with your API URL
      maxBodyLength: Infinity,
      headers: {}
    }

    Axios.request(config)
      .then(response => {
        response.data.selectedcurrency = c;
        dispatch(CurrencyRates(response.data));
        
      })
      .catch(error => {
        // Handle errors here
        console.error(error)
      })
  }

  const AllCurrency = () => {
    var token = CurrencyConverter();
    const config = {
      method: 'get',
      url: 'https://v6.exchangerate-api.com/v6/' + token + '/latest/GBP', // Replace with your API URL
      maxBodyLength: Infinity,
      headers: {}
    }

    Axios.request(config)
      .then(response => {
        // Handle the response data here
        dispatch(AllCurrencyRates(response.data))
      })
      .catch(error => {
        // Handle errors here
        console.error(error)
      })
  }

  const GetCatagories = async () => {
    var data = {
      token: token
    }
    try {
      const response = await Axios.post(
        endpoint + '/api/get_all_catigories_list_apis_new',
        data,
        {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
        sessionStorage.setItem('Catogories',JSON.stringify(response.data.categories));
      setDropdownCat(response.data.categories)
    } catch (error) {
      console.error('Error:', error)
    }
  };

  // const getLocation = () => {
  //   if ('geolocation' in navigator) {
  //     // Geolocation is available
  //     navigator.geolocation.getCurrentPosition(function (position) {
  //       // Get the latitude and longitude from the position
  //       const latitude = position.coords.latitude
  //       const longitude = position.coords.longitude
  //       alert(latitude)
  //       alert(longitude)

  //       // Use a reverse geocoding service to get the user's current country
  //       const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBmwlQFQKwxZ4D8nRbsWVRTBFUHMO-lUOY`

  //       fetch(geocodingUrl)
  //         .then(response => response.json())
  //         .then(data => {
  //           const results = data.results
  //           if (results.length > 0) {
  //             // The user's current country can be extracted from the address components
  //             const country = results[0].address_components.find(component =>
  //               component.types.includes('country')
  //             )
  //             console.log("User's current country: " + country.long_name)
  //           } else {
  //             console.log("Could not determine the user's current country.")
  //           }
  //         })
  //         .catch(error => {
  //           console.error('Error while fetching geolocation data: ' + error)
  //         })
  //     })
  //   } else {
  //     // Geolocation is not available
  //     console.log('Geolocation is not available in this browser.')
  //   }
  // }

  const FindPackageDetail = id => {
    toggleDropdown()
    navigation('/umrah_packages', { state: id })
  }

  return (
    <>
      <header>
        {/* <div className='navbar-top'>
          <div className='row'>
            <div className='col-lg-4 col-md-4 navbar-img col-sm-12'>
              <img src={logo} alt='Logo' height='60' />
            </div>
            <div className='col-lg-8 col-md-8 col-sm-12'>
              <div className='navbar-top-right '>
                <div className='d-flex  '>
                  <FontAwesomeIcon icon={faPhone} />
                  <h6>0121 777 2522</h6>
                </div>
                <div className='d-flex  '>
                  <button
                    onClick={toggleModal}
                    className='btn btn-primary currency-btn'
                  >
                    {selectedCurrency}
                  </button>
                </div>
                <div className='d-flex top-button-effect'>
                  <button className='btn btn-success '>
                    <FontAwesomeIcon
                      className='navbar-sign-in'
                      icon={faSignIn}
                    />{' '}
                    <span>Sign in</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <nav
          id='navbar'
          className={
            'navbar-expand-lg pb-2  navbar-dark   ' +
            (isMobileNavOpen ? 'navbar-mobile' : 'navbar')
          }
        >
         
          <div className='logo-top'>
          {/* <img src={logo} alt='Logo'/> */}
          <h3>Alwasyet</h3>
          </div>
          <button
            type='button'
            data-toggle='collapse'
            data-target='#navbarSupportedContent'
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'
            className='navbar-toggler'
          >
            {isMobileNavOpen ? (
              <span
                style={{ color: 'white' }}
                onClick={toggleMobileNav}
                className='mobile-nav-toggle '
              >
                {' '}
                <FontAwesomeIcon icon={faClose} />
              </span>
            ) : (
              <span
                onClick={toggleMobileNav}
                className='mobile-nav-toggle navbar-toggler-icon'
              ></span>
            )}
          </button>
          <ul className='navbar-nav navbar-link  ml-auto'>
            <li className='nav-item nav-link scrollto  active'>
              <NavLink className='nav-link' to='/'>
              {t('Home')}
              </NavLink>
            </li>
            <li className='nav-item ps-3 dropdown nav-link scrollto'>
              <h5 onClick={toggleDropdown} className='nav-link'>
              {t('Packages')}{' '}
                <FontAwesomeIcon onClick={toggleDropdown} icon={faAngleDown} />
              </h5>
              {isDropdownOpen2 && (
                <ul>
                  {dropdownCat.map((item, index) => (
                    <li key={index} className='mb-3'>
                      <h6
                        onClick={() => FindPackageDetail(item.id)}
                        className='dropdown-nav-link '
                      >
                        {t(`${item.title}`)}
                      </h6>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li className='nav-item nav-link scrollto'>
              <a href='#' className='nav-link'>
              {t('Activities')}
              </a>
              <span class=' submenu-toggle'>
                <FontAwesomeIcon icon={faAngleRight} />
              </span>
            </li>
            <li className='nav-item nav-link scrollto'>
              <NavLink className='nav-link' to='/about-us'>
              {t('About Us')} 
              </NavLink>
              <span class=' submenu-toggle'>
                <FontAwesomeIcon icon={faAngleRight} />
              </span>
            </li>
            <li className='nav-item nav-link scrollto'>
              <NavLink className='nav-link' to='/contact-us'>
              {t('Contact Us')}
              </NavLink>
              <span className=' submenu-toggle'>
                <FontAwesomeIcon icon={faAngleRight} />
              </span>
            </li>
          </ul>
          <div style={{alignItems:'center'}} className='d-flex'>
            <div>
                <I18nextProvider i18n={i18n}>
                            <LanguageSwitcher language="arabic" />
                          </I18nextProvider>
                    </div>
                    <div >
                        <button
                          onClick={toggleModal}
                          className='btn btn-primary currency-btn'
                        >
                          {selectedCurrency}
                        </button>
                </div>
            </div>
        </nav>
      </header>

      {/*********** Cuurency  Model ****************/}
      <Modal
        style={{ maxWidth: '90%' }}
        isOpen={modalOpen}
        toggle={toggleModal}
      >
        <ModalHeader toggle={toggleModal}>Select Your Currency</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <p>
              Where applicable, prices will be converted to—and shown in—the
              currency you select. The currency you pay in may differ based on
              your reservation, and a service fee may also apply.
            </p>
            <div className='border-line mt-2 mb-2'></div>
            {/* <div className='row mt-2'>
         <h5>Suggested for you</h5>
       </div> */}
            <div className='row'>
              <div className='d-flex justify-content-between'>
                <h5>All Currencies</h5>
                <input
                  type='text'
                  value={searchValue}
                  onChange={SearchValue}
                  placeholder='Search'
                />
              </div>

              {searchValue === ''
                ? // Render the full list when there is no search input
                  countryList.map((item, index) => (
                    <div key={index} className='col-md-4 mt-2 currency-modal'>
                      <div
                        className={` ${
                          index === activeIndex ? 'currency-div' : ''
                        }`}
                        onClick={() =>
                          handleCurrencyDivClick(index, item.currency)
                        }
                      >
                        <p className='currency-item'>
                          {item.name} - {item.currency}
                        </p>
                      </div>
                    </div>
                  ))
                : // Render the filtered list when there is a search input
                  userCountry.map((item, index) => (
                    <div key={index} className='col-md-4 mt-2 currency-modal'>
                      <div
                        className={` ${
                          index === activeIndex ? 'currency-div' : ''
                        }`}
                        onClick={() =>
                          handleCurrencyDivClick(index, item.currency)
                        }
                      >
                        <p className='currency-item'>
                          {item.name} - {item.currency}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default Navbar
