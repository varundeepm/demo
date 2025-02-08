import pandas as pd
from pymongo import MongoClient
# Replace with your MongoDB Atlas connection string
MONGO_URI = "mongodb+srv://pranesh2305117:212005Tn%40@cltempsea.0kwnz.mongodb.net/?retryWrites=true&w=majority&appName=cltempsea"
DATABASE_NAME = "ClimateDB"  # Change to your preferred database name
COLLECTION_NAME = "WeatherData"  # Change to your preferred collection name

# Connect to MongoDB Atlas
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
collection = db[COLLECTION_NAME]

# Load Excel file
file_path = r"C:\Users\T480s\OneDrive\Desktop\API\random_city_location_data_withweather.xlsx"  # Replace with the actual Excel file path
df = pd.read_excel(file_path)

# Convert DataFrame to dictionary and insert into MongoDB
data = df.to_dict(orient="records")
collection.insert_many(data)

print("Excel file successfully uploaded to MongoDB Atlas.")
