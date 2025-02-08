import os
import requests
import pandas as pd
from datetime import datetime

# Function to fetch location details using OpenStreetMap API
def fetch_location_details(city):
    # OpenStreetMap API URL
    url = f"https://nominatim.openstreetmap.org/search?city={city}&format=json"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)

    if response.status_code == 200 and response.json():
        data = response.json()[0]
        latitude = data.get("lat", "N/A")
        longitude = data.get("lon", "N/A")
        state = data.get("display_name", "").split(",")[-2].strip() if len(data.get("display_name", "").split(",")) > 1 else "N/A"
        country = data.get("display_name", "").split(",")[-1].strip()

        # Fetch temperature data from OpenWeatherMap
        weather_url = f"http://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid=6e8a16414f5f8d3fb4550b965e573e80&units=metric"
        weather_response = requests.get(weather_url)

        # Ensure valid response for temperature
        if weather_response.status_code == 200:
            temperature = weather_response.json().get("main", {}).get("temp", "N/A")
        else:
            temperature = "N/A"

        # Fetch sea level data
        sea_level_url = f"https://www.worldtides.info/api/v3/stations?lat={latitude}&lon={longitude}&key=3685aef9-3639-451d-8f68-84d3fbadf4f2"
        sea_level_response = requests.get(sea_level_url)

        # Debugging: Print raw response to check the structure
        print(f"Sea level response for {city}: {sea_level_response.text}")

        # Ensure valid response for sea level
        if sea_level_response.status_code == 200:
            try:
                # Assuming the response JSON structure looks like: {"data": [{"sea_level": <value>}]}
                sea_level_data = sea_level_response.json().get("data", [])
                if sea_level_data:
                    sea_level = sea_level_data[0].get("sea_level", "N/A")
                else:
                    sea_level = "N/A"
            except Exception as e:
                print(f"Error parsing sea level data for {city}: {e}")
                sea_level = "N/A"
        else:
            sea_level = "N/A"

        # Return the data dictionary
        return {
            "City": city.title(),  # Convert to Title Case
            "Latitude": latitude,
            "Longitude": longitude,
            "State": state,
            "Country": country,
            "Temperature (°C)": temperature,
            "Sea Level (m)": sea_level,
            "Date": datetime.now().strftime("%Y-%m-%d"),
            "Time": datetime.now().strftime("%H:%M:%S")
        }
    else:
        # Return default data if no location found
        return {
            "City": city, 
            "Latitude": "N/A", 
            "Longitude": "N/A", 
            "State": "N/A", 
            "Country": "N/A", 
            "Temperature (°C)": "N/A", 
            "Sea Level (m)": "N/A", 
            "Date": "N/A", 
            "Time": "N/A"
        }

# List of random cities from different countries
cities = ["Tokyo", "New York", "Paris", "Berlin", "Sydney", "Cape Town", "Toronto", "Rio de Janeiro", "Dubai", "Moscow"]
# Collect data
data_list = [fetch_location_details(city) for city in cities]

# Convert data to a DataFrame
df = pd.DataFrame(data_list)

# Save to Excel file
file_path = "random_city_location_data_withweather3.xlsx"  # Change path if needed
df.to_excel(file_path, index=False)

print(f"Data saved successfully in {file_path}")
