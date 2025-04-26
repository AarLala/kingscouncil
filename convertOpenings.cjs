const fs = require('fs');
const path = require('path');

const files = ['a.tsv', 'b.tsv', 'c.tsv', 'd.tsv', 'e.tsv'];
const book = {};

files.forEach(file => {
  const data = fs.readFileSync(path.join(__dirname, file), 'utf8');
  data.split('\n').forEach(line => {
    const [eco, name, pgn] = line.split('\t');
    if (pgn) {
      const moves = pgn.trim().split(' ');
      for (let i = 1; i < moves.length; i++) {
        const key = moves.slice(0, i).join(' ');
        if (!book[key]) book[key] = [];
        if (!book[key].includes(moves[i])) book[key].push(moves[i]);
      }
    }
  });
});

fs.writeFileSync(path.join(__dirname, 'openingBook.json'), JSON.stringify(book, null, 2));
console.log('Opening book generated!'); 