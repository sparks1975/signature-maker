import React, { useState } from 'react';
import SignatureCanvas from './SignatureCanvas';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const styles = ['elegant', 'bold', 'casual']; // Removed 'random'

  return (
    <div className="App">
      <h1>Signature Generator</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="previews">
        {styles.map((style) => (
          <div key={style} className="preview">
            <p>{style.charAt(0).toUpperCase() + style.slice(1)}</p>
            <SignatureCanvas name={name} style={style} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;