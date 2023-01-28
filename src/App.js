// CSS
import './App.css';


// React
import { useEffect, useCallback, useState } from 'react';

// Dados
import {wordsList} from './data/words';


//Componentes
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: 'start'},
  {id: 2, name: 'game'},
  {id: 3, name: 'end'}
]

let guessQty = 5;

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return {category, word}
  }, [words])





  // Starts the game
  const startGame = useCallback(() => {
    clearLetterStates()

    // Pick word and Pick Category
    const {category, word} = pickWordAndCategory()

    // Create an array of letters
    let wordLetters = word.split("").map(l => l.toLowerCase())

    // console.log(category, word)
    // console.log(wordLetters)

    // Fill States
    setPickedCategory(category)
    setPickedWord(word)
    setLetters(wordLetters)
    setGameStage(stages[1].name);
  }, [pickWordAndCategory])

  // Verifica as letras inseridas
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase()

    // Check if letter has already been used
    if(guessedLetters.includes(normalizedLetter) ||
       wrongLetters.includes(normalizedLetter)) {
        return;
       }

    // Push guessed letter or remove a point from score
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, normalizedLetter
      ])
      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  // console.log(wrongLetters)

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])

  }


  // Losing condition
  useEffect(() => {
    // Reset all states
    // clearLetterStates()

    if(guesses <= 0) {
      setGameStage(stages[2].name)
    }

  }, [guesses])

  // Win condition
  useEffect(() => {

    const uniqueLetters = [...new Set(letters)]
    if (guessedLetters.length === uniqueLetters.length && guessedLetters.length > 0) {
      setScore((actualScore) => actualScore += 1)
      console.log(score)
      startGame()
    }

  }, [guessedLetters, letters, score, startGame])


  // Reiniciar jogo
  const retry = () => {
    setGuesses(guessQty)
    setScore(0)
    setGameStage(stages[1].name)
    startGame()
  }

  return (
    <div className="App">

      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && <Game
                                  verifyLetter={verifyLetter}
                                  pickedWord={pickedWord}
                                  pickedCategory={pickedCategory}
                                  letters={letters}
                                  guessedLetters={guessedLetters}
                                  wrongLetters={wrongLetters}
                                  guesses={guesses}
                                  score={score}
                               />}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
      {console.log(score)}


    </div>
  );
}

export default App;
