/**
 * Upload files to Google Drive and save record to Google Sheet
 * By www.bpwebs.com
 * References: https://stackoverflow.com/a/26497772/2391195
 *             https://developers.google.com/apps-script/guides/html/communication#index.html_4
 */


 var folderID = "root"; //Replace the "root"with folder ID to upload files to a specific folder
 var sheetName = "Data"; //Replace the "Data" with your data sheet name
 
 
 function uploadFiles(formObject) {
   try {
     var folder = DriveApp.getFolderById(folderID);
     var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
     var fileUrl = "";
     var fileName = "";
 
     //Upload file if exists and update the file url
     if (formObject.myFile.length > 0) {
       var blob = formObject.myFile;
       var file = folder.createFile(blob);
       file.setDescription("Uploaded by " + formObject.first_name);
       fileUrl = file.getUrl();
       fileName = file.getName();
     } else{
       fileUrl = "Record saved without a file";
     }
 
     //Saving records to Google Sheet
     sheet.appendRow([
       formObject.first_name,
       formObject.last_name,
       formObject.gender,
       formObject.dateOfBirth,
       formObject.email,
       formObject.phone,
       fileName,
       fileUrl,
       Utilities.formatDate(new Date(), "GMT+5:30", "yyyy-MM-dd'T'HH:mm:ss'Z'")]);
     
     // Return the URL of the saved file
     return fileUrl;
     
   } catch (error) {
     return error.toString();
   }
 }