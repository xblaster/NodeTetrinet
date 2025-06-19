import React from 'react';
import { useParams } from 'react-router-dom';

export default function Chat({ nickname }) {
  const { id } = useParams();
  const [people, setPeople] = React.useState([]);
  const [lines, setLines] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const socketRef = React.useRef(null);

  React.useEffect(() => {
    const socket = io('/chat');
    socketRef.current = socket;
    socket.emit('join', { roomName: id, nickname });
    socket.on('say', (msg) =>
      setLines((l) => [...l.slice(-14), msg])
    );
    socket.on('people', (list) => setPeople(list));
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [id, nickname]);

  function handleSubmit(ev) {
    ev.preventDefault();
    if (socketRef.current) {
      socketRef.current.emit('say', message);
    }
    setMessage('');
  }

  return (
    <div>
      <div>
        {people.map((n) => (
          <span key={n} className="nickname">
            <i className="icon-user"></i> {n}
          </span>
        ))}
      </div>
      <div>
        {lines.map((line, idx) => (
          <div key={idx}>
            <small>{new Date(line.at).toLocaleTimeString()}</small>
            <b>&lt;{line.author}&gt;</b> {line.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="btn btn-mini" type="submit">
          say
        </button>
      </form>
    </div>
  );
}
