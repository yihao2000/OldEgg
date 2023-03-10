// import { useEffect, useState } from 'react';
// import { appendMessage } from '../features/message/messageSlice';
// import { WsUrl } from '@/util/server';

// const useSocket = (id: number, user_id: number) => {
//   const [socket, setSocket] = useState<WebSocket>();

//   useEffect(() => {
//     if (socket) {
//       socket.close();
//     }
//     setSocket(new WebSocket(WsUrl(`/websocket?id=${id}&user=${user_id}`)));
//   }, [id, user_id]);

//   return socket;
// };

// const connect = (socket: WebSocket) => {
//   // const dispatch = useAppDispatch()

//   socket.onopen = () => {
//     console.log('Successfully Connected');
//   };

//   socket.onmessage = (msg) => {
//     console.log(JSON.parse(msg.data));
//     // dispatch(appendMessage(msg.data))
//   };

//   socket.onclose = (event) => {
//     console.log('Socket Closed Connection: ', event);
//   };

//   socket.onerror = (error) => {
//     console.log('Socket Error: ', error);
//   };
// };

// const sendMsg = (msg: string, socket: WebSocket) => {
//   console.log('sending msg: ', msg);
//   socket.send(msg);
// };

// export { useSocket, connect, sendMsg };
