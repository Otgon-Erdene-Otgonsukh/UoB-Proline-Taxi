export async function POST(req: Request) {
    const headers = {
        "Content-Type": "application/json",
        "Cookie": "GATEWAY-TOKEN=" + process.env.OSRM_SECRET + ";"
    }

    const body = await req.json();

    const points = body.points;

    for (let i = 0; i < points.length; i++) {
        points[i] = `${points[i].lng},${points[i].lat}`;
    }

    const path = points.join(";");

    const routes = await fetch("https://osrm.ilm.gg/route/v1/driving/" + path + "?overview=full&geometries=geojson&alternatives=false", { headers });
    const responsebody = await routes.arrayBuffer();

    return new Response(responsebody);
}