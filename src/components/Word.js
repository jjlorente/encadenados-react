import React from 'react';
import '../App.css';
import dataJS from '../words.json';
import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import Image from "../Assets/flecha-izquierda.png";

export const Word = () => {
  const [words, setWords] = useState(dataJS.dias[1]);
  const [inputs, setInputs] = useState([]);
  const [inputs2, setInputs2] = useState([]);
  const [classForm1, setClassName1] = useState(null);
  const [classForm2, setClassName2] = useState(null);
  const [wordsGuessed, setWordsGuessed] = useState({word1: false, word2: false})

  useEffect(() => {
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

    if(!valorActual){
        localStorage.setItem("day", fechaActual);
    } else {
      const fechaGuardada = new Date(valorActual); 
      const anio = fechaGuardada.getFullYear();
      const mes = fechaGuardada.getMonth() + 1; 
      const dia = fechaGuardada.getDate();
      const fechaFormateadaGuardada = `${anio}-${mes}-${dia}`;

      if(fechaFormateada > fechaFormateadaGuardada){
        localStorage.setItem("day", fechaActual);
        const numDay = Number(localStorage.getItem("dailyWord"));
        localStorage.setItem("dailyWord", numDay+1);
        //Reset words acertadas
        setWordsGuessed(prevState => ({
          ...prevState,
          word1: true
        })) 
        localStorage.removeItem("guessedFirstWord");
        localStorage.removeItem("guessedSecondWord");
      }
    }
    const numDaily = localStorage.getItem("dailyWord");
    setWords(dataJS.dias[Number(numDaily)])

    const word1Guessed = localStorage.getItem("guessedFirstWord") === "true";
    !word1Guessed ? setClassName1('divForm') : setClassName1(null);
    word1Guessed ? 
    setWordsGuessed(prevState => ({
      ...prevState,
      word1: true
    })) 
    : 
    setWordsGuessed(prevState => ({
      ...prevState,
      word1: false
    }));

    const word2Guessed = localStorage.getItem("guessedSecondWord") === "true";
    !word2Guessed ? setClassName2('divForm') : setClassName2(null);
    word2Guessed ? 
    setWordsGuessed(prevState => ({
      ...prevState,
      word2: true
    })) 
    : 
    setWordsGuessed(prevState => ({
      ...prevState,
      word2: false
    }));

    createInputs(word1Guessed, 1, 'input', setInputs, inputs, "firstInput");
    createInputs(word2Guessed, 3, 'input2', setInputs2, inputs2, "secondInput");
  }, []);

  const createInputs = (wordGuessed, numWord, numInput, setArrayInputs, arrayI, classInput) => {
    const numDaily = localStorage.getItem("dailyWord");
    console.log(words)
    if (wordGuessed) {
      const array1 = dataJS.dias[numDaily][numWord].split('').map((char, i) => {
        const inputProps = { maxLength: 1, className: `inputWord greenInput ${classInput}`,readOnly:true, value: char }
        return <input id={`${numInput}${i}`} key={`${numInput}${i}`} type="text" {...inputProps} />;
      });
      setArrayInputs(array1);
    } else {
      const array2 = dataJS.dias[numDaily][numWord].split('').map((char, i) => {
        const inputProps = i === 0
          ? { maxLength: 1, className: `inputWord greenInput ${classInput}`,readOnly:true, value: char }
          : { maxLength: 1, className: `inputWord ${classInput}`, onChange: e => handleChange(e, numInput + i), onKeyDown: e => handleKeyDown(e, numInput + i) };
        return <input id={`${numInput}${i}`} key={`${numInput}${i}`} /* CREAR REF */ type="text" {...inputProps} />;
      });
      setArrayInputs(array2);
    }
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

  const onFormSubmit = (event) => {
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
      });
      if (letters === (actualForm === 1 ? words[1] : words[3])) {
        isForm1 === true 
        ? localStorage.setItem('guessedFirstWord',true) 
        : localStorage.setItem('guessedSecondWord',true);
        showCorrectWordMessage(inputList, isForm1);
      } else {
        showIncorretWordMessage(inputList, isForm1);
      }
    }
  };
    
  const showCorrectWordMessage = (inputList, isForm1) => {
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
      });
    });
  };

  const showIncorretWordMessage = (inputList, isForm1) => {
    let found = false;
    Swal.fire({
      title: 'Palabra incorrecta.',
      text: 'Una letra mas como ayuda.',
      icon: 'error',
      confirmButtonText: 'OK',
      position: 'top'
    }).then(function() {
      inputList.map((element,index) => {
        element.blur()
        if(!element.className.includes('greenInput') && found===false ){
          isForm1 ? element.value = words[1][index] : element.value = words[3][index];
          element.className = `inputWord greenInput ${isForm1 ? "firstInput" : "secondInput"}`;
          element.readOnly = true;
          found = true;
        } else if (!element.className.includes('greenInput')) {
          element.value = "";
        }
      });
    });
  };
    
  return (
    <div className="Word">
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
                    <div className='inputsRow'>
                      {index === 1 ? inputs.map((input) => input) : inputs2.map((input) => input)}
                      {index === 1 && !wordsGuessed['word1'] ? 
                        <button className='buttonForm' type="submit">
                          <img src={Image} alt="Arrow"/>      
                        </button> :
                        null
                      }
                    </div>
                    {index === 3 && !wordsGuessed['word2'] ? 
                      <button className='buttonForm' type="submit">
                        <img src={Image} alt="Arrow"/>                      
                      </button> :
                      null
                    }
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