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

    case "SET_LOAIDNG_TRUE":
      return {
        ...state,
        isLoading: true,
      };
      break;

    case "SET_LOAIDNG_FALSE":
      return {
        ...state,
        isLoading: false,
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