import { createContext, useMemo, useContext } from "react";
import io from "socket.io-client";
import { server } from "./constants/config";

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);
// this is function which give me the socket id

const SocketProvider = ({ children }) => {
  // here we are using useMemo, when my page render , then fr se wwo connection nhi banne
  const socket = useMemo(() => io(server, { withCredentials: true }), []);
  // socket.on("connect",()=>{
  //     console.log("connected to the server",socket.id);
  // })
  // console.log("socket Provider", children);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
export { SocketProvider, getSocket };
