import React,{useState,useEffect,useRef} from 'react'
import bgimage from '../../Images/Pages/contact.png'
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar} from '@fortawesome/free-solid-svg-icons'
import Layout from '../../Components/Layout/Layout';
import PackageDetailCard from '../../Components/PackageDetailCard/PackageDetailCard';
function Umrahpackages () {
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(10000);
    const sliderRef = useRef(null);
  
    useEffect(() => {
      const slider = sliderRef.current;
      noUiSlider.create(slider, {
        start: [minValue, maxValue],
        connect: true, // Initial values
        range: {
          min: 0,    // Minimum value
          max: 10000,  // Maximum value
        },
      });
  
      slider.noUiSlider.on('update', (values, handle) => {
        if (handle === 0) {
          setMinValue(parseInt(values[handle]));
        } else {
          setMaxValue(parseInt(values[handle]));
        }
      });
  
      return () => slider.noUiSlider.destroy();
    }, []);
  
    
  return (
    <>
    <Layout>
      <div className='contact-img'>
        <img src={bgimage} />
        <h1 className='text-capitalize fw-bold' style={{ color: '#363d48' }}>
          Umrah Packages
        </h1>
      </div>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12 p-5'>
            {/* <h4 style={{ te: 'center' }}>Umrah Packages</h4> */}
          </div>

          <div className='col-md-3 col-md-pull-9'>
            <div className='page-sidebar'>
              <div className='widget widget_price_filter'>
                <div className='mb-0'>
                  <label className='form-label'>Price Level</label>
                  <div ref={sliderRef} />
                  <div className='pt-5'>
                  
                    <div className='fw-bold mb-2'>
                      Min: <span id='kt_slider_basic_min'>{minValue}</span>
                    </div>
                    <div className='fw-bold mb-2'>
                      Max: <span id='kt_slider_basic_max'>{maxValue}</span>
                    </div>
                  </div>
                </div>

                {/* <input type='text' id='category' hidden='' value='21' />
                <input type='text' id='city' hidden='' value='' />
                <input type='text' id='start' hidden='' value='' /> */}
              </div>

              <div className='widget widget_has_radio_checkbox'>
                <h3>Star Rating</h3>
                <ul>
                  <li>
                    <label>
                      <input type='checkbox' className='custom-textbox' name='rating_starts' value='5' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'>
                      <i className='fa fa-star'> <FontAwesomeIcon icon={faStar}/></i>
                        <i className='fa fa-star'> <FontAwesomeIcon icon={faStar}/></i>
                        <i className='fa fa-star'> <FontAwesomeIcon icon={faStar}/></i>
                        <i className='fa fa-star'> <FontAwesomeIcon icon={faStar}/></i>
                        <i className='fa fa-star'> <FontAwesomeIcon icon={faStar}/></i>
                      </span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type='checkbox' className='custom-textbox' name='rating_starts' value='4' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'>
                      <i className='fa fa-star'> <FontAwesomeIcon icon={faStar}/></i>
                      <i className='fa fa-star'> <FontAwesomeIcon icon={faStar}/></i>
                      <i className='fa fa-star'> <FontAwesomeIcon icon={faStar}/></i>
                      <i className='fa fa-star'> <FontAwesomeIcon icon={faStar}/></i>
                      </span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type='checkbox' className='custom-textbox' name='rating_starts' value='3' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'>
                      <i className='fa fa-star'> <FontAwesomeIcon icon={faStar}/></i>
                      <i className='fa fa-star'> <FontAwesomeIcon icon={faStar}/></i>
                      <i className='fa fa-star'> <FontAwesomeIcon icon={faStar}/></i>
                      </span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type='checkbox' className='custom-textbox' name='rating_starts' value='2' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'>
                      <i className='fa fa-star'> <FontAwesomeIcon icon={faStar}/></i>
                      <i className='fa fa-star'> <FontAwesomeIcon icon={faStar}/></i>
                      </span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type='checkbox' className='custom-textbox' name='rating_starts' value='1' />
                      <i className='awe-icon awe-icon-check'></i>
                      <span className='rating'>
                      <i className='fa fa-star'> <FontAwesomeIcon icon={faStar}/></i>
                      </span>
                    </label>
                  </li>
                </ul>
              </div>

              <div className='widget widget_has_radio_checkbox'>
                <h3>Included services</h3>
                <ul></ul>
              </div>

              <button className='btn select-styling search-btn1'>Filter</button>

              <div className='widget widget_product_tag_cloud mt-2'>
                <h3>Tags</h3>
                <div className='tagcloud'>
                  <a href='#'>Hotel</a>
                  <a href='#'>Motel</a>
                  <a href='#'>Hostel</a>
                  <a href='#'>Homestay</a>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-9 col-md-push-3'>
            <PackageDetailCard/>
          </div>
        </div>
        <div className="col-md-12 mb-5">
                        <p className='text-justify'> 
                            Alhijaz Tours team has the experience and it provides the most reliable and economical Umrah packages. Our large range of Umrah Packages allows us to meet the needs of various range of budgets and durations. All the umrah packages offered at <a href="https://alhijaztours.net/" style={{color:'#d39d00'}}><b> Alhijaz Tours </b></a> are tailored to meet the specific requirements of the individuals. We have the best resources and personnel to meet your expectations. Make your umrah journey, a memorable one through our unmatched umrah packages.
                            All our low cost umrah packages include return tickets and we offer economical accommodations ranging from 4 and 5 star hotels at a walking distance from Haramain Shirafain. Air conditioned transportation for your travel requirements is also part of the service. Our low cost umrah packages are available throughout the year other than the hajj season. We always have busy days being one of the top umrah services providers with umrah packages in United Kingdom.
                            Alhijaz Tours team works with an objective to be as much flexible as we can in the umrah packages. We have a thorough understanding that everyone has his/her own desires and financial circumstances. So, we offer cheap umrah packages for different budgets and durations. Haramayn ltd also let you choose most appropriate hotel according to your requirements from a wide range of hotel accommodations available with us. All the services in our umrah packages are remarkable for UK residents. We are trusted by Muslim Community due to our umrah packages.
                        </p>
                    </div>
      </div>
      </Layout>
    </>
  )
}

export default Umrahpackages
