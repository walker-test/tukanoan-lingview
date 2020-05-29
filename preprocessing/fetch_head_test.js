const fetch = require('fetch-retry')(require('isomorphic-fetch'));
const { URL } = require('url');

async function fetchHeadTest(url) {
  const urlEncoded = new URL(url).href; // without encoding the url, the fetch fails if the url includes any letters with diacritics
  const response = await fetch(urlEncoded, {
    method: 'HEAD',
    retries: 5,
    retryDelay: 1000
  });
  // if (!response.ok) {
  //   console.warn('unexpected response', response.statusText, 'when checking url', url);
  // }
  return response.ok;
}

module.exports = () => fetchHeadTest;