# Application architecture

Daylight uses a small feature-based structure. Code is grouped by the product
area it supports, with API requests, stateful behavior, presentation, and
formatting kept in separate modules.

## Source layout

```text
src/
├── App.tsx
├── main.tsx
├── index.css
└── features/
    └── weather/
        ├── api/
        │   ├── forecastApi.ts
        │   └── locationApi.ts
        ├── components/
        │   ├── CurrentWeatherCard.tsx
        │   ├── HourlyForecast.tsx
        │   ├── LocationPinIcon.tsx
        │   ├── LocationSearch.tsx
        │   ├── SearchIcon.tsx
        │   ├── WeatherDashboard.tsx
        │   ├── WeatherDetails.tsx
        │   ├── WeatherIcon.tsx
        │   └── WeeklyForecast.tsx
        ├── hooks/
        │   ├── useForecast.ts
        │   └── useLocationSearch.ts
        ├── utils/
        │   └── weatherUtils.ts
        ├── constants.ts
        ├── types.ts
        └── weather.css
```

## Module responsibilities

- `main.tsx` mounts React and loads global styles. `App.tsx` is the root
  composition point; keep it small as more features are added.
- `features/weather/components/WeatherDashboard.tsx` owns page-level location
  selection, connects the forecast hook, and composes the dashboard.
- Other files in `components/` render focused UI. They receive data and event
  handlers through props rather than making network requests.
- `hooks/` owns asynchronous UI behavior. `useForecast` loads and refreshes a
  forecast; `useLocationSearch` debounces queries and cancels outdated requests.
- `api/` owns Open-Meteo URLs, request parameters, and response checks. Keep
  browser and React state out of this layer.
- `utils/` contains pure formatting and weather-domain functions.
- `constants.ts` contains stable values used across the weather feature.
- `weather.css` contains styles specific to the weather feature. `index.css`
  contains global resets, typography, and shared base styles.

The intended dependency direction is:

```text
main.tsx → App.tsx → weather dashboard → components and hooks
                                           hooks → API modules
components and hooks → weather utilities and constants
```

Keep dependencies flowing inward toward the feature. API modules should not
import React or UI components, and components should not call `fetch` directly.

## Naming conventions

| Code | Convention | Examples |
| --- | --- | --- |
| React components | PascalCase, one component per file | `WeatherDetails.tsx` |
| Custom hooks | `use` prefix with camelCase | `useForecast.ts` |
| API modules | Domain plus `Api` suffix | `forecastApi.ts` |
| Utilities | camelCase, named for their operation | `weatherUtils.ts` |
| Constants | UPPER_SNAKE_CASE | `DEFAULT_LOCATION` |
| CSS classes | kebab-case | `.weather-hero`, `.hour-card` |
| Component props | camelCase, describe inputs/actions | `isLoading`, `onRetry` |

Use explicit named or default exports from the module that owns the code. Avoid
barrel files until there is a concrete need; direct imports make dependencies
easy to trace.

## Adding functionality

1. Add new user-facing functionality under `src/features/<feature-name>/`.
2. Keep network details in `api/`, stateful async work in `hooks/`, UI in
   `components/`, and pure domain logic in `utils/`.
3. Keep feature-specific styles with the feature. Put styles in `index.css` only
   when they are truly global.
4. Add tests beside the code they cover (for example,
   `useForecast.test.ts` or `WeatherDetails.test.tsx`) when a test runner is
   introduced.
5. Promote a component or utility to `src/shared/` only when multiple features
   need the same general-purpose behavior. Avoid creating abstractions for
   single-use code.

Surface request and invalid-response errors to the UI, cancel requests when
their inputs change or components unmount, and keep formatting helpers pure so
they can be tested independently.

## TypeScript

All application modules use `.ts` or `.tsx`; use `.tsx` only for files that
contain JSX. Keep shared weather-domain and API response types in
`features/weather/types.ts`. Treat network responses as `unknown` and validate
their shape in the API module before exposing typed data to hooks or components.

`tsconfig.json` enables strict checking and `npm run typecheck` runs the
no-emit TypeScript compiler. Tooling configuration may remain JavaScript when
its ecosystem does not require TypeScript.
