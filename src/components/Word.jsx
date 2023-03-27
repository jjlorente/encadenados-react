import React from 'react';
import '../App.css';
import { useState, useEffect, useRef } from 'react';

export const Word = () => {
    const [words, setWords] = useState(["AGUA","BENDITA","LOCURA"])
    const inputs = [];
    
    for (let i = 0; i < words[1].length; i++ ) {
        if (i === 0){
            inputs.push(<label style={{width:10}} 
                maxLength="1" 
                id={i} 
                key={i}
                readOnly={true} 
                >{words[1][i]}</label>
            );
        } else {
            inputs.push(<input 
                className='inputWord'
                ref={(input) => (inputs[i] = input)}
                style={{width:10}} 
                maxLength="1" 
                id={i} 
                key={i} 
                type="text"
                onKeyDown={(event) => handleKeyDown(event, i)}
                onChange={(event) => handleChange(event, i)}/>
            )
        }
    }

    function handleChange(event, id){
        const inputID = event.target.getAttribute('id');
        const actualInput = inputs[Number(inputID)];
        const nextInput = inputs[Number(inputID) + 1];
        inputs[id].value = inputs[id].value.toUpperCase();
        if (!isNaN(parseInt(event.target.value))) {
            //TODO Alert react not numeric
            console.log("s");
            alert("a");
            actualInput.value = "";
        } else {
            if (nextInput && inputs[id].value != "") {
                nextInput.focus();
            }
        }
    }

    function handleKeyDown(event, id) {
        if (id > 1) {
            if (event.key === "Backspace" && inputs[id].value === "") {
                inputs[id - 1].focus();
            }
        }
    }

    const onFormSubmit = (event) => {
        event.preventDefault();
        console.log("e");
      };

    return (
        <div className="Word">
            <div>
                {words.map((word, index) => (
                    index === 1 ?(
                        <div key={"divForm"} className='wordTip'>
                            <form key={"form"} onSubmit={onFormSubmit}>
                                {inputs.map((input) => (
                                    input
                                ))}
                                <button style={{display: 'none'}} type="submit">Enviar</button>
                            </form>
                        </div>
                    ) : (
                        <div key={"divSpan"+index} className='wordTip'>
                            <span key={index}>{word}</span>
                        </div>
                    )
                    
                ))}
            </div>
        </div>
    )

}