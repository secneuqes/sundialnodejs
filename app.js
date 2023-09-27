const express = require('express');
const axios = require('axios');
const { parseString } = require('xml2js');
const path = require('path');
// const fs = require('fs');
var bodyParser = require('body-parser');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const compression = require('compression');
require('dotenv').config();

const csrfMiddleware = csrf({ cookie: true });

const app = express();
app.use(express.static('public'));

const PORT = process.env.PORT || 5000;

app.use(
    compression({
        level: 6,
        threshold: 100 * 1000,
        filter: (req, res) => {
            if (req.headers["x-no-compression"]) {
                // header에 x-no-compression이 있으면, 압축하지 않도록 false를 반환한다.
                return false;
            }
            return compression.filter(req, res);
        },
    })
);

app.use(cookieParser());
app.use(csrfMiddleware);
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

//////////////////////////////////////////////////

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get('/learn', (req, res) => {
    res.sendFile(__dirname + "/public/learn.html");
});

app.get('/makemodel', (req, res) => {
    res.sendFile(__dirname + "/public/makemodel.html");
});

app.get('/downloadmodel', (req, res) => {
    res.sendFile(__dirname + "/public/downloadmodel.html");
});

app.get('/extensions', (req, res) => {
    res.sendFile(__dirname + "/public/extensions.html");
})

app.get('/devinfo', (req, res) => {
    res.sendFile(__dirname + "/public/devinfoOnContest.html");
})

// TODO: /learn/{title} 형식으로 get으로 페이지 띄우기

app.get('/download/student/en', (req, res) => {
    let file = path.join(__dirname, "/public/assets/학습지/exploring_the_principles_of_angbuilgu_forStudents.pdf");
    res.download(file, 'exploring_the_principles_of_angbuilgu_forStudents.pdf', (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error downloading file");
        }
    })
})

app.get('/download/student/ko', (req, res) => {
    let file = path.join(__dirname, "/public/assets/학습지/앙부일구 실험서(학생용).pdf");
    res.download(file, '앙부일구 실험서(학생용).pdf', (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error downloading file");
        }
    })

})

app.get('/download/teacher/en', (req, res) => {
    let file = path.join(__dirname, "/public/assets/학습지/exploring_the_principles_of_angbuilgu_forTeachers.pdf");
    res.download(file, 'exploring_the_principles_of_angbuilgu_forTeachers.pdf', (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error downloading file");
        }
    })
})

app.get('/download/teacher/ko', (req, res) => {
    let file = path.join(__dirname, "/public/assets/학습지/앙부일구 실험서(교사용).pdf");
    res.download(file, '앙부일구 실험서(교사용).pdf', (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error downloading file");
        }
    })
})

app.post('/api/decl', (req, res) => {
    const apiUrl = `https://www.ngdc.noaa.gov/geomag-web/calculators/calculateDeclination?lat1=${req.body.lat}&lon1=${req.body.lon}&key=zNEw7&resultFormat=xml`;

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

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}/`);
})