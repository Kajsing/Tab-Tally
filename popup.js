import { collectStats } from "./stats.js";

const elements = {
  status: document.querySelector("#status"),
  refresh: document.querySelector("#refresh"),
  totalTabs: document.querySelector("#total-tabs"),
  totalWindows: document.querySelector("#total-windows"),
  totalGroups: document.querySelector("#total-groups"),
  groupedTabs: document.querySelector("#grouped-tabs"),
  ungroupedTabs: document.querySelector("#ungrouped-tabs"),
  incognitoWindows: document.querySelector("#incognito-windows"),
  windows: document.querySelector("#windows"),
  windowTemplate: document.querySelector("#window-template")
};

function setText(element, value) {
  element.textContent = String(value);
}

function renderWindowList(windows) {
  elements.windows.replaceChildren();

  for (const windowInfo of windows) {
    const fragment = elements.windowTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".window-card");
    const title = fragment.querySelector(".window-title");
    const meta = fragment.querySelector(".window-meta");
    const tabs = fragment.querySelector(".tab-pill");
    const groups = fragment.querySelector(".group-pill");

    title.textContent = windowInfo.focused ? "Current window" : `Window ${windowInfo.id}`;
    meta.textContent = [windowInfo.type, windowInfo.state, windowInfo.incognito ? "incognito" : null]
      .filter(Boolean)
      .join(" · ");
    tabs.textContent = `${windowInfo.tabCount} tabs`;
    groups.textContent = `${windowInfo.groupCount} groups`;

    if (windowInfo.focused) {
      card.setAttribute("aria-current", "true");
    }

    elements.windows.append(fragment);
  }
}

async function render() {
  elements.status.classList.remove("error");
  elements.status.textContent = "Loading counts...";
  elements.refresh.disabled = true;

  try {
    const stats = await collectStats();

    setText(elements.totalTabs, stats.totalTabs);
    setText(elements.totalWindows, stats.totalWindows);
    setText(elements.totalGroups, stats.totalGroups);
    setText(elements.groupedTabs, stats.groupedTabs);
    setText(elements.ungroupedTabs, stats.ungroupedTabs);
    setText(elements.incognitoWindows, stats.incognitoWindows);
    renderWindowList(stats.windows);

    elements.status.textContent = `Updated ${new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })}`;
  } catch (error) {
    elements.status.classList.add("error");
    elements.status.textContent = error.message || "Could not read browser counts.";
  } finally {
    elements.refresh.disabled = false;
  }
}

elements.refresh.addEventListener("click", render);
render();
