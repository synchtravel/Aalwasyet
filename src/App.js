import 'bootstrap/dist/css/bootstrap.min.css';
import './Style/Style.css';
import './Style/Mediaquries.css'
import 'wowjs/css/libs/animate.css';
import 'animate.css';
 import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
 import Home from './Pages/Home/Home';
import Contact from './Pages/Contactus/Contact';
import About from './Pages/Aboutus/Aboutus';
import Umrahpackages from './Pages/UmrahPackages/UmrahPackages';
import InvoicePage from './Pages/UmrahPackages/Invoicepage';
import ViewDeail from './Pages/ViewDetail/ViewDetail';
import SearchTour from './Pages/SearchTour/SearchTour';
import Hotels from './Pages/Hotels/Hotel';
import HotelDetail from './Pages/Hotels/HotelDetail';
import BookRoom from './Pages/BookRoom/BookRoom';
import FlightCheckout from './Pages/Flight/FlightCheckout';
import BookPackage from './Pages/UmrahPackages/BookPackage';
import Confirmation from './Pages/BookingConfirmation/Confirmation';
import PackageCheckout from './Pages/UmrahPackages/Package_checkout';
import PackageInvoice2 from './Pages/UmrahPackages/PackageInvoice2';
import FlightListing from './Pages/Flight/FlightListing';
import FlightInvoice from './Pages/Flight/FlightInvoice';
import UmrahPackage2 from './Pages/UmrahPackages/umrahpackage2';
import FaqPage from './Pages/FooterPages/faqPage';
import PrivacyPolicy from './Pages/FooterPages/PrivacyPolicyPage';
import TermsConditions from './Pages/FooterPages/TermsConditions';
import ComplaintPolicy from './Pages/FooterPages/ComplaintPolicy';
import Activities from './Pages/Activities/Activities';
import ActivityDetail from './Pages/Activities/ActivityDetail';
import ActivityCheckout from './Pages/Activities/ActivityCheckout';
import ActivityInvoice from './Pages/Activities/ActivityInvoice';
import TransferListing from './Pages/Transfer/TransferListing';
import TransferCheckout from './Pages/Transfer/TransferCheckout';
import TransferInvoice from './Pages/Transfer/TransferInvoice';
import AboutSaudi from './Pages/KnowBeforeGo/AboutSaudi';
import TravelTips from './Pages/KnowBeforeGo/TravelTips';
import UsefulContacts from './Pages/KnowBeforeGo/UsefulContacts';
function App() {
  return (
   <>
   <Router>
    <Routes>
    
      <Route path="/" element={<Home />} />
      <Route path="/contact-us" element={<Contact />} />
      <Route path="/about-us" element={<About />} />
      {/* <Route path="/umrah-packages" element={<Umrahpackages />} /> */}
      <Route path="/umrah-package/:id" element={<ViewDeail />} />
      <Route path="/search-tour" element={<SearchTour />} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/hotel_detail/:id" element={<HotelDetail />} />
      <Route path="/hotel_checkout" element={<BookRoom />} />
      <Route path="/book_package" element={<BookPackage />} />
      <Route path="/package_invoice/:id" element={<InvoicePage />} />
      <Route path="/package_checkout" element={<PackageCheckout />} />
      <Route path="/umrah_packages" element={<UmrahPackage2 />} />
      <Route path="/invoice_package/:id/:id/:id" element={<PackageInvoice2 />} />
      <Route path="/Flight_search" element={<FlightListing />}  />
      <Route path="/Flight_checkout" element={<FlightCheckout />} />
      <Route path="/Flight_invoice/:id" element={<FlightInvoice />} />
      <Route path="/faqs" element={<FaqPage />} />
      <Route path="/complaint_policy" element={<ComplaintPolicy/>} />
      <Route path="/privacy_policy" element={<PrivacyPolicy/>} />
      <Route path="/terms_and_conditions" element={<TermsConditions/>} />
      <Route path="/hotel_booking_invoice/:id" element={<Confirmation />} />
      <Route path="/activities" element={<Activities />} />
      <Route path="/activity_details/:id" element={<ActivityDetail />} />
      <Route path="/activity_checkout" element={<ActivityCheckout />} />
      <Route path="/activity_invoice/:id" element={<ActivityInvoice />} />
      <Route path="/transfer-search" element={<TransferListing />} />
      <Route path="/transfer-checkout" element={<TransferCheckout />} />
      <Route path="/transfer_invoice/:id" element={<TransferInvoice />} />
      <Route path="/about_saudi" element={<AboutSaudi />} />
      <Route path="/travel_safety_tips" element={<TravelTips />} />
      <Route path="/useful_contacts" element={<UsefulContacts />} />
    </Routes>
   
    </Router>
   
   </>
  );
}

export default App;
