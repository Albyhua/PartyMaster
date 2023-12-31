// Import Hooks
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

// Import Queries and Mutations
import { EVENT_DATA, LOOKUP_USER } from "../../utils/queries";
import {
  UPDATE_EVENT,
  DELETE_EVENT,
  UPDATE_RSVP,
  ADD_GUEST,
} from "../../utils/mutations";

// Import Styling
import "../../styles/EventOverview.css";

// Import utils and custom elements
import Auth from "../../utils/auth";
import getUserRole from "../../utils/userRole";
import Comment from "../Communication/Comments";
import CommentForm from "../Communication/CommentForm";
import Contribution from "../Contributions/ContributionCoordination";
import EasyEdit from "react-easy-edit";

const EventOverview = () => {
  // Get the logged in user
  const user = Auth.getProfile();
  const { name } = user.data;
  // Get the event ID from the URL params
  const { eventId } = useParams();
  // Set up useState hooks for the data we'll need
  let [title, setTitle] = useState("");
  let [date, setDate] = useState("");
  let [time, setTime] = useState("");
  let [location, setLocation] = useState("");
  let [description, setDescription] = useState("");
  let [comments, setComments] = useState();
  let [rsvp, setRSVP] = useState([]);
  let [rsvpMaybe, setRsvpMaybe] = useState([]);
  let [rsvpYes, setRsvpYes] = useState([]);
  let [rsvpNo, setRsvpNo] = useState([]);
  let [contributions, setContributions] = useState([]);
  let [hostID, setHostID] = useState("");
  let [hostName, setHostName] = useState('')
  let [userResponse, setUserResponse] = useState({ hostBool: false, rsvp: "" });
  let [guestRSVP, setGuestRSVP] = useState(userResponse.rsvp);
  let [inviteList, setInviteList] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [isGuestEditable, setIsGuestEditable] = useState(false);
  const [contribBool, setContribBool] = useState();
  let [rsvpType, setRsvpType] = useState("");

  const toggleEditable = () => {
    setIsEditable(!isEditable);

  };
  const toggleGuestEditable = () => {
    setIsGuestEditable(!isGuestEditable);

  };
  // Set up mutations
  const [updateEvent, { eventError }] = useMutation(UPDATE_EVENT);
  const [deleteEvent, { deleteError }] = useMutation(DELETE_EVENT);
  const [updateRSVP, { rsvpError }] = useMutation(UPDATE_RSVP);
  const [addGuest, { addError }] = useMutation(ADD_GUEST);

  const saveEventDetails = () => {
    try {
      const { data } = updateEvent({
        variables: {
          id: eventId,
          description,
          title,
          location,
          date,
          time,
        },
      });
    } catch (eventError) {
      console.error("Unable to update event", eventError);
    }
    toggleEditable();
  };
  const delEvent = () => {
    try {
      const { data } = deleteEvent({
        variables: {
          id: eventId,
        },
      });
      window.location.href = "/dashboard";
    } catch (eventError) {
      console.error("Unable to delete event", eventError);
    }
  };

  const saveRSVP = (value) => {
    toggleGuestEditable();
    try {
      const { data } = updateRSVP({
        variables: {
          id: eventId,
          rsvp: {
            userId: user.data._id,
            invite: value,
          },
        },
      });
    } catch (rsvpError) {
      console.error("Unable to update RSVP", rsvpError);
    }
    if(typeof(value)===String){
      setRSVP(value)

    }
  };
  const inviteGuests = () => {
    const guestArray = inviteList.split(",");
    guestArray.forEach(async (invitee) => {
      invitee.trim();
      const { data } = addGuest({
        variables: {
          eventId: eventId,
          email: invitee,
        },
      });
    });
    setInviteList("");
  };


  // Query the event data
  const { loading, data } = useQuery(EVENT_DATA, {
    variables: { id: eventId },
  });
  // wait for the event data to be returned, then set all the values
  useEffect(() => {
    if (loading === false && data) {
      
      const events = data?.getEventData || {};
      setTitle(events.title);
      setDate(events.date);
      setTime(events.time);
      setLocation(events.location);
      setDescription(events.description);
      setComments(events.comment);
      setRSVP(events.RSVP);
      setRsvpMaybe(events.rsvpMaybe);
      setRsvpYes(events.rsvpYes);
      setRsvpNo(events.rsvpNo);
      setContributions(events.potluckContributions);
      setContribBool(events.potluck);
      setHostID(events.hostID);
    }
  }, [loading, data]);


  // Wait for the event data to come back, and then derive additional information
  useEffect(() => {
    if (hostID && rsvp) {
      setUserResponse(getUserRole(hostID, rsvp, user.data._id));
      setGuestRSVP(userResponse.rsvp)
    }
  }, [hostID, rsvp]);


  const editStyles = {
    margin: "1%",
    border: isEditable
    ?"1px solid black"
    : "2px",
    padding: isEditable
    ?"1%"
    : 0,
    borderRadius:"5px",
  }

  const guestEditStyles = {
    margin: "1%",
    border: isGuestEditable
    ?"1px solid black"
    : "2px",
    padding: isGuestEditable
    ?"1%"
    : 0,
    borderRadius:"5px",
  }
  return (
    <>
      <div className="flex-container"></div>
      <div>
        <div className="flex-container">
          <div className="left-column">
            <section className="post-full mt-5 p-3 rounded bg-white border event-container" >
              <>
                <h2 className="display-4">
                  <div className="title-edit-group" >
                    <div style={editStyles} className="eady-edit-override">
                    <EasyEdit
                      type="text"
                      value={title}
                      saveOnBlur={true}
                      allowEdit={isEditable}
                      onSave={(value) => setTitle(value)}
                    /></div>
                    {userResponse.hostBool && (
                      <div className="edit-buttons">
                        <button onClick={toggleEditable} hidden={isEditable}>
                          <img src="/edit_icon.png" />
                        </button>
                        <button onClick={delEvent} hidden={!isEditable}>
                          <img src="/trash_icon.png" />
                        </button>
                        <button onClick={saveEventDetails} hidden={!isEditable}>
                          <img src="/checkmark_icon.png" />
                        </button>
                      </div>
                    )}
                  </div>
                </h2>
                <p className="text-muted">
                </p>
                <div className="time-section">
                <div style={editStyles} className="eady-edit-override">
                  <EasyEdit
                    type="date"
                    value={date}
                    saveOnBlur={true}
                    allowEdit={isEditable}
                    onSave={(value) => setDate(value)}
                  />
                  </div>
                  <div style={editStyles} className="eady-edit-override">
                  <EasyEdit
                    type="time"
                    value={time}
                    saveOnBlur={true}
                    allowEdit={isEditable}
                    onSave={(value) => setTime(value)}
                  /></div>
                </div>
                <div style={editStyles} className="eady-edit-override">
                <EasyEdit
                  type="text"
                  saveOnBlur={true}
                  value={location}
                  allowEdit={isEditable}
                  onSave={(value) => setLocation(value)}
                />
                </div>
                <div style={editStyles} className="eady-edit-override">
                <EasyEdit
                  type="textarea"
                  value={description}
                  saveOnBlur={true}
                  allowEdit={isEditable}
                  onSave={(value) => setDescription(value)}
                />
                </div>
              </>
            </section>
            <section className="rsvp-container">
              {userResponse.hostBool ? (
                <>
                  <div>
                    <div className="rsvp-response-group">
                      <h3>RSVPs</h3>
                      <div className="show-rsvp">
                        
                        <p>
                          Yes: {rsvpYes.length}
                        </p>
                      </div>
                      <div className="show-rsvp">
                       
                        <p> No: {rsvpNo.length}</p>
                      </div>
                      <div className="show-rsvp" >
                      
                        <p>
                          Maybe: {rsvpMaybe.length}
                        </p>
                      </div>
                    </div>
                    
                  </div>
                  {isEditable ? (
                    <div>
                      <textarea
                        placeholder="Add emails, separated by commas"
                        value={inviteList}
                        onChange={(event) => setInviteList(event.target.value)}
                        id="guest-input"
                      ></textarea>
                      <button onClick={inviteGuests} className="invite-button">Invite Guests</button>        
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <>
                  <div className="edit-rsvp-group">
                    <h3>Your RSVP: </h3>

                   <div className="update-rsvp-group">
                    <div className="rsvp-dropdown-input">
                    <EasyEdit
                      type="select"
                      options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                        { label: "Maybe", value: "Maybe" },
                      ]}
                      placeholder={userResponse.rsvp}
                      hideCancelButton={true}
                      saveOnBlur
                      onSave={saveRSVP}
                      editMode={true}
                      
                    /> 
                    </div>
                    <button onClick={saveRSVP} className="save-rsvp-button">Save</button>
                    </div>
                   
                  </div>
                  <div className="rsvp-response-group">
                    <div className="show-rsvp">
                    

                      <p>{rsvpYes.length} Going</p>
                    </div>
                    <div className="show-rsvp" >
                      

                      <p>{rsvpNo.length} Not going</p>
                    </div>
                    <div className="show-rsvp"  >
                     

                      <p>{rsvpMaybe.length} Maybe going</p>
                    </div>
                  </div>
                  
                </>
              )}{" "}
            </section>
            <section className="commentForm">
              <CommentForm eventId={eventId} />
            </section>
            <section className="comments-container">
              {comments &&
                comments.map((comment) => (
                  <Comment
                    comment={comment}
                    user={user}
                    hostID={hostID}
                    key={comment.commentId}
                  />
                ))}
            </section>
          </div>
          <aside className="contributions-container">
            {contributions && (
              <Contribution
                contributions={contributions}
                eventId={eventId}
                user={user}
                isEditable={isEditable}
                hostBool={userResponse.hostBool}
                contribBool={contribBool}
              />
            )}
          </aside>
        </div>
      </div>
    </>
  );
};

export default EventOverview;
