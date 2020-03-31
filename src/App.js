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

  render() {
    const { wordList, answerKey, linkCopied } = this.state;

    const getActiveClass = (team) => {
      if (team === 1) {
        return 'active-one';
      } else if (team === 2) {
        return 'active-two';
      } else if (team === 3) {
        return 'active-death';
      }

      return 'neutral';
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
          </nav>
        )}
      </>
    );
  }
}

export default App;
