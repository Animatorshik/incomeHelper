# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Dev server (localhost:3000)
npm run build    # Production build
npm test         # Run tests
npm run deploy   # Build and deploy to GitHub Pages (gh-pages)
npm run tsc      # Type-check TypeScript files
```

## Environment Variables

Copy `.env.example` to `.env` before running. Required vars:

- `REACT_APP_MIN_SALARY_PLN` — minimum salary in PLN (e.g. `4300`). The income limit is calculated as `MIN_SALARY_PLN * 0.75 * 2` per month (or `* 3` per quarter).
- `REACT_APP_LIMIT_BY_QUARTER` — set to `1` to track limits per quarter instead of per month; `0` for monthly.

## Architecture

This is a Create React App (TypeScript) income tracker for freelancers in Poland. It has no backend — all data lives in `localStorage` under the key `trackerData`.

**State management:** Single Redux slice at `src/features/records/recordsSlice.ts`. The slice hydrates itself from `localStorage` on init and writes back on every mutation. The async thunk `addRecordAsync` fetches the PLN exchange rate from the Polish National Bank API (`api.nbp.pl`) before saving a record.

**Exchange rate logic:** For non-PLN currencies, the rate used is from the *working day before* the income date (per Polish tax law). If that date's rate isn't available, it falls back to the latest rate.

**Key data flow:**
1. User fills `IncomeForm` → dispatches `addRecordAsync(data)`
2. Thunk calls `src/api/api.ts` → NBP API → returns rate
3. Record with `pricePln` and `exchangeRate` stored in Redux + localStorage
4. `Records` component groups records by month/quarter/year and renders them
5. `Limits` component shows remaining income limit for the current period (fetches live EUR/USD rates for display only)

**Backup/Restore:** `Backup` exports localStorage JSON as a `.txt` file; `Restore` reads it back and dispatches `updateRecords` to rehydrate state.

**Two receivers** are hardcoded: `reciever === 0` = Лена, `reciever === 1` = Влад. The limit is split 50/50 between them.

The `TRecord` type is in `src/types/records.ts`. `AppDispatch` is exported from `src/app/store.ts` and should be used when typing `useDispatch()` in components that dispatch thunks.

**Styling:** Tailwind CSS + MUI (Material UI) components used together throughout.
