const puppeteer = require('puppeteer');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
// const cheerio = require('cheerio');

// parse countries for comparison
const countriesOfInterest = require('./countriesOfInterest.json');

//
var initYear = 2008;
var finalYear = 2016;

const url = `https://www.bu.edu/cgef/#/2016/Country/Angola`;

puppeteer
    .launch()
    .then((browser) => {
        return browser.newPage();
    })
    .then((page) => {
        return page.goto(url).then(() => {
            return page.content();
        })
    })
    .then((html) => {
        const dom = new JSDOM(html);
        var sections = dom.window.document.querySelectorAll('div[class=attributeList]');
        console.log(sections);

        console.log(`Found ${sections.length} sections`);
        sections.forEach(section => {

            var obj = {};
            obj.title = section.querySelector('[class=title]').textContent;
            obj.source = section.querySelector('span[class=clickable]').textContent;
            obj.groupTotal = section.querySelector('div[class=groupTotal]').textContent;
            obj.projectName = section.querySelector('span[class=attributeValue]').textContent;
        
            console.log(obj);
        });
        

    })
    .catch((err) => {
        console.error(`Error loading ${url}`);
        console.error(JSON.stringify(err));
        // exit();
    });