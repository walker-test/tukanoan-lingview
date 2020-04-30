const fetch = require('node-fetch');
const { promises: { writeFile } } = require('fs');
const path = require('path');

async function remoteMediaSearchFetchSaveIndex() {
  const cachedRemoteMediaFiles = {};
  if (typeof process.env.GDRIVE_MEDIA_FOLDER_ID === 'undefined') {
    console.log('MISSING ENV VARIABLE: GDRIVE_MEDIA_FOLDER_ID');
    process.exit(1);
  }
  if (typeof process.env.GOOGLE_API_KEY === 'undefined') {
    console.log('MISSING ENV VARIABLE: GOOGLE_API_KEY');
    process.exit(1);
  }

  let nextPageToken = true;
  while (nextPageToken) {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=%27${process.env.GDRIVE_MEDIA_FOLDER_ID}%27+in+parents&key=${process.env.GOOGLE_API_KEY}`);
    const json = await res.json();
    for (const { kind, id, name } of json.files) {
      if (kind === 'drive#file') {
        cachedRemoteMediaFiles[name] = id;
      }
    }
    ({ nextPageToken } = json);
  }
  await writeFile(path.join(__dirname, 'TEMP_remote_media_index.json'), JSON.stringify(cachedRemoteMediaFiles, null, '  '), 'utf8');
}
(async () => await remoteMediaSearchFetchSaveIndex())();