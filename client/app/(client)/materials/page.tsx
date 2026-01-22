"use client";

import MaterialList from "./components/material-list/material-list.component";
import * as Sentry from "@sentry/react";
import ErrorPage from "../error/page";
import AddMaterial from "./components/add-material/add-material.component";

const Materials = () => {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorPage />}>
      <AddMaterial />
      <MaterialList />
    </Sentry.ErrorBoundary>
  );
};

export default Materials;
