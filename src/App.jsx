import './App.css';
import { useState, useEffect } from 'react';
import { Word } from './components/Word';


export default function App() {

  const [test, setTest] = useState();

  useEffect(()=>{
    async function fetchData() {
      await setTest("A")
    }
    fetchData();
  }, [])
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>ENCADENADOS</h1>
      </header>
      <Word />
    </div>
  );
}