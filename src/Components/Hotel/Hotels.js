import React from 'react'
import america from '../../Images/Hotels/america.jpeg'
import australia from '../../Images/Hotels/australia.jpeg'
import canada from '../../Images/Hotels/canada.jpeg'
import hongkong from '../../Images/Hotels/hongkong.jpeg'
import italy from '../../Images/Hotels/italy.jpeg'
import paris from '../../Images/Hotels/paris.jpeg'
import saudia from '../../Images/Hotels/saudia.jpeg'
import spain from '../../Images/Hotels/spain.jpeg'
import uae from '../../Images/Hotels/uae.jpeg'

function Hotels () {
  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='section-title'>
            <h2>FIND HOTELS THAT SUIT YOUR STYLE</h2>
          </div>
        </div>
        <div className='row'>
          <div className='column img-grid'>
            <div className='image-container m-1'>
              <img src={america} className='inner-img' alt='America' />
              <div className='overlay'>
                {' '}
                <div className='overlay-text'>
                  <h5>America</h5>
                </div>
              </div>
            </div>
            <div className='image-container m-1'>
              <img src={australia} className='inner-img' alt='Australia' />
              <div className='overlay'>
                {' '}
                <div className='overlay-text'>
                  <h5>Australia</h5>
                </div>
              </div>
            </div>
          </div>
          <div className='column img-grid'>
            <div className='image-container m-1'>
              <img src={canada} alt='canada' />
              <div className='overlay'>
                {' '}
                <div className='overlay-text'>
                  <h5>Canada</h5>
                </div>
              </div>
            </div>
            <div className='image-container m-1'>
              <img src={hongkong} alt='hongkong' />
              <div className='overlay'>
                {' '}
                <div className='overlay-text'>
                  <h5>Hongkong</h5>
                </div>
              </div>
            </div>
          </div>
          <div className='column img-grid'>
            <div className='image-container m-1'>
              <img src={italy} alt='italy' />
              <div className='overlay'>
                {' '}
                <div className='overlay-text'>
                  <h5>Italy</h5>
                </div>
              </div>
            </div>
            <div className='image-container m-1'>
              <img src={paris} alt='paris' />
              <div className='overlay'>
                {' '}
                <div className='overlay-text'>
                  <h5>Paris</h5>
                </div>
              </div>
            </div>
          </div>
          <div className='column img-grid'>
            <div className='image-container m-1'>
              <img src={saudia} alt='saudia' />
              <div className='overlay'>
                {' '}
                <div className='overlay-text'>
                  <h5>Saudia</h5>
                </div>
              </div>
            </div>
            <div className='image-container m-1'>
              <img src={spain} alt='spain' />
              <div className='overlay'>
                {' '}
                <div className='overlay-text'>
                  <h5>Spain</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Hotels
