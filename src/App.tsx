import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import classNames from './App.module.scss';
import GameContainer from './GameContainer';

function App() {
  return (
    <div className={classNames.app}>
      <GameContainer />
    </div>
  );
}

export default App;
