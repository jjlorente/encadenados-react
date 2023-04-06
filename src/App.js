import './App.css';
import { Word } from './components/Word';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header/>
      </header>
      <section>
        <Word/>
      </section>
      <footer>
        <Footer/>
      </footer>
    </div>
  );
}
