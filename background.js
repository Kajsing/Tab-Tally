import { collectStats, formatBadgeText } from "./stats.js";

async function updateBadge() {
  try {
    const stats = await collectStats();
    await chrome.action.setBadgeText({ text: formatBadgeText(stats.totalTabs) });
    await chrome.action.setBadgeBackgroundColor({ color: "#2563eb" });
    await chrome.action.setTitle({
      title: `Tab Tally: ${stats.totalTabs} tabs, ${stats.totalWindows} windows, ${stats.totalGroups} groups`
    });
  } catch {
    await chrome.action.setBadgeText({ text: "!" });
    await chrome.action.setBadgeBackgroundColor({ color: "#dc2626" });
  }
}

chrome.runtime.onInstalled.addListener(updateBadge);
chrome.runtime.onStartup.addListener(updateBadge);
chrome.tabs.onCreated.addListener(updateBadge);
chrome.tabs.onRemoved.addListener(updateBadge);
chrome.tabs.onUpdated.addListener(updateBadge);
chrome.tabs.onAttached.addListener(updateBadge);
chrome.tabs.onDetached.addListener(updateBadge);
chrome.windows.onCreated.addListener(updateBadge);
chrome.windows.onRemoved.addListener(updateBadge);

if (chrome.tabGroups) {
  chrome.tabGroups.onCreated.addListener(updateBadge);
  chrome.tabGroups.onRemoved.addListener(updateBadge);
  chrome.tabGroups.onUpdated.addListener(updateBadge);
  chrome.tabGroups.onMoved.addListener(updateBadge);
}

updateBadge();
