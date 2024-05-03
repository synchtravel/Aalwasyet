import React,{useState,useEffect} from "react";
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SelectPackageData } from '../../Redux/Actions/actions'
import Layout from '../../Components/Layout/Layout';
import bgimage from '../../Images/Packages/kabapic.jpg'
import { ToastContainer, toast } from 'react-toastify';
function BookPackage(){
  var doublepax=0;
  var triplepax=0;
  var quadpax=0;
  var totalprice=0;
  var currency='';
  const dispatch = useDispatch();
  const navigate=useNavigate();

  const [roomData, setroomData] = useState({
        double: '',
        triple: '',
        quad: ''
      });
      const [grandtotal, setGrandtotal] = useState(null);
      const [showPackage, setShowPackage] = useState({double:false,triple:false,quad:false,without:false});
      const [doublePerson, setDublePerson] = useState({
        adultwith: '',
        childwith: '',
        infantwith: '',
       
      });
      const [triplePerson, setTriplePerson] = useState({
        adultwith: '',
        childwith: '',
        infantwith: '',
       
      });
      const [withoutAccPerson, setwithoutAccPerson] = useState({
        adult: '',
        child: '',
        infant: '',
       
      });
      const [withoutAccTotal, setwithoutAccTotal] = useState({
        adult: 0,
        child: 0,
        infant: 0,
       
      });
      const [quadPerson, setQuadPerson] = useState({
        adultwith: '',
        childwith: '',
        infantwith: '',
       
      });
      const [doubletotal, setDublettotal] = useState({
        adultwith: 0,
        childwith: 0,
        infantwith: 0,
       
      });
      const [tripletotal, setTripletotal] = useState({
        adultwith: 0,
        childwith: 0,
        infantwith: 0,
       
      });
      const [quadtotal, setquadtotal] = useState({
        adultwith: 0,
        childwith: 0,
        infantwith: 0,
        
      });
     
    const tourDetail = useSelector(state => state.hotels.viewtourdetail);
    useEffect(()=>{
      calculatetotal();
},[doubletotal,tripletotal,quadtotal,withoutAccTotal]);

const clearallvalue=(num)=>{
      if(num===2){
            setDublePerson({
              adultwith: '',
              childwith: '',
              infantwith: '',
              adultwithout: '',
              childwithout: '',
              infantwithout: ''
          });
          setDublettotal({
            adultwith: 0,
            childwith: 0,
            infantwith: 0,
            adultwithout: 0,
            childwithout: 0,
            infantwithout: 0
          });
      }else  if(num===3){
        setTriplePerson({
          adultwith: '',
          childwith: '',
          infantwith: '',
          adultwithout: '',
          childwithout: '',
          infantwithout: ''
      });
      setTripletotal({
        adultwith: 0,
        childwith: 0,
        infantwith: 0,
        adultwithout: 0,
        childwithout: 0,
        infantwithout: 0
      });
  }else  if(num===3){
    setQuadPerson({
      adultwith: '',
      childwith: '',
      infantwith: '',
      adultwithout: '',
      childwithout: '',
      infantwithout: ''
  });
  setquadtotal({
    adultwith: 0,
    childwith: 0,
    infantwith: 0,
    adultwithout: 0,
    childwithout: 0,
    infantwithout: 0
  });
}else if(num===5){
  setwithoutAccPerson({
    adult: '',
    child: '',
    infant: ''
});
setwithoutAccTotal({
  adult: 0,
  child: 0,
  infant: 0
});
    };
  }
    const handleAdultRoomChange = (event, price) => {
        var { name, value } = event.target
    
        if (name === 'double_rooms') {
          var adult = value * 2;
          if(adult >doublepax){
            toast.error('Exceeded PAX Limit', {
              position: toast.POSITION.TOP_RIGHT,
            });
          }else{
            setroomData(prevAdultRoom => ({
              ...prevAdultRoom,
              double: value
            }));
            setDublePerson(prevAdultRoom => ({
              ...prevAdultRoom,
              adultwith: adult
            }))
      
            var p = adult * price
            setDublettotal(prevAdultRoom => ({
              ...prevAdultRoom,
              adultwith: p
            }));
          }
           
        }else if(name === 'triple_rooms'){
          setroomData(prevAdultRoom => ({
            ...prevAdultRoom,
            triple: value
          }));
          
          var adult = value * 3
          setTriplePerson(prevAdultRoom => ({
            ...prevAdultRoom,
            adultwith: adult
          }))
    
          var p = adult * price
          setTripletotal(prevAdultRoom => ({
            ...prevAdultRoom,
            adultwith: p
          }));
        }else if(name === 'quad_rooms'){
          setroomData(prevAdultRoom => ({
            ...prevAdultRoom,
            quad: value
          }));
          
          var adult = value * 4
          setQuadPerson(prevAdultRoom => ({
            ...prevAdultRoom,
            adultwith: adult
          }))
    
          var p = adult * price
          setquadtotal(prevAdultRoom => ({
            ...prevAdultRoom,
            adultwith: p
          }));
        }
      };

      const handleAdultAdultChange = (event, price) => {
        
       
        var { name, value } = event.target;
        if (name === 'double_adult') {
          if(Number(value)>Number(roomData.double)*2){
            toast.error('Please enter adult as per your room selection.', {
              position: toast.POSITION.TOP_RIGHT,
            });
          }else{
            setDublePerson(prevAdultRoom => ({
              ...prevAdultRoom,
              adultwith: value
            }));
             // Maximum children that can be accommodated
            var p = value * price;
           
            setDublettotal(prevAdultRoom => ({
              ...prevAdultRoom,
              adultwith: p
            }));
          }
          
        }else if(name === 'triple_adult'){
          if(Number(value)>Number(roomData.triple)*3){
            toast.error('Please enter adult as per your room selection.', {
              position: toast.POSITION.TOP_RIGHT,
            });
          }else{
            setTriplePerson(prevAdultRoom => ({
              ...prevAdultRoom,
              adultwith: value
            }));
             // Maximum children that can be accommodated
            var p = value * price;
           
            setTripletotal(prevAdultRoom => ({
              ...prevAdultRoom,
              adultwith: p
            }));
          }
        }else if(name === 'quad_adult'){
          if(Number(value)>Number(roomData.quad)*4){
            toast.error('Please enter adult as per your room selection.', {
              position: toast.POSITION.TOP_RIGHT,
            });
          }else{
            setQuadPerson(prevAdultRoom => ({
              ...prevAdultRoom,
              adultwith: value
            }));
             // Maximum children that can be accommodated
            var p = value * price;
           
            setquadtotal(prevAdultRoom => ({
              ...prevAdultRoom,
              adultwith: p
            }));
          }
        }
        if(name==='double_child'){
        
          var check=Number(roomData.double)*2 - (Number(doublePerson.adultwith)+Number(value)+Number(doublePerson.infantwith));
          if(check>=0){
            setDublePerson(prevAdultRoom => ({
              ...prevAdultRoom,
              childwith: value
            }));
            var x = Number(value) * price;
            setDublettotal(prevAdultRoom => ({
              ...prevAdultRoom,
              childwith: x
            }));
          }else{
            var r=Number(roomData.double)*2 - (Number(doublePerson.adultwith)+Number(doublePerson.infantwith))
            toast.error('You can add only '+ r, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
         
        }else if(name==='triple_child'){
          var check=Number(roomData.triple)*3 - (Number(triplePerson.adultwith)+Number(value)+Number(triplePerson.infantwith));
          if(check>=0){
            setTriplePerson(prevAdultRoom => ({
              ...prevAdultRoom,
              childwith: value
            }));
            var x = Number(value) * price;
            setTripletotal(prevAdultRoom => ({
              ...prevAdultRoom,
              childwith: x
            }));
          }else{
            var r=Number(roomData.triple)*3 - (Number(triplePerson.adultwith)+Number(triplePerson.infantwith))
            toast.error('You can add only '+ r, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }else if(name==='quad_child'){
          var check=Number(roomData.quad)*4 - (Number(quadPerson.adultwith)+Number(value)+Number(quadPerson.infantwith));
          if(check>=0){
            setQuadPerson(prevAdultRoom => ({
              ...prevAdultRoom,
              childwith: value
            }));
            var x = Number(value) * price;
            setquadtotal(prevAdultRoom => ({
              ...prevAdultRoom,
              childwith: x
            }));
          }else{
            var r=Number(roomData.quad)*4 - (Number(quadPerson.adultwith)+Number(quadPerson.infantwith))
            toast.error('You can add only '+ r, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }
        if(name==='double_infant'){
          var check=Number(roomData.double)*2 - (Number(doublePerson.adultwith)+Number(value)+Number(doublePerson.childwith));
          if(check>=0){
          setDublePerson(prevAdultRoom => ({
            ...prevAdultRoom,
            infantwith: value
          }));
          var x = Number(value) * price;
          setDublettotal(prevAdultRoom => ({
            ...prevAdultRoom,
            infantwith: x
          }));
        }else{
          var r=Number(roomData.double)*2 - (Number(doublePerson.adultwith)+Number(doublePerson.childwith))
          toast.error('You can add only '+ r, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }else if(name==='triple_infant'){
        var check=Number(roomData.triple)*3 - (Number(triplePerson.adultwith)+Number(value)+Number(triplePerson.childwith));
        if(check>=0){
        setTriplePerson(prevAdultRoom => ({
          ...prevAdultRoom,
          infantwith: value
        }));
        var x = Number(value) * price;
        setTripletotal(prevAdultRoom => ({
          ...prevAdultRoom,
          infantwith: x
        }));
      }else{
        var r=Number(roomData.triple)*3 - (Number(triplePerson.adultwith)+Number(triplePerson.childwith))
        toast.error('You can add only '+ r, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      }else if(name==='quad_infant'){
        var check=Number(roomData.quad)*4 - (Number(quadPerson.adultwith)+Number(value)+Number(quadPerson.childwith));
        if(check>=0){
        setQuadPerson(prevAdultRoom => ({
          ...prevAdultRoom,
          infantwith: value
        }));
        var x = Number(value) * price;
        setquadtotal(prevAdultRoom => ({
          ...prevAdultRoom,
          infantwith: x
        }));
      }else{
        var r=Number(roomData.quad)*4 - (Number(quadPerson.adultwith)+Number(quadPerson.childwith))
        toast.error('You can add only '+ r, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      }
      };


      const withoutaccomodation=(e,price)=>{
        var {name,value} = e.target;
        if(name==='adult-without'){
            setwithoutAccPerson(prevvalue => ({
                ...prevvalue,
                adult: value
              }));
              var p = value * price;
              setwithoutAccTotal(prevvalue => ({
                ...prevvalue,
                adult: p
              }));
        }else if(name==='child-without'){
            setwithoutAccPerson(prevvalue => ({
                ...prevvalue,
                child: value
              }));
              var p = value * price;
              setwithoutAccTotal(prevvalue => ({
                ...prevvalue,
                child: p
              }));
        }else if(name==='infant-without'){
            setwithoutAccPerson(prevvalue => ({
                ...prevvalue,
                infant: value
              }));
              var p = value * price;
              setwithoutAccTotal(prevvalue => ({
                ...prevvalue,
                infant: p
              }));
        }
      };

      const calculatetotal =()=>{
        const sumdouble = Object.values(doubletotal).reduce((acc, value) => acc + value, 0);
        const sumtriple = Object.values(tripletotal).reduce((acc, value) => acc + value, 0);
        const sumquad = Object.values(quadtotal).reduce((acc, value) => acc + value, 0);
        const withouts = Object.values(withoutAccTotal).reduce((acc, value) => acc + value, 0);

        setGrandtotal(sumdouble+sumtriple+sumquad+withouts);
      };

      const selectedPackage=(e,num)=>{
        e.preventDefault();
        if(num===2){
          clearallvalue(num);
          setShowPackage(prevdata=>({
            ...prevdata,
            double:!showPackage.double
          }));
        };
        if(num===3){
          clearallvalue(num);
          setShowPackage(prevdata=>({
            ...prevdata,
            triple:!showPackage.triple
          }));
        };
        if(num===4){
          clearallvalue(num);
          setShowPackage(prevdata=>({
            ...prevdata,
            quad:!showPackage.quad
          }));
        };
        if(num===5){
          clearallvalue(num);
          setShowPackage(prevdata=>({
            ...prevdata,
            without:!showPackage.without
          }));
        };
      };

      const submitdata=async(event)=>{
        event.preventDefault();
        var double=0;
        var tripple=0;
        var quad=0;
        var data={
          "tourId": tourDetail.tours.tour_id,
          generate_id: Number(tourDetail.tours.generate_id),
          provider_id: '',
          name: tourDetail.tours.title,
          flight_id: tourDetail.tours.flight_id,
          adults: 0,
          agent_name: '-1',
          double_rooms: roomData.double,
          double_adults: doublePerson.adultwith,
          double_adult_total_without_dic: doubletotal.adultwith,
          double_adult_discount_type: 'amount',
          double_adult_disc: null,
          double_adult_disc_total: null,
          double_adult_total: doubletotal.adultwith,
          triple_rooms: roomData.triple,
          triple_adults: triplePerson.adultwith,
          triple_adult_total_without_dic: tripletotal.adultwith,
          triple_adult_discount_type: 'amount',
          triple_adult_disc: null,
          triple_adult_disc_total: null,
          triple_adult_total: tripletotal.adultwith,
          quad_rooms: roomData.quad,
          quad_adults: quadPerson.adultwith,
          quad_adult_total_without_dic: quadtotal.adultwith,
          quad_adult_discount_type: 'amount',
          quad_adult_disc: null,
          quad_adult_disc_total: null,
          quad_adult_total:quadtotal.adultwith,
          without_acc_adults: withoutAccPerson.adult,
          without_acc_adult_price: tourDetail.tours.without_acc_sale_price,
          without_acc_adult_total_without_dic: withoutAccTotal.adult,
          without_acc_adult_discount_type: 'amount',
          without_acc_adult_disc: null,
          without_acc_adult_disc_total: null,
          without_acc_adult_total:  withoutAccTotal.adult,
          adult_total_price: (Number(doubletotal.adultwith)+Number(tripletotal.adultwith)+Number(quadtotal.adultwith)+Number(withoutAccTotal.adult)),
          total_adults:(Number(doublePerson.adultwith)+Number(triplePerson.adultwith)+Number(quadPerson.adultwith)+Number(withoutAccPerson.adult)),
          children: withoutAccPerson.child,
          cost_price_child: tourDetail.tours.child_grand_total_cost_price,
          child_price:  tourDetail.tours.child_grand_total_sale_price,
          without_acc_child_total_without_dic: withoutAccTotal.child,
          without_acc_child_discount_type: 'amount',
          without_acc_child_disc: null,
          without_acc_child_disc_total: null,
          without_acc_child_total: withoutAccTotal.child,
          childs_sharing_price: [
            "{\"type\":\"double\",\"price\":983.14}",
            "{\"type\":\"triple\",\"price\":754.98}",
            "{\"type\":\"quad\",\"price\":640.92}",
          ],
          double_childs: doublePerson.childwith,
          double_child_price: (tourDetail.tours.double_grand_total_amount-(Number(tourDetail.tours.flights_per_person_price))+tourDetail.tours.child_flight_cost_price),
          double_child_total_without_dic: doubletotal.childwith,
          double_child_discount_type: 'amount',
          double_child_disc: 0,
          double_child_disc_total: null,
          double_childs_total: doubletotal.childwith,
          triple_childs: triplePerson.childwith,
          triple_child_price: (tourDetail.tours.triple_grand_total_amount-(Number(tourDetail.tours.flights_per_person_price))+tourDetail.tours.child_flight_cost_price),
          triple_child_total_without_dic: tripletotal.childwith,
          triple_child_discount_type: 'amount',
          triple_child_disc: 0,
          triple_child_disc_total: null,
          triple_childs_total:tripletotal.childwith,
          quad_childs: quadPerson.childwith,
          quad_child_price: (tourDetail.tours.quad_grand_total_amount-(Number(tourDetail.tours.flights_per_person_price))+tourDetail.tours.child_flight_cost_price),
          quad_child_total_without_dic: quadtotal.childwith,
          quad_child_discount_type: 'amount',
          quad_child_disc: 0,
          quad_child_disc_total: null,
          quad_child_total: quadtotal.childwith,
          child_total_price:  (Number(doubletotal.childwith)+Number(tripletotal.childwith)+Number(quadtotal.childwith)+Number(withoutAccTotal.child)),
          total_childs:  (Number(doublePerson.childwith)+Number(triplePerson.childwith)+Number(quadPerson.childwith)+Number(withoutAccPerson.child)),
          infants:withoutAccPerson.infant,
          cost_price_infant: tourDetail.tours.infant_total_cost_price,
          infant_price: tourDetail.tours.infant_total_sale_price,
          infant_sharing_price: [
            "{\"type\":\"double\",\"price\":883.14}",
            "{\"type\":\"triple\",\"price\":654.98}",
            "{\"type\":\"quad\",\"price\":540.92}",
          ],
          without_acc_infant_total_without_dic:withoutAccTotal.infant,
          without_acc_infant_discount_type: 'amount',
          without_acc_infant_disc: null,
          without_acc_infant_disc_total: null,
          without_acc_infant_total:withoutAccTotal.infant,
          double_infant: doublePerson.infantwith,
          double_infant_price: (tourDetail.tours.double_grand_total_amount-(Number(tourDetail.tours.flights_per_person_price))+tourDetail.tours.infant_flight_cost),
          double_infant_total_without_dic:doubletotal.infantwith,
          double_infant_discount_type: 'amount',
          double_infant_disc: 0,
          double_infant_disc_total: null,
          double_infant_total:doubletotal.infantwith,
          triple_infant: triplePerson.infantwith,
          triple_infant_price: (tourDetail.tours.triple_grand_total_amount-(Number(tourDetail.tours.flights_per_person_price))+tourDetail.tours.infant_flight_cost),
          triple_infant_total_without_dic: tripletotal.infantwith,
          triple_infant_discount_type: 'amount',
          triple_infant_disc: 0,
          triple_infant_disc_total: null,
          triple_infant_total: tripletotal.infantwith,
          quad_infant: quadPerson.infantwith,
          quad_infant_price:(tourDetail.tours.quad_grand_total_amount-(Number(tourDetail.tours.flights_per_person_price))+tourDetail.tours.infant_flight_cost),
          quad_infant_total_without_dic: quadtotal.infantwith,
          quad_infant_discount_type: 'amount',
          quad_infant_disc: 0,
          quad_infant_disc_total: null,
          quad_infant_total: quadtotal.infantwith,
          infant_total_total:  (Number(doubletotal.infantwith)+Number(tripletotal.infantwith)+Number(quadtotal.infantwith)+Number(withoutAccTotal.infant)),
          total_Infants: (Number(doublePerson.infantwith)+Number(triplePerson.infantwith)+Number(quadPerson.infantwith)+Number(withoutAccPerson.infant)),
          agent_info: null,
          Agent_commission_info: null,
          agent_commission_type: 'amount',
          agent_commission_enter: null,
          agent_commsion_am: null,
          agent_commsion_add_total: null,
          customer_book: null,
          total_double_pax:double=Number(doublePerson.adultwith) + Number(doublePerson.childwith) + Number(doublePerson.infantwith),
          total_triple_pax: tripple= Number(triplePerson.adultwith) + Number(triplePerson.childwith) + Number(triplePerson.infantwith),
          total_quad_pax: quad= Number(quadPerson.adultwith) + Number(quadPerson.childwith) + Number(quadPerson.infantwith),
          total_pax:double+tripple+quad,
          sigle_price: null,
          cost_price: 0,
          discount_type: 'amount',
          discount_enter_am: null,
          discount_Price: 0,
          markup_Price: 0,
          tour_total_price: grandtotal,
          price_without_disc: grandtotal,
          price: grandtotal,
          total_service_price: 0,
          sharing2: tourDetail.tours.double_grand_total_amount,
          sharing3: tourDetail.tours.triple_grand_total_amount,
          sharing4: tourDetail.tours.quad_grand_total_amount,
          without_acc_sale_price: tourDetail.tours.without_acc_sale_price,
          sharingSelect: null,
          image: tourDetail.tours.visa_image,
          currency:tourDetail.tours.currency_symbol,
          pakage_type: 'tour',
          Additional_services_names: null,
          services_persons: null,
          services_price: 0,
          service_day: 0,
          service_dates: null,
          Additional_services_names_more: null,
          services_persons_more: null,
          services_price_more: [],
          services_days_more: [],
          services_dates_more: [],
          cancellation_policy:tourDetail.tours.cancellation_policy,
          checkout_message:tourDetail.tours.checkout_message ,
          discount_price_on_all: null,
        };
        dispatch(SelectPackageData(data));
            navigate('/package_checkout');

      };
    return(
        <>
        <Layout>
        <ToastContainer/>
        <div className='contact-img'>
          <img src={bgimage}/>
        </div>
         <div className='container mt-3'>
              <div className='text-center'>
                <h4 className='flight-heading'>Select Package  </h4>
              </div>
              <div class='box-top'>
                <div class='row'>
                  <div class='col-sm-12'>
                    <div class='invisible-checkboxes'>
                      <label class='checkbox-alias' for='dbl'>
                       
                      
                        <ul className="inline-list">
                          <li> Adult Price : {tourDetail.tours.currency_symbol}  {tourDetail.tours.double_grand_total_amount}</li>
                          <li> Child Price : {tourDetail.tours.currency_symbol} {tourDetail.tours.double_grand_total_amount-(Number(tourDetail.tours.flights_per_person_price))+tourDetail.tours.child_flight_cost_price}</li>
                          <li>  Infant Price : {tourDetail.tours.currency_symbol} {tourDetail.tours.double_grand_total_amount-(Number(tourDetail.tours.flights_per_person_price))+tourDetail.tours.infant_flight_cost}</li>
                          <li>  Space : {doublepax=tourDetail.tours.available_double_seats} pax</li>
                          <li>  <span>
                        
                            <label class={`btn btn-default fw-bold mt-2 ${showPackage.double ? ' umrah-package-modal-checkbox2' : ' umrah-package-modal-checkbox'} select-room--checkbox info`}
                            onClick={(event) =>
                              selectedPackage(event,2)
                            }>
                              <i class='fa fa-fw'></i>
                              <input
                                id='0'
                                autocomplete='off'
                                class='room-check'
                                type='checkbox'
                                checked={showPackage.double}
                                onChange={() => {}}
                              />
                              Select Double
                            </label>
                          
                        </span></li>
                        </ul>
                       
                       
                      </label>
                    </div>
                  </div>
                  <div class='col-sm-12 item-from dbl box'>
                    {showPackage.double && (
                    <div class='row p-1'>
                      <div class='col-sm-7 offset-md-2 room-filed-top mt-1'>
                        <div class='row'>
                          <div class='col-sm-6'>
                            <label>
                              <i class='fa fa-bed' aria-hidden='true'></i> Rooms
                            </label>
                            <input
                              type='number'
                              placeholder='Enter Rooms'
                              name='double_rooms'
                              value={roomData.double}
                              onChange={(event) => handleAdultRoomChange(event, tourDetail.tours.double_grand_total_amount)}
                              id='double_rooms'
                              min={0}
                              class='form-control form-control-sm'
                            />
                          </div>
                          <div class='col-sm-6'>
                            <label>
                              {' '}
                              <i class='fa fa-user' aria-hidden='true'></i>{' '}
                              Adults
                            </label>
                            <input
                              type='number'
                              name='double_adult'
                               value={doublePerson.adultwith}
                               disabled={roomData.double === '' || roomData.double === 0 ? 'true' : ''}
                               onChange={(event) => handleAdultAdultChange(event, tourDetail.tours.double_grand_total_amount)}
                              placeholder='Enter Adults'
                              id='double_adult'
                              min={0}
                              class='form-control form-control-sm'
                            />
                          </div>
                        </div>
                      </div>
                      <div class='col-sm-3 mt-1 fw-bold'>
                        <label>Price</label> <br />
                        {tourDetail.tours.currency_symbol}  {doubletotal.adultwith}
                      </div>
                      <div class='col-sm-7 offset-md-2 room-filed-top mt-1'>
                        <div class='row'>
                          <div class='col-sm-6'>
                            <label>
                              {' '}
                              <i class='fa fa-user' aria-hidden='true'></i>{' '}
                              Child with Accomodation
                            </label>
                          </div>
                          <div class='col-sm-6'>
                            <input
                              type='number'
                              name='double_child'
                              value={doublePerson.childwith}
                              onChange={(event) => handleAdultAdultChange(event, tourDetail.tours.double_grand_total_amount-(Number(tourDetail.tours.flights_per_person_price))+tourDetail.tours.child_flight_cost_price)}
                              placeholder='Enter Children'
                              id='double_adult'
                              disabled={Number(roomData.double) * 2  - (Number(doublePerson.adultwith)+Number(doublePerson.infantwith)) < 1 } 
                              min={0}
                              class='form-control form-control-sm'
                            />
                          </div>
                        </div>
                      </div>
                      <div class='col-sm-3 mt-1 fw-bold'>
                      {tourDetail.tours.currency_symbol} {doubletotal.childwith}
                      </div>
                      <div class='col-sm-7 offset-md-2 room-filed-top mt-1'>
                        <div class='row'>
                          <div class='col-sm-6'>
                            <label>
                              {' '}
                              <i class='fa fa-user' aria-hidden='true'></i>{' '}
                              infant with Accomodation
                            </label>
                          </div>
                          <div class='col-sm-6'>
                            <input
                              type='number'
                              name='double_infant'
                              value={doublePerson.infantwith}
                              onChange={(event) => handleAdultAdultChange(event, tourDetail.tours.double_grand_total_amount-(Number(tourDetail.tours.flights_per_person_price))+tourDetail.tours.infant_flight_cost)}
                              placeholder='Enter infant'
                              id='double_adult'
                              disabled={Number(roomData.double) * 2  - (Number(doublePerson.adultwith)+Number(doublePerson.childwith)) < 1 }
                              min={0}
                              class='form-control form-control-sm'
                            />
                          </div>
                        </div>
                      </div>
                      <div class='col-sm-3 mt-1 fw-bold'>
                      {tourDetail.tours.currency_symbol} {doubletotal.infantwith}
                      </div>
                    </div>
                    )}
                  </div>
                </div>
              </div>
              <div class='box-top'>
                <div class='row'>
                  <div class='col-sm-12'>
                    <div class='invisible-checkboxes'>
                      <label class='checkbox-alias' for='dbl'>
                      <ul className="inline-list">
                       <li> Adult Price : {tourDetail.tours.currency_symbol} {tourDetail.tours.triple_grand_total_amount}</li>
                       <li> Child Price :  {tourDetail.tours.currency_symbol} {tourDetail.tours.triple_grand_total_amount-(Number(tourDetail.tours.flights_per_person_price))+tourDetail.tours.child_flight_cost_price}</li>
                       <li>Infant Price : {tourDetail.tours.currency_symbol} {tourDetail.tours.triple_grand_total_amount-(Number(tourDetail.tours.flights_per_person_price))+tourDetail.tours.infant_flight_cost}</li>
                       <li> Space : {triplepax= tourDetail.tours.available_triple_seats} pax</li>
                       <li><label class={`btn btn-default fw-bold mt-2 ${showPackage.triple ? ' umrah-package-modal-checkbox2' : ' umrah-package-modal-checkbox'}  select-room--checkbox info`}
                            onClick={(event) =>
                              selectedPackage(event,3)
                            }>
                              <i class='fa fa-fw'></i>
                              <input
                                id='0'
                                autocomplete='off'
                                class='room-check'
                                type='checkbox'
                                checked={showPackage.triple}
                                onChange={() => {}}
                              />
                              Select Triple
                            </label></li>
                        </ul>

                      </label>
                    </div>
                  </div>
                  <div class='col-sm-12 item-from dbl box'>
                  {showPackage.triple && (
                    <div class='row p-1'>
                      <div class='col-sm-7 offset-md-2 room-filed-top  mt-1'>
                        <div class='row'>
                          <div class='col-sm-6'>
                            <label>
                              <i class='fa fa-bed' aria-hidden='true'></i> Rooms
                            </label>
                            <input
                              type='number'
                              placeholder='Enter Rooms'
                              name='triple_rooms'
                              value={roomData.triple}
                              onChange={(event) => handleAdultRoomChange(event, tourDetail.tours.triple_grand_total_amount)}
                              id='double_rooms'
                              min={0}
                              class='form-control form-control-sm'
                            />
                          </div>
                          <div class='col-sm-6'>
                            <label>
                              {' '}
                              <i class='fa fa-user' aria-hidden='true'></i>{' '}
                              Adults
                            </label>
                            <input
                              type='number'
                              name='triple_adult'
                               value={triplePerson.adultwith}
                               disabled={roomData.triple === '' || roomData.triple === 0 ? 'true' : ''}
                               onChange={(event) => handleAdultAdultChange(event, tourDetail.tours.triple_grand_total_amount)}
                              placeholder='Enter Adults'
                              min={0}
                              class='form-control form-control-sm'
                            />
                          </div>
                        </div>
                      </div>
                      <div class='col-sm-3 mt-1 fw-bold'>
                        <label>Price</label> <br />
                        {tourDetail.tours.currency_symbol} {tripletotal.adultwith}
                      </div>
                      {/* <div class='col-sm-9 mt-1'>
                        <div class='row'>
                          <div class='col-sm-7'>
                            <label>
                              <i class='fa fa-user' aria-hidden='true'></i>{' '}
                              Adult without Accomodation ({tourDetail.tours.currency_symbol} {tourDetail.tours.without_acc_sale_price})
                            </label>
                          </div>
                          <div class='col-sm-5'>
                            <input
                              type='number'
                              name='triple_adult-without'
                              value={triplePerson.adultwithout}
                              onChange={(event)=>withoutaccomodation(event,tourDetail.tours.without_acc_sale_price)}
                              placeholder='Enter Adults'
                              min={0}
                              class='form-control form-control-sm'
                            />
                          </div>
                        </div>
                      </div> */}
                      {/* <div class='col-sm-3 mt-1 fw-bold'>
                         {tourDetail.tours.currency_symbol} {tripletotal.adultwithout}
                      </div> */}
                      <div class='col-sm-7 offset-md-2 room-filed-top mt-1'>
                        <div class='row'>
                          <div class='col-sm-6'>
                            <label>
                              {' '}
                              <i class='fa fa-user' aria-hidden='true'></i>{' '}
                              Child with Accomodation
                            </label>
                          </div>
                          <div class='col-sm-6'>
                            <input
                              type='number'
                              name='triple_child'
                              value={triplePerson.childwith}
                              onChange={(event) => handleAdultAdultChange(event, tourDetail.tours.triple_grand_total_amount-(Number(tourDetail.tours.flights_per_person_price))+tourDetail.tours.child_flight_cost_price)}
                              placeholder='Enter Children'
                              disabled={Number(roomData.triple) * 3  - (Number(triplePerson.adultwith)+Number(triplePerson.infantwith)) < 1 } 
                              min={0}
                              class='form-control form-control-sm'
                            />
                          </div>
                        </div>
                      </div>
                      <div class='col-sm-3 mt-1 fw-bold'>
                      {tourDetail.tours.currency_symbol} {tripletotal.childwith}
                      </div>
                      {/* <div class='col-sm-9 mt-1'>
                        <div class='row'>
                          <div class='col-sm-7'>
                            <label>
                              {' '}
                              <i class='fa fa-user' aria-hidden='true'></i>{' '}
                              Child without Accomodation ({tourDetail.tours.currency_symbol} {tourDetail.tours.child_grand_total_sale_price})
                            </label>
                          </div>
                          <div class='col-sm-5'>
                            <input
                              type='number'
                              name='triple_child-without'
                              value={triplePerson.childwithout}
                              onChange={(event)=>withoutaccomodation(event,tourDetail.tours.child_grand_total_sale_price)}
                              placeholder='Enter Children'
                              min={0}
                              class='form-control form-control-sm'
                            />
                          </div>
                        </div>
                      </div>
                      <div class='col-sm-3 mt-1 fw-bold'>
                         {tourDetail.tours.currency_symbol} {tripletotal.childwithout}
                      </div> */}
                      <div class='col-sm-7 offset-md-2 room-filed-top mt-1'>
                        <div class='row'>
                          <div class='col-sm-6'>
                            <label>
                              {' '}
                              <i class='fa fa-user' aria-hidden='true'></i>{' '}
                              infant with Accomodation
                            </label>
                          </div>
                          <div class='col-sm-6'>
                            <input
                              type='number'
                              name='triple_infant'
                              value={triplePerson.infantwith}
                              onChange={(event) => handleAdultAdultChange(event, tourDetail.tours.triple_grand_total_amount-(Number(tourDetail.tours.flights_per_person_price))+tourDetail.tours.infant_flight_cost)}
                              placeholder='Enter infant'
                              disabled={Number(roomData.triple) * 3  - (Number(triplePerson.adultwith)+Number(triplePerson.childwith)) < 1 }
                              min={0}
                              class='form-control form-control-sm'
                            />
                          </div>
                        </div>
                      </div>
                      <div class='col-sm-3 mt-1 fw-bold'>
                      {tourDetail.tours.currency_symbol} {tripletotal.infantwith}
                      </div>
                      {/* <div class='col-sm-9 mt-1'>
                        <div class='row'>
                          <div class='col-sm-7'>
                            <label>
                              {' '}
                              <i class='fa fa-user' aria-hidden='true'></i>{' '}
                              infant without Accomodation ({tourDetail.tours.currency_symbol} {tourDetail.tours.infant_total_sale_price})
                            </label>
                          </div>
                          <div class='col-sm-5'>
                            <input
                              type='number'
                              name='triple_infant-without'
                              value={triplePerson.infantwithout}
                              onChange={(event)=>withoutaccomodation(event,tourDetail.tours.infant_total_sale_price)}
                              min={0}
                              placeholder='Enter infant'
                              id='double_adult'
                              class='form-control form-control-sm'
                            />
                          </div>
                        </div>
                      </div>
                      <div class='col-sm-3 mt-1 fw-bold'>
                         {tourDetail.tours.currency_symbol} {tripletotal.infantwithout}
                      </div> */}
                    </div>
                  )}
                  </div>
                </div>
              </div>
              <div class='box-top'>
                <div class='row'>
                  <div class='col-sm-12'>
                    <div class='invisible-checkboxes'>
                      <label class='checkbox-alias' for='dbl'>
                      <ul className="inline-list">
                        <li> Adult Price : {tourDetail.tours.currency_symbol} {tourDetail.tours.quad_grand_total_amount}</li>
                        <li> Child Price :  {tourDetail.tours.currency_symbol} {tourDetail.tours.quad_grand_total_amount-(Number(tourDetail.tours.flights_per_person_price))+tourDetail.tours.child_flight_cost_price}</li>
                        <li> Infant Price : {tourDetail.tours.currency_symbol} {tourDetail.tours.quad_grand_total_amount-(Number(tourDetail.tours.flights_per_person_price))+tourDetail.tours.infant_flight_cost}</li>
                        <li> Space : {quadpax= tourDetail.tours.available_quad_seats} pax</li>
                        <li>  <label class={`btn btn-default fw-bold mt-2 ${showPackage.quad ? ' umrah-package-modal-checkbox2' : ' umrah-package-modal-checkbox'}  select-room--checkbox info`}
                            onClick={(event) =>
                              selectedPackage(event,4)
                            }>
                              <i class='fa fa-fw'></i>
                              <input
                                id='0'
                                autocomplete='off'
                                class='room-check'
                                type='checkbox'
                                checked={showPackage.quad}
                                onChange={() => {}}
                              />
                              Select Quad
                            </label></li>
                        </ul>
                        
                      </label>
                    </div>
                  </div>
                  <div class='col-sm-12 item-from dbl box'>
                  {showPackage.quad && (
                    <div class='row p-1'>
                      <div class='col-sm-7 offset-md-2 room-filed-top mt-1'>
                        <div class='row'>
                          <div class='col-sm-6'>
                            <label>
                              <i class='fa fa-bed' aria-hidden='true'></i> Rooms
                            </label>
                            <input
                              type='number'
                              placeholder='Enter Rooms'
                              name='quad_rooms'
                              value={roomData.quad}
                              onChange={(event) => handleAdultRoomChange(event, tourDetail.tours.quad_grand_total_amount)}
                              min={0}
                              class='form-control form-control-sm'
                            />
                          </div>
                          <div class='col-sm-6'>
                            <label>
                              {' '}
                              <i class='fa fa-user' aria-hidden='true'></i>{' '}
                              Adults
                            </label>
                            <input
                              type='number'
                              name='quad_adult'
                               value={quadPerson.adultwith}
                               disabled={roomData.quad === '' || roomData.quad === 0 ? 'true' : ''}
                               onChange={(event) => handleAdultAdultChange(event, tourDetail.tours.quad_grand_total_amount)}
                              placeholder='Enter Adults'
                              min={0}
                              class='form-control form-control-sm'
                            />
                          </div>
                        </div>
                      </div>
                      <div class='col-sm-3 mt-1 fw-bold'>
                        <label>Price</label> <br />
                        {tourDetail.tours.currency_symbol} {quadtotal.adultwith}
                      </div>
                      
                      <div class='col-sm-7 offset-md-2 room-filed-top mt-1'>
                        <div class='row'>
                          <div class='col-sm-6'>
                            <label>
                              {' '}
                              <i class='fa fa-user' aria-hidden='true'></i>{' '}
                              Child with Accomodation
                            </label>
                          </div>
                          <div class='col-sm-6'>
                            <input
                              type='number'
                              name='quad_child'
                              value={quadPerson.childwith}
                              onChange={(event) => handleAdultAdultChange(event, tourDetail.tours.quad_grand_total_amount-(Number(tourDetail.tours.flights_per_person_price))+tourDetail.tours.child_flight_cost_price)}
                              placeholder='Enter Children'
                              disabled={Number(roomData.quad) * 4  - (Number(quadPerson.adultwith)+Number(quadPerson.infantwith)) < 1 } 
                              min={0}
                              class='form-control form-control-sm'
                            />
                          </div>
                        </div>
                      </div>
                      <div class='col-sm-3 mt-1 fw-bold'>
                      {tourDetail.tours.currency_symbol} {quadtotal.childwith}
                      </div>
                     
                      <div class='col-sm-7 offset-md-2 room-filed-top mt-1'>
                        <div class='row'>
                          <div class='col-sm-6'>
                            <label>
                              {' '}
                              <i class='fa fa-user' aria-hidden='true'></i>{' '}
                              infant with Accomodation
                            </label>
                          </div>
                          <div class='col-sm-6'>
                            <input
                              type='number'
                              name='quad_infant'
                              value={quadPerson.infantwith}
                              onChange={(event) => handleAdultAdultChange(event, tourDetail.tours.quad_grand_total_amount-(Number(tourDetail.tours.flights_per_person_price))+tourDetail.tours.infant_flight_cost)}
                              placeholder='Enter infant'
                              disabled={Number(roomData.quad) * 4  - (Number(quadPerson.adultwith)+Number(quadPerson.childwith)) < 1 }
                              min={0}
                              class='form-control form-control-sm'
                            />
                          </div>
                        </div>
                      </div>
                      <div class='col-sm-3 mt-1 fw-bold'>
                      {tourDetail.tours.currency_symbol} {quadtotal.infantwith}
                      </div>
                    
                    </div>
                  )}
                  </div>
                </div>
              </div>
              <div class='box-top'>
                <div class='row'>
                  <div class='col-sm-12'>
                    <div class='invisible-checkboxes'>
                      <label class='checkbox-alias' for='dbl'>

                      <ul className="inline-list">
                        <li> Adult Price : {tourDetail.tours.currency_symbol} {tourDetail.tours.without_acc_sale_price}</li>
                        <li> Child Price :  {tourDetail.tours.currency_symbol} {tourDetail.tours.child_grand_total_sale_price}</li>
                        <li> Infant Price : {tourDetail.tours.currency_symbol} {tourDetail.tours.infant_total_sale_price}</li>
                     
                        <li>  <label class={`btn btn-default fw-bold mt-2 ${showPackage.without ? ' umrah-package-modal-checkbox2' : ' umrah-package-modal-checkbox'}  select-room--checkbox info`}
                            onClick={(event) =>
                              selectedPackage(event,5)
                            }>
                              <i class='fa fa-fw'></i>
                              <input
                                id='0'
                                autocomplete='off'
                                class='room-check'
                                type='checkbox'
                                checked={showPackage.without}
                                onChange={() => {}}
                              />
                              Without Accomodation
                            </label></li>

                        </ul>
                      
                      
                      </label>
                    </div>
                  </div>
                  <div class='col-sm-12 item-from dbl box'>
                  {showPackage.without && (
                    <div class='row p-1'>
                      <div class='col-sm-7 offset-md-2 room-filed-top mt-2'>
                        <div class='row'>
                          <div class='col-sm-6'>
                            <label>
                              <i class='fa fa-user' aria-hidden='true'></i>{' '}
                              Adult without Accomodation 
                            </label>
                          </div>
                          <div class='col-sm-6'>
                            <input
                              type='number'
                              name='adult-without'
                              value={withoutAccPerson.adult}
                              onChange={(event)=>withoutaccomodation(event,tourDetail.tours.without_acc_sale_price)}
                              placeholder='Enter Adults'
                              min={0}
                              class='form-control form-control-sm'
                            />
                          </div>
                        </div>
                      </div>
                      <div class='col-sm-3 mt-1 fw-bold'>
                      {tourDetail.tours.currency_symbol} {withoutAccTotal.adult}
                      </div>
                      <div class='col-sm-7 offset-md-2 room-filed-top mt-2'>
                        <div class='row'>
                          <div class='col-sm-6'>
                            <label>
                              {' '}
                              <i class='fa fa-user' aria-hidden='true'></i>{' '}
                              Child without Accomodation 
                            </label>
                          </div>
                          <div class='col-sm-6'>
                            <input
                              type='number'
                              name='child-without'
                              value={withoutAccPerson.child}
                              onChange={(event)=>withoutaccomodation(event,tourDetail.tours.child_grand_total_sale_price)}
                              placeholder='Enter Children'
                              min={0}
                              class='form-control form-control-sm'
                            />
                          </div>
                        </div>
                      </div>
                      <div class='col-sm-3 mt-1 fw-bold'>
                      {tourDetail.tours.currency_symbol} {withoutAccTotal.child}
                      </div>
                      <div class='col-sm-7 offset-md-2 room-filed-top mt-2'>
                        <div class='row'>
                          <div class='col-sm-6'>
                            <label>
                              {' '}
                              <i class='fa fa-user' aria-hidden='true'></i>{' '}
                              infant without Accomodation 
                            </label>
                          </div>
                          <div class='col-sm-5'>
                            <input
                              type='number'
                              name='infant-without'
                              value={withoutAccPerson.infant}
                              onChange={(event)=>withoutaccomodation(event,tourDetail.tours.infant_total_sale_price)}
                              min={0}
                              placeholder='Enter infant'
                              id='double_adult'
                              class='form-control form-control-sm'
                            />
                          </div>
                        </div>
                      </div>
                      <div class='col-sm-3 mt-1 fw-bold'>
                      {tourDetail.tours.currency_symbol} {withoutAccTotal.infant}
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              </div>
              <div className='row mt-3'>
                <div className="col-md-6 order-2 bookpacakge-bottom order-md-1">
                <button style={{width:'70%'}} onClick={(event)=>submitdata(event)}  className='btn btn-primary btn-block select-styling search-btn1'>
                   Proceed To Checkout
                 </button>
                </div>
                <div className="col-md-6 order-1 bookpacakge-bottom order-md-2">
                    <div className=" package-total"><h4>Grand Total : {tourDetail.tours.currency_symbol} {grandtotal}</h4></div>

                </div>
              </div>
            </div>
            </Layout>
        </>
    );
}

export default BookPackage;