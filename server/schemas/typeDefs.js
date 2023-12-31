const typeDefs = `
# need to fix event, figuring out model 
 type Event {
    _id: ID
    hostID: ID
    title: String!
    description: String!
    date: String!
    time: String!
    location: String!
    comment: [Comment]
    RSVP: [Invite]
    potluck: Boolean
    potluckContributions: [Contribution]
    rsvpMaybe:[Invite]
    rsvpYes:[Invite]
    rsvpNo:[Invite]
   
 }

 type User {
    _id: ID
    name: String
    email: String
    password: String
    event: [Event]
 }

 type Comment {
   commentId: ID
   userId: ID
   content: String
 }

 input CommentInput {
   commentId: ID
   content: String!
 }


 type Invite {
   userId: ID
   invite: String!
 }

 type Contribution {
   _id: ID
   name: String
   item: String
}

input ContributionInput {
   _id: ID
   item: String
}
#TODO Should make userId required
input RSVPInput {
   userId: ID
   invite: String
}

 type Auth {
   token: ID!
   user: User
}

type Query {
   events: [Event]
   users: [User]
   me: User
   getEventData(_id: ID!): Event
   getUserEvents: User
   lookupUser (_id:ID!): User
   
 }

 type Mutation {
   login(email: String!, password: String!): Auth
   addUser(name: String!, email: String!, password: String!): Auth
   deleteUser(_id: ID!): User
   addEvent(title: String!, description: String!, date: String!, time: String!, location: String!, potluck: Boolean, contribution: [ContributionInput], guestList:String): Event
   updateEvent(_id: ID!, title: String, description:String, date: String, time: String, location: String, potluck: Boolean,  contribution: [ContributionInput]): Event
   deleteEvent(_id: ID!): Event
   addComment(_id: ID!, comment: CommentInput!): Event
   deleteComment(_id:ID!, commentId: ID!): Event
   updateComment(_id:ID!, comment: CommentInput!): Event
   addGuest(eventId: ID!, email:String!) : Event
   removeGuest(eventId:ID!, guestId:ID!) : Event
   updateRSVP (_id: ID!, RSVP:RSVPInput): Event
   addContribution (eventId:ID!, contribution: ContributionInput!): Event
   deleteContribution (eventId:ID!, contribution:ContributionInput!): Event
   claimContribution (eventId:ID!, contribution:ContributionInput!): Event

 }
`;
module.exports = typeDefs;
