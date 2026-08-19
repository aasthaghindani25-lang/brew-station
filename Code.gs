/*******************************************************
 * The Brew Station — Google Apps Script order receiver
 * 1) Create a Google Sheet.
 * 2) Extensions → Apps Script.
 * 3) Replace the default code with this file.
 * 4) Deploy → New deployment → Web app.
 *    Execute as: Me
 *    Who has access: Anyone
 * 5) Copy the Web app URL into CONFIG.orderApi in app.js.
 *******************************************************/
const SHEET_NAME = "Orders";

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(["Order ID","Time","Table","Customer","Payment","Total","Items","Notes","Status"]);
  }
  const items = (data.items || []).map(x => `${x.qty} × ${x.name}${x.variant ? " ("+x.variant+")" : ""}`).join(" | ");
  sh.appendRow([data.id,new Date(data.createdAt || Date.now()),data.table,data.name,data.payment,data.total,items,data.notes || "","NEW"]);
  return ContentService.createTextOutput(JSON.stringify({ok:true,id:data.id}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput("The Brew Station order API is running.");
}
