
//document.querySelector() method is used to select elements in the DOM using css selectors
const imgContainer = document.querySelector('.image-container');
const dateElement = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-form');
const ulElement = document.querySelector('.ul-searches');


let datesArr = [];

//The localStorage.getItem() method is used to retrieve the value of the dates key from the browser's local storage.

if(localStorage.getItem('dates')){
    datesArr = localStorage.getItem('dates');
}
else{
    localStorage.setItem('dates', JSON.stringify(datesArr));
}
//The JSON.parse() method is used to convert the stringified array back to an array object.
datesArr = JSON.parse(localStorage.getItem('dates'));


//The renderUI() function accepts an object data as an argument and returns an HTML template string.
function renderUI(data){
    return `
    <h1>Picture On ${data.date}</h1>
    <img src="${data.hdurl}" alt="image of the day from nasa">
    <h3>${data.title}</h3>
    <p>${data.explanation}</p>
    `
}


function getCurrentImageOfTheDay(date = ''){
    const url = "https://api.nasa.gov/planetary/apod";
    const queryParams = {
        date: date,
        api_key: 'IFB5kdYEnhqJ4BckAoTULkC2aLPbVKzHeJcSTjiw'
    }

    const queryString = new URLSearchParams(queryParams).toString();
    console.log("query string", queryString);

    fetch(`${url}?${queryString}`)
        .then(response => {
            if(response.status === 400){
                alert("please enter a date before today")
            }
            return response.json()})
        .then(data => {
            console.log("api requested data -> ",data);
            imgContainer.innerHTML = renderUI(data);
        })
        .catch((error) =>  {
            console.log("error message", error)
            imgContainer.innerHTML = error.msg;
        })

}

function renderPreviousSearch(date){
    return `
    <li><button class="previous">${date}</button></li>
    `

}

function addSearchToHistory(){
    ulElement.innerHTML = "";
    datesArr.forEach((date) => {
        ulElement.innerHTML += renderPreviousSearch(date);
    })
}

//The saveSearch(dateToSave) function takes a dateToSave parameter and checks if it's a valid date.
function saveSearch(dateToSave){
    if(dateToSave){
        datesArr.push(dateToSave);
        localStorage.setItem('dates', JSON.stringify(datesArr));
    }
    
}

//The getImageOfTheDay(e) function is the event handler function for the click event on the searchButton element.

function getImageOfTheDay(e){
    e.preventDefault();
    let datePicked = dateElement.value
    console.log('date picked ',datePicked);
    getCurrentImageOfTheDay(datePicked);
    saveSearch(datePicked);
    addSearchToHistory();
    
}

getCurrentImageOfTheDay();

//The globalEventListener(type, selector, callback) function is a utility function that takes three parameters - type, selector, and callback.
function globalEventListener(type, selector, callback){
    document.addEventListener(type, e => {
        if(e.target.matches(selector)) callback(e);
    })
}
// showPrevious(e) function is the event handler function for the click event on the .previous elements
function showPrevious(e){
    let date = e.target.textContent;
    getCurrentImageOfTheDay(date);

}

//the event listeners are attached to the searchButton element and the document object for the click event on the .previous elements using the addEventListener() method.
searchButton.addEventListener('click', getImageOfTheDay);
globalEventListener('click', '.previous', showPrevious);