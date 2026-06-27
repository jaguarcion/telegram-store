const fs = require('fs');
async function test() {
  const r = await fetch('https://akunding.shop/api/docs');
  const text = await r.text();
  const match = text.match(/url: "(.*?)"/);
  if (match) {
     const openapiUrl = 'https://akunding.shop' + match[1];
     console.log('Fetching', openapiUrl);
     const spec = await fetch(openapiUrl);
     console.log((await spec.text()).substring(0, 500));
  }
}
test();
