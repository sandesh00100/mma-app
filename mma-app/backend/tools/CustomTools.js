/**
 * Generates a random number between a range
 * @param {*} from where the number starts
 * @param {*} to where the number ends + 1
 */
const randomNumber = (from, to) => {
  return Math.floor(Math.random() * (to - from)) + from;
};

const ignoreUtility = {
  ignoreObject: {
    isTestData: 0, isMockData: 0, __v: 0
  },
  ignoreString: "-__v -isTestData -isMockData"
};

module.exports = {
  randomNumber: randomNumber,
  ignoreUtility: ignoreUtility
};
