import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import UserProvider from './context/UserContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SnackbarProvider } from 'notistack';
import StyleProvider from './context/StylesContext.jsx'
import SocketProvider from './context/SocketContext.jsx'
import ChatProvider from './context/ChatContext.jsx'
import FriendListProvider from './context/FriendListContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <SnackbarProvider
    maxSnack={3}
    autoHideDuration={1500}
    anchorOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
  >
    <BrowserRouter>
      <StyleProvider>

        <SocketProvider>
          <ChatProvider>
            <UserProvider>
              <FriendListProvider>
                <App />
              </FriendListProvider>
            </UserProvider>
          </ChatProvider>
        </SocketProvider>

      </StyleProvider>
    </BrowserRouter>
  </SnackbarProvider >,
  // </React.StrictMode>,
)
