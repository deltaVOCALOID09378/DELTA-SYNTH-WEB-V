const fs = require('fs');

const data = JSON.parse(fs.readFileSync('assets/data/content.json', 'utf8'));

const toRemove = [
    "Main",
    "About US",
    "All DELTA's Voicebank",
    "All USTX, MIDI, SVP and VSQX file",
    "All Callaboraion Voicebank.",
    "Events",
    "more",
    "All DELTA SYNTH's voicebank for My Development And My Professional OpenUtau Partner is live in this page nowno more page from other website.",
    "©Since for 2019",
    "DELTA SYNTH's Team",
    "Made inThailand",
    "Skip to Main Content"
];

for (const key in data) {
    data[key] = data[key].filter(text => !toRemove.includes(text));
}

fs.writeFileSync('assets/data/content.json', JSON.stringify(data, null, 2), 'utf8');
