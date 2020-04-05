const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');
const transformEvent =(event=>{
  return {
          ...event._doc,
          _id: event._id,
          creator: user.bind(this, event._doc.creator)
        };
});

const transformBooking =(booking =>{
  return  {
          ...booking._doc,
          _id: booking.id,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: dateToString(booking._doc.createdAt),
          updatedAt: dateToString(booking._doc.updatedAt)
        };
})
const transformUser = (user =>{
  return {
         ...user._doc,
         _id: user._id,
         createdEvents: userEvents.bind(this, user._doc.createdEvents),
         password : "We can't return password"
       };
})

const userEvents = eventsIds => {
  console.log(eventsIds);
  return Event.find({ _id: { $in: eventsIds } })
    .then(events => {
      return events.map(event => {
        return transformEvent(event)
      });
    })
    .catch(err => {
      throw err;
    });
};
const eventBookings = bookingIds => {
  console.log(bookingIds);
  return Booking.find({ _id: { $in: bookingIds } })
    .then(bookings => {
      return bookings.map(book => {
        return {
          ...book._doc,
          _id: book._id,
          user: user.bind(this, book._doc.user),
          user: singleEvent.bind(this, book._doc.event)
        };
      });
    })
    .catch(err => {
      throw err;
    });
};
const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event)
  } catch (err) {
    throw err;
  }
};
const user = async userId => {
  try {
    const user = await User.findById(userId);
    return transformUser(user)
  } catch (err) {
    throw err;
  }
};

exports.user = user;
exports.singleEvent = singleEvent;
exports.eventBookings = eventBookings;
exports.userEvents = userEvents;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.transformUser = transformUser;