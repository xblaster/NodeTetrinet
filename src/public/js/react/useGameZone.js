import React from 'react';
import { createEmptyZone, applyZoneWithVal, GameEventEnum } from './tetris.js';

export default function useGameZone(roomName, nickname) {
  const [zone, setZone] = React.useState(() => {
    const base = createEmptyZone();
    const display = [];
    applyZoneWithVal(base, display);
    return display;
  });
  const socketRef = React.useRef(null);

  React.useEffect(() => {
    const socket = io('/game');
    socketRef.current = socket;
    socket.emit('join', { roomName, nickname });
    socket.on('updateGameField', (opt) => {
      setZone((z) => {
        const clone = z.map((row) => row.slice());
        applyZoneWithVal(opt.zone, clone);
        return clone;
      });
    });
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [roomName, nickname]);

  const sendGameEvent = React.useCallback((event) => {
    if (socketRef.current) socketRef.current.emit('gameEvent', event);
  }, []);

  return { zone, sendGameEvent };
}

export { GameEventEnum };
