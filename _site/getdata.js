import GoogleSpreadsheet from "google-spreadsheet"
import async from "async"
import fs from "fs"

    const doc = new GoogleSpreadsheet(
    "1AD-CEIVKCbYeM3ep-fcZuksGitNJOTGx6wlU1tSzf-s"
    )
    let sheet

    async.series([function setAuth(step) {
        const creds = require("./shripad-kelkar-a788f4c7e164.json");
        doc.useServiceAccountAuth(creds, step);
      }, function getInfoAndWorksheets(step) {
        doc.getInfo((err, info) => {
          console.log(
            "Loaded spreadsheet: " + info.title + " by " + info.author.email
          )
          
          // Using the first sheet
          sheet = info.worksheets[0];
          console.log(
            "sheet 1: " + sheet.title + " " + sheet.rowCount + "x" + sheet.colCount
          )
          step()
        })
      }, function getStuff(step) {
        sheet.getRows(
          {
            offset: 1,
            limit: 20,
            orderby: "col1"
          }, function(err, rows) {
            console.log("Read " + rows.length + " rows")
            // Clean posts.yml
            fs.truncate("./_data/posts.yml", 0, () => {
            })
            // Save rows as items in the YAML file
            for (let row of rows) {
              console.log(row);
              fs.appendFile(
                "./_data/posts.yml",
                "- date: " +
                row.date +
                "\n\x20\x20" +
                "title: \"" +
                row.title +
                "\"\n\x20\x20" +
                "source: \"" +
                row.source +
                "\"\n\x20\x20" +
                "category: \"" +
                row.category +
                "\"\n\x20\x20" +
                "content: \"" +
                row.content +
                "\"\n\n",
                err => {
                }
              )
            }
          }
        )
      }
      ])