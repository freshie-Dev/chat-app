import { initialUserState } from "../context/UserContext";


const userReducer = (state, action) => {
  const key = action.type;
  switch (key) {
    case "SAVE_USER_INFO":
      // console.log("from save user info", action.payload)
      console.log(action.payload)
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload.user
      };
      break;

    case "UPDATE_USER_INFO":
      const { fieldName, updatedValue } = action.payload
      return {
        ...state,
        [fieldName]: updatedValue
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

    case "UPDATE_USER_INFO":
      const storedUserData = JSON.parse(localStorage.getItem("userinfo"));
      storedUserData.username = action.payload.username;
      localStorage.setItem("userinfo", JSON.stringify(storedUserData));

      return {
        ...state,
        loggedInUserInfo: {
          ...state.loggedInUserInfo,
          username: action.payload.username,
        },
      };

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