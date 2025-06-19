import React from 'react';
import { useParams } from 'react-router-dom';
import Chat from './Chat.jsx';
import useGameZone, { GameEventEnum } from './useGameZone.js';

export default function GamePage() {
  const { id } = useParams();
  const nickname = React.useMemo(
    () => localStorage.getItem('nickname') || 'Anonymous',
    []
  );
  const { zone, sendGameEvent } = useGameZone(id, nickname);

  function handleKey(event) {
    const code = event.key;
    if (code === 'ArrowUp') sendGameEvent(GameEventEnum.UP);
    else if (code === 'ArrowDown') sendGameEvent(GameEventEnum.DOWN);
    else if (code === 'ArrowLeft') sendGameEvent(GameEventEnum.LEFT);
    else if (code === 'ArrowRight') sendGameEvent(GameEventEnum.RIGHT);
    else if (code === ' ') sendGameEvent(GameEventEnum.DROP);
  }

  React.useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  return (
    <div className="row">
      <div className="span3" id="game">
        <table className="game-zone">
          {zone.map((line, i) => (
            <tr key={i}>
              {line.map((cell, j) => (
                <td key={j} className={`game-cell block${cell.val}`}></td>
              ))}
            </tr>
          ))}
        </table>
      </div>
      <div className="span5 hidden-on-phone">
        <Chat nickname={nickname} />
      </div>
    </div>
  );
}
