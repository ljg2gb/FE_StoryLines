
const usersURL = 'http://localhost:3000/users'
const loginURL = 'http://localhost:3000/login'
const storiesURL = 'http://localhost:3000/stories'

const $error = document.querySelector('.error')
const errorMessages = {
    400: "400 error",
    401: "401 error"
}

const $welcomeSection = document.querySelector('#welcome')

const $signUpButton = document.querySelector('#sign-up-button')
const $signUpDiv = document.querySelector('#Signup')
const $signUpForm = document.querySelector('#new-user-form')

const $loginButton = document.querySelector('#login-button')
const $loginForm = document.querySelector('#login-form')
const $logoutButton = document.querySelector('#logoutbutton')

const $newStoryButton = document.querySelector('#create-new-story-button')
const $newStoryForm = document.querySelector('#create-new-story-form')
const $storyDisplaySection = document.querySelector('#story-display')

const latitude = 36.161179
const longitude = -5.348260
const zoom = 2
// const mapView = [latitude,longitude], zoom

hideLoginandCreateUserForms()
isLoggedIn()
displayMap(latitude, longitude, zoom)
displayUserStories()
$signUpButton.addEventListener('click', displaysignUpForm)
$loginButton.addEventListener('click', displayLoginForm)
$logoutButton.addEventListener('click', logout )
$newStoryButton.addEventListener('click', displayCreateNewStoryForm)
$newStoryForm.addEventListener('submit', handleNewStoryForm)

function hideLoginandCreateUserForms() {
    $signUpForm.style.display = 'none'
    $loginForm.style.display = 'none'
}

function hideWelcomeSection() {
    $welcomeSection.style.display = 'none'
}

function displayWelcomeSection() {
    $welcomeSection.style.display = 'block'
}

function displaysignUpForm() {
    $loginForm.style.display = 'none'
    $signUpForm.style.display = 'block'
    $signUpForm.addEventListener('submit', handleSignUp)
}

function displayLoginForm() {
    $signUpForm.style.display = 'none'
    $loginForm.style.display = 'block'
    $loginForm.addEventListener('submit', handleLogin)
}

function displayCreateNewStoryForm() {
    $newStoryForm.style.display = 'block'
}


function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user_id")
    isLoggedIn()
}

function isLoggedIn() {
    if (localStorage.getItem('token')){
        $logoutButton.style.display = 'block'
        hideWelcomeSection()
    } 
    else {
        $logoutButton.style.display = 'none'
        displayWelcomeSection()
    }
}

function handleSignUp(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const first_name = formData.get('first_name')
    const last_name = formData.get('last_name')
    const email = formData.get('email')
    const username = formData.get('username')
    const password = formData.get('password')
    const user = { "user": {first_name, last_name, email, username, password}}
    console.log('user', user)
    
    fetchCall(usersURL, 'POST', user)
    .then(handleFetchResponse)
    .then(displayLoginForm)
    .catch(handleNetworkError)

}


function handleLogin(event) {
    event.preventDefault()
    const loginFormData = new FormData(event.target)
    
    const username = loginFormData.get('username')
    const password = loginFormData.get('password')
    const loginBody = { username, password  } 
    
    fetchCall(loginURL, 'POST', loginBody)
    .then(parseJson)
    // .then(console.log)
    .then(result => {
        const token = result.token
        const user_id = result.user_id
        localStorage.setItem("token", token)
        localStorage.setItem("user_id", user_id)
    })
    .then(isLoggedIn)
    .then(displayUserStories)
}

function handleNewStoryForm(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const title = formData.get('title')
    const description = formData.get('description')
    const date = formData.get('date')
    const status = formData.get('status')
    const user_id = localStorage.getItem("user_id")
    const newStoryBody = {title, description, date, status, user_id}

    fetchCall(storiesURL, 'POST', newStoryBody, 'auth')
    .then(handleFetchResponse)
    .then(displayMap)
    
}

function displayUserStories(){
    $storyDisplaySection.style.display = 'block'
    fetch(storiesURL)
        .then(parseJson)
        .then(result => result.stories.forEach(displayUserStory))
}

function displayUserStory(result) {
    const $storyCard = document.createElement('div')
    const title = result.title
    const description = result.description
    const date = result.date
    $storyCard.className = "story-card"
    $storyCard.innerHTML = `
    <h1>${title}</h1>
    <p>${description}</p>
    <p>${date}</p>
    `
    $storyDisplaySection.append($storyCard)
}

function handleFetchResponse(response) {
    console.log(response)
    if (!response.ok) {
        $error.textContent = errorMessages[response.status]
    }
    else {
        parseJson(response)
    }
}

function handleNetworkError(error) {
    $error.textContent = "There was a problem with the network; please check your internet connection."
}

function parseJson(response) {
    // console.log(response.json())
    return response.json()
}

function fetchCall(url, method, data, auth) {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (auth) {
        headers["Authorization"] = `Bearer ${localStorage.token}`
    }
    const body = JSON.stringify(data)
    return fetch(url, { method, headers, body })
  }

// map stuff
function displayMap(latitude, longitude, zoom) {
    document.getElementById('mapid').innerHTML = "<div id='map' style='width: 100%; height: 100%;'></div>";
    let mymap = L.map('mapid').setView([latitude, longitude], zoom);

    // satellite-v9

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibGpnMmdiIiwiYSI6ImNrYW1xeHE4YzFoNncyeWw2NW83c3N4MDUifQ.qSHmG5Ee_suJ1KNUNHmxZQ'
    }).addTo(mymap);

    let marker = L.marker([36.161179, -5.348260]).addTo(mymap);

    // let popup = L.popup()
    //     .setLatLng([36.161179, -5.348240])
    //     .setContent("I am a standalone popup.")
    //     .openOn(mymap);

    let popup = L.popup();
    mymap.on('click', onMapClick);

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            console.log(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(mymap);
    }

    const latlngs = [
        [36.163894, -5.347327],
        [36.164339, -5.34722],
        [36.164521, -5.352069],
        [36.164347, -5.353668],
        [36.164028, -5.354156],
        [36.164501, -5.356629],
        [36.165075, -5.356489],

    ];

    const polyline = L.polyline(latlngs, {color: 'red'}).addTo(mymap);
    // zoom the map to the polyline
    // map.fitBounds(polyline.getBounds());

}