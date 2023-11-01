import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

import { default as express } from 'express';
import { default as sqlite3 } from 'sqlite3';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const port = 8000;
const root = path.join(__dirname, 'public');
const template = path.join(__dirname, 'templates');
const css = path.join(__dirname, 'css');

let app = express();
app.use(express.static(root));

const db = new sqlite3.Database(path.join(__dirname, 'murders.sqlite3'), sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.log('Error connecting to database');
    }
    else {
        console.log('Successfully connected to database');
    }
});

function dbSelect(query, params) {
    let p = new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
    return p;
}

app.get('*', (req, res) => {
    console.log('Invalid request for: ' + req.url);
    res.status(404).type('txt').send('Invalid request for: ' + req.url);
})


app.get('/', (req, res) => {
    res.redirect('/murder-rate/under10');
})

app.get('/murder-rate/under10', (req, res) => {
    let p1 = dbSelect("SELECT * FROM murders WHERE murders_2015 < 10");
    let p2 = fs.promises.readFile(path.join(template, 'template.html'), 'utf-8');
    let p3 = fs.promises.readFile(path.join(css, 'style.css'), 'utf-8');
    Promise.all([p1, p2, p3]).then((results) => {
        let tableBody = '';
        let datapoints_2015 = [];
        let datapoints_2016 = [];
        results[0].forEach((city) => {
            let tableRow = '<tr>';
            tableRow += '<td>' + city.city + '</td>';
            tableRow += '<td>' + city.state + '</td>';
            tableRow += '<td>' + city.murders_2015 + '</td>';
            tableRow += '<td>' + city.murders_2016 + '</td>';
            tableRow += '<td>' + city.change + '</td>';
            tableRow += '</tr>\n';
            tableBody += tableRow;

            let datapoint_2015 = {y: city.murders_2015, label: city.city};
            let datapoint_2016 = {y: city.murders_2016, label: city.city};
            datapoints_2015.push(datapoint_2015);
            datapoints_2016.push(datapoint_2016);
        });
        let style = "<style>" + results[2] + "</style>";
        let response = results[1].replace("$DATAPOINTS_2016$", JSON.stringify(datapoints_2016)).replace("$DATAPOINTS_2015$", JSON.stringify(datapoints_2015)).replace('$TITLE$', "Cities with under 10 murders").replace('$TABLEDATA$', tableBody).replace('<style></style>', style).replace('$PREV$', '/murder-rate/over100').replace('$NEXT$', '/murder-rate/10-40');
        res.status(200).type('html').send(response);
    }).catch((error) => {
        console.log(error);
        res.status(404).type('txt').send('File not found');
    });
})

app.get('/murder-rate/10-40', (req, res) => {
    let p1 = dbSelect("SELECT * FROM murders WHERE murders_2015 > 10 AND murders_2015 < 40");
    let p2 = fs.promises.readFile(path.join(template, 'template.html'), 'utf-8');
    let p3 = fs.promises.readFile(path.join(css, 'style.css'), 'utf-8');
    Promise.all([p1, p2, p3]).then((results) => {
        let tableBody = '';
        let datapoints_2015 = [];
        let datapoints_2016 = [];

        results[0].forEach((city) => {
            let tableRow = '<tr>';
            tableRow += '<td>' + city.city + '</td>';
            tableRow += '<td>' + city.state + '</td>';
            tableRow += '<td>' + city.murders_2015 + '</td>';
            tableRow += '<td>' + city.murders_2016 + '</td>';
            tableRow += '<td>' + city.change + '</td>';
            tableRow += '</tr>\n';
            tableBody += tableRow;

            let datapoint_2015 = {y: city.murders_2015, label: city.city};
            let datapoint_2016 = {y: city.murders_2016, label: city.city};
            datapoints_2015.push(datapoint_2015);
            datapoints_2016.push(datapoint_2016);
        });
        let style = "<style>" + results[2] + "</style>";
        let response = results[1].replace("$DATAPOINTS_2016$", JSON.stringify(datapoints_2016)).replace("$DATAPOINTS_2015$", JSON.stringify(datapoints_2015)).replace('$TITLE$', "Cities with between 10 and 40 murders").replace('$TABLEDATA$', tableBody).replace('<style></style>', style).replace('$PREV$', '/murder-rate/under10').replace('$NEXT$', '/murder-rate/40-100');
        res.status(200).type('html').send(response);
    }).catch((error) => {
        console.log(error);
        res.status(404).type('txt').send('File not found');
    });
})

