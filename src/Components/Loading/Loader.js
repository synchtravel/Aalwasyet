import React from 'react';
import gif from '../../Images/Loading/newloader.gif'
const Loading = () => {
  return (
//     <div id="loading-wrapper" style={{zIndex:"9999"}}>
//   <div id="loading-text"><div class="lds-ripple"><div style={{background:'#008000bd'}}></div><div style={{background:'#0000ff9e'}}></div></div></div>
// </div>
    <div id="loading-wrapper"  style={{zIndex:"9999"}}>
      <div id="loading-text">
              <img src={gif}/>
           </div>
    </div>

  );
};

export default Loading;
