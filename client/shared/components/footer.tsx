import React, { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="py-30 px-4 text-center text-gray-200 bg-neutral-800">
      <small className="mb-2 block text-sm">
        &copy; 2026 Oleksii Slipokurov. All rights reserved.
      </small>
      {/* <p className="text-xs">
        <span className="font-semibold">Front-end:</span> built with React &
        Next.js (App Router & Server Actions), TypeScript, Tailwind CSS, Framer
        Motion, Vercel hoisting, Azure, Docker.
      </p>
      <p className="text-xs">
        <span className="font-semibold">Back-end:</span> built with FastAPI,
        SQLite, SQLalchemy
      </p> */}
    </footer>
  );
};

export default Footer;
