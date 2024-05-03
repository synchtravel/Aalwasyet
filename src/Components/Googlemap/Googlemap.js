import React from 'react'
function Googlemap () {
  return (
    <>
      <div className='container'>
        <div className='col-12'>
          <div className='responsive-map'>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2431.0074118442067!2d-1.8621419070118492!3d52.44589152602594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870bbef3588bc13%3A0x8a441b0b4a83c6d0!2sAlhijaz%20Tours!5e1!3m2!1sen!2suk!4v1683195987117!5m2!1sen!2suk'
              width='600'
              height='450'
              frameborder='0'
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </>
  )
}

export default Googlemap
