
    let mymap = L.map('mapid').setView([36.161179, -5.348260], 14);

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