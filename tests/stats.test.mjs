import assert from "node:assert/strict";
import { collectStats, formatBadgeText } from "../stats.js";

const chromeMock = {
  tabs: {
    async query() {
      return [
        { id: 1, windowId: 100, groupId: -1 },
        { id: 2, windowId: 100, groupId: 10 },
        { id: 3, windowId: 100, groupId: 10 },
        { id: 4, windowId: 200, groupId: -1 },
        { id: 5, windowId: 200, groupId: 20 }
      ];
    }
  },
  windows: {
    async getAll() {
      return [
        { id: 100, focused: true, incognito: false, state: "normal", type: "normal" },
        { id: 200, focused: false, incognito: true, state: "maximized", type: "normal" }
      ];
    }
  },
  tabGroups: {
    async query() {
      return [
        { id: 10, windowId: 100 },
        { id: 20, windowId: 200 }
      ];
    }
  }
};

const stats = await collectStats(chromeMock);

assert.equal(stats.totalTabs, 5);
assert.equal(stats.totalWindows, 2);
assert.equal(stats.totalGroups, 2);
assert.equal(stats.groupedTabs, 3);
assert.equal(stats.ungroupedTabs, 2);
assert.equal(stats.incognitoWindows, 1);
assert.deepEqual(
  stats.windows.map((window) => ({
    id: window.id,
    tabCount: window.tabCount,
    groupCount: window.groupCount
  })),
  [
    { id: 100, tabCount: 3, groupCount: 1 },
    { id: 200, tabCount: 2, groupCount: 1 }
  ]
);

assert.equal(formatBadgeText(12), "12");
assert.equal(formatBadgeText(1000), "999+");

console.log("stats.test.mjs passed");
