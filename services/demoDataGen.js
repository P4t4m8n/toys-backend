import { MongoClient } from 'mongodb'

const url = 'mongodb://localhost:27017'
const dbName = 'toys_db'

// Sample data attributes
const sampleData = {
    "name": "Talking Doll",
    "price": 123,
    "labels": [
        "Doll",
        "Battery Powered",
        "Baby"
    ],
    "createdAt": 1631031801011,
    "inStock": true,
    "img": "src/assets/img/1.jpg"
}

const numberOfDocuments = 100

// Function to generate random date within a range
function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Function to insert demo data
async function insertDemoData() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })

    try {
        await client.connect()
        console.log('Connected to the database')

        const db = client.db(dbName)
        const collection = db.collection('toy') 

        // Insert multiple documents
        const documents = Array.from({ length: numberOfDocuments }, (_, index) => ({
            ...sampleData,
            createdAt: getRandomDate(new Date(2022, 0, 1), new Date()),
          
        }))

        const result = await collection.insertMany(documents)
        console.log(`${result.insertedCount} documents inserted successfully`)
    } finally {
        await client.close()
        console.log('Connection closed')
    }
}

// Run the function to insert demo data
insertDemoData()
