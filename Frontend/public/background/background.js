/* global chrome */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'activateCaptureMode') {
    const tabId = message.tabId;
    chrome.tabs.sendMessage(tabId, { action: message.action });
  }

  if (message.action === 'activateAuthMode') {
    console.log("왔업");
    // chrome.windows.create({
    //   url: "http://k9a708.p.ssafy.io:8081/swagger-ui/index.html#/",
    //   type: 'popup',
    // });
    chrome.identity.launchWebAuthFlow(
      {
        url: "http://k9a708.p.ssafy.io:8081/login",
        interactive: true,
      },
      (redirectUrl) => {
        // redirectUrl에서 인증 코드 추출
        if (redirectUrl) {
          const url = new URL(redirectUrl);
          const code = url.searchParams.get('code');
          console.log(code);
        }
      }
    );
  }
});