const Event = require("../../models/event");
const {user, eventBookings, transformEvent} = require('./merge')


module.exports = {

  events: req => {
      if(!req.isAuth){
          throw new Error('Unauthenticated')
      }
    return Event.find()
      .then(events => {
        return events.map(event => {
          console.log(event);
          return {
            ...event._doc,
            _id: event._id,
            creator: user.bind(this, event._doc.creator),
            bookedList : eventBookings.bind(this,event.bookedList)
          };
        });
      })
      .catch(err => {
        throw err;
      });
  },
  createEvent: (args, req) => {
      if(!req.isAuth){
          throw new Error('Unauthenticated')
      }
    let createdEvent;
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: args.eventInput.price,
      date: new Date(),
      creator: req.userId
    });
    return event
      .save()
      .then(result => {
        createdEvent =  transformEvent(result)
        return User.findById(req.userId);
      })
      .then(user => {
        if (!user) throw new Error("User not Found");
        else {
          user.createdEvents.push(event);
          user.save();
        }
      })
      .then(result => {
        return createdEvent;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
};