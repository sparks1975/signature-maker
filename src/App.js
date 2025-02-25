import React, { useState } from 'react';
import SignatureCanvas from './SignatureCanvas';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [style, setStyle] = useState('random');

  const styles = ['elegant', 'bold', 'casual', 'random']; // Predefined styles + random

  return (
    <div className="App">
      <h1>Signature Generator</h1>
      <p>Create and download a unique signature for use in various applications.</p>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={style} onChange={(e) => setStyle(e.target.value)}>
        {styles.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
      <SignatureCanvas name={name} style={style} />
    </div>
  );
}

export default App;