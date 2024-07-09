import { initialUserState } from "../context/UserContext";


const userReducer = (state, action) => {
  const key = action.type;
  switch (key) {
    case "SAVE_USER_INFO":
      localStorage.setItem('token', action.payload.token)
      // localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload.user
      };
      break;

    case "UPDATE_USER_INFO":
      const user = action.payload;
      return {
        ...state,
        user,
      };
      break;

    case "UPDATE_PROFILE_PICTURE":
      let tempUser = JSON.parse(localStorage.getItem('user'))
      tempUser = {
        ...tempUser,
        profile: {
          ...tempUser.profile,
          profilePicture: action.payload,
          isProfilePictureSet: true,
        }
      }
      return {
        ...state,
        user: tempUser,
      };
      break;
    
    case "UPDATE_FRIEND_REQUESTS":
      let tempReqs = state.user.friendRequests;
      let updatedFriendRequests;
      if(tempReqs) {
        updatedFriendRequests = [...tempReqs, action.payload]
      } else {
        updatedFriendRequests = [action.payload]
      }
      return {
        ...state,
        user: {
          ...state.user,
          friendRequests: updatedFriendRequests
        }
      };
      break;

    case "UPDATE_FRIEND_REQUEST_STATUS":
      let updatedRequests = state.user.friendRequests.map(request => {
         if (action.payload.friendRequestId === request._id) {
          return {
            ...request,
            status: action.payload.status,
          }
         } else {
          return request
         }
      });

      return {
        ...state,
        user: {
          ...state.user,
          friendRequests: updatedRequests
        },
      };
      break;

    case "UPDATE_NOTIFICATIONS":
      let tempNotifs = state.user.notifications;
      console.log(tempNotifs)
      console.log(action.payload)
      const newNotifs = [...tempNotifs, action.payload]
      return {
        ...state,
        user: {
          ...state.user,
          notifications: newNotifs
        }
      };
      break;

    case "UPDATE_NOTIFICATION_STATUS":
      let notifications = state.user.notifications;
      const updatedNotifications = notifications.map(notif => {
        if (notif.friendRequestId === action.payload.friendRequestObj._id) {
          return {
            ...notif,
            status: action.payload.status
          }
        } else {
          return notif
        }
      })
      console.log(action.payload)
      console.log(updatedNotifications)
      return {
        ...state,
        user: {
          ...state.user,
          notifications: updatedNotifications
        }
      };
      break;

    case "UPDATE_CONTACTS":
      let tempContacts = state.contacts;
      let updatedContacts;
      updatedContacts = [...tempContacts, action.payload]
      console.log(updatedContacts)
      return {
        ...state,
        contacts: updatedContacts
      };
      break;

    case 'DELETE_SINGLE_CONTACT':
      let updatedContactArray = state.contacts.filter (contact => {
        return contact._id !== action.payload
      })

      return {
        ...state,
        contacts: updatedContactArray
      }
      break;

    case "RESET_USER_STATE":
      localStorage.clear();
      return {
        ...initialUserState
      };
      break;

    case "SET_CONTACTS":
      return {
        ...state,
        contacts: action.payload
      }
      break;
    
    case "SET_LOADING_TRUE":
      return {
        ...state,
        isLoading: true
      };
      break;
    
    case "SET_LOADING_FALSE":
      return {
        ...state,
        isLoading: false
      };
      break;

    case "CLEAR_USER_STATE":
      return {
        loggedInUserInfo: null,
        isLoading: false,
      };
      break;

    default:
      return state;
  }
};

export default userReducer;