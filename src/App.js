import React, { Component } from 'react';
import {
  getStartingState, stateToHash, saveStateToUrl,
} from './util/stateManagement';
import clipboard from './util/clipboard';
import words from './util/words.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...getStartingState(),
      linkCopied: false,
      modalOpen: false,
    };
  }

  componentDidUpdate() {
    saveStateToUrl(this.state);
  }

  handleSetActive = (index) => {
    this.setState((state) => {
      const wordList = state.wordList.concat();

      wordList[index].active = true;

      return wordList;
    });
  };

  handleNewGame = () => {
    this.setState(getStartingState(true));
    document.body.className = '';
  }

  handleCopyCodemasterLink = () => {
    const { wordList } = this.state;

    clipboard(`${document.location.origin}${document.location.pathname}?${stateToHash({ wordList, answerKey: true })}`);
    this.setState({ linkCopied: true });
    setTimeout(() => this.setState({ linkCopied: false }), 2000);
  };

  handleToggleModal = () => this.setState(state => ({ modalOpen: !state.modalOpen }));

  render() {
    const {
      wordList, answerKey, linkCopied, modalOpen,
    } = this.state;

    const getActiveClass = (team) => {
      let result = 'neutral';

      if (team === 1) {
        result = 'one';
      } else if (team === 2) {
        result = 'two';
      } else if (team === 3) {
        result = 'death';
      }

      return `active-${result}`;
    };

    const getTeamCardsRemaining = (team) => wordList
      .filter(word => word.team === team && !word.active).length;
    const teamOneRemaining = getTeamCardsRemaining(1);
    const teamTwoRemaining = getTeamCardsRemaining(2);
    const teamOneWinner = teamOneRemaining === 0;
    const teamTwoWinner = teamTwoRemaining === 0;
    const death = getTeamCardsRemaining(3) === 0;
    const winner = teamOneWinner || teamTwoWinner || death;
    let title = 'Codenames';

    if (answerKey) {
      title = 'Codemaster';
    } else if (death) {
      title = 'Gameover';
      document.body.classList.add('death');
    } else if (winner) {
      title = 'Congrats!';
      document.body.classList.add(`winner-${teamOneWinner ? 'one' : 'two'}`);
    }

    return (
      <>
        <header>
          <span className="team-1">{!answerKey && teamOneRemaining}</span>{title}<span className="team-2">{!answerKey && teamTwoRemaining}</span>
        </header>
        <ul className="game-board">
          {wordList.map((word, index) => (
            <li key={words[word.index]}>
              {console.log(words[word.index].length)}
              <button
                type="button"
                onClick={() => this.handleSetActive(index)}
                className={word.active || answerKey ? getActiveClass(word.team) : ''}
                disabled={winner || answerKey}
              >
                {words[word.index]}
              </button>
            </li>
          ))}
        </ul>
        {!answerKey && (
          <nav>
            <button
              type="button"
              onClick={this.handleNewGame}
            >
              New Game
            </button>
            <button
              type="button"
              onClick={this.handleCopyCodemasterLink}
            >
              {linkCopied ? 'Copied!' : 'Copy Codemaster Link'}
            </button>
            <button
              type="button"
              onClick={this.handleToggleModal}
            >
              Help
            </button>
          </nav>
        )}
        <div class={`modal ${modalOpen ? 'modal-open' : ''}`}>
          <button type="button" onClick={this.handleToggleModal}>×</button>
          <div class="modal-inner">
            <h1 className="text-center">Instructions</h1>
            <ul>
              <li>Screenshare in your video chat platform of choice. The host is responsible for clicking the cards.</li>
              <li>Click "Copy Codemaster Link" and text it to the codemasters (clue-givers).</li>
              <li>Two teams: green and purple. Yellow cards are neutral. Black card is death.</li>
              <li>Numbers at the top of the screen show how many cards remain for each team. Team with 9 cards goes first (random each game).</li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}

export default App;
