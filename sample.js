const fs = require('fs');

// Read the heart rate data from the specified JSON file
const jsonData = fs.readFileSync('C:/Users/Satyanarayana/heartRate.json');

// Parse the JSON data into a JavaScript object
const inputData = JSON.parse(jsonData);

// Function to calculate the median of an array
function calculateMedian(arr) {
    const sortedArr = arr.slice().sort((a, b) => a - b);
    const mid = Math.floor(sortedArr.length / 2);
    return sortedArr.length % 2 !== 0 ? sortedArr[mid] : (sortedArr[mid - 1] + sortedArr[mid]) / 2;
}

// Object to store grouped heart rate data
const groupedData = {};

// Iterate through input data
inputData.forEach(data => {
    // Extract the date from the start time
    const date = data.timestamps.startTime.slice(0, 10);

    // If date group doesn't exist, create it
    if (!groupedData[date]) {
        groupedData[date] = {
            beatsPerMinute: [],
            timestamps: []
        };
    }

    // Add beats per minute and timestamps to respective arrays
    groupedData[date].beatsPerMinute.push(data.beatsPerMinute);
    groupedData[date].timestamps.push(data.timestamps.endTime);
});

// Array to store final output
const output = [];

// Iterate through grouped data by date
for (const date in groupedData) {
    const beatsPerMinute = groupedData[date].beatsPerMinute;
    const timestamps = groupedData[date].timestamps;

    // Calculate minimum and maximum heart rates
    const min = Math.min(...beatsPerMinute);
    const max = Math.max(...beatsPerMinute);

    // Calculate the median heart rate
    const median = calculateMedian(beatsPerMinute);

    // Find the latest timestamp
    const latestTimestamp = Math.max(...timestamps.map(timestamp => new Date(timestamp).getTime()));

    // Find the corresponding timestamp formatted
    const latestDataTimestamp = timestamps.find(timestamp => new Date(timestamp).getTime() === latestTimestamp);

    // Add the date,min,max,median,latestDataTimestamp to output array
    output.push({
        date,
        min,
        max,
        median,
        latestDataTimestamp
    });
}

// Write the output to output.json
fs.writeFileSync('./output.json', JSON.stringify(output, null, 2));

// Log the output to the console
console.log(output);
