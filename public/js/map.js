 maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
     container: "map",
    style: `https://api.maptiler.com/maps/streets/style.json?key=${mapToken}`,
    center: listing.geometry.coordinates,
    zoom: 10,
});

new maptilersdk.Marker({color: "#FF0000"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 20 }).setHTML(`
            <p>${listing.location}, ${listing.country}</p>
        `))
    .addTo(map);
               
