import words from "./words";
import shuffle from "./shuffle";
import { WordListEntry, TeamCardNumbers } from "./types";

const getRandomTeam = (stateTeamCards: TeamCardNumbers): number => {
  const randomTeam = Math.floor(Math.random() * 3) + 1;

  if (
    !(
      Object.keys(stateTeamCards) as unknown as Array<
        keyof typeof stateTeamCards
      >
    ).some((key) => stateTeamCards[key])
  ) {
    return 0;
  }

  if (stateTeamCards[randomTeam] > 0) {
    stateTeamCards[randomTeam] = stateTeamCards[randomTeam] - 1;

    return randomTeam;
  }

  return getRandomTeam(stateTeamCards);
};

const getTeamCards: () => TeamCardNumbers = () => {
  const firstTeam = Math.floor(Math.random() * 2) + 1;

  return {
    1: firstTeam === 1 ? 9 : 8,
    2: firstTeam === 2 ? 9 : 8,
    3: 1, // Death card
  };
};

const getNewState = () => {
  const stateTeamCards = getTeamCards();
  let wordListIndex = words.map((word, index) => index);
  wordListIndex = shuffle(wordListIndex).slice(0, 25);
  let wordList = wordListIndex.map((index) => ({
    index,
    team: getRandomTeam(stateTeamCards),
    active: false,
  }));
  wordList = shuffle(wordList);

  const result = {
    wordList,
    answerKey: false,
  };

  saveStateToUrl(result);

  return result;
};

const getStateFromUrl = () => {
  const hash = document.location.search.concat().replace("?", "").split(",");
  const wordIndex = hash.slice(0, 25);
  const team = hash.slice(25, 50);
  const active = hash.slice(50, 75);
  const wordList = wordIndex.map((wordIndexItem, index) => {
    const wordIndexNum = parseInt(wordIndexItem, 10);
    return {
      index: wordIndexNum,
      team: parseInt(team[index], 10) - words[wordIndexNum].length,
      active: !!parseInt(active[index], 10),
    };
  });

  return {
    wordList,
    answerKey: !!parseInt(hash[75], 10),
  };
};

export const getStartingState = (newGame = false) => {
  if (document.location.search && !newGame) {
    return getStateFromUrl();
  }

  return getNewState();
};

export const stateToHash = ({
  wordList,
  answerKey,
}: {
  wordList: WordListEntry[];
  answerKey: boolean;
}) => {
  const wordIndex = wordList.map((word) => word.index).join(",");
  const teams = wordList
    .map((word) => word.team + words[word.index].length)
    .join(",");
  const active = wordList.map((word) => (word.active ? 1 : 0)).join(",");
  const answerKeyBinary = answerKey ? 1 : 0;

  return `${wordIndex},${teams},${active},${answerKeyBinary}`;
};

export const saveStateToUrl = (state: {
  wordList: WordListEntry[];
  answerKey: boolean;
}) => {
  const newurl = `${document.location.origin}${
    document.location.pathname
  }?${stateToHash(state)}`;

  window.history.pushState({ path: newurl }, "", newurl);
};
