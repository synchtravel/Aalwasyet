import React, { useState } from 'react'
import Layout from '../../Components/Layout/Layout'
import { Accordion } from 'rsuite'
import img from './faq.jpg'
function FaqPage () {
 

  return (
    <>
    <Layout>
      <div>
        <img src={img} className='image-100'/>
      </div>
      <div className='container'>
      <section id='section-7 mt-5'>
        <h4 className='mt-5 flight-heading '>Frequently Asked Questions</h4>
        <Accordion>
    <Accordion.Panel header=" How can I book a trip with your agency?" defaultExpanded>
      <p>Easily book your trip by browsing our website for packages or deals that suit your needs. Once you've made your choice, follow the on-screen instructions to book, or contact us for personalized assistance.</p>
    </Accordion.Panel>
    <Accordion.Panel header="What payment methods do you accept?">
      <p>We accept major credit cards, debit cards, and PayPal. For specific payment options, please visit our payment information page.</p>
    </Accordion.Panel>
    <Accordion.Panel header="Can I cancel or change my booking?">
      <p>Yes, you can cancel or change your booking. Please note that terms and conditions apply, and fees may vary depending on the timing and nature of the changes. For detailed information, refer to our cancellation policy.</p>
    </Accordion.Panel>
    <Accordion.Panel header="Do you offer travel insurance?">
      <p>Yes, we offer comprehensive travel insurance options to cover medical expenses, trip cancellations, and more. For more details, please check our insurance page or contact us.</p>
    </Accordion.Panel>
    <Accordion.Panel header="How do I know my booking is confirmed?">
      <p>After completing your booking, you'll receive a confirmation email with all your trip details and a booking reference number. If you haven't received it, please check your spam folder or contact us.</p>
    </Accordion.Panel>
    <Accordion.Panel header="Can you accommodate special travel requests?">
      <p>Yes, we strive to accommodate special requests, including dietary restrictions, accessibility needs, or specific room requests. Please let us know your needs when booking.</p>
    </Accordion.Panel>
  </Accordion>
      </section>
      </div>
      </Layout>
    </>
  )
}

export default FaqPage
