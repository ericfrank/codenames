import React, { useState, useEffect } from "react";
import {
  getStartingState,
  stateToHash,
  saveStateToUrl,
} from "./util/stateManagement";
import clipboard from "./util/clipboard";
import words from "./util/words";
import { handleToggleColorScheme } from "./util/colorScheme";

const startingState = getStartingState();

const App = () => {
  const [wordList, setWordList] = useState(startingState.wordList);
  const [answerKey] = useState(startingState.answerKey);
  const [linkCopied, setLinkCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    saveStateToUrl({ wordList, answerKey });
  }, [answerKey, wordList]);

  const handleSetActive = (index: number) => {
    const newWordList = wordList.concat();

    newWordList[index].active = true;
    setWordList(newWordList);
  };

  const handleNewGame = () => {
    setWordList(getStartingState(true).wordList);
    document.body.classList.remove(
      "death",
      ...["one", "two"].map((state) => `winner-${state}`)
    );
  };

  const handleCopyCodemasterLink = () => {
    clipboard(
      `${document.location.origin}${document.location.pathname}?${stateToHash({
        wordList,
        answerKey: true,
      })}`
    );
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleToggleModal = () => setModalOpen(!modalOpen);

  const getActiveClass = (team: number) => {
    let result = "neutral";

    if (team === 1) {
      result = "one";
    } else if (team === 2) {
      result = "two";
    } else if (team === 3) {
      result = "death";
    }

    return `active-${result}`;
  };

  const getTeamCardsRemaining = (team: number) =>
    wordList.filter((word) => word.team === team && !word.active).length;
  const teamOneRemaining = getTeamCardsRemaining(1);
  const teamTwoRemaining = getTeamCardsRemaining(2);
  const teamOneWinner = teamOneRemaining === 0;
  const teamTwoWinner = teamTwoRemaining === 0;
  const death = getTeamCardsRemaining(3) === 0;
  const winner = teamOneWinner || teamTwoWinner || death;
  let title = "DashXPnames";

  if (answerKey) {
    title = "Codemaster";
  } else if (death) {
    title = "Gameover";
    document.body.classList.add("death");
  } else if (winner) {
    title = "Congrats!";
    document.body.classList.add(`winner-${teamOneWinner ? "one" : "two"}`);
  }

  return (
    <>
      <header>
        <span className="team-1">{!answerKey && teamOneRemaining}</span>
        {title}
        <span className="team-2">{!answerKey && teamTwoRemaining}</span>
      </header>
      <ul className="game-board">
        {wordList.map((word, index) => (
          <li key={words[word.index]}>
            <button
              type="button"
              onClick={() => handleSetActive(index)}
              className={
                word.active || answerKey || winner
                  ? getActiveClass(word.team)
                  : ""
              }
              disabled={winner || answerKey}
            >
              {words[word.index]}
            </button>
          </li>
        ))}
      </ul>
      {!answerKey && (
        <nav>
          <button type="button" onClick={handleNewGame}>
            New Game
          </button>
          <button type="button" onClick={handleCopyCodemasterLink}>
            {linkCopied ? "Copied!" : "Copy Codemaster Link"}
          </button>
          <button type="button" onClick={handleToggleModal}>
            Help
          </button>
          <button
            type="button"
            onClick={handleToggleColorScheme}
            title="Toggle dark mode"
          >
            <span className="dark-mode-hidden">☼</span>
            <span className="light-mode-hidden">☾</span>
          </button>
        </nav>
      )}
      <div className={`modal ${modalOpen ? "modal-open" : ""}`}>
        <button type="button" onClick={handleToggleModal}>
          ×
        </button>
        <div className="modal-inner">
          <h1 className="text-center">Instructions</h1>
          <ul>
            <li>
              Screenshare in your video chat platform of choice. The host is
              responsible for clicking the cards.
            </li>
            <li>
              Click "Copy Codemaster Link" and text it to the codemasters
              (clue-givers).
            </li>
            <li>
              Two teams: green and purple. Yellow cards are neutral. Black card
              is death.
            </li>
            <li>
              Numbers at the top of the screen show how many cards remain for
              each team. Team with 9 cards goes first (random each game).
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default App;
