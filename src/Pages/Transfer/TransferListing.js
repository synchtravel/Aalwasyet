import React,{useState,useEffect} from "react";
import bgimage from '../../Images/Transfer/transfercover.jfif';
import Layout from "../../Components/Layout/Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faAngleDown
  , faDollar,faCar,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from "react-redux";
import { RangeSlider } from 'rsuite';
import TransferCard from "../../Components/Transfer/TransferCard";
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
function TransferListing(){
  var minValue1=0;
  var maxValue1 = 0;
  const CurrencyRates = useSelector(state => state.hotels.Currency);
  const GBPCurrencyRates = useSelector(state => state.hotels.AllCurrency);
  const TransferDetail=useSelector((state) => state.hotels.TrSeResponse);
  if(TransferDetail?.transfers_list !== 0){
     var amounts = TransferDetail?.transfers_list.map(item => item.total_fare_markup);
        if(amounts.length !==0){
          minValue1 = Math.min(...amounts);
          maxValue1 = Math.max(...amounts);
        };
  };
  const [minValue, setMinValue] = useState(minValue1);
  const [showModifySearch, setShowModifySearch] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showClassFilter, setShowClassFilter] = useState(false);
  const [maxValue, setMaxValue] = useState(maxValue1);
  const [SessionID, setSessionID] = useState(TransferDetail?.sessionID);
  const [rangeValue, setRangeValue] = useState([minValue1, maxValue1]);
  const [FilterData, setFilterData] = useState(TransferDetail?.transfers_list);
  const [vehicleClass, setVehicleClass] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);


  const handleChange = (newRangeValue) => {
    setRangeValue(newRangeValue);
    setMinValue(newRangeValue[0]);
    setMaxValue(newRangeValue[1]);
  };
  
  useEffect(()=>{
    setFilterData(TransferDetail?.transfers_list);
  },[TransferDetail]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
      if (checked) {
        setSelectedCheckboxes([...selectedCheckboxes, name]);
      } else {
        setSelectedCheckboxes(selectedCheckboxes.filter(item => item !== name));
      }
  };

  const filterbyPrice=()=>{
    setShowPriceFilter(false);
    const filteredTours = TransferDetail?.transfers_list.filter(item => {
      const price = item.total_fare_markup;
        return price >= minValue && price <= maxValue;
    });
    setFilterData(filteredTours);
  };

  const filterbyClass=()=>{
    setShowClassFilter(false);
      if(selectedCheckboxes.length !==0){
        const filtered = TransferDetail?.transfers_list.filter(item => selectedCheckboxes.includes(item.vehicle_Name));
        setFilterData(filtered);
      }else{
        setFilterData(TransferDetail?.transfers_list);
      }
  };

    useEffect(()=>{
      VehicleClassfilter();
    },[TransferDetail]);

  const VehicleClassfilter=()=>{

    const VehicleCount = {};
    for (const vehicle of TransferDetail?.transfers_list) {
      
      const vehicleType =vehicle.vehicle_Name;
      if(vehicleType !==undefined){
          if (VehicleCount.hasOwnProperty(vehicleType)) {
            VehicleCount[vehicleType]++;
          } else {
            VehicleCount[vehicleType] = 1;
          }
       }
   
    setVehicleClass(VehicleCount);
  }
  };

  const ShowSearchBar=()=>{
    setShowModifySearch(!showModifySearch);
  };

  const renderPrice = price => {
    if (CurrencyRates === undefined) {
      var baseprice =price;
    } else {
      const conversionrate = GBPCurrencyRates.conversion_rates[CurrencyRates.selectedcurrency];
      var newprice = (Number(conversionrate) * Number(price)).toFixed(0);
      var baseprice =newprice;
    }
    return baseprice
  };

  const TogglePriceFilter=()=>{
    setShowPriceFilter(!showPriceFilter)
  };

  const ToggleClassFilter=()=>{
    setShowClassFilter(!showClassFilter);
  };
    return(
        <>
        <Layout>
        <Modal isOpen={showPriceFilter} toggle={TogglePriceFilter}>
              <ModalHeader toggle={TogglePriceFilter}>Price Filter</ModalHeader>
              <ModalBody>
              <div className='widget widget_price_filter'>
                          <div className='mb-0'>
                            <RangeSlider
                                value={rangeValue}
                                onChange={handleChange}
                                min={minValue1-1}
                                tooltip={false}
                                max={maxValue1+1}
                                step={1}
                              />
                                <div className='pt-2'>
                              <div className='fw-bold mb-2'>
                                Min: <span id='kt_slider_basic_min'>{renderPrice(minValue)}</span>
                              </div>
                              <div className='fw-bold mb-2'>
                                Max: <span id='kt_slider_basic_max'>{renderPrice(maxValue)}</span>
                              </div>
                            </div>
                            <button onClick={filterbyPrice}  className='btn select-styling search-btn1 mb-1'>Filter</button>
                          </div>
                        </div>
              </ModalBody>
            </Modal>
            <Modal isOpen={showClassFilter} toggle={ToggleClassFilter}>
              <ModalHeader toggle={ToggleClassFilter}>Vehicles</ModalHeader>
              <ModalBody>
              <div className='widget widget_has_radio_checkbox'>
                    <ul>
                    {Object.entries(vehicleClass).map(([code, count]) => (
                          <li key={code}>
                            <label>
                              <input
                                type='checkbox'
                                className="custom-textbox"
                                checked={selectedCheckboxes.includes(code)} // Check if checkbox is selected
                                onChange={handleCheckboxChange}
                                name={code}
                                value={code}
                              />
                              <i className='awe-icon awe-icon-check'></i>
                              <span className='rating'>{' '}
                              {code} ({count})
                              </span>
                            </label>
                          </li>
                        ))}

                    </ul>
                    <button onClick={filterbyClass}  className='btn select-styling search-btn1 mb-1'>Filter</button>

                  </div>
              </ModalBody>
            </Modal>
            <div className='container'>
                    <div className='row mt-3 hotel-top'>
                        <div className='col-md-6 d-flex'>
                            <h3 className='title font-size-24 ms-3 tc' id='tours_result'>
                           {TransferDetail?.transfers_list.length} Result found
                            </h3>
                        </div>
                </div>
                
                <div className='row mt-3'>
                    <div className='col-md-3 col-md-pull-9'>
                    <div class="mobile-Filter-info">
                                <ul>
                                    <li><p onClick={TogglePriceFilter}><FontAwesomeIcon icon={faDollar}/> Price</p></li>
                                    <li><p onClick={ToggleClassFilter}><FontAwesomeIcon icon={faCar}/><span > Vehicle Class</span></p>
                                    </li>
                                </ul>
                               
                            </div>
                    <div className='page-sidebar hide-page_filter'>
                    <div className='widget widget_price_filter'>
                      <div className='mb-0'>
                        <h3 className='form-label'>Price Filter</h3>
                        <RangeSlider
                            value={rangeValue}
                            onChange={handleChange}
                            min={minValue1-1}
                            tooltip={false}
                            max={maxValue1+1}
                            step={1}
                          />
                            <div className='pt-2'>
                          <div className='fw-bold mb-2'>
                            Min: <span id='kt_slider_basic_min'>{renderPrice(minValue)}</span>
                          </div>
                          <div className='fw-bold mb-2'>
                            Max: <span id='kt_slider_basic_max'>{renderPrice(maxValue)}</span>
                          </div>
                        </div>
                        <button onClick={filterbyPrice}  className='btn select-styling search-btn1 mb-1'>Filter</button>
                      </div>
                    </div>
                    <div className='widget widget_has_radio_checkbox'>
                <h3>Vehicles</h3>
                <ul>
                {Object.entries(vehicleClass).map(([code, count]) => (
                      <li key={code}>
                        <label>
                          <input
                            type='checkbox'
                            className="custom-textbox"
                            checked={selectedCheckboxes.includes(code)} // Check if checkbox is selected
                            onChange={handleCheckboxChange}
                            name={code}
                            value={code}
                          />
                          <i className='awe-icon awe-icon-check'></i>
                          <span className='rating'>{' '}
                           {code} ({count})
                          </span>
                        </label>
                      </li>
                    ))}

                </ul>
                <button onClick={filterbyClass}  className='btn select-styling search-btn1 mb-1'>Filter</button>

              </div>

                </div>
                    </div>
                    <div className='col-md-9 col-md-push-3'>
                        <TransferCard  TransferData={FilterData} sessionID= {SessionID}/>
                    </div>
                </div>
             </div>
        </Layout>

        </>
    );
}

export default TransferListing;