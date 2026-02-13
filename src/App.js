import './App.css';
import SpeechInput from './speechInput';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Text to Speech Converter</h1>
      </header>

      <main className="main-content">
        <SpeechInput />
      </main>

      <footer>
        <p>&copy; 2026 Speech App Internship Project</p>
      </footer>
    </div>
  );
}

export default App;