import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,ts,jsx,tsx}",
  },
  video: false,
  viewportWidth: 1366,
  viewportHeight: 768,
});
