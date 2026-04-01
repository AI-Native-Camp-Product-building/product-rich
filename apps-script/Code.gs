/**
 * Liveklass Extensions Marketplace — 요청 수신 웹훅
 *
 * 사용법:
 * 1. Google Sheets에서 확장 프로그램 > Apps Script 열기
 * 2. 이 코드를 Code.gs에 붙여넣기
 * 3. 배포 > 새 배포 > 웹 앱 선택
 *    - 실행 주체: 본인
 *    - 액세스 권한: 누구나
 * 4. 배포 후 생성된 URL을 config.js의 requestEndpoint에 설정
 *
 * 시트 구조 (첫 행 헤더):
 * submittedAt | source | siteUrl | contactChannel | requestedAppId | requestedAppName | desiredLaunchWindow | problemStatement | accessMode
 */

const SHEET_NAME = "requests";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return response({ error: "SHEET_NOT_FOUND" }, 500);
    }

    // 헤더가 없으면 생성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "submittedAt",
        "source",
        "siteUrl",
        "contactChannel",
        "requestedAppId",
        "requestedAppName",
        "desiredLaunchWindow",
        "problemStatement",
        "accessMode"
      ]);
    }

    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.source || "",
      data.siteUrl || "",
      data.contactChannel || "",
      data.requestedAppId || "",
      data.requestedAppName || "",
      data.desiredLaunchWindow || "",
      data.problemStatement || "",
      data.accessMode || ""
    ]);

    return response({ status: "ok", row: sheet.getLastRow() });
  } catch (err) {
    return response({ error: err.message }, 500);
  }
}

function doGet() {
  return response({ status: "healthy", sheet: SHEET_NAME });
}

function response(body, code) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON
  );
}
