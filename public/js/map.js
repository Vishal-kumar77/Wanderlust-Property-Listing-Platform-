
document.addEventListener("DOMContentLoaded", function () {
    maptilersdk.config.apiKey = map_api_key;
    const map = new maptilersdk.Map({
        container: 'map',
        style: maptilersdk.MapStyle.STREETS,
        center: [77.2088, 28.6139], // [longitude,latitude]
        zoom: 9
    });

    // map.addControl(gc, 'top-left');
    const locationString = listing_location; // EJS injects location string

    function geocodeAndCenter(location) {
        const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${maptilersdk.config.apiKey}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.features && data.features.length > 0) {
                    const [lng, lat] = data.features[0].center;
                    map.setCenter([lng, lat]);
                    map.setZoom(9);

                    // Create a popup with custom text
                    const popup = new maptilersdk.Popup({ offset: 25 })
                        .setHTML(`
                        <h6>${listing_title}</h6>
                        <p>Exact location will be provided after booking</p>
                    `);

                    // Create the marker and attach the popup
                    new maptilersdk.Marker({ color: "red", offset: [0, -20] })
                        .setLngLat([lng, lat])
                        .setPopup(popup)   // Attach popup
                        .addTo(map);
                } else {
                    alert("Location not found on map.");
                }
            })
            .catch(err => {
                console.error("Geocoding error:", err);
            });
    }


    geocodeAndCenter(locationString);


});





