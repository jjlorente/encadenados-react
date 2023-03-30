import './App.css';
import { Word } from './components/Word';


export default function App() {

  return (
    <div className="App">
      <header className="App-header">
        <h1>⛓ ENCADENADAS ⛓</h1>
        <h3 style={{fontStyle:'italic'}}>DEL DÍA</h3>
      </header>
      <Word />
    </div>
  );
}