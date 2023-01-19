const inputBox = document.getElementById("ip-input")
const submitBtn = document.getElementById("input-submit")
const ipAddressEl = document.getElementById("ip-address-el")
const locationEl = document.getElementById("location-el")
const timezoneEl = document.getElementById("timezone-el")
const ispEl = document.getElementById("ISP-el")

// using visible api-key in this client-side demo
let api_key = "at_jVAMMPOPADyrv2u8uqzUfPp1Y8m5Z"

// get user ip-address
const jsonData = $.getJSON("https://api.ipify.org?format=json")

// user's ip as default ip
let ip = jsonData.responseJSON

// function to lookup default ip or input ip
function findIp(ip) {
    $(function () {
        // use jQuery ajax method to get api data, apiKey required
        $.ajax({
            url: "https://geo.ipify.org/api/v1",
            data: {apiKey: api_key, ipAddress: ip},
            success: function(data) {
                let {ip, isp} = data   // destructure ip and isp data
                let {lat, lng, timezone,city,country,region} = data.location // destructure location data
                renderMap(lat,lng) // render the map using location data
                renderData(ip, isp, timezone, city, country, region) // render ip related data on page
                hoverIP(ip) // to show searched ip in the input box on hover
            },
            error: console.log("error")
         })
     })
}

// create map and marker using OpenStreetMap and LeafletJS
var map = L.map('map').setView([0, 0], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
let myIcon = L.icon({
    iconUrl: "images/icon-location.svg",
    iconSize: [46,56],
    iconAnchor: [23, 56]
})
var marker = L.marker([0, 0],{icon: myIcon})


// function to render the map using latitude and longitude 
function renderMap(lat,lng) {
    map.removeLayer(marker) //delete marker of previous IP
    map.setView([lat, lng], 13)
    marker = L.marker([lat,lng],{icon: myIcon}).addTo(map) //add marker with myIcon
}


// function to render data on the page using ip-data
function renderData(ip, isp, timezone, city, country, region) {
    ipAddressEl.textContent = ip
    locationEl.textContent = `${city}, ${region}, ${country}`
    timezoneEl.textContent = `UTC ${timezone}`
    ispEl.textContent = isp
    
}

// function to show input ip on hover in inputBox
function hoverIP(ip) {
    inputBox.addEventListener("mouseover", () => {
        inputBox.placeholder = ip
    })
    inputBox.addEventListener("mouseout", () => {
        inputBox.placeholder = "Search for any IP address"
    })
}

// use value in input box, pass to findIp function, jQuery so page doesn't refresh
$("#input-box").submit(function() {
    ip = inputBox.value
    findIp(ip)
    inputBox.value = ""
})

// init
findIp(ip)

