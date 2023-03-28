import React from 'react';
import '../App.css';
import dataJS from '../words.json';
import { useState } from 'react';
const Swal = require('sweetalert2')

export const Word = () => {
    const [contador] = useState(1);
    const [words] = useState(dataJS.dias[contador])
    
    const inputs = [];
    const inputs2 = [];
    for (let i = 0; i < words[1].length; i++ ) {
        if (i === 0){
            inputs.push(<input 
                style={{width:10}} 
                className='inputWord greenInput'
                maxLength="1" 
                id={'input'+i} 
                key={'input'+i}
                type="text"
                tabIndex="-1"
                readOnly={true}
                value={words[1][i]}
                />
            );
        } else {
            inputs.push(<input 
                className='inputWord'
                ref={(input) => (inputs[i] = input)}
                style={{width:10}} 
                maxLength="1" 
                id={'input'+i} 
                key={'input'+i} 
                type="text"
                onKeyDown={(event) => handleKeyDown(event, 'input'+i)}
                onChange={(event) => handleChange(event, 'input'+i)}
                />
            )
        }
    }

    for (let i = 0; i < words[3].length; i++ ) {
        if (i === 0){
            inputs2.push(<input 
                style={{width:10}} 
                className='inputWord greenInput'
                maxLength="1" 
                id={'input2'+i} 
                key={'input2'+i}
                type="text"
                readOnly={true}
                tabIndex="-1"
                value={words[3][i]}
                />
            );
        } else {
            inputs2.push(<input 
                className='inputWord'
                ref={(input) => (inputs2[i] = input)}
                style={{width:10}} 
                maxLength="1" 
                id={'input2'+i} 
                key={'input2'+i} 
                type="text"
                onKeyDown={(event) => handleKeyDown(event, 'input2'+i)}
                onChange={(event) => handleChange(event, 'input2'+i)}
                />
            )
        }
    }

    function handleChange(event, id){
        const inputID = id;
        //Next input for focus
        const nextInput = Number(inputID[inputID.length-1]) + 1;
        const newId = id.slice(0, -1) + nextInput;
        const input = document.getElementById(id);
        const newInput = document.getElementById(newId);

        //Only string valid
        input.value = input.value.toUpperCase();
        input.value = input.value.replace(/[^a-z]/gi, '')
        
        if (newInput && document.getElementById(id).value !== "" ) {
            console.log("gola");
            newInput.focus();
        }
        
    }

    function handleKeyDown(event, id) {
        const inputID = id;
        const prevInput = Number(inputID[inputID.length-1]) - 1;
        const input = id.slice(0, -1) + prevInput;
        if (prevInput >= 1) {
            if (event.key === "Backspace" && document.getElementById(id).value === "") {
                console.log("dasa")
                document.getElementById(input).focus();
            }
        }
    }


    const [contadorInput, setContadorInput] = useState(1);
    const [contadorInput2, setContadorInput2] = useState(1);
    const onFormSubmit = (event) => {
        let inputsIncomplete = false;
        const inputList = event.target.id === "form1" ? inputs : inputs2;
        inputList.forEach(input => {
            if(input.value === ""){
                inputsIncomplete = true;
            }
        });

        if(inputsIncomplete) {
            Swal.fire(
                'Palabra incompleta?',
                'Fijate que la palabra necesita más letras!',
                'question'
            )
        } else {
            let letters;

            if(inputList === inputs){
                letters = words[1][0];
            } else {
                letters = words[3][0];
            }
            
            inputList.forEach(input => {
                if(input.value){
                    letters = letters + input.value;
                }      
            })

            if(inputList === inputs){
                if(words[1] === letters) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Palabra correcta!',
                        showConfirmButton: false,
                        timer: 1500,
                      })

                } else {
                    Swal.fire({
                        title: 'Palabra incorrecta!',
                        text: 'Te damos una letra mas como ayuda.',
                        icon: 'error',
                        confirmButtonText: 'Vamos'
                    })
                    inputs[contadorInput].value = words[1][contadorInput];
                    inputs[contadorInput].readOnly = true;
                    inputs[contadorInput].className = "inputWord greenInput";
                    setContadorInput(contadorInput+1);
                    for(let i = contadorInput+1; i < inputs.length; i++) {
                        inputs[i].value = "";
                    }
                }
            } else {
                if(words[3] === letters) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Palabra correcta!',
                        showConfirmButton: false,
                        timer: 1500
                      })
                } else {
                    Swal.fire({
                        title: 'Palabra incorrecta!',
                        text: 'Te damos una letra mas como ayuda.',
                        icon: 'error',
                        confirmButtonText: 'Vamos'
                    })
                    inputs2[contadorInput2].value = words[3][contadorInput2];
                    inputs2[contadorInput2].readOnly = true;
                    inputs2[contadorInput2].className = "inputWord greenInput";
                    setContadorInput2(contadorInput2+1);
                    for(let i = contadorInput2+1; i < inputs2.length; i++) {
                        inputs2[i].value = "";
                    }
                }
            }
        }
        event.preventDefault();
      };

    return (
        <div className="Word">
            <div className='cont'>
                {words.map((word, index) => {
                    if ( index === 1 ) {
                        return ( 
                            <div key={"divForm"+index} className='wordTip'>
                                <i className="fas fa-arrow-down" style={{marginBottom:10,marginTop:10}}></i>
                                <form key={"form"+index} id={"form"+index} onSubmit={onFormSubmit}>
                                    {inputs.map((input) => (
                                        input
                                    ))}
                                    <button style={{display: 'none'}} type="submit">Enviar</button>
                                </form>
                                <i className="fas fa-arrow-up" style={{marginBottom:10,marginTop:10}}></i>
                            </div> 
                            
                        )
                    } else if ( index === 3 ){
                        return (
                        <div key={"divForm"+index} className='wordTip'>
                            <i className="fas fa-arrow-down" style={{marginBottom:10,marginTop:10}}></i>
                            <form key={"form"+index} id={"form"+index} onSubmit={onFormSubmit}>
                                {inputs2.map((input) => (
                                    input
                                ))}
                                <button style={{display: 'none'}} type="submit">Enviar</button>
                            </form>
                            <i className="fas fa-arrow-up" style={{marginBottom:10,marginTop:10}}></i>
                        </div> 
                        )
                    } else {
                        return (
                        <div key={"divSpan"+index} className='wordTip'>
                            <div className='divSpans'>
                                {word.split("").map((letter,indexLetter) => (
                                    <div className='divSpan' key={"div"+indexLetter}>
                                        <span key={"letter"+indexLetter}>{letter}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        )
                    }
                })}
            </div>
        </div>
    )

}