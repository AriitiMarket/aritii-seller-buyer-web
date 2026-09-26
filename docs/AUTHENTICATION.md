# Authentication

Customer login and registration use OAuth authorization-code flow with PKCE
through `src/services/auth.service.js`. Access tokens remain in memory. The
rotating refresh token is retained in `sessionStorage` for page-reload recovery
in the current tab and is removed on logout or refresh failure.

`ProtectedRoute` is a UX guard only; backend token validation and authorization
remain authoritative.
