// Before this file is running, please Firstly you run this command in terminal.
//npm list --depth=0 --json > deps.json

const fs = require('fs');

const deps = JSON.parse(fs.readFileSync('deps.json')).dependencies;
const lines = Object.entries(deps).map(([name, info]) => `${name}@${info.version}`);

fs.writeFileSync('requirements.txt', lines.join('\n'));
console.log('Congratulations! 🚀 Requirements.txt created!');


//After the generate this file with node : node generate_requirements.js
// you can run this in terminal: xargs npm install < requirements.txt