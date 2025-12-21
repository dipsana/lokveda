/* LOCATION CHECKER WITH BORDER PROTECTION: We calculate where the polygon edge meets the user’s horizontal line,
                                            then check whether that meeting point is to the right of the user.
   > Exports
   #checkUserProximity: verifies user distance and boundary
*/

import { fetchCoords, getRole, getOfficeLatitude, getOfficeLongitude, logout } from '/lokveda/firebase.js';

// Haversine distance calculation (in km)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180; // delta latitude in radians
    const dLon = (lon2 - lon1) * Math.PI / 180; // delta longitude in radians
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// Role-based distance limits (km)
const roleLimits = { user: 10, staff: 100, admin: 500 };

// Define service area as polygon (lat/lon points) [India's rough estimated polygon]
const indiaPolygon = [
    { lat: 37.6, lon: 77.0 },   // North-west
    { lat: 37.6, lon: 97.4 },   // North-east
    { lat: 26.8, lon: 97.4 },   // North-east-inner
    { lat: 8.0, lon: 97.4 },    // South-east
    { lat: 8.0, lon: 68.0 },    // South-west
    { lat: 26.8, lon: 68.0 },   // North-west-inner
    { lat: 37.6, lon: 77.0 }    // Close the loop
];

// Ray-casting algorithm to check if point is inside polygon
function isInsidePolygon(point, polygon) {
    let x = point.lat, y = point.lon;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].lat, yi = polygon[i].lon;
        const xj = polygon[j].lat, yj = polygon[j].lon;
        const intersect = ((yi > y) !== (yj > y)) &&
            (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// Main function
export async function checkUserProximity() {
    try {
        const { lat: userLat, lon: userLon } = await fetchCoords();
        const officeLat = getOfficeLatitude();
        const officeLon = getOfficeLongitude();
        if (!officeLat || !officeLon) throw new Error("Office coordinates unavailable");

        const distance = getDistanceFromLatLonInKm(userLat, userLon, officeLat, officeLon);
        console.log(`Distance from office: ${distance.toFixed(2)} km`);

        // Check distance
        const role = getRole();
        const maxDistance = roleLimits[role] ?? 10;
        if (distance > maxDistance) {
            alert("🚫 You are outside the allowed distance for your role.");
            return false;
        }

        // Check India polygon boundary
        if (!isInsidePolygon({ lat: userLat, lon: userLon }, indiaPolygon)) {
            alert("🚫 You are outside the official service area.");
            console.log("🚫 User is outside India");
            return false;
        }

        alert("✅ You are within the allowed area.");
        console.log("✅ User is in India");
        return true;

    } catch (err) {
        await logout();
        console.error("Location check failed:", err);
        return false;
    }
}