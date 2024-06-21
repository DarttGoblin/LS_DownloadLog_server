const fs = require('fs');
const express = require("express");
const cors = require("cors");

const app = express();
const port = 8013;

app.use(express.json({limit: '50mb'}));
app.use(cors({ origin: "*" }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.post("/", (req, res) => {
    const parsedFileLog = req.body.parsedFileLog;
    const fileType = req.body.fileType;
    switch (fileType) {
        case "2": DownloadFileCSV(parsedFileLog, res); break;
        case "3": DownloadFileJSON(parsedFileLog, res); break;
    }
});

app.listen(port, () => console.log("Listening on port " + port));

function DownloadFileCSV(parsedFileLog, res) {
    const fileName = 'LogFiles/SnortLog.csv';
    const writeStream = fs.createWriteStream(fileName);

    writeStream.on('finish', () => {
        console.log('CSV File has been created successfully!');
        res.json({ success: true, message: "File created successfully!" });
    });

    writeStream.on('error', (err) => {
        console.error('An error occurred while writing the file:', err);
        res.status(500).json({ success: false, message: "Error creating file" });
    });

    const keys = Object.keys(parsedFileLog[0]);
    writeStream.write(keys.join(',') + '\n');

    parsedFileLog.forEach(line => {
        const values = keys.map(key => line[key]);
        writeStream.write(values.join(',') + '\n');
    });

    writeStream.end();
}

function DownloadFileJSON(parsedFileLog, res) {
    const fileName = 'LogFiles/SnortLog.json';
    const writeStream = fs.createWriteStream(fileName);

    writeStream.on('finish', () => {
        console.log('JSON file has been created successfully!');
        res.json({ success: true, message: "File created successfully!" });
    });

    writeStream.on('error', (err) => {
        console.error('An error occurred while creating the file:', err);
        res.status(500).json({ success: false, message: "Error creating file" });
    });

    writeStream.write(JSON.stringify(parsedFileLog, null, 2));
    writeStream.end();
}