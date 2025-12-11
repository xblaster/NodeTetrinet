import React from 'react';

export default function Lobby() {
  const [nickname, setNickname] = React.useState(
    localStorage.getItem('nickname') || 'Anonymous'
  );
  const [mode, setMode] = React.useState('read');
  const [rooms, setRooms] = React.useState([]);
  const socketRef = React.useRef(null);

  React.useEffect(() => {
    localStorage.setItem('nickname', nickname);
  }, [nickname]);

  React.useEffect(() => {
    const socket = io('/discover');
    socketRef.current = socket;
    socket.on('room', (data) => setRooms(Array.isArray(data) ? data : []));
    socket.emit('ask');
    return () => socket.disconnect();
  }, []);

  function startNewGame() {
    window.location.href = '/game/' + Math.floor(Math.random() * 9999);
  }

  const welcome =
    mode === 'edit' ? (
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          setMode('read');
        }}
      >
        <input
          type="text"
          value={nickname}
          onChange={(ev) => setNickname(ev.target.value)}
        />
      </form>
    ) : (
      <p>
        Welcome{' '}
        <span className="clickable editable" onClick={() => setMode('edit')}>
          {nickname}
        </span>{' '}
        on Node Tetrinet, a fully funny and working implementation of multiplayer
        tetrinet battles with node.js, React and socket.io
      </p>
    );

  const roomsTable =
    rooms.length === 0 ? (
      <p>
        <i className="icon-eye-close"></i> No open game.{' '}
        <a onClick={startNewGame}>Start a new game ?</a>
      </p>
    ) : (
      <table className="table table-bordered table-striped">
        {rooms.map((room) => (
          <tr key={room.name}>
            <td>
              <i className="icon-group"></i> <b>{room.name}</b> by {room.owner}
            </td>
            <td>
              <a href={'/game/' + room.name} className="btn">
                join
              </a>
            </td>
          </tr>
        ))}
      </table>
    );

  return (
    <div>
      <div className="row hero-unit disclaimer">
        <div className="span8">
          <h1>Node Tetrinet</h1>
          <hr />
          {welcome}
        </div>
      </div>
      <div className="row">
        <div className="span6">
          <h1>
            <i className="icon-play icon-x4"></i> Actions
          </h1>
          <ul className="nav nav-list">
            <li>
              <a onClick={startNewGame}>Start a new game</a>
            </li>
          </ul>
        </div>
        <div className="span6">
          <h1>
            <i className="icon-th icon-x4"></i> Available rooms
          </h1>
          {roomsTable}
        </div>
      </div>
    </div>
  );
}