app.get('/murder-rate/40-100', (req, res) => {
    let p1 = dbSelect("SELECT * FROM murders WHERE murders_2015 > 40 AND murders_2015 < 100");
    let p2 = fs.promises.readFile(path.join(template, 'template.html'), 'utf-8');
    let p3 = fs.promises.readFile(path.join(css, 'style.css'), 'utf-8');
    Promise.all([p1, p2, p3]).then((results) => {
        let tableBody = '';
        let datapoints_2015 = [];
        let datapoints_2016 = [];
        results[0].forEach((city) => {
            let tableRow = '<tr>';
            tableRow += '<td>' + city.city + '</td>';
            tableRow += '<td>' + city.state + '</td>';
            tableRow += '<td>' + city.murders_2015 + '</td>';
            tableRow += '<td>' + city.murders_2016 + '</td>';
            tableRow += '<td>' + city.change + '</td>';
            tableRow += '</tr>\n';
            tableBody += tableRow;

            let datapoint_2015 = {y: city.murders_2015, label: city.city};
            let datapoint_2016 = {y: city.murders_2016, label: city.city};
            datapoints_2015.push(datapoint_2015);
            datapoints_2016.push(datapoint_2016);
        });

        let style = "<style>" + results[2] + "</style>";
        let response = results[1].replace("$DATAPOINTS_2016$", JSON.stringify(datapoints_2016)).replace("$DATAPOINTS_2015$", JSON.stringify(datapoints_2015)).replace('$TITLE$', "Cities with between 40 and 100 murders").replace('$TABLEDATA$', tableBody).replace('<style></style>', style).replace('$PREV$', '/murder-rate/10-40').replace('$NEXT$', '/murder-rate/over100');
        res.status(200).type('html').send(response);
    }).catch((error) => {
        console.log(error);
        res.status(404).type('txt').send('File not found');
    });
})

app.get('/murder-rate/over100', (req, res) => {
    let p1 = dbSelect("SELECT * FROM murders WHERE murders_2015 > 100");
    let p2 = fs.promises.readFile(path.join(template, 'template.html'), 'utf-8');
    let p3 = fs.promises.readFile(path.join(css, 'style.css'), 'utf-8');
    Promise.all([p1, p2, p3]).then((results) => {
        let tableBody = '';
        let datapoints_2015 = [];
        let datapoints_2016 = [];
        results[0].forEach((city) => {
            let tableRow = '<tr>';
            tableRow += '<td>' + city.city + '</td>';
            tableRow += '<td>' + city.state + '</td>';
            tableRow += '<td>' + city.murders_2015 + '</td>';
            tableRow += '<td>' + city.murders_2016 + '</td>';
            tableRow += '<td>' + city.change + '</td>';
            tableRow += '</tr>\n';
            tableBody += tableRow;

            let datapoint_2015 = {y: city.murders_2015, label: city.city};
            let datapoint_2016 = {y: city.murders_2016, label: city.city};
            datapoints_2015.push(datapoint_2015);
            datapoints_2016.push(datapoint_2016);

        });
        let style = "<style>" + results[2] + "</style>";
        let response = results[1].replace("$DATAPOINTS_2016$", JSON.stringify(datapoints_2016)).replace("$DATAPOINTS_2015$", JSON.stringify(datapoints_2015)).replace('$TITLE$', "Cities with over 100 murders").replace('$TABLEDATA$', tableBody).replace('<style></style>', style).replace('$PREV$', '/murder-rate/40-100').replace('$NEXT$', '/murder-rate/under10');
        res.status(200).type('html').send(response);
    }).catch((error) => {
        console.log(error);
        res.status(404).type('txt').send('File not found');
    });
})

app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
