/** 현재 탭의 정보를 가져오는 함수 */
export const getActiveTab = async (): Promise<chrome.tabs.Tab | undefined> => {
  const [tab] = await chrome.tabs.query({ active: true });

  // "chrome://"으로 시작하는 url이면 막기
  if (tab.url?.startsWith("chrome://")) {
    alert("Capture is not available on this tab.");
    return undefined;
  }

  if (typeof tab.id === "number") {
    return new Promise((resolve) => {
      chrome.tabs.get(tab.id as number, (tabInfo) => resolve(tabInfo));
    });
  }

  return undefined;
};
