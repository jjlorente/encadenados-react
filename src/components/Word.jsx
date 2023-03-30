import React from 'react';
import '../App.css';
import dataJS from '../words.json';
import { useState, useEffect } from 'react';
const Swal = require('sweetalert2');

export const Word = () => {
    const dailyWord = dataJS.dias[3];
    const [words, setWords] = useState(dailyWord);
    const [inputs, setInputs] = useState([]);
    const [inputs2, setInputs2] = useState([]);
    
    useEffect(() => {
        const word1Guessed = localStorage.getItem("guessedFirstWord") === "true";
        const word2Guessed = localStorage.getItem("guessedSecondWord") === "true";
        createInputs(word1Guessed, 1, 'input', setInputs, inputs, "firstInput");
        createInputs(word2Guessed, 3, 'input2', setInputs2, inputs2, "secondInput");
    }, []);

    const createInputs = (wordGuessed, numWord, numInput, setArrayInputs, array, classInput) => {
        if (wordGuessed) {
            const array = words[numWord].split('').map((char, i) => {
                const inputProps = { maxLength: 1, className: `inputWord greenInput ${classInput}`,readOnly:true, value: char }
                return <input id={`${numInput}${i}`} key={`${numInput}${i}`} type="text" {...inputProps} />;
            });
            setArrayInputs(array);
        } else {
            const array = words[numWord].split('').map((char, i) => {
                const inputProps = i === 0
                  ? { maxLength: 1, className: `inputWord greenInput ${classInput}`,readOnly:true, value: char }
                  : { maxLength: 1, className: `inputWord ${classInput}`, ref: el => (array[i] = el), onChange: e => handleChange(e, numInput + i), onKeyDown: e => handleKeyDown(e, numInput + i) };
                return <input id={`${numInput}${i}`} key={`${numInput}${i}`} type="text" {...inputProps} />;
            });
            setArrayInputs(array);
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
        
        if (prevInput >= 1) {
          if (event.key === "Backspace" && document.getElementById(id).value === "") {
            document.getElementById(input).focus();
            event.preventDefault();
          }
        }
    }
      
    const onFormSubmit = (event) => {
      event.preventDefault();
    
      let inputsIncomplete = false;
      const isForm1 = event.target.id === "form1";
      const inputList = isForm1 ? inputs : inputs2;
    
      inputList.forEach(input => {
        if (input.value === "") {
          inputsIncomplete = true;
        }
      });
    
      if (inputsIncomplete) {
        Swal.fire({
          title: 'Palabra incompleta?',
          text: 'Fijate que la palabra necesita más letras!',
          icon: 'question',
          confirmButtonText: 'OK',
          position: 'top'
        })
      } else {
        let  letters = isForm1 ? words[1][0] : words[3][0];
        inputList.forEach(input => {
          if (input.value) {
            letters += input.value;
          }
        });
        console.log(letters)
        if (letters === (isForm1 ? words[1] : words[3])) {
            console.log("hola")
            isForm1 === true 
            ? localStorage.setItem('guessedFirstWord',true) 
            : localStorage.setItem('guessedSecondWord',true);
            showCorrectWordMessage(isForm1);
        } else {
            showIncorretWordMessage(isForm1);
        }
      }
    };
    
    const showCorrectWordMessage = (isForm1) => {
        Swal.fire({
            icon: 'success',
            title: 'Palabra correcta!',
            showConfirmButton: false,
            timer: 2500,
            position: 'top'
        }).then( function( result )  {
            const elements = document.getElementsByClassName(isForm1 ? "firstInput" : "secondInput");
            Array.from(elements).forEach(element => {
                element.className = `inputWord greenInput ${isForm1 ? "firstInput" : "secondInput"}`;
                element.readOnly = true;
            });
        });
    };

    const showIncorretWordMessage = (isForm1) => {
        let found = false;
        Swal.fire({
          title: 'Palabra incorrecta!',
          text: 'Te damos una letra mas como ayuda.',
          icon: 'error',
          confirmButtonText: 'OK',
          position: 'top'
        }).then(function(result) {
            const elements = document.getElementsByClassName(isForm1 ? "firstInput" : "secondInput");
            Array.from(elements).forEach((element,index) => {
                if(!element.className.includes('greenInput') && found===false ){
                    isForm1 ?  element.value = words[1][index] : element.value = words[3][index];
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
            <div className='cont'>
                {words.map((word, index) => {
                    const isForm = index === 1 || index === 3;
                    return (
                        <div key={isForm ? `divForm${index}` : `divSpan${index}`} className='wordTip'>
                            {isForm ? (
                                <>
                                    <span className='arrowIcon'>⇅</span>                                    
                                    <form key={`form${index}`} id={`form${index}`} onSubmit={onFormSubmit}>
                                        {index === 1 ? inputs.map((input) => input) : inputs2.map((input) => input)}
                                        <button style={{display: 'none'}} type="submit">Enviar</button>
                                    </form>
                                    <span className='arrowIcon'>⇅</span>
                                </>
                            ) : (
                                <div className='divSpans'>
                                    {word.split("").map((letter, indexLetter) => (
                                        <div className='divSpan' key={`div${indexLetter}`}>
                                            <span key={`letter${indexLetter}`}>{letter}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

}