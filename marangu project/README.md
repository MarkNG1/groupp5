# Marangu Properties - Static Prototype

A simple static website frame for a property management/listing experience with cascading dropdowns by location (country → state/region → city), search, and basic sorting.

## Run locally

Open `index.html` directly in your browser, or serve the folder with any static server.

Examples:

```bash
# Python 3
python -m http.server 8080

# PowerShell (Windows)
Start-Process powershell -Verb runAs -ArgumentList "-NoProfile -Command \"cd '$pwd'; npx serve -s .\""
```

Then navigate to `http://localhost:8080` (or the URL your server prints).

## Customize data

Edit `data.js` to add or update properties. Each property uses:

```js
{
  id: 'unique-id',
  name: 'Building name',
  address: 'Street and number',
  price: 1200, // monthly rent or price
  beds: 2,
  baths: 1,
  thumbnail: 'optional-image-url',
  location: { country: 'Country', state: 'Region/State', city: 'City' }
}
```

## Notes

- No frameworks; vanilla HTML/CSS/JS to keep it lightweight.
- Dropdowns are populated dynamically from your data and filter the results in real time.
- Sorting supports price and name; adjust via `#sortSelect`.

