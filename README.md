# Daylight

A responsive weather dashboard built with React and Vite. Search for a city to
see its current conditions, hourly outlook, and 7-day forecast.

Weather and location data are provided by the free
[Open-Meteo API](https://open-meteo.com/); no API key is required.

See [the architecture guide](./docs/architecture.md) for the source layout,
module responsibilities, and naming conventions.

## Run locally

```sh
npm install
npm run dev
```

Run `npm run lint` to check the code or `npm run build` to create a production
build. Run `npm run typecheck` to validate TypeScript types.

Run `npm test` for the unit test suite and a V8 coverage summary in the console.
An HTML coverage report is written to `coverage/`. Use `npm run test:watch`
while developing.
