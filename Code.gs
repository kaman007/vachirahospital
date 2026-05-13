// ============================================================
//  วางโค้ดทั้งหมดนี้ใน Google Apps Script แล้ว Deploy
// ============================================================

var SHEET_NAME = "ข้อมูลหัวหน้ากลุ่มงาน";

function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var data = sheet.getDataRange().getValues();
    var registrations = {};
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var deptId = String(row[0]);
      if (deptId) {
        registrations[deptId] = {
          deptName:    row[1],
          name:        row[2],
          position:    row[3],
          phone:       row[4],
          email:       row[5],
          submittedAt: row[6],
        };
      }
    }
    return buildResponse({ status: "ok", registrations: registrations });
  } catch (err) {
    return buildResponse({ status: "error", message: err.message });
  }
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    if (payload.action !== "submit") {
      return buildResponse({ status: "error", message: "Unknown action" });
    }
    var sheet = getOrCreateSheet();
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(payload.deptId)) {
        return buildResponse({ status: "error", message: "Already submitted" });
      }
    }
    sheet.appendRow([
      payload.deptId,
      payload.deptName,
      payload.name,
      payload.position,
      payload.phone       || "",
      payload.email       || "",
      payload.submittedAt || new Date().toLocaleString("th-TH"),
    ]);
    return buildResponse({ status: "ok" });
  } catch (err) {
    return buildResponse({ status: "error", message: err.message });
  }
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["รหัสหน่วยงาน","ชื่อหน่วยงาน","ชื่อ-นามสกุล","ตำแหน่ง","เบอร์โทรศัพท์","อีเมล","วันเวลาที่บันทึก"]);
    var h = sheet.getRange(1, 1, 1, 7);
    h.setBackground("#1a3a6b");
    h.setFontColor("#ffffff");
    h.setFontWeight("bold");
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, 7, 180);
  }
  return sheet;
}

function buildResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
