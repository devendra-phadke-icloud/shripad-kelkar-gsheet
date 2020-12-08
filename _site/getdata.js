const { GoogleSpreadsheet } = require('google-spreadsheet');
const { DateTime } = require("luxon");
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require("path");

// spreadsheet key is the long id in the sheets URL
const doc = new GoogleSpreadsheet("1AD-CEIVKCbYeM3ep-fcZuksGitNJOTGx6wlU1tSzf-s");

const postsDir = path.join(__dirname, "_posts");
console.log('postsDir', postsDir);

// function to remove all files from a directory
const removeDir = (_path) => {
  try {
    fs.rmdirSync(_path, { recursive: true });
    console.log(`${_path} is deleted!`);
    // create empty directory
    fs.mkdirSync(_path);
  } catch (err) {
    console.error(`Error while deleting ${_path}.`);
  }
}

(async function () {

  // use service account creds
  // OR load directly from json file if not in secure environment
  await doc.useServiceAccountAuth(require('./shripad-kelkar-a788f4c7e164.json'));

  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);

  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  console.log(sheet.title);
  console.log(sheet.rowCount);

  const rows = await sheet.getRows({
    offset: 1,
    limit: 20,
    orderby: "col1"
  }); // can pass in { limit, offset }

  console.log("Read " + rows.length + " rows")
  // Clean posts.yml
  // fs.truncate("./_data/posts.yml", 0, () => {
  // });
  removeDir(postsDir);

  // Save rows as items in the YAML file
  for (let row of rows) {
    // console.log('printing row', row, row.date, row.Date, DateTime.fromFormat(row.Date, "d-LLL-yyyy").toFormat('yyyy-LL-dd'));
    fs.appendFile(
      // "./_data/posts.yml",
      "./_posts/" + DateTime.fromFormat(row.Date, "d-LLL-yyyy").toFormat('yyyy-LL-dd') + "-" + uuidv4() + '.md',
      "---\n" +
      "layout: post\n" + 
      "title: \"" + row.Title + "\"\n" + 
      "categories: [" + row.Categories + "]\n" + 
      "tags: [" + row.Tags + "]\n" + 
      "source: \"" + row.Source + "\"\n" + 
      "---\n\n" +
      row.Content +
      "\n",
      err => {
      }
    )
  }

}());
