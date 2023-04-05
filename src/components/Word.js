import React from 'react';
import '../App.css';
import dataJS from '../words.json';
import { useState, useEffect, useCallback, useRef } from 'react';
import Heart from '../Assets/heart.png';
import HeartBrkd from '../Assets/heartLose.png';
import Swal from 'sweetalert2';
import { Modal } from './Modal';
import ReactDOM from 'react-dom';

export const Word = () => {
  const [words, setWords] = useState(dataJS.dias[1]);
  const [inputs, setInputs] = useState([]);
  const [inputs2, setInputs2] = useState([]);
  const [classForm1, setClassName1] = useState(null);
  const [classForm2, setClassName2] = useState(null);
  const [wordsGuessed, setWordsGuessed] = useState({word1: false, word2: false})
  const [trueWords, setTrueWords] = useState(null);
  const [hearts, setHearts] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const word1Guessed = localStorage.getItem("guessedFirstWord") === "true";
    const word2Guessed = localStorage.getItem("guessedSecondWord") === "true";
    const obtenerDailyWord = async () => {
      const actualHearts = localStorage.getItem("hearts");
      !actualHearts ? setHearts(5) : setHearts(actualHearts);
      !actualHearts ? localStorage.setItem("hearts", 5) : setHearts(actualHearts);
      const numDaily = localStorage.getItem("dailyWord");
      numDaily ? setWords(dataJS.dias[numDaily]): setWords(dataJS.dias[1]);

      const checkDay = await dailyWord();
      await checkWordsGuessed(word1Guessed, word2Guessed);
      if (word1Guessed && word2Guessed && checkDay===false){
        setTrueWords(
          <button id="setTrueWords" className='relations' onClick={()=>{setShowModal(true)}}>Explicación de las relaciones 
            <i className="fas fa-question-circle"></i>
          </button>
        );
      } else {
        setTrueWords(null)
      }
      
      if (checkDay === true){
        localStorage.setItem("hearts", 5);
        setHearts(5);
        setWordsGuessed(prevState => ({
          ...prevState,
          word2: false
        }));
        setWordsGuessed(prevState => ({
          ...prevState,
          word1: false
        }));
        createInputs(false, 1, 'input', setInputs, inputs, "firstInput");
        createInputs(false, 3, 'input2', setInputs2, inputs2, "secondInput");
        const buttonForm1 = <button id="buttonForm1" className='buttonForm' type="submit"><i id="iconQuestion" className="fas fa-question-circle"></i></button>
        const buttonForm2 = <button id="buttonForm2" className='buttonForm' type="submit"><i id="iconQuestion" className="fas fa-question-circle"></i></button>

        const buttonDiv1 = document.getElementById("myRefButton1");
        const buttonDiv2 = document.getElementById("myRefButton3");
        
        if(!document.getElementById("buttonForm1")){
          const buttonNode1 = document.createElement('div');
          ReactDOM.render(buttonForm1, buttonNode1);
          buttonDiv1.appendChild(buttonNode1.firstChild);
        }
        if(!document.getElementById("buttonForm2")){
          const buttonNode2 = document.createElement('div');
          ReactDOM.render(buttonForm2, buttonNode2);
          buttonDiv2.appendChild(buttonNode2.firstChild);
        }
        setClassName2('divForm');
        setClassName1('divForm');
      } else {
        createInputs(word1Guessed, 1, 'input', setInputs, inputs, "firstInput");
        createInputs(word2Guessed, 3, 'input2', setInputs2, inputs2, "secondInput");
      }
    };
    obtenerDailyWord(); 
  }, []);


  const createInputs = (wordGuessed, numWord, numInput, setArrayInputs, arrayI, classInput) => {
    const numDaily = localStorage.getItem("dailyWord");
    if (wordGuessed === true) {
      console.log("entro", wordGuessed)
      const array1 = dataJS.dias[numDaily][numWord].split('').map((char, i) => {
        const inputProps = { 
          maxLength: 1, 
          className: `inputWord greenInput ${classInput}`,
          readOnly:true, 
          value: char 
        }
        return <input 
                  id={`${numInput}${i}`} 
                  key={`${numInput}${i}`} 
                  type="text" 
                  {...inputProps}
                />;
      });
      setArrayInputs(array1);
    } else {
      const array2 = dataJS.dias[numDaily][numWord].split('').map((char, i) => {
        const inputProps = i === 0
          ? { maxLength: 1, 
              className: `inputWord greenInput ${classInput}`,
              readOnly: true, 
              value: char 
            }
          : { 
              maxLength: 1, 
              className: `inputWord ${classInput}`, 
              onChange: e => handleChange(e, numInput + i), 
              onKeyDown: e => handleKeyDown(e, numInput + i) 
            };
        return <input 
                id={`${numInput}${i}`} 
                key={`${numInput}${i}`} 
                type="text" {...inputProps}
               />;
      });
      setArrayInputs(array2);
    }
  }

  const dailyWord = async () => {
    const fechaActual = new Date(); 
    if (typeof fechaActual === 'string') {
      fechaActual = new Date(fechaActual);
    }
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1;
    const dia = fechaActual.getDate();
    const fechaFormateada = `${anio}-${mes}-${dia}`;

    const valorActual = localStorage.getItem('day');
    const wordDiaria = localStorage.getItem('dailyWord');
    if(!wordDiaria){
      localStorage.setItem("dailyWord", Number(1));
    } else {
      setWords(dataJS.dias[Number(wordDiaria)]);
    }
    let checkDay = false;
    if(!valorActual){
        localStorage.setItem("day", fechaActual);
    } else {
      const fechaGuardada = new Date(valorActual); 
      const anio = fechaGuardada.getFullYear();
      const mes = fechaGuardada.getMonth() + 1; 
      const dia = fechaGuardada.getDate();
      const fechaFormateadaGuardada = `${anio}-${mes}-${dia}`;
      if(fechaFormateada > fechaFormateadaGuardada){
        setWordsGuessed(prevState => ({
          ...prevState,
          word2: false
        }));
        setWordsGuessed(prevState => ({
          ...prevState,
          word1: false
        }));
        localStorage.setItem("day", fechaActual);
        const numDay = Number(localStorage.getItem("dailyWord"));
        localStorage.setItem("dailyWord", numDay+1);
        localStorage.setItem("guessedFirstWord", false);
        localStorage.setItem("guessedSecondWord", false);
        const numDaily = localStorage.getItem("dailyWord");
        setWords(dataJS.dias[Number(numDaily)]);
        checkDay = true;
      }
    }
    return checkDay;
  }

  const checkWordsGuessed = async (word1, word2) => {
    !word1 ? setClassName1('divForm') : setClassName1(null);
    word1 ? 
    setWordsGuessed(prevState => ({
      ...prevState,
      word1: true
    })) 
    : 
    setWordsGuessed(prevState => ({
      ...prevState,
      word1: false
    }));

    !word2 ? setClassName2('divForm') : setClassName2(null);
    word2 ? 
    setWordsGuessed(prevState => ({
      ...prevState,
      word2: true
    })) 
    : 
    setWordsGuessed(prevState => ({
      ...prevState,
      word2: false
    }));
  }

  function handleChange(event, id) {
    const currentInputId = id;
    const nextInputId = currentInputId.slice(0, -1) + (Number(currentInputId.slice(-1)) + 1);
    const currentInput = document.getElementById(currentInputId);
    const nextInput = document.getElementById(nextInputId);
    currentInput.value = currentInput.value.trim().toUpperCase().replace(/[^a-z]/gi, '');
    if (nextInput && currentInput.value !== '') {
      nextInput.focus();
    }
  }

  function handleKeyDown(event, id) {
    const inputID = id;
    const prevInput = Number(inputID[inputID.length-1]) - 1;
    const input = id.slice(0, -1) + prevInput;
    const prevInputElem = document.getElementById(input);
    if (prevInput >= 1) {
      if (event.key === "Backspace" && document.getElementById(id).value === "" && !prevInputElem.classList.contains("greenInput")) {
        document.getElementById(input).focus();
        event.preventDefault();
      }
    }
  }

  const onFormSubmit = async (event) => {
    event.preventDefault();

    let inputsIncomplete = false;
    const isForm1 = event.target.id === "form1";
    const inputList = Array.from(event.target.elements);
    const actualForm = isForm1 ? 1 : 2;

    inputList.map((element) => {
      if (element.type === "text") {
        if (element.value === "") {
          inputsIncomplete = true;
        }
      }
      return inputList;
    });

    if (inputsIncomplete) {
      Swal.fire({
        title: 'Palabra incompleta',
        text: 'Fijate que la palabra necesita más letras!',
        icon: 'question',
        confirmButtonText: 'OK',
        position: 'top'
      })
    } else {
      let letters = "";
      inputList.map((input) => {
        if (input.value) {
          letters += input.value;
        }
        return inputList;
      });
      if (letters === (actualForm === 1 ? words[1] : words[3])) {
        isForm1 === true 
          ? localStorage.setItem('guessedFirstWord',true) 
          : localStorage.setItem('guessedSecondWord',true);

        await showCorrectWordMessage(inputList, isForm1);

        const word1Guessed = localStorage.getItem("guessedFirstWord") === "true";
        const word2Guessed = localStorage.getItem("guessedSecondWord") === "true";
        if (word1Guessed && word2Guessed) {
          setTrueWords(
            <button className='relations' onClick={()=>{setShowModal(true)}}>Explicación de las relaciones 
              <i className="fas fa-question-circle"></i>
            </button>
          );
        }
      } else {
        const actualHearts = await controlHearts();
        if(actualHearts === 0){
          await loseGame(true);
          await loseGame(false);
        } else {
          await showIncorretWordMessage(inputList, isForm1);
          const actualWord = actualForm === 1 ? words[1] : words[3];
          let countGreenInput = 0;
          inputList.map(input => {
            input.classList.contains('greenInput') ? 
            countGreenInput = countGreenInput + 1 : countGreenInput = countGreenInput;
          })

          if (countGreenInput+1 === actualWord.length) {
            isForm1 === true 
            ? localStorage.setItem('guessedFirstWord',true) 
            : localStorage.setItem('guessedSecondWord',true);
          
            isForm1 === true ?
            setWordsGuessed(prevState => ({
              ...prevState,
              word1: true
            })) : 
            setWordsGuessed(prevState => ({
              ...prevState,
              word2: true
            }))
            
            isForm1 ? setClassName1(null) : setClassName2(null);
          }
        } 
      }
    }
  };

  const loseGame = async(isForm1) => {
    Swal.fire({
      title: "¡Has perdido!",
      text: "Vuelve a intentarlo mañana.",
      icon: "error",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Ver las soluciónes!",
      position: 'top'
    });
    setTrueWords(
      <button className='relations' onClick={()=>{setShowModal(true)}}>Explicación de las relaciones 
        <i className="fas fa-question-circle"></i>
      </button>
    );
    let arrayInputs = [];
    isForm1 === true ? arrayInputs = document.querySelectorAll("#form1 input") : arrayInputs = document.querySelectorAll("#form3 input");
    arrayInputs.forEach((element, index) => {
      isForm1 === true ? element.value = words[1][index] : element.value = words[3][index];
      element.className = `inputWord greenInput ${isForm1 === true ? "firstInput" : "secondInput"}`;
      element.readOnly = true;
    });
    localStorage.setItem('guessedSecondWord',true);
    localStorage.setItem('guessedFirstWord',true);
    setWordsGuessed(prevState => ({
      ...prevState,
      word1: true
    }));
    setWordsGuessed(prevState => ({
      ...prevState,
      word2: true
    }));
    setClassName1(null); 
    setClassName2(null);
  }

  const showCorrectWordMessage = async (inputList, isForm1) => {
    Swal.fire({
      icon: 'success',
      title: '¡Palabra correcta!',
      showConfirmButton: false,
      timer: 2500,
      position: 'top'
    }).then( function() {
      isForm1 ? setClassName1(null) : setClassName2(null);
      inputList.map((element) => {
        if (element.tagName === "BUTTON") {
          element.className = `displayNone`
        } else if (element.value) {
          element.className = `inputWord greenInput ${isForm1 ? "firstInput" : "secondInput"}`;
          element.readOnly = true;
        }
        return inputList;
      });
    });
  };

  async function controlHearts(){
    const actualHeartsErrors = hearts - 1;
    setHearts(actualHeartsErrors);
    localStorage.setItem("hearts", actualHeartsErrors);
    return actualHeartsErrors;
  }

  const showIncorretWordMessage = async (inputList, isForm1) => {
    let found = false;
    Swal.fire({
      title: 'Palabra incorrecta.',
      text: 'Una letra más como ayuda pero te quitamos una vida!',
      icon: 'error',
      confirmButtonText: 'OK',
      position: 'top'
    }).then(function() {
      inputList.map((element,index) => {
        if(!element.className.includes('greenInput') && found===false ){
          isForm1 ? element.value = words[1][index] : element.value = words[3][index];
          element.className = `inputWord greenInput ${isForm1 ? "firstInput" : "secondInput"}`;
          element.readOnly = true;
          found = true;
          inputList[index + 1].focus();
        } else if (!element.className.includes('greenInput')) {
          element.value = "";
        }
        return inputList;
      });
    });
  };
    
  return (
    <div className="Word">
      {trueWords}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2>Relación</h2>
          <p>Aquí va la explicación.</p>
          <p>En proceso.</p>
        </Modal>
      )}
      <div className='divHearts'>
        {Array(5).fill(null).map((_, index) => (
          <img
            key={`${index}-heart`}
            className='heartImg'
            style={{ maxWidth: '30px', height: 'auto' }}
            src={index < hearts ? Heart : HeartBrkd}
          />
        ))}
      </div>
      {words.map((word, index) => {
        const isForm = index === 1 || index === 3;
        return (
          <div
            key={isForm ? `divForm${index}` : `divSpan${index}`}
            className="wordTip"
          >
            {isForm ? (
              <>
                <span className="arrowIcon">⇅</span>
                <div className={`${index === 1 ? classForm1 : classForm2} formContainer`}>
                  <form
                    key={`form${index}`}
                    id={`form${index}`}
                    onSubmit={onFormSubmit}
                  >
                    <div className='inputsRow' id={`myRefButton${index}`}>
                      {index === 1 ? inputs.map((input) => input) : inputs2.map((input) => input)}
                      {index === 1 && !wordsGuessed['word1'] ? 
                        <button id="buttonForm1" className='buttonForm' type="submit">
                          <i className="fas fa-question-circle"></i>
                        </button> :
                        null
                      }
                      {index === 3 && !wordsGuessed['word2'] ? 
                        <button id="buttonForm2" className='buttonForm' type="submit">
                          <i id={"iconQuestion"} className="fas fa-question-circle"></i>                     
                        </button> :
                        null
                      }
                    </div>
                  </form>
                </div>
                <span className="arrowIcon">⇅</span>
              </>
            ) : (
              <div className="divSpans">
                {word.split("").map((letter, indexLetter) => (
                  <div className="divSpan" key={`div${indexLetter}`}>
                    <span key={`letter${indexLetter}`}>{letter}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}