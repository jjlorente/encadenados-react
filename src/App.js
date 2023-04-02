import './App.css';
import { Word } from './components/Word';
import { Modal } from './components/Modal'
import { useState } from 'react';

export default function App() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="App">
      <header className="App-header">
        <h1>⛓ ENCADENADAS ⛓ </h1>
        <h3 style={{fontStyle:'italic'}}>DEL DÍA</h3>
        <div className='explainDv'>
          <p className='explain'>Debes formar una <span style={{color:'blue'}}>cadena de palabras</span> que tengan relación entre ellas!
          </p>
        </div>
        {/* <button onClick={()=>{setShowModal(true)}}>AW</button> */}
      </header>
      <section>
        <Word/>
      </section>
      <div className='explainDv'>
          <p className='explain'>¡Una <span style={{color:'blue'}}>cadena</span> nueva cada día!
          </p>
      </div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2>¿Cómo jugar?</h2>
          <p>Aquí va la explicación de cómo jugar.</p>
        </Modal>
      )}
    </div>
  );
}
