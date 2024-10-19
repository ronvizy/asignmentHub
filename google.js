const sheetName = 'Sheet1' // work on present sheet name
const scriptProp = PropertiesService.getScriptProperties()

function initialSetup() {
    const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    scriptProp.setProperty('key', activeSpreadsheet.getId()) // same name(id) as acc. to need value
}

function doPost(e) {
    const lock = LockService.getScriptLock()
    lock.tryLock(10000)

    try {
        const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
        const sheet = doc.getSheetByName(sheetName)

        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] // old data entry
        const nextRow = sheet.getLastRow() + 1 // new data entry

        const newRow = headers.map(function (header) {
            return header === 'Date' ? new Date() : e.parameter[header]  // date enrty with date
        })

        sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]) //


        // sending mail over here after the record has been created in file.

        console.log('at line no. 27 =======', newRow);
        const mailMsg = `Hi Admin,
    Someone has submit the contact us request please see the following details:
    Name:  ${newRow[0]},
    Email: ${newRow[1]},
    Contact_No: ${newRow[2]},
    Message: ${newRow[3]}`;
        MailApp.sendEmail('agrawalashish005@gmail.com', 'Contact Us Details', mailMsg);
        console.log('at line no. 29 =======', MailApp.getRemainingDailyQuota());
        Logger.log('asdfghjkgfbfggb', MailApp.getRemainingDailyQuota());


        return ContentService
            .createTextOutput(JSON.stringify({'result': 'success', 'row': nextRow}))
            .setMimeType(ContentService.MimeType.JSON)
    } catch (e) {
        return ContentService
            .createTextOutput(JSON.stringify({'result': 'error', 'error': MailApp.getRemainingDailyQuota()}))
            .setMimeType(ContentService.MimeType.JSON)
    } finally {
        lock.releaseLock()
    }
}

