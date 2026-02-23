/**
 * Header — thin re-export.
 *
 * ClientHeader is now a pure "use client" component that resolves auth
 * state on the client via Clerk's useUser hook — no server await needed.
 * This means the header is part of the static HTML shell and renders
 * instantly on every navigation.
 */
export { default } from "./ClientHeader";
