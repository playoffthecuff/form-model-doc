import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ThemeProvider } from "../components/theme-provider";
import { ThemeToggler } from "../components/theme-toggler";

export const Route = createRootRoute({
  component: Root,
})

function Root() {
  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <div className="p-2 flex gap-2 text-lg">
          <Link
            to="/"
            activeProps={{
              className: 'font-bold',
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link
            to="/constructor"
            activeProps={{
              className: 'font-bold',
            }}
          >
            About
          </Link>
          <Link
            to="/text"
            activeProps={{
              className: 'font-bold',
            }}
          >
            Text
          </Link>
          <Link
            to="/form"
            activeProps={{
              className: 'font-bold',
            }}
          >
            Form
          </Link>
          <Link
            to="/tests"
            activeProps={{
              className: 'font-bold',
            }}
          >
            Tests
          </Link>
          <Link
            to="/units"
            activeProps={{
              className: 'font-bold',
            }}
          >
            Units
          </Link>
          <ThemeToggler/>
        </div>
        <hr />
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
      </ThemeProvider>
    </>
  )
}