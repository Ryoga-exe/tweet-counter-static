import { createBrowserRouter } from "react-router-dom";
import PageIndex from "./pages/index.tsx";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      children: [{ index: true, element: <PageIndex /> }],
    },
  ],
  {
    basename: "/tweet-counter-static/",
  },
);
