// Use Nominatim to return latitude and longitude from address.
export async function getLatLon(address: string, recurse_uk : boolean = false): Promise<{ lat: string; lon: string; name: string; full_address: string } | null> {
    // Specify English for results regardless of browser.
    const headers = new Headers();
    headers.append("Accept-Language", "en-GB");
    const result = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`, { headers });
    if (result.ok) {
        const data = await result.json();
        if (data && data.length > 0) {
        const display_name = data[0].display_name
        // Check if last item in the array made by splititng with , is United Kingdom to ensure location is not abroad.
        if (display_name.split(",")[display_name.split(",").length - 1].trim() === "United Kingdom") {
            return { lat: data[0].lat, lon: data[0].lon, name: data[0].name, full_address: display_name };
        } else if (recurse_uk) {
            if (!address.includes("United Kingdom")) {
            return getLatLon(address + ", United Kingdom", false); // Try appending "United Kingdom" to the search query if initial search isn't a place in the UK.
            }
        }
        }
    };
    return null;
}