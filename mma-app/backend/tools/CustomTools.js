/**
 * Generates a random number between a range
 * @param {*} from where the number starts
 * @param {*} to where the number ends -1
 */
const randomNumber = (from , to) => {
    return Math.floor(Math.random() * (to - from)) + from;
};

module.exports = {
    randomNumber:randomNumber
};
