const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');
const replaceProd = require('./modules/replaceProd');

////////////// Files

// Blocking
// const inputData = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(inputData);

// const outputData = `Here's an article about avacado for you:\n${inputData}\n\nWritten in ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', outputData);
// console.log('File Written!');

// Non blocking way
// fs.readFile( /* './txt/starttt.txt' */ './txt/start.txt', 'utf-8', (err1, data1) => {
//     if(err1) return console.log('ERROR! 😡');

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err2, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err3, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file is ready! 😊');
//             });
//         });
//     });
// });
// console.log('Reading...');

/////// SERVER
// const server = http.createServer((req,res) => {
//     const pathName = req.url;

//     if (pathName === '/' || pathName === '/overview'){
//         setTimeout(() => {
//             res.end('Hello from overview page!');
//         }, 5000);
//     } else if (pathName === '/product') {
//         res.end('Hello from product page!');
//     } else if (pathName === '/api') {
//         fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
//             // console.log(data);
//             res.writeHead(200, {'Content-type':'application/json'});
//             res.end(data);
//         });
//     } else {
//         res.writeHead(404, {
//             'Content-type' : 'text/html',
//             'my-own-header': 'custom'
//         });
//         res.end('<h1>Hello from some page!</h1>');
//     }
// });

// server.listen(8000, '127.0.0.1', () => {
//     console.log('Listening to requests...');
// });

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const productTemplate = fs.readFileSync(
    `${__dirname}/templates/product.html`,
    'utf-8'
);
const overviewTemplate = fs.readFileSync(
    `${__dirname}/templates/overview.html`,
    'utf-8'
);
const productCardTemplate = fs.readFileSync(
    `${__dirname}/templates/product-card.html`,
    'utf-8'
);

const slugs = dataObj.map(el => slugify(el, { lower: true }));
const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    // OVERVIEW page
    if (pathname === '/' || pathname === '/overview') {
        const cardsTemp = dataObj
            .map(el => replaceTemplate(productCardTemplate, el))
            .join('');
        const outputOverview = overviewTemplate.replace(
            '{%PRODUCT_CARDS%}',
            cardsTemp
        );

        res.writeHead(200, { 'Content-type': 'text/html' });
        res.end(outputOverview);

        // PRODUCT page
    } else if (pathname === '/product' && query.id < dataObj.length) {
        const el = dataObj[query.id];
        const prodTemp = replaceProd(productTemplate, el);
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.end(prodTemp);

        // API
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);

        // NOT FOUND
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'custom'
        });
        res.end('<h1>Hello from some page!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests...');
});
