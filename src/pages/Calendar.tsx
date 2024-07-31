import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { request } from '../axios_helper';
import Breadcrumb from '../components/Breadcrumb';
import { FaCalendarAlt, FaRegEdit, FaMapMarkerAlt, FaUser, FaClipboardList } from 'react-icons/fa';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedDateStart, setSelectedDateStart] = useState<Date | null>(null);
  const [selectedDateEnd, setSelectedDateEnd] = useState<Date | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventOrganizer, setEventOrganizer] = useState('');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  

  useEffect(() => {
    request('GET', '/admin/getAllEvents')
      .then(response => {
        const eventsWithDates = response.data.map((event: any) => ({
          id: event.id,
          title: event.nom,
          start: new Date(new Date(event.dateDebut)), // Add 1 hour
          end: new Date(event.dateFin),
          description: event.description, // Ensure fields are correct
          lieu: event.lieu,
          organisateur: event.organisateur,
          dateDebut: event.dateDebut,
          dateFin: event.dateFin,
        }));
        setEvents(eventsWithDates);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);

  const handleAddEvent = () => {
    if (selectedDateStart && selectedDateEnd && eventTitle) {
      const requestData = {
        dateDebut: selectedDateStart.toISOString(),
        dateFin: selectedDateEnd.toISOString(),
        nom: eventTitle,
        description: eventDescription,
        lieu: eventLocation,
        organisateur: eventOrganizer,
      };
      if (editingEventId) {
        // Update existing event
        request('PUT', `/admin/updateEvent/${editingEventId}`, requestData)
          .then(response => {
            setEvents(events.map(event =>
              event.id === editingEventId
                ? { ...response.data, start: new Date(response.data.dateDebut), end: new Date(response.data.dateFin) }
                : event
            ));
            resetForm();
          })
          .catch(error => {
            console.error('Error updating event:', error);
          });      
      } else {
        // Add new event
        request('POST', '/admin/createEvent', requestData)
          .then(response => {
            setEvents([...events, { ...response.data, start: new Date(response.data.dateDebut), end: new Date(response.data.dateFin) }]);
            resetForm();
          })
          .catch(error => {
            console.error('Error adding event:', error);
          });
      }
    }
  };
//.getTime() + 60 * 60 * 1000
  const handleDeleteEvent = (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this event?');
    if (confirmed) {
      request('DELETE', `/admin/deleteEvent/${id}`)
        .then(() => {
          setEvents(events.filter(event => event.id !== id));
          setShowEventDetails(false);
        })
        .catch(error => {
          console.error('Error deleting event:', error);
        });
    }
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description);
    setEventLocation(event.lieu);
    setEventOrganizer(event.organisateur);
    setSelectedDateStart(new Date(event.dateDebut));
    setSelectedDateEnd(new Date(event.dateFin));
    setEditingEventId(event.id); // Set the event ID for editing
    setShowEventDetails(true);
  };

  const handleModifyClick = () => {
    setShowEventDetails(false);
    setShowForm(true);
  };

  const resetForm = () => {
    setEventTitle('');
    setEventDescription('');
    setEventLocation('');
    setEventOrganizer('');
    setSelectedDateStart(null);
    setSelectedDateEnd(null);
    setEditingEventId(null); // Clear editing ID
    setShowForm(false);
  };

  const formatDate = (date: Date | string) => {
    return moment(date).format('DD/MM/YYYY HH:mm');
  };

  return (
    <>
      <Breadcrumb pageName="Calendar" />

      <div className="relative w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* Add Event Button */}
        <div className="p-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-meta-5 text-white p-2 rounded flex items-center"
          >
            <FaCalendarAlt className="mr-2" />
            Add Event
          </button>
        </div>

        {/* Calendar Wrapper */}
        <div className={`relative ${showForm || showEventDetails ? 'filter blur-sm' : ''}`}>
          {/* Calendar */}
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '500px' }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: '#1A3EC2',
                borderRadius: '5px',
                opacity: 0.8,
                color: 'black',
                border: 'none',
              },
            })}
            components={{
              event: ({ event }: { event: any }) => (
                <div style={{ textAlign: 'center' }}>
                  {event.title}
                </div>
              )
            }}
            selectable
            onSelectSlot={(slotInfo) => {
              setSelectedDateStart(slotInfo.start);
              setSelectedDateEnd(slotInfo.end);
              setShowForm(true);
            }}
            onSelectEvent={handleEventClick} // Handle event clicks
          />
        </div>

        {/* Event Form */}
        {showForm && (
          <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-gray-800 opacity-50 z-10"></div>

            {/* Form */}
            <div className="absolute top-1/2 left-1/2 px-4 py-6 transform -translate-x-1/2 -translate-y-1/2 bg-white border dark:bg-meta-4 rounded shadow-lg z-20 max-w-md w-full">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-form-input dark:text-stroke">
                  {editingEventId ? 'Edit Event' : 'Add Event'}
                </h2>
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-3">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  onChange={(e) =>
                    setSelectedDateStart(e.target.value ? new Date(e.target.value) : null)
                  }
                  className="w-full border rounded p-2 dark:bg-bodydark placeholder:text-gray-500 dark:text-[#2D2E2D]"
                  value={selectedDateStart ? selectedDateStart.toISOString().slice(0, 16) : ""}
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-3">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  onChange={(e) =>
                    setSelectedDateEnd(e.target.value ? new Date(e.target.value) : null)
                  }
                  className="w-full border rounded p-2 dark:bg-bodydark placeholder:text-gray-500 dark:text-[#2D2E2D]"
                  value={selectedDateEnd ? selectedDateEnd.toISOString().slice(0, 16) : ""}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-3">
                  Event Title
                </label>
                <input
                  type="text"
                  placeholder="Event title"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full border rounded p-2 dark:bg-bodydark placeholder:text-gray-500 dark:text-[#2D2E2D]"
                />
              </div>
              <div className=" mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-3">
                  Event Description
                </label>
                <input
                  type="text"
                  placeholder="Event description"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full border rounded p-2 dark:bg-bodydark placeholder:text-gray-500 dark:text-[#2D2E2D]"
                />
              </div>
              <div className=" mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-3">
                  Event location
                </label>
                <input
                  type="text"
                  placeholder="Event location"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full border rounded p-2 dark:bg-bodydark placeholder:text-gray-500 dark:text-[#2D2E2D]"
                />
              </div>
              <div className=" mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-3">
                  Event organizer
                </label>
                <input
                  type="text"
                  placeholder="Organizer"
                  value={eventOrganizer}
                  onChange={(e) => setEventOrganizer(e.target.value)}
                  className="w-full border rounded p-2 dark:bg-bodydark placeholder:text-gray-500 dark:text-[#2D2E2D]"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleAddEvent}
                  className="bg-[#0F870D] text-white px-4 py-2 rounded"
                >
                  {editingEventId ? 'Update' : 'Save'}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-[#000000] text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {/* Event Details */}
        {showEventDetails && selectedEvent && (
          <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-gray-800 opacity-50 z-10"></div>

            {/* Event Details */}
            <div className="absolute top-1/2 left-1/2 px-4 py-6 transform -translate-x-1/2 -translate-y-1/2 bg-white border rounded shadow-lg z-20 max-w-md w-full">
              <h2 className="text-2xl font-bold text-form-input dark:text-stroke text-center mb-4">
                {selectedEvent.title}
              </h2>
              <div className="mb-4">
                <strong>Description:</strong>
                <p>{selectedEvent.description}</p>
              </div>
              <div className="mb-4">
                <strong>Location:</strong>
                <p>{selectedEvent.lieu}</p>
              </div>
              <div className="mb-4">
                <strong>Organizer:</strong>
                <p>{selectedEvent.organisateur}</p>
              </div>
              <div className="mb-4">
                <strong>Date de debut:</strong>
                <p>{formatDate(selectedEvent.dateDebut)}</p>
              </div>
              <div className="mb-4">
                <strong>Date de fin:</strong>
                <p>{formatDate(selectedEvent.dateFin)}</p>
              </div>
              <div className="flex mt-6 justify-end space-x-2">
                <button
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  className="bg-meta-1 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={handleModifyClick}
                  className="bg-[#0F870D] text-white px-4 py-2 rounded"
                >
                  Modify
                </button>
                <button
                  onClick={() => setShowEventDetails(false)}
                  className="bg-black-2 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CalendarComponent;
