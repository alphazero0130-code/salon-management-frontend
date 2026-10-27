# Glow Salon Management — Frontend

A responsive React + Vite admin workspace connected to the provided Express/MongoDB backend.

## Included screens
- Sign in and staff registration (`POST /api/auth/login`, `POST /api/auth/register`)
- Admin overview (`GET /api/admin/dashboard/stats`, services, appointments)
- Users: search and list accounts from `GET /api/auth/user` (read-only)
- Services: search, list, create, edit, activate/deactivate, delete (admin-only mutations)
- Appointments: list, status filter, create booking with user/service/staff, update status, delete
- Team: list/create/edit/delete staff and show availability
- Payments: list/filter and update status/method
- Reports: paid-payment revenue, booked appointment value, completed revenue by service
- Team access: list accounts, assign admin/staff roles and reset passwords

## Requirements
- Node.js 20.19+ or 22.12+ recommended for Vite 8
- Your backend running at `http://localhost:3000`
- MongoDB connection configured in the backend `.env`

## Run locally
1. Open this folder in VS Code.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` if needed. Set `VITE_API_BASE_URL` to your backend origin or include the `/api` path (for example, `http://localhost:3000` or `http://localhost:3000/api`). The deployed backend URL is used when this variable is unset.
4. Start the backend in a separate terminal.
5. Start frontend: `npm run dev`
6. Open the URL Vite prints (normally `http://localhost:5173`).

## Login and role setup
- Registering from the login screen creates a `staff` account by design, matching the backend.
- An existing administrator must promote the intended admin through Team access, or set the role securely in the database for the first admin account.
- Protected endpoints use `Authorization: Bearer <token>`. The frontend stores the JWT and user details in browser local storage and clears them on 401/logout.
- Admins get the dashboard, team management, payments, reports, and account access. Staff can access appointments, customers and services according to backend permissions.

## API response format
The frontend keeps presentation pages separate from application API operations (`services/salonApi.js`), HTTP transport (`services/httpClient.js`), and API configuration (`services/apiConfig.js`). The shared API configuration stores the `/api` base URL and endpoint paths relative to it. Set `VITE_API_BASE_URL` in `.env` or Vercel to the backend origin or its `/api` URL; a missing `/api` suffix is added automatically. The backend must allow the exact Vercel frontend origin via its `CORS_ORIGINS` environment variable. The HTTP client unwraps the backend's `{ success, message, data }` envelope and surfaces server error messages. Paginated list requests send `page` and `limit` query parameters, show 15 records per page, and read `{ pagination: { page, limit, total, totalPages } }` metadata for page navigation. The dashboard shows up to five appointments and services. The Users screen reads from `GET /api/auth/user`; the Customer API is not used. No API keys or backend environment secrets should be placed in this frontend `.env`.

Reusable presentation controls live in `src/components/ui/` as focused components (buttons, text, and form controls). `src/components/Field.jsx` composes those controls with labels and validation, while application colors are defined in `src/theme/colors.css` and exposed to components through `src/theme/colors.js`. Keep page-specific behavior in `src/pages/` and use these shared controls instead of rendering native controls directly in pages.

## Notes about existing backend behavior
- Appointment creation expects `userId` to reference a `User` account (not a `Customer` document), `serviceId`, optional `staffId`, and `appointmentDate`.
- Creating an appointment also creates a pending payment record on the backend.
- Your backend appointment filter currently accepts `booked`, `completed`, and `cancelled` only; pending appointments appear under “All appointments”.
- The backend currently exposes staff availability as a field but its PATCH controller only allows name/email/jobTitle updates. The UI therefore displays availability without pretending it can change it.
- The service-by-revenue report returns service ObjectIds rather than populated service names, so that report is labelled by service ID.


https://salon-management-frontend-ruby.vercel.app/login