const randomNumber = (from , to) => {
    return Math.floor(Math.random() * (to - from)) + from;
};

module.exports = {
    randomNumber:randomNumber
};
