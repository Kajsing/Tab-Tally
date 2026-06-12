export async function collectStats(chromeApi = globalThis.chrome) {
  if (!chromeApi?.tabs?.query || !chromeApi?.windows?.getAll) {
    throw new Error("Chrome tabs and windows APIs are unavailable.");
  }

  const [tabs, windows, groups] = await Promise.all([
    chromeApi.tabs.query({}),
    chromeApi.windows.getAll({ populate: false }),
    chromeApi.tabGroups?.query ? chromeApi.tabGroups.query({}) : Promise.resolve([])
  ]);

  const tabCountsByWindow = new Map();
  const groupCountsByWindow = new Map();

  for (const tab of tabs) {
    tabCountsByWindow.set(tab.windowId, (tabCountsByWindow.get(tab.windowId) || 0) + 1);
  }

  for (const group of groups) {
    groupCountsByWindow.set(group.windowId, (groupCountsByWindow.get(group.windowId) || 0) + 1);
  }

  const groupedTabs = tabs.filter((tab) => typeof tab.groupId === "number" && tab.groupId !== -1).length;

  return {
    totalTabs: tabs.length,
    totalWindows: windows.length,
    totalGroups: groups.length,
    groupedTabs,
    ungroupedTabs: tabs.length - groupedTabs,
    incognitoWindows: windows.filter((window) => window.incognito).length,
    normalWindows: windows.filter((window) => !window.incognito).length,
    windows: windows
      .map((window) => ({
        id: window.id,
        focused: Boolean(window.focused),
        incognito: Boolean(window.incognito),
        state: window.state || "unknown",
        type: window.type || "normal",
        tabCount: tabCountsByWindow.get(window.id) || 0,
        groupCount: groupCountsByWindow.get(window.id) || 0
      }))
      .sort((a, b) => Number(b.focused) - Number(a.focused) || b.tabCount - a.tabCount)
  };
}

export function formatBadgeText(tabCount) {
  if (tabCount > 999) {
    return "999+";
  }

  return String(tabCount);
}
