import { gql } from '@apollo/client';

export const USERS = gql`
query Query {
    users {
      _id
      name
      email
      password
    }
  }`;

export const EVENTS = gql `
query Events {
  events {
    _id
   
    title
    description
    date
    time
    location
    
    potluck
    comment {
      commentId
      content
    }

    RSVP {
      invite
      userId
    }
    rsvpMaybe{
      invite
      userId
    }
  }
}
`;

export const EVENT_DATA = gql `
query GetEventData($id: ID!) {
  getEventData(_id: $id) {
    _id
    hostID
    title
    description
    date
    time
    location
    comment {
      commentId
      userId
      content
    }
    RSVP {
      userId
      invite
    }
    potluck
    potluckContributions {
      _id
      name
      item
    }
    rsvpMaybe {
      userId
      invite
    }
    rsvpYes {
      userId
      invite
    }
    rsvpNo {
      userId
      invite
    }
  }
}`;

export const GET_USER_EVENTS = gql `
query GetUserEvents {
  getUserEvents {
  
    event {
      title
      time
      location
      date
      RSVP {
        userId
        invite
      }
      _id
      hostID 
    }

  }
}
`;

export const LOOKUP_USER = gql`
query LookupUser($id: ID!) {
  lookupUser(_id: $id) {
    name
  }
}
`;