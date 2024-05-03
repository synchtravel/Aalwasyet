import React, { useState } from 'react'
function Faqs () {
  const [activeIndex, setActiveIndex] = useState(null)

  const OpenFAQ = index => {
    const buttons = document.getElementsByClassName('accordion2')
    const panel = buttons[index].nextElementSibling
    buttons[index].classList.toggle('active-2')

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px'
    }

    // Remove "active" class from other buttons
    for (let i = 0; i < buttons.length; i++) {
      if (i !== index) {
        buttons[i].classList.remove('active-2')
        buttons[i].nextElementSibling.style.maxHeight = null
      }
    }
  };

  return (
    <>
      <div className='container'>
      <section id='section-7 mt-5'>
        <h4 className='mt-5 flight-heading '>Frequently Asked Questions</h4>
        <button
          className={` accordion2 mt-4 ${activeIndex === 7 ? 'active' : ''}`}
          onClick={() => OpenFAQ(0)}
        >
         How do I pay?
        </button>
        <div className='panel'>
          <p className='mt-2 mb-2'>
          Once you have chosen the service and provided information about yourself and other participants, you will be able to pay for your reservation by any convenient way through a secure payment system. Our payment system accepts cards from any banks and countries. The amount of prepayment is determined by the conditions of a Travel Expert. The day before the tour you need to pay for the tour in full (unless otherwise stated in the information about the tour). If you have any difficulties with payment, please contact our manager.
          </p>
        </div>

        <button
          className={`accordion2 ${activeIndex === 8 ? 'active' : ''}`}
          onClick={() => OpenFAQ(1)}
        >
         Why should I book through Alhijaz Tours?
        </button>
        <div class='panel'>
          <p className='mt-2 mb-2'>
          By booking a tour through Alhijaz Tours you can:
                            Choose from more than 42,000 tours designed by certified travel experts and presented on the same platform;
                            Avoid paying additional fees and tour commissions as the best price is offered by a travel expert directly;
                            Communicate directly with travel experts and get answer to any question you might have immediately;
                            Pay online for services through a reliable and safe payment system;
                            We are happy to help travelers to choose the best tour and to ensure that it is safe and memorable.
                            This is our main goal that we work on every day while adhering to our principles.
          </p>
        </div>

        <button
          className={` accordion2 ${activeIndex === 9 ? 'active' : ''}`}
          onClick={() => OpenFAQ(2)}
        >
          Why do I need to go on a group tour?
        </button >
        <div class='panel'>
          <p className='mt-2 mb-2'>
          Traveling in a small group gives you the opportunity to meet people from a different culture, both in the country you are visiting and within your travel group. Usually travelers get so close that they become lifelong friends and continue to travel together. A small group saves you time and money on the one hand, and saves you stressful planning on the other. Travel expert has already booked transport, accommodation and program for you, you just need to be at the start of your trip and enjoy the trip, and the rest will be taken care of by Travel expert. In addition, an active journey organized in advance allows you to calculate your vacation dates in advance, saving money.
          </p>
        </div>
        <button
          className={` accordion2 ${activeIndex === 10 ? 'active' : ''}`}
          onClick={() => OpenFAQ(3)}
        >
          Are the flights included?
        </button >
        <div class='panel'>
          <p className='mt-2 mb-2'>
          To find out whether flights are included in your tour, go to "What is included" on the tour page. If the air tickets are not included, you can calculate the approximate price on the tour page in the 'Air tickets' section.
          </p>
        </div>
        <button
          className={` accordion2 ${activeIndex === 11 ? 'active' : ''}`}
          onClick={() => OpenFAQ(4)}
        >
         What happens after the payment?
        </button >
        <div class='panel'>
          <p className='mt-2 mb-2'>
          Once the deposit has been paid, a confirmation of the transaction and a detailed booking confirmation with further instructions will be sent to the e-mail address provided upon registration at Alhijaz Tours.
          </p>
        </div>

        <button
          className={`accordion2 ${activeIndex === 12 ? 'active' : ''}`}
          onClick={() => OpenFAQ(5)}
        >
        When do I get my refund?
        </button >
        <div class='panel'>
          <p className='mt-2 mb-2'>
          The refund process can take up to 30 calendar days, but it usually takes 7 days.
          </p>
        </div>

        <button
          className={` accordion2 ${activeIndex === 13 ? 'active' : ''}`}
          onClick={() => OpenFAQ(6)}
        >
       What payment methods are available on Alhijaz Tours?
        </button >
        <div class='panel'>
          <p className='mt-2 mb-2'>
          At the moment payment is available from any VISA, MasterCard and via bank transfer as well.
          </p>
        </div>

        <button
          className={` accordion2 ${activeIndex === 14 ? 'active' : ''}`}
          onClick={() => OpenFAQ(7)}
        >
      Can I go alone?
        </button >
        <div class='panel'>
          <p className='mt-2 mb-2'>
          Of course, many individual travelers choose adventure tours in small groups. Accommodation is in double rooms with a traveller of the same gender or in a single room with surcharge. In most groups there are a few individual travellers who start socializing and become friends already in the first days of the trip!
          </p>
        </div>
      </section>
      </div>
    </>
  )
}

export default Faqs
