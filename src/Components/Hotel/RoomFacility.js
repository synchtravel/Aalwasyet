import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck} from '@fortawesome/free-solid-svg-icons'
function RoomFacilities({ item }) {
  const [showAllFacilities, setShowAllFacilities] = useState(false);

  const facilitiesToDisplay = showAllFacilities
    ? item.rooms_facilities
    : item.rooms_facilities.slice(0, 5);

  const toggleFacilities = () => {
    setShowAllFacilities(!showAllFacilities);
  };

  return (
    <div>
    <ul className="facilities-list">
      {facilitiesToDisplay.map((facility, index) => (
        <li key={index}>
          <i className='awe-icon fa tc fa-check' aria-hidden='true'>
            <FontAwesomeIcon icon={faCheck} />
          </i>{' '}
          {facility}
        </li>
      ))}
    </ul>

    {item.rooms_facilities.length > 5 && (
      <button onClick={toggleFacilities}>
        {showAllFacilities ? 'Show Less' : 'View More'}
      </button>
    )}
  </div>
  );
}

export default RoomFacilities;
