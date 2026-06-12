# Tab Tally

Tab Tally is a small Chrome extension that gives you a quick count of your open tabs, browser windows, and tab groups.

The popup shows totals, grouped vs. ungrouped tabs, incognito windows, and a simple per-window breakdown. The toolbar badge shows your current tab count at a glance.

## Features

- Counts open tabs, windows, and tab groups
- Shows grouped and ungrouped tab totals
- Shows incognito window count
- Breaks counts down per browser window
- Updates the toolbar badge when tabs, windows, or groups change
- Uses only the `tabGroups` permission

## Install Locally

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this repository folder.

## Test

Run the lightweight logic test:

```bash
npm test
```

You can also open `test.html` directly in a browser to preview the popup UI with mocked browser data.

## License

MIT

## Privacy

Tab Tally does not collect, store, transmit, sell, or share personal data. See [PRIVACY.md](PRIVACY.md) for details.
