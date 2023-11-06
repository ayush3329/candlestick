const getRandomOpen = ()=>{
const min = 500; 
const max = 600; 

const randomNumber = Math.floor(Math.random() * (max - min) + min);

return randomNumber
}

const getRandomClose = ()=>{
    const min = 500; 
    const max = 600; 
    const randomNumber = Math.floor(Math.random() * (max - min) + min);
    return randomNumber
}
const getRandomHigh = ()=>{
    const min = 500; 
    const max = 600; 
    const randomNumber = Math.floor(Math.random() * (max - min) + min);
    return randomNumber
}
const getRandomLow = ()=>{
    const min = 500; 
    const max = 600; 
    const randomNumber = Math.floor(Math.random() * (max - min) + min);
    return randomNumber
}
module.exports = {getRandomClose,getRandomHigh, getRandomLow, getRandomOpen};
