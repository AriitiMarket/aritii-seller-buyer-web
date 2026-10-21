import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { getAllEventsShop, deleteEvent } from '@/store/slices/eventThunks';
import { AiOutlineEye, AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import Loader from '@/components/common/Loading';
import '@/business/components/AllEvents.css';


const AllEvents = () => {
  const { events, isLoading } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    //important to check if seller and seller._id exist before dispatching the action to avoid errors when the seller is not logged in or the seller data is not available.
    if (seller && seller._id) {                // This condition checks if the seller object exists and has a valid _id property. This is important because the getAllEventsShop action requires a seller ID to fetch the events associated with that specific shop. If the seller is not logged in or the seller data is not available, this condition prevents the dispatch from being called, avoiding potential errors or unnecessary API calls.
      dispatch(getAllEventsShop(seller._id)); 
    }
  }, [dispatch, seller]);



  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
  }

  // Helper function to determine event status
  const getEventStatus = (event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'ended';
    return 'active';
  };

  // Helper function to get event status badge class
  const getEventStatusBadgeClass = (event) => {
    const status = getEventStatus(event);
    if (status === 'active') return 'event-badge event-badge--active';
    if (status === 'upcoming') return 'event-badge event-badge--upcoming';
    return 'event-badge event-badge--ended';
  };

  // Helper function to format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const row = [];

  events &&
  events.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: item.discountPrice,
        stock: item.stock,
        sold: item.sold_out,
        startDate: item.startDate,
        endDate: item.endDate,
        ...item
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="events-container">
          <div className="events-header">
            <h2>Shop Events</h2>
            <p className="events-count">{row.length} event{row.length !== 1 ? 's' : ''}</p>
          </div>

          {row.length === 0 ? (
            <div className="events-empty">
              <p>No events found</p>
            </div>
          ) : (
            <div className="events-grid">
              {row.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-card-header">
                    <h3 className="event-name">{event.name}</h3>
                    <span className={getEventStatusBadgeClass(event)}>
                      {getEventStatus(event).toUpperCase()}
                    </span>
                  </div>

                  <div className="event-card-body">
                    <div className="event-info-row">
                      <span className="info-label">Price:</span>
                                            <span className="info-value">ETB {event.discountPrice ?? 0}</span>
                    </div>
                    <div className="event-info-row">
                      <span className="info-label">Stock:</span>
                      <span className="info-value">{event.stock} units</span>
                    </div>
                    <div className="event-info-row">
                      <span className="info-label">Sold:</span>
                      <span className="info-value">{event.sold || 0} units</span>
                    </div>
                    <div className="event-dates">
                      <div className="date-item">
                        <span className="date-label">Starts:</span>
                        <span className="date-value">{formatDate(event.startDate)}</span>
                      </div>
                      <div className="date-item">
                        <span className="date-label">Ends:</span>
                        <span className="date-value">{formatDate(event.endDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="event-card-footer">
                    {/* Events have no detail route; the old link pointed at
                        /product/<name-slug>, which could only ever 404. */}
                    <Link to="/events" className="action-btn action-btn--view" title="View events">
                      <AiOutlineEye size={18} />
                      <span>View</span>
                    </Link>
                    <button 
                      onClick={() => handleDelete(event.id)} 
                      className="action-btn action-btn--delete"
                      title="Delete event"
                    >
                      <AiOutlineDelete size={18} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllEvents;