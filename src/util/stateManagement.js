import words from './words.js';
import shuffle from './shuffle';

const getRandomTeam = (stateTeamCards) => {
  const randomTeam = Math.floor(Math.random() * 3) + 1;

  if (!Object.keys(stateTeamCards).some(key => stateTeamCards[key])) {
    return 0;
  }

  if (stateTeamCards[randomTeam] > 0) {
    stateTeamCards[randomTeam] = stateTeamCards[randomTeam] - 1;

    return randomTeam;
  }

  return getRandomTeam(stateTeamCards);
}

const getTeamCards = () => {
  const firstTeam = Math.floor(Math.random() * 2) + 1;

  return {
    1: firstTeam === 1 ? 9 : 8,
    2: firstTeam === 2 ? 9 : 8,
    3: 1, // Death card
  };
};

const getNewState = () => {
  const stateTeamCards = getTeamCards();
  let wordList = words.map((word, index) => index);
  wordList = shuffle(wordList).slice(0, 25);
  wordList = wordList
    .map(index => ({
      index,
      team: getRandomTeam(stateTeamCards),
      active: false,
    }))
  wordList = shuffle(wordList);

  const result = {
    wordList,
    answerKey: false,
  };

  saveStateToUrl(result);

  return result;
};

const getStateFromUrl = () => {
  const hash = document.location.hash.concat().replace('#', '').split(',');
  const wordIndex = hash.slice(0, 25);
  const team = hash.slice(25, 50);
  const active = hash.slice(50, 75);
  const wordList = wordIndex.map((wordIndex, index) => ({
    index: wordIndex,
    team: parseInt(team[index], 10) - words[wordIndex].length,
    active: !!parseInt(active[index], 10),
  }));

  return {
    wordList,
    answerKey: !!parseInt(hash[75], 10),
  }
};

export const getStartingState = (newGame = false) => {
  if (document.location.hash && !newGame) {
    return getStateFromUrl();
  }

  return getNewState();
};

export const stateToHash = ({ wordList, answerKey }) => {
  const wordIndex = wordList.map(word => word.index).join(',');
  const teams = wordList.map(word => word.team + words[word.index].length).join(',');
  const active = wordList.map(word => word.active ? 1 : 0).join(',');
  const answerKeyBinary = answerKey ? 1 : 0;

  return `${wordIndex},${teams},${active},${answerKeyBinary}`;
};

export const saveStateToUrl = (state) => {
  window.location.hash = stateToHash(state);
};

export default null;
