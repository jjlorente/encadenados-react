import React from 'react';
import '../App.css';
import dataJS from '../words.json';
import { useState, useEffect } from 'react';
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
    // Check if the user has already guessed the first and second word
    const word1Guessed = localStorage.getItem("guessedFirstWord") === "true";
    const word2Guessed = localStorage.getItem("guessedSecondWord") === "true";
    
    // Async function to get the daily word and update hearts count
    const obtenerDailyWord = async () => {
      const actualHearts = localStorage.getItem("hearts");
       // If there is no heart count in local storage, set the count to 5
      !actualHearts 
      ? 
      setHearts(5) 
      : 
      setHearts(actualHearts);

      // If there is no heart count in local storage, set it to 5
      !actualHearts 
      ? 
      localStorage.setItem("hearts", 5) 
      : 
      setHearts(actualHearts);

      // If there is a daily word number in local storage, set the daily word to that number from dataJS.dias
      const numDaily = localStorage.getItem("dailyWord");
      numDaily 
      ? 
      setWords(dataJS.dias[numDaily])
      :
      setWords(dataJS.dias[1]);

      // Check if it's a new day by calling the dailyWord function
      const checkDay = await dailyWord();

      // Check if the user has already guessed the first and second word
      await checkWordsGuessed(word1Guessed, word2Guessed);

      if (word1Guessed && word2Guessed && checkDay === false){
        // If the user has guessed both words and it's not a new day, show the "explicación de las relaciones" button
        setTrueWords(
          <button id="setTrueWords" 
            className='relations' 
            onClick={()=>{setShowModal(true)}}>
            Explicación de las relaciones 
            <i className="fas fa-question-circle"></i>
          </button>
        );
      } else {
        // Otherwise, set the "explicación de las relaciones" button to null
        setTrueWords(null)
      }

      // If it's a new day, reset the heart count, reset the words guessed, and create new input fields for the user to guess the words again
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

        // Create new input fields for the user to guess the words again
        createInputs(false, 1, 'input', setInputs, inputs, "firstInput");
        createInputs(false, 3, 'input2', setInputs2, inputs2, "secondInput");

        // Add form buttons if they don't exist yet
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

        // Set the class names for the input fields div to guess
        setClassName2('divForm');
        setClassName1('divForm');
      } else {
        //Otherwise create the input fields, using the createInputs function and passing the values
        await createInputs(word1Guessed, 1, 'input', setInputs, inputs, "firstInput");
        await createInputs(word2Guessed, 3, 'input2', setInputs2, inputs2, "secondInput");
      }
    };

    // Call the obtenerDailyWord function
    obtenerDailyWord(); 
  }, []);


  /**
   * Creates an array of input elements to allow the user to guess a word
   * @param {boolean} wordGuessed - Indicates if the word has already been guessed
   * @param {number} numWord - Indicates the word number to guess (1 for the first word, 3 for the second word)
   * @param {string} numInput - Indicates the input number (e.g., 'input' for the first word, 'input2' for the second word)
   * @param {function} setArrayInputs - Function to update the array of input elements
   * @param {array} arrayI - Array of input elements
   * @param {string} classInput - CSS class name for the input elements
   */
  const createInputs = async (wordGuessed, numWord, numInput, setArrayInputs, arrayI, classInput) => {
    const numDaily = localStorage.getItem("dailyWord");
    let inputArray = [];
    if (wordGuessed === true) {
      // If the word has already been guessed, create input elements with the word's characters pre-filled in green
      inputArray = dataJS.dias[numDaily][numWord]
        .split('')
        .map((char, i) => {
          const inputProps = { 
            maxLength: 1, 
            className: `inputWord greenInput ${classInput}`,
            readOnly: true, 
            value: char 
          }
          return (
            <input 
              id={`${numInput}${i}`} 
              key={`${numInput}${i}`} 
              type="text" 
              {...inputProps}
            />
          );
        });
        setArrayInputs(inputArray);
    } else {
      // If the word has not been guessed, create input elements for the user to input each character
      inputArray  = dataJS.dias[numDaily][numWord]
        .split('')
        .map((char, i) => {
          const inputProps = i === 0
            // The first input should be read-only and pre-filled with the first character of the word
            ? { 
                maxLength: 1, 
                className: `inputWord greenInput ${classInput}`,
                readOnly: true, 
                value: char 
              }
            // For the rest of the characters, create a regular input element that can be modified
            : { 
                maxLength: 1, 
                className: `inputWord ${classInput}`, 
                onChange: e => handleChange(e, numInput + i), 
                onKeyDown: e => handleKeyDown(e, numInput + i) 
              };
          return (
            <input 
              id={`${numInput}${i}`} 
              key={`${numInput}${i}`} 
              type="text" 
              {...inputProps}
            />
          );
        });
        setArrayInputs(inputArray);
        return inputArray;
    }
  }


  /**
   * Checks if a day has passed and resets certain data accordingly.
   * @returns {Boolean} - True if a day has passed, false otherwise.
   */
  const dailyWord = async () => {
    // Get the current date
    let currentDate = new Date(); 

    // Check if currentDate is a string and convert to Date object if necessary
    if (typeof currentDate === 'string') {
      currentDate = new Date(currentDate);
    }

    // Get year, month, and day from currentDate
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    // Format currentDate as a string
    const formattedDate = `${year}-${month}-${day}`;

    // Get the current daily word and check if it exists in localStorage
    const currentDailyWord = localStorage.getItem('dailyWord');
    const dailyWordExists = Boolean(currentDailyWord);

    // If daily word does not exist, set it to 1
    if (!dailyWordExists) {
      localStorage.setItem("dailyWord", Number(1));
    } else {
      // If daily word exists, set the current word to the value stored in localStorage
      setWords(dataJS.dias[Number(currentDailyWord)]);
    }

    // Get the value of "day" from localStorage and check if it exists
    const storedDate = localStorage.getItem('day');
    const storedDateExists = Boolean(storedDate);

    // If stored date does not exist, set it to currentDate
    if (!storedDateExists) {
      localStorage.setItem("day", currentDate);
    } else {
      // If stored date exists, convert it to a Date object and format it as a string
      const formattedStoredDate = new Date(storedDate); 
      const storedYear = formattedStoredDate.getFullYear();
      const storedMonth = formattedStoredDate.getMonth() + 1; 
      const storedDay = formattedStoredDate.getDate();
      const formattedStoredDateStr = `${storedYear}-${storedMonth}-${storedDay}`;

      // If the current date is later than the stored date, reset certain data and update "day" and "dailyWord" in localStorage
      if (formattedDate > formattedStoredDateStr) {
        // Reset wordsGuessed to false for two specific words
        setWordsGuessed(prevState => ({
          ...prevState,
          word2: false
        }));
        setWordsGuessed(prevState => ({
          ...prevState,
          word1: false
        }));

        // Update "day" in localStorage to currentDate
        localStorage.setItem("day", currentDate);

        // Increment "dailyWord" in localStorage by 1 and set "guessedFirstWord" and "guessedSecondWord" to false
        const numDailyWord = Number(localStorage.getItem("dailyWord"));
        localStorage.setItem("dailyWord", numDailyWord + 1);
        localStorage.setItem("guessedFirstWord", false);
        localStorage.setItem("guessedSecondWord", false);

        // Update current word based on new dailyWord value
        const newDailyWord = localStorage.getItem("dailyWord");
        setWords(dataJS.dias[Number(newDailyWord)]);

        // Return true to indicate that a day has passed
        return true;
      }
    }

    // Return false to indicate that a day has not passed
    return false;
  }


  /**
   * Checks whether the user has guessed both words or not, and updates the state accordingly.
   * Also sets the appropriate class name for the input fields based on whether they have been filled or not.
   * @param {string} word1 - The user's guess for the first word.
   * @param {string} word2 - The user's guess for the second word.
   */
  const checkWordsGuessed = async (word1, word2) => {
    // Set the class name for the first input field based on whether it has been filled or not.
    !word1 ? setClassName1('divForm') : setClassName1(null);
    // Update the state for whether the first word has been guessed or not.
    word1 ?
      setWordsGuessed(prevState => ({
        ...prevState,
        word1: true
      })) :
      setWordsGuessed(prevState => ({
        ...prevState,
        word1: false
      }));

    // Set the class name for the second input field based on whether it has been filled or not.
    !word2 ? setClassName2('divForm') : setClassName2(null);
    // Update the state for whether the second word has been guessed or not.
    word2 ?
      setWordsGuessed(prevState => ({
        ...prevState,
        word2: true
      })) :
      setWordsGuessed(prevState => ({
        ...prevState,
        word2: false
      }));
  }


  /**
   * Handles changes in the input fields for guessing the words.
   * @param {Object} event - The event object for the input field change.
   * @param {string} id - The ID of the input field that triggered the change event.
   */
  function handleChange(event, id) {
    // Get the ID of the current input field and the ID of the next input field.
    const currentInputId = id;
    const nextInputId = currentInputId.slice(0, -1) + (Number(currentInputId.slice(-1)) + 1);

    // Get the current and next input fields.
    const currentInput = document.getElementById(currentInputId);
    const nextInput = document.getElementById(nextInputId);

    // Trim, convert to uppercase, and remove non-alphabetic characters from the value of the current input field.
    currentInput.value = currentInput.value.trim().toUpperCase().replace(/[^a-z]/gi, '');

    // If there is a next input field and the value of the current input field is not empty, focus on the next input field.
    if (nextInput && currentInput.value !== '') {
      nextInput.focus();
    }
  }


  /**
   * Handles changes in the input fields for guessing the words.
   * @param {Object} event - The event object for the input field change.
   * @param {string} id - The ID of the input field that triggered the change event.
   */
  function handleKeyDown(event, id) {
    // Get the id of the input field and the id of the previous input field
    const inputID = id;
    const prevInput = Number(inputID[inputID.length - 1]) - 1;
    const input = id.slice(0, -1) + prevInput;
    // Get the previous input element
    const prevInputElem = document.getElementById(input);

    // Check if the previous input field exists
    if (prevInput >= 1) {
      // Check if the backspace key was pressed, the current input field is empty, and the previous input field is not already filled with a correct letter
      if (event.key === "Backspace" && document.getElementById(id).value === "" && !prevInputElem.classList.contains("greenInput")) {
        // Move focus to the previous input field and prevent the default action of the backspace key
        document.getElementById(input).focus();
        event.preventDefault();
      }
    }
  }



  // This function is an asynchronous event handler for form submission
  const onFormSubmit = async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Initialize a boolean variable to track if any inputs are incomplete
    let inputsIncomplete = false;

    // Determine which form is being submitted and get the list of input elements
    const isForm1 = event.target.id === "form1";
    const inputList = Array.from(event.target.elements);
    const actualForm = isForm1 ? 1 : 2;

    // Check each input element to see if it is incomplete
    inputList.map((element) => {
      if (element.type === "text") {
        if (element.value === "") {
          inputsIncomplete = true;
        }
      }
      return inputList;
    });

    // If any inputs are incomplete, show an error message
    if (inputsIncomplete) {
      Swal.fire({
        title: 'Incomplete Word',
        text: 'Make sure the word has more letters!',
        icon: 'question',
        confirmButtonText: 'OK',
        position: 'top'
      })
    } else {
      // If all inputs are complete, concatenate the input values into a single string
      let letters = "";
      inputList.map((input) => {
        if (input.value) {
          letters += input.value;
        }
        return inputList;
      });
      
      // Check if the concatenated letters match the correct word
      if (letters === (actualForm === 1 ? words[1] : words[3])) {
        // If the guess is correct, update local storage and show a success message
        isForm1 === true 
          ? localStorage.setItem('guessedFirstWord',true) 
          : localStorage.setItem('guessedSecondWord',true);

        await showCorrectWordMessage(inputList, isForm1);

        // Check if both words have been correctly guessed, and update state if they have
        const word1Guessed = localStorage.getItem("guessedFirstWord") === "true";
        const word2Guessed = localStorage.getItem("guessedSecondWord") === "true";
        if (word1Guessed && word2Guessed) {
          setTrueWords(
            <button className='relations' onClick={()=>{setShowModal(true)}}>Explanation of the relationships 
              <i className="fas fa-question-circle"></i>
            </button>
          );
        }
      } else {
        // If the guess is incorrect, show an error message and update the game state accordingly
        const actualHearts = await controlHearts();
        if(actualHearts === 0){
          await loseGame(true);
          await loseGame(false);
        } else {
          await showIncorretWordMessage(inputList, isForm1);
          const actualWord = actualForm === 1 ? words[1] : words[3];
          let countGreenInput = 0;
          inputList.map(input => {
            if (input.classList.contains('greenInput')) {
              countGreenInput = countGreenInput + 1;
            }
            return inputList;
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

  
  /**
   * Displays a success message with a check icon and sets the class name of the input elements accordingly.
   * @param {boolean} isForm1 - Whether the inputs belong to the first form or not.
   */
  // This function is called when the player loses the game
  const loseGame = async(isForm1) => {

    // Show a pop-up message indicating that the player has lost
    Swal.fire({
      title: "¡Has perdido!",
      text: "Vuelve a intentarlo mañana.",
      icon: "error",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Ver las soluciónes!",
      position: 'top'
    });

    // Set the 'true words' state to a button that displays an explanation of the relationships between the words
    setTrueWords(
      <button className='relations' onClick={()=>{setShowModal(true)}}>Explicación de las relaciones 
        <i className="fas fa-question-circle"></i>
      </button>
    );

    // Find all input elements in the form and update their values and styles
    let arrayInputs = [];
    isForm1 === true ? arrayInputs = document.querySelectorAll("#form1 input") : arrayInputs = document.querySelectorAll("#form3 input");
    arrayInputs.forEach((element, index) => {
      isForm1 === true ? element.value = words[1][index] : element.value = words[3][index];
      element.className = `inputWord greenInput ${isForm1 === true ? "firstInput" : "secondInput"}`;
      element.readOnly = true;
    });

    // Set flags in localStorage to indicate that both words have been guessed
    localStorage.setItem('guessedSecondWord',true);
    localStorage.setItem('guessedFirstWord',true);

    // Update the 'words guessed' state to indicate that both words have been guessed
    setWordsGuessed(prevState => ({
      ...prevState,
      word1: true
    }));
    setWordsGuessed(prevState => ({
      ...prevState,
      word2: true
    }));

    // Reset the 'className' states to null
    setClassName1(null); 
    setClassName2(null);
  };


  /**
   * Displays a success message with a check icon and sets the class name of the input elements accordingly.
   * @param {HTMLInputElement[]} inputList - The list of input elements to modify.
   * @param {boolean} isForm1 - Whether the inputs belong to the first form or not.
   */
  const showCorrectWordMessage = async (inputList, isForm1) => {
    // Display a success message using Swal, a popular third-party library for displaying alerts and modals.
    console.log( localStorage.getItem('guessedFirstWord') , localStorage.getItem('guessedSecondWord'))
    if (localStorage.getItem('guessedFirstWord') === "true" && localStorage.getItem('guessedSecondWord') === "true") {
      console.log("entro")
      Swal.fire({
        icon: 'success',
        title: '¡Has ganado!',
        text: "Vuelve mañana para continuar la racha.",
        confirmButtonText: "OK",
        position: 'top'
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: '¡Palabra correcta!',
        showConfirmButton: false,
        timer: 2500,
        position: 'top'
      });
    }
    // Set the class name of the corresponding form elements to null.
    // This clears any previous classes that may have been added.
    isForm1 ? setClassName1(null) : setClassName2(null);

    // Loop through each input element in the inputList.
    inputList.forEach((element) => {
      // If the element is a button, hide it by setting its class name to 'displayNone'.
      if (element.tagName === "BUTTON") {
        element.className = 'displayNone';
      }
      // If the element has a value, set its class name to 'inputWord greenInput firstInput' or 'inputWord greenInput secondInput'
      // depending on the value of isForm1. Also, set its readOnly property to true so that the user cannot modify its value.
      else if (element.value) {
        element.className = `inputWord greenInput ${isForm1 ? "firstInput" : "secondInput"}`;
        element.readOnly = true;
      }
    });

  };


  /**
   * Decreases the number of hearts by one and updates the state and local storage accordingly.
   * @return {number} The updated number of hearts after the decrement.
   */
  async function controlHearts() {
    // Get the current number of hearts and subtract one.
    const actualHeartsErrors = hearts - 1;
    // Update the state with the new number of hearts.
    setHearts(actualHeartsErrors);
    // Update the local storage with the new number of hearts.
    localStorage.setItem("hearts", actualHeartsErrors);
    // Return the new number of hearts.
    return actualHeartsErrors;
  }


  /**
  * Shows a message indicating that the entered word is incorrect, removes a life and gives a hint by revealing one additional letter.
  * @param {NodeList} inputList - A list of HTML input elements representing the word.
  * @param {boolean} isForm1 - A boolean value indicating if the word is in form 1 or form 2.
  */
  const showIncorretWordMessage = async (inputList, isForm1) => {
    // A boolean flag used to check if a hint has already been given.
    let found = false; 
    // Shows an alert using the SweetAlert2 when the user fail the word.
    Swal.fire({
      title: 'Palabra incorrecta.',
      text: 'Una letra más como ayuda pero te quitamos una vida!',
      icon: 'error',
      confirmButtonText: 'OK',
      position: 'top'
    }).then(function() {
      // Executes the following code after the user clicks the OK button in the modal dialog.
      // Iterates over the input elements in the word.
      inputList.map((element, index) => { 
        // Checks if the input element has not been correctly guessed yet and a hint has not been given.
        if (!element.className.includes('greenInput') && !found) { 
          // Reveals one additional letter.
          isForm1 ? element.value = words[1][index] : element.value = words[3][index]; 
          // Changes the input element's class to green to additional letter.
          element.className = `inputWord greenInput ${isForm1 ? "firstInput" : "secondInput"}`;
          // Disables editing of the additional letter.
          element.readOnly = true;
          // Sets the flag to true to indicate a hint has been given.
          found = true; 
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
        </Modal>
      )}
      <div className='divHearts'>
        {Array(5).fill(null).map((_, index) => (
          <img
            alt='heart'
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