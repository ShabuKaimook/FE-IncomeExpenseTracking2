# IncomeExpenseTracking2-FE Agent Guide

This is the active frontend: TanStack Start, TanStack Router, TanStack Query, React, Tailwind CSS, Radix Themes, and Bun.

## Layers

- `src/routes`: route declarations only.
  Example: `src/routes/index.tsx` maps `/transaction/create` to `TransactionCreatePage` and wraps protected pages with `RequireAuth`.
- `src/features/<topic>`: page containers, feature API code, hooks, and page-specific components.
  Example: `src/features/transactions/TransactionPage.tsx` owns transaction filters and renders transaction components.
- `src/features/<topic>/components`: components that belong to one page or feature.
  Example: `src/features/dashboard/components/SpendingTrendDashboardCard.tsx` belongs to the dashboard.
- `src/shared`: cross-feature code only.
  Example: `src/shared/components/SearchBar.tsx`, `src/shared/components/DatePicker.tsx`, and `src/shared/api/AxiosInstance.ts`.

## Page And Component Placement

When creating a new page with many components, create a folder for that topic under `src/features` and put page-specific pieces in its `components` folder.

Example:

```txt
src/features/budget/BudgetPage.tsx
src/features/budget/components/BudgetLimitCard.tsx
src/features/budget/components/BudgetProgressList.tsx
src/features/budget/api/BudgetService.ts
src/features/budget/hooks/useBudgets.ts
```

If a component can be reused globally, put it in `src/shared/components`.

Example:

```txt
src/shared/components/SearchBar.tsx
src/shared/components/DropDown.tsx
src/shared/components/LoadingSpinner.tsx
```

Do not put a one-page component in `src/shared`. Move it there only when another feature needs it.

## Data Pattern

Keep feature data files beside the feature.

- `api/*Request.ts`: request types.
  Example: `src/features/transactions/api/TransactionRequest.ts`.
- `api/*Response.ts`: response types.
  Example: `src/features/userTransactionCategories/api/UserTransactionCategoryResponse.ts`.
- `api/*Service.ts`: HTTP calls through `axiosInstance`.
  Example: `TransactionService.createTransaction()` posts to `/transaction/create`.
- `api/*QueryKeys.ts`: TanStack Query keys.
  Example: `transactionKeys.list(req)`.
- `hooks/use*.ts`: query/mutation wrappers for pages.
  Example: `useUserTransactions()` returns `transactions`, `error`, and `isLoading`.

## UI Pattern

- Reuse shared controls first.
  Example: `TransactionPage.tsx` uses `SearchBar` and `DateRangeWithShowDisabledNavigation`.
- Use page-specific dropdowns/cards inside the feature.
  Example: `TransactionSortByDropdown.tsx` and `TransactionCard.tsx` stay under `features/transactions/components`.
- Use `lucide-react` icons for actions.
  Example: `CategoryCard.tsx` uses `Pencil`, `Trash2`, and `ChevronDown`.
- Use `cn` from `src/shared/utils/Utils.ts` for class names.
  Example: `SearchBar.tsx` combines base and caller-provided classes.

## Routing And Auth

- Add routes in `src/routes/index.tsx`.
  Example: `/category` renders `CategoryPage`.
- Wrap private pages in `RequireAuth`.
  Example: dashboard, transaction, create transaction, and category routes.
- Use `RedirectIfAuthenticated` for login-like public pages.
  Example: `/login`.

## Checks

Run from this folder:

```bash
bun run check
bun run build
```

Keep changes small. Prefer existing feature and shared patterns over new structure.
