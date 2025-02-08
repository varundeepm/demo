const cityData = [
    { city: "Tokyo", latitude: 35.676860, longitude: 139.763895, state: "東京都", country: "Japan", temperature: 4.14, seaLevel: 40, date: "2025-02-08", time: "23:00:00" },
    { city: "New York", latitude: 40.712728, longitude: -74.006015, state: "New York", country: "United States", temperature: 0.58, seaLevel: 10, date: "2025-02-08", time: "23:00:01" },
    { city: "Paris", latitude: 48.853495, longitude: 2.348391, state: "France métropolitaine", country: "France", temperature: 7.45, seaLevel: 35, date: "2025-02-08", time: "23:00:02" },
    { city: "Berlin", latitude: 52.510885, longitude: 13.398937, state: "Pankow", country: "Germany", temperature: 3.21, seaLevel: 34, date: "2025-02-08", time: "23:00:03" },
    { city: "Sydney", latitude: -33.869844, longitude: 151.208285, state: "New South Wales", country: "Australia", temperature: 21.17, seaLevel: 58, date: "2025-02-08", time: "23:00:04" }
];
function searchCity() {
    const inputCity = document.getElementById("cityInput").value.trim().toLowerCase();
    const result = cityData.find(entry => entry.city.toLowerCase() === inputCity);
    if (result) {
        displayData(result);
    } else {
        alert("City not found in dataset");
    }
}
function displayData(data) {
    document.getElementById("cityName").textContent = data.city;
    document.getElementById("temperature").textContent = `${data.temperature} °C`;
    document.getElementById("seaLevel").textContent = `${data.seaLevel} meters`;
    document.getElementById("location").textContent = `${data.state}, ${data.country}`;
    createBarChart(data);
    createLineChart(data);
    updateMap(data);
}
function createBarChart(data) {
    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Temperature", "Sea Level"],
            datasets: [{
                label: data.city,
                data: [data.temperature, data.seaLevel],
                backgroundColor: ['red', 'blue']
            }]
        }
    });
}
function createLineChart(data) {
    const ctx = document.getElementById('lineChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Temperature", "Sea Level"],
            datasets: [{
                label: data.city,
                data: [data.temperature, data.seaLevel],
                borderColor: 'green',
                fill: false
            }]
        }
    });
}
function updateMap(data) {
    const map = L.map('map').setView([data.latitude, data.longitude], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker([data.latitude, data.longitude]).addTo(map).bindPopup(`${data.city}: ${data.temperature}°C`).openPopup();
}
document.getElementById("searchButton").addEventListener("click", searchCity);
