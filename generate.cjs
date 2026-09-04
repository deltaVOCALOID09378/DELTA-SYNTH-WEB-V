const fs = require('fs');
const { VOICEBANKS } = require('./src/public/voicebankData.js');

const template = fs.readFileSync('./src/public/singers/dokya.html', 'utf8');

VOICEBANKS.forEach(singer => {
    let html = template;
    
    // Replace Title
    html = html.replace(/<title>.*?<\/title>/, `<title>${singer.name} - DELTA SYNTH (Desolate Space)</title>`);
    
    // Replace Header Name
    html = html.replace(/<h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 glow-text">.*?<\/h1>/, `<h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 glow-text">${singer.name}</h1>`);
    
    // Replace Image (both alt and src)
    html = html.replace(/<img alt=".*?"/g, `<img alt="${singer.name}"`);
    html = html.replace(/src="\.\.\/assets\/voicebanks\/profile\/.*?"/g, `src="../${singer.image}"`);
    
    // Replace Age / Gender
    html = html.replace(
        /<p class="text-xs text-red-500 uppercase tracking-widest mb-1">Age \/ Gender<\/p>\s*<p class="text-xl text-white font-light">.*?<\/p>/,
        `<p class="text-xs text-red-500 uppercase tracking-widest mb-1">Age / Gender</p>\n<p class="text-xl text-white font-light">${singer.age || '?'}, ${singer.gender || '?'}</p>`
    );
    
    // Replace Genre
    html = html.replace(
        /<p class="text-xs text-red-500 uppercase tracking-widest mb-1">Genre<\/p>\s*<p class="text-xl text-white font-light">.*?<\/p>/,
        `<p class="text-xs text-red-500 uppercase tracking-widest mb-1">Genre</p>\n<p class="text-xl text-white font-light">${singer.genre || 'Unknown'}</p>`
    );
    
    // Replace Voicer
    html = html.replace(
        /<p class="text-xs text-red-500 uppercase tracking-widest mb-1">Voicer<\/p>\s*<p class="text-xl text-white font-light">.*?<\/p>/,
        `<p class="text-xs text-red-500 uppercase tracking-widest mb-1">Voicer</p>\n<p class="text-xl text-white font-light">${singer.voicer || 'Unknown'}</p>`
    );
    
    // Replace Engine/Project
    html = html.replace(
        /<p class="text-xs text-red-500 uppercase tracking-widest mb-1">Project<\/p>\s*<p class="text-xl text-white font-light">.*?<\/p>/,
        `<p class="text-xs text-red-500 uppercase tracking-widest mb-1">Engine</p>\n<p class="text-xl text-white font-light">${singer.engine || 'Unknown'}</p>`
    );
    
    // Replace Biography
    html = html.replace(
        /<p class="text-gray-400 font-light leading-relaxed text-lg font-th">.*?<\/p>/s,
        `<p class="text-gray-400 font-light leading-relaxed text-lg font-th">${singer.description}</p>`
    );
    html = html.replace(
        /<p class="text-gray-400 font-light leading-relaxed text-lg font-en text-red-200\/80">.*?<\/p>/s,
        `<p class="text-gray-400 font-light leading-relaxed text-lg font-en text-red-200/80">${singer.name} is a featured singer in the DELTA SYNTH roster.</p>`
    );
    
    // Replace Audio Source
    html = html.replace(/<source src="\.\.\/Voice\/.*?"/, `<source src="../${singer.audioSample}"`);
    
    // Replace Download Link
    html = html.replace(
        /<a class="inline-block bg-red-700.*?href=".*?".*?>.*?<\/a>/s,
        `<a class="inline-block bg-red-700 hover:bg-red-600 text-white font-medium py-3 px-8 rounded-full transition transform hover:scale-[1.05] active:scale-[0.98] glow-text shadow-[0_0_15px_rgba(255,0,0,0.4)]" href="${singer.downloadUrl}" target="_blank" rel="noopener noreferrer">ดาวน์โหลด ${singer.name} (Download Voicebanks)</a>`
    );

    // Save to file
    const filePath = `./src/public/${singer.detailUrl}`;
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Generated: ${filePath}`);
});
console.log('All 53 singer profiles updated.');
