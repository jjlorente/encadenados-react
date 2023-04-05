import './App.css';
import { Word } from './components/Word';

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>⛓ ENCADENADAS ⛓</h1>
        <h5 style={{fontStyle:'italic'}}>DEL DÍA</h5>
        <div className='explainDv'>
          <p className='explain'>Debes formar una <span style={{color:'blue'}}>cadena de palabras</span> que tengan relación entre ellas!</p>
        </div>
      </header>
      <section>
        <Word/>
      </section>
      <div className='explainDv'>
          <p className='explain'>¡Una <span style={{color:'blue'}}>cadena</span> nueva cada día!</p>
      </div>
    </div>
  );
}
