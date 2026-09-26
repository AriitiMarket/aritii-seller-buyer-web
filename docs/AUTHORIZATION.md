# Authorization

Guests can access the public website and permitted marketplace discovery.
Authenticated users can access buyer routes. Business routes require both
authentication and the approved-seller check in `SellerAuthRoute`.

The frontend is not the security boundary. Backend APIs must enforce ownership,
seller approval, order access, and role permissions.
