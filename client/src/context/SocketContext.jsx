import { createContext, useContext, useEffect, useRef, useState } from "react";



const SocketContext = createContext();

const SocketProvider = ({ children }) => {

    const [showSlider, setShowSlider] = useState(false)
  return (
    <SocketContext.Provider
      value={{
        showSlider, setShowSlider
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
// CUSTOM HOOK FOR USING USER CONTEXT
const useSocket = () => {
  return useContext(SocketContext);
};

export default SocketProvider;
export { useSocket };