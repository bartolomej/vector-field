const ghPages = require('gh-pages');

ghPages.publish('dist', err => {
  console.log(err ? err : 'Published site!')
});