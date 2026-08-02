const { Server } = require('socket.io');

let io = null;

const init = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join room for specific ticket or channel
    socket.on('join_room', (roomId) => {
      if (roomId) {
        socket.join(String(roomId));
        console.log(`[Socket.io] Socket ${socket.id} joined room: ${roomId}`);
      }
    });

    // Leave room
    socket.on('leave_room', (roomId) => {
      if (roomId) {
        socket.leave(String(roomId));
        console.log(`[Socket.io] Socket ${socket.id} left room: ${roomId}`);
      }
    });

    // User typing event
    socket.on('typing', ({ roomId, userName }) => {
      socket.to(String(roomId)).emit('user_typing', { roomId, userName });
    });

    socket.on('stop_typing', ({ roomId, userName }) => {
      socket.to(String(roomId)).emit('user_stop_typing', { roomId, userName });
    });

    // Send direct chat message event
    socket.on('send_message', (data) => {
      const { roomId, message } = data || {};
      if (roomId && message) {
        io.to(String(roomId)).emit('receive_message', message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    console.warn('[Socket.io] Socket.io not initialized yet.');
  }
  return io;
};

const emitToRoom = (roomId, event, payload) => {
  if (io && roomId) {
    io.to(String(roomId)).emit(event, payload);
  }
};

const broadcastEvent = (event, payload) => {
  if (io) {
    io.emit(event, payload);
  }
};

module.exports = {
  init,
  getIO,
  emitToRoom,
  broadcastEvent,
};
