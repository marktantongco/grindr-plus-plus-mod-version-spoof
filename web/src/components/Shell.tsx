import type { ReactNode } from "react";
import { Masthead } from "./Masthead";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Masthead />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main id="main" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
