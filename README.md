# Leave Booker 

## Features
- Auth (JWT), roles (staff/manager/admin), protected routes.
- Staff: create/cancel, see remaining leave, filter pending.
- Manager: approve/reject, export CSV.
- Dates robustly parsed/displayed; inclusive day counts.

## Security
- Bearer JWT; role-gated routes; destructive actions via PATCH/DELETE.
- Auto-logout on token expiry.

## Accessibility
- Proper labels, alerts (`role="alert"`), visible focus, keyboard-friendly nav.
- Status badges with `role="status"`; skip link; responsive tables.

## Testing
- Cypress e2e (“happy path”), plus small component/validator tests.

## How to run
- API: `npm start` (port 8900); Frontend: `npm run dev` (5173).
- `VITE_API_URL=http://localhost:8900/api`.
