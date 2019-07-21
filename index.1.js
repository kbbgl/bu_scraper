const puppeteer = require('puppeteer');
const readlLine = require('readline');
const fs = require('fs');

// parse countries for comparison
const countries = require('./countries.json');
const countriesOfIntereset = require('./countriesOfInterest.json');

//
var initYear = 2008;
var finalYear = 2016;

// prompt user for country and year
const rl = readlLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Which country do you want to search for? ", (answer) => {

    var countryFound = false;
    countries.forEach(country => {
        if(country.name.toLowerCase() == answer.toLowerCase()){
            countryFound = true;
            query = answer[0].toUpperCase() + answer.substring(1);
            console.log(`${query} exists!`);

            rl.question(`\nWhat year would you like data for ${query}? `, (year) => {

                //http://www.bu.edu/cgef/#/{year}/Country/{country}
                if (year.length != 4){
                    console.error("Invalid year. Exiting...");
                    exit();
                }
                const url = `https://www.bu.edu/cgef/#/${year}/Country/${query}`;
                console.log(url);

                console.log("Launching puppeteer to start scrape...");
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
                        console.log(html);
                        fs.writeFileSync(`${query}.html`, html);
                        console.log(`Finished writing to file ${query}-${year}.html`);
                        rl.close();
                        exit();
                    })
                    .catch((err) => {
                        console.error(`Error loading ${url}`);
                        console.error(JSON.stringify(err));
                        rl.close();
                        exit();
                    })

                })
        }
    });

    if(!countryFound){
        console.error("Country not found. Exiting...");
        exit();
    }
    
})

findCountry = (country) => {

}

exit = () => {
    process.exit();
}