document.getElementById('csvFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            const csvData = e.target.result;
            processCSV(csvData);
        };
    }
});

// Function to process CSV data
function processCSV(csvText) {
    const rows = csvText.split("\n").map(row => row.split(","));
    const headers = rows.shift(); // Extract headers
    const tableBody = document.querySelector("#data-table tbody");

    const labels = [], temperature = [], co2 = [], seaLevel = [], latitudes = [], longitudes = [];

    // Loop through CSV rows
    rows.forEach(row => {
        if (row.length < 6) return; // Ignore incomplete rows

        const [date, temp, carbon, sea, lat, lon] = row;
        
        // Append data to the table
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${date}</td><td>${temp}</td><td>${carbon}</td><td>${sea}</td><td>${lat}</td><td>${lon}</td>`;
        tableBody.appendChild(tr);
        
        // Add data for the chart and map
        labels.push(date);
        temperature.push(parseFloat(temp));
        co2.push(parseFloat(carbon));
        seaLevel.push(parseFloat(sea));
        latitudes.push(parseFloat(lat));
        longitudes.push(parseFloat(lon));
    });

    createBarChart(labels, temperature, co2);
    createPieChart(labels, co2);
    createLineChart(labels, seaLevel);
    plotMap(latitudes, longitudes, temperature);
}

// Function to create a Bar Chart
function createBarChart(labels, temperature, co2) {
    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Temperature (°C)', data: temperature, backgroundColor: 'red' },
                { label: 'CO2 (ppm)', data: co2, backgroundColor: 'blue' }
            ]
        },
        options: { responsive: true }
    });
}

// Function to create a Pie Chart (CO2 Levels)
function createPieChart(labels, co2) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{ label: 'CO2 Levels (ppm)', data: co2, backgroundColor: ['red', 'blue', 'green', 'orange'] }]
        }
    });
}

// Function to create a Line Chart (Sea Level Changes)
function createLineChart(labels, seaLevel) {
    const ctx = document.getElementById('lineChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{ label: 'Sea Level (m)', data: seaLevel, borderColor: 'green', fill: false }]
        }
    });
}

// Function to plot markers on the map
function plotMap(latitudes, longitudes, temperature) {
    const map = L.map('map').setView([latitudes[0], longitudes[0]], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    latitudes.forEach((lat, index) => {
        L.marker([lat, longitudes[index]])
            .addTo(map)
            .bindPopup(`Temperature: ${temperature[index]}°C`);
    });
}
