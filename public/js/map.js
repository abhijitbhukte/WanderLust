if (typeof mapToken !== "undefined" && typeof listing !== "undefined" && document.getElementById("map")) {
    if (mapToken) {
        maptilersdk.config.apiKey = mapToken;
    }

    const coordinates = (listing.geometry && Array.isArray(listing.geometry.coordinates) && listing.geometry.coordinates.length === 2)
        ? listing.geometry.coordinates
        : [77.2090, 28.6139];

    try {
        const map = new maptilersdk.Map({
            container: "map",
            style: `https://api.maptiler.com/maps/streets/style.json?key=${mapToken}`,
            center: coordinates,
            zoom: 10,
        });

        new maptilersdk.Marker({ color: "#FF0000" })
            .setLngLat(coordinates)
            .setPopup(
                new maptilersdk.Popup({ offset: 20 }).setHTML(`
                    <h6>${listing.title || 'Location'}</h6>
                    <p>${listing.location || ''}, ${listing.country || ''}</p>
                `)
            )
            .addTo(map);
    } catch (e) {
        console.warn("Map initialization skipped:", e.message);
    }
}




