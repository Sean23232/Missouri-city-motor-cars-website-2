# Missouri City Motor Cars

A responsive dealership website with searchable vehicle inventory, individual listing pages, customer inquiries, and a protected owner dashboard.

## Owner dashboard

Open `/admin` and set a private `ADMIN_PASSWORD` environment variable in the hosting environment before signing in. The dashboard supports adding and editing vehicles, uploading photo galleries, marking listings sold or available, removing listings, and reviewing messages submitted through the website.

Do not commit an admin password to source control. The owner session is HTTP-only and expires after eight hours.

## Inventory and photos

Vehicle records, customer inquiries, and uploaded vehicle images are stored in PostgreSQL through Drizzle ORM. The first public or owner inventory request seeds the six supplied vehicles if their VINs are not already present. Supplied seed records intentionally omit price, mileage, and listing photography when those details were not available. Upload the dealership's real photos from the owner dashboard; the public listing cards will use those photos automatically.

For local development, set `DATABASE_URL` and `ADMIN_PASSWORD` in the environment, apply the schema with `npx drizzle-kit push`, and run `npm run dev`.
