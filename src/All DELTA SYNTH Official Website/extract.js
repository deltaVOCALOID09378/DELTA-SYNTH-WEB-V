const fs = require('fs');
const glob = require('glob');
const cheerio = require('cheerio');

const files = glob.sync('*.html');
const data = {};

for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html);
    const pageData = [];
    
    $('h1, h2, h3, h4, h5, h6, p').each((_, el) => {
        const text = $(el).text().trim();
        if (text) {
            pageData.push(text);
        }
    });
    
    data[file] = [...new Set(pageData)];
}

if (!fs.existsSync('assets/data')) {
    fs.mkdirSync('assets/data', { recursive: true });
}

fs.writeFileSync('assets/data/content.json', JSON.stringify(data, null, 2), 'utf8');
