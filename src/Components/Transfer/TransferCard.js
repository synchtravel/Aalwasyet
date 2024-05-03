import React,{useState,useEffect} from "react";
import { CustomerDomainName } from "../GlobalData/GlobalData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGlobe,
  faInfoCircle,
  faPerson,
  faCar,
  faSuitcase,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../Loading/Loader";
import moment from "moment";
import { Popover, Whisper, Button } from 'rsuite';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Axios from "axios";
import { TransferApiToken,ApiEndPoint } from "../GlobalData/GlobalData";
function TransferCard(props){
  const [isLoading, setIsLoading] = useState(false);
  const CurrencyRates = useSelector(state => state.hotels.Currency);
  const GBPCurrencyRates = useSelector(state => state.hotels.AllCurrency);
  const token=TransferApiToken();
  const endpoint=ApiEndPoint();
  const navigate=useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const TransferPerPage =10; // Number of hotels to display per page
  const indexOfLastTransfer = currentPage * TransferPerPage;
  const indexOfFirstTransfer = indexOfLastTransfer - TransferPerPage;
  const currentransfers =props.TransferData.slice(indexOfFirstTransfer, indexOfLastTransfer);
  const pagesCount = Math.ceil(props.TransferData.length / TransferPerPage);
  const validCurrentPage = currentPage < 1 ? 1 : currentPage;
  const maxPagesToShow = 5;
  const startHotelIndex = indexOfFirstTransfer + 1;
  const endHotelIndex = Math.min(indexOfLastTransfer, props.TransferData.length);
  const paginate = (pageNumber) => {
    window.scrollTo(0, 0);
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    // Adjust the current page if it exceeds the total number of pages
    if (currentPage < 1) {
      setCurrentPage(1);
    } else if (currentPage > pagesCount) {
      setCurrentPage(pagesCount);
    }
  }, [ currentPage, pagesCount]); 

  useEffect(() => {
    setCurrentPage(1);
  }, [ props.TransferData]); 

  const renderPaginationItems = () => {
    const items = [];
    let startPage = currentPage - Math.floor(maxPagesToShow / 2);
    startPage = Math.max(startPage, 1);
    const endPage = Math.min(startPage + maxPagesToShow - 1, pagesCount);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i} active={i === currentPage}>
          <PaginationLink onClick={() => paginate(i)} href="#">
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };
  const BookTransfer=async(id)=>{

    var transfer=props.TransferData.filter((item)=>item.destination_id===id);
    sessionStorage.setItem('TransferID', id);
    if(transfer[0].booking_From !=="3rd Party API"){
      navigate('/transfer-checkout');
    }else{
      setIsLoading(true);
      var extras_avline=[];
      if(transfer[0]?.extras_Avline){
     extras_avline=JSON.parse(transfer[0]?.extras_Avline);
    }
     
      var data={
       'token': token,
       'extras_Avline':extras_avline.length ===0 ? JSON.stringify([]):JSON.stringify(extras_avline),
       'sessionID':props.sessionID,
	      'bookingid': transfer[0].destination_id,
      }

      try {
         
        const response = await Axios.post(endpoint+'/api/book_Transfer_Api',data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
          } ,
          
        });
        setIsLoading(false);
        if(response.data.message==="Success"){
          sessionStorage.setItem('TransferTransectionNumber', response.data.transactionNumber);
          if(response.data?.extras_Data){
            sessionStorage.setItem('Extradata', JSON.stringify(response.data.extras_Data));
          }else{
            sessionStorage.setItem('Extradata', JSON.stringify([]));
          }
          navigate('/transfer-checkout');
        }
      
      } catch (error) {
        setIsLoading(false);
        console.error('Error:', error);
      }


    }
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


    return(
      <>
      {isLoading && ( <Loading/>)}
      <div>
      <div className='filter-page__content'>
      <div className='fw-bold  m-2'>Showing {startHotelIndex} to {endHotelIndex} of {props.TransferData.length} Transfers</div>                   

          <div className='filter-item-wrapper' id='tours_filter'>
            {currentransfers.map((item, index) => {
               var SubLocation=[];
               if(item.more_destination_details !==''){
                SubLocation=JSON.parse(item.more_destination_details);
               };
               var extra_Avline=[]
               if(item?.extras_Avline){
                extra_Avline = JSON.parse(item.extras_Avline);
              }
               var PopoverContent=item.more_destination_details !=='' ?(
                SubLocation.map((loc,index)=>{
                  return(
                  <div key={index} className="col-md-12">
                    <p className="fw-bold text-center">Destination {index+2}</p>
                    <p className="item-address"><strong className="text-dark">Pick-up : </strong>{loc.subLocationPic}</p>
                    <p className="item-address"><strong className="text-dark">Drop-off : </strong>{loc.subLocationdrop}</p>
                  </div>
                  )}) ):null;
              return(
              <div key={index} className='row'>
                <div className='col-md-12 mb-4'>
                  <div className='row parent_row pt-0'>
                    <div className='transfer-card-top'  style={{ background: 'aliceblue',justifyContent:'space-between' }}>
                        <h5 className='card-title m-2'>
                            {item.vehicle_Name}                       
                        </h5>
                        <h5 style={{color:'cadetblue'}} className='card-title m-2'>Type : {item?.TransferType ?item?.TransferType:item.transfer_type }</h5>
                     </div>
                    <div className="col-md-9 ">
                      <div className="row">
                        <div className='col-md-4 item-from'>
                          {/* <p className="text-center show-provider">{item.booking_From}</p> */}
                          <div>
                                <img
                                  className=''
                                  src={item.vehicle_image }
                                  alt=''
                                />
                          </div>
                        </div>
                        <div className='col-md-8'>
                          <p className='text-primary fw-bold mb-0'>
                          Pick-up Date : {moment(item.pickup_date).format('DD-MM-YYYY')}{' '}
                          </p>
                          <p className="fw-bold mt-0">Pick-Up Location</p>

                            <div class='item-address'>
                              <i class='awe-icon awe-icon-marker-2'>
                                <FontAwesomeIcon icon={faGlobe} />
                              </i>{' '}
                              {item.pickup_City}{' '}
                            </div>
                            <p className="fw-bold">Drop-Off Location</p>
                            <div class='item-address'>
                              <i class='awe-icon awe-icon-marker-2'>
                                <FontAwesomeIcon icon={faGlobe} />
                              </i>{' '}
                              {item.dropof_City}{' '}
                            </div>
                            { extra_Avline.length !==0 && (
                              <div>
                              <p className='text-center header__center fw-bold mt-2'>Extra</p>
                            
                             {extra_Avline.map((item1,index)=>(
                               <div key={index} className="row">
                                <div  className=' col-sm-12 col-12 col-md-8 col-lg-8 mt-1'> 
                                       <p class=''>{item1.Extras_Description}</p>
                                      
                                </div>
                                <div  className='col-sm-12 col-12 col-md-4 col-lg-4 mt-1'> 
                                
                                <p class=''>{CurrencyRates===undefined ? item.sale_currency:CurrencyRates.selectedcurrency} {renderPrice(Number(item1.Price))}</p>

                         </div>
                         </div>
                              ))}
                              
                              </div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-12 ">
                       <div class='row mt-3'>
                            {item.OccupancyFrom && (
                                <div className=' col-sm-6 col-6 col-md-3 col-lg-3 mt-1' >
                                      <div class='single-tour-feature d-flex align-items-center mb-3'>
                                        <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                                          <i class='fas fa-check'>
                                            <FontAwesomeIcon icon={faPerson} />
                                          </i>
                                        </div>
                                        <div class='single-feature-titles'>
                                          <p class='title fw-bold'>Capacity</p>
                                          <p class='title fw-bold mt-0'>{item.OccupancyFrom} to {item.OccupancyTo}</p>
                                        </div>
                                      </div>
                                </div>
                            )}
                            {item.SmallBagAllowance && (
                                <div className=' col-sm-6 col-6 col-md-3 col-lg-3 mt-1'>
                                      <div class='single-tour-feature d-flex align-items-center mb-3'>
                                        <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                                          <i class='fas fa-check'>
                                            <FontAwesomeIcon icon={faSuitcase} />
                                          </i>
                                        </div>
                                        <div class='single-feature-titles'>
                                          <p class='title fw-bold'>Baggages</p>
                                          <p class='title fw-bold mt-0'>{item.SmallBagAllowance} to {item.BigBagAllowance}</p>
                                        </div>
                                      </div>
                                </div>
                            )}
                            {item.duration && (
                                <div className=' col-sm-6 col-6 col-md-3 col-lg-3 mt-1'>
                                      <div class='single-tour-feature d-flex align-items-center mb-3'>
                                        <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                                          <i class='fas fa-check'>
                                            <FontAwesomeIcon icon={faClock} />
                                          </i>
                                        </div>
                                        <div class='single-feature-titles'>
                                          <p class='title fw-bold'>Duration</p>
                                          <p class='title fw-bold mt-0'>{item.duration} </p>
                                        </div>
                                      </div>
                                </div>
                            )}
                            {item.VehicleClass && (
                                <div className=' col-sm-6 col-6 col-md-3 col-lg-3 mt-1'>
                                      <div class='single-tour-feature d-flex align-items-center mb-3'>
                                        <div class='single-feature-icon icon-element ml-0 flex-shrink-0 mr-3'>
                                          <i class='fas fa-check'>
                                            <FontAwesomeIcon icon={faCar} />
                                          </i>
                                        </div>
                                        <div class='single-feature-titles'>
                                          <p class='title fw-bold'>Class</p>
                                          <p class='title fw-bold mt-0'>{Object.keys( item.VehicleClass).length === 0 ? item.VehicleMake: item.VehicleClass }</p>
                                        </div>
                                      </div>
                                </div>
                            )}
                       
                        </div>
                    </div>
                    </div>
                    <div className='col-md-3 text-center card-price-section  pt-2'>
                      {item.more_destination_details !=='' && (
                        <Whisper
                        placement="top"
                        trigger="click"
                        speaker={<Popover >{PopoverContent}</Popover>}
                      >
                       <h6 className='text-center m-2 p-view-detail' >
                        View Detail
                      </h6>
                      </Whisper>
                      )}
                    
                      <div className='price text-center p-card-price'>
                        <h6><super>{CurrencyRates===undefined ? item.sale_currency:CurrencyRates.selectedcurrency} {renderPrice(Number(item.total_fare_markup))}</super></h6>
                      </div>
                      <div className="mt-2" style={{ fontSize: '11px' }}>
                         <FontAwesomeIcon color='#bd1c1cc9' icon={faInfoCircle}/>{' '}
                            Inclusive of VAT and Taxes
                        </div>
                      <button
                        className='btn btn-primary select-styling search-btn1 form-control'
                        onClick={()=>BookTransfer(item.destination_id)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              )
             })}
          </div>
          <div className='row'>
          <div className='col-md-6 col-sm-12  col-12'>
             <div className='fw-bold  m-2'>Showing {startHotelIndex} to {endHotelIndex} of {props.TransferData.length} Transfers</div>                   
          </div>
          <div className='col-md-6 col-sm-12 col-12'>
          <Pagination aria-label="Page navigation example ">
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink previous onClick={() => paginate(validCurrentPage  - 1)} />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem disabled={currentPage === pagesCount}>
                  <PaginationLink next onClick={() => paginate(validCurrentPage  + 1)} />
                </PaginationItem>
              </Pagination>            
              </div>
        </div> 
        </div>
      </div>
      </>
    );
}

export default TransferCard;