import { createContext, useContext, useEffect, useRef, useState } from "react";



const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [showSlider, setShowSlider] = useState(false)
  return (
    <AuthContext.Provider
      value={{
        showSlider, setShowSlider
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
// CUSTOM HOOK FOR USING USER CONTEXT
const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
export { useAuth };