const express = require('express');
const axios = require('axios');
const { parseString } = require('xml2js');
const fs = require('fs');
const io = require('@jscad/io');

const jscadmodel = require('./public/jscad/jscad.js');

const app = express();
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    console.log("index");
    res.sendFile(__dirname + "/public/index.html");
});

app.get('/makemodel', (req, res) => {
    console.log("makemodel");
    res.sendFile(__dirname + "/public/makemodel.html");
});

app.get('/downloadmodel', (req, res) => {
    console.log("downloadmodel");
    res.sendFile(__dirname + "/public/downloadmodel.html");
});

app.get('/api/decl', (req, res) => {
    const apiUrl = `https://www.ngdc.noaa.gov/geomag-web/calculators/calculateDeclination?lat1=${req.query.lat}&lon1=${req.query.lon}&key=zNEw7&resultFormat=xml`;

    axios.get(apiUrl)
        .then(response => {
            const xmlData = response.data;

            parseString(xmlData, (error, result) => {
                if (error) {
                    console.error('Error parsing XML:', error);
                    return;
                }
                const magneticDeclination = result.maggridresult.result[0].declination[0]._.replace('\n', '');
                res.json({ "declination": magneticDeclination });
            });
        })
        .catch(error => {
            res.json({ "declination": null });
        });
});

app.get('/api/modelBlob', async (req, res) => {
    try {
        console.log("started rendering jscad gemoetry!");
        const result = await jscadmodel(req.query.latitude, req.query.decl);
        console.log("jscad geometry created!");

        const rawData = io.stlSerializer.serialize({ binary: false }, result);
        const text = rawData[0]
        // console.log(rawData);
        fs.writeFileSync('cube.stl', text);
        return rawData;
    } catch (error) {
        console.error('Error generating or sending STL file:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}/`);
})

// async function saveBlobAsSTL(blob, filename) {
//     try {
//         const buffer = await blob.arrayBuffer(); // Convert Blob to ArrayBuffer
//         await fs.writeFile(filename, Buffer.from(buffer));
//         console.log('STL file saved successfully.');
//     } catch (error) {
//         console.error('Error saving STL file:', error);
//     }
// }

// saveBlobAsSTL(blob, 'ang.stl');