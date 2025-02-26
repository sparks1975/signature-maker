import React, { useState } from 'react';
import SignatureCanvas from './SignatureCanvas';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const styles = ['elegant', 'bold', 'casual', 'ballet', 'alex', 'meddon', 'windsong', 'engagement', 'aguafina'];

  return (
    <div className="App">
      <h1>
        <img src="/signature-icon.svg" alt="signature icon" style={{ width: '32px', height: '32px', verticalAlign: 'middle', marginRight: '8px' }} />
        Signature Generator
      </h1>
      <p>Create and download your signature to use on various online applications.</p>
      <label htmlFor="name">Enter your name:</label>
      <input
        id="name"
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="previews" style={{ paddingBlockStart: '24px' }}>
        {styles.map((style) => (
          <div key={style} className="preview">
            {/* <p>{style.charAt(0).toUpperCase() + style.slice(1)}</p> */}
            <SignatureCanvas name={name} style={style} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;