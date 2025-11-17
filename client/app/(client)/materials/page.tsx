"use client";

import AddMaterial from "@/app/(components)/add-material.component";
import MaterialList from "./components/material-list/material-list.component";
import * as Sentry from "@sentry/react";
import ErrorPage from "../error/page";

const Materials = () => {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorPage />}>
      <AddMaterial />
      <MaterialList />
    </Sentry.ErrorBoundary>
  );
};

export default Materials;
