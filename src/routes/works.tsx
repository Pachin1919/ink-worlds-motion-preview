import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/works")({ component: () => <Outlet /> });