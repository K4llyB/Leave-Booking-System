describe("Happy path", () => {
  it("staff creates; manager approves", () => {
    // --- Staff logs in ---
    cy.visit("/login");
    cy.get('[data-cy="login-email"]').clear().type("staff@example.com");
    cy.get('[data-cy="login-password"]').clear().type("password123");
    cy.get('[data-cy="login-submit"]').click();

    // Ensure we landed
    cy.location("pathname").should("include", "/requests");

    // --- Staff creates a new request ---
    cy.contains(/new request/i).click();
    cy.location("pathname").should("include", "/new");

    cy.get('[data-cy="start"]').clear().type("2025-10-01");
    cy.get('[data-cy="end"]').clear().type("2025-10-02");
    // Optional: a reason helps show it’s working
    cy.get('[data-cy="reason"]').clear().type("Conference");

    cy.get('[data-cy="submit-request"]').click();

    // Back on list with a pending row
    cy.location("pathname").should("include", "/requests");
    cy.contains(/pending/i).should("exist");

    // --- Staff logs out ---
    // --- Staff logs out ---
cy.contains(/log out/i).click();

// token should be gone
cy.window().its("sessionStorage.length").should("eq", 0);

// normalise: go to the login page explicitly
cy.visit("/login", {
  onBeforeLoad(win) {
    win.sessionStorage.clear(); // belt & braces
  },
});

// login form should be visible
cy.get('[data-cy="login-email"]', { timeout: 10000 }).should("be.visible");


   // --- Manager logs in ---
cy.visit("/login", {
  onBeforeLoad(win) {
    win.sessionStorage.clear();
  },
});

// wait for the login form
cy.get('[data-cy="login-email"]', { timeout: 10000 }).should("be.visible");

// intercept the API call so we know login actually happened
cy.intercept("POST", "**/api/login").as("loginApi");

cy.get('[data-cy="login-email"]').clear().type("apistaff@example.com");
cy.get('[data-cy="login-password"]').clear().type("password123");
cy.get('[data-cy="login-submit"]').click();

cy.wait("@loginApi").its("response.statusCode").should("be.oneOf", [200, 201]);

// go to Manage explicitly and make sure we're not redirected
cy.visit("/manage");
cy.location("pathname", { timeout: 10000 }).should("include", "/manage");
cy.location("pathname").should("not.include", "/login");

// Approve the first pending request
cy.contains("button", /approve/i, { timeout: 10000 }).first().click();

// Badge or toast shows "approved"
cy.contains(/approved/i, { timeout: 5000 }).should("exist");

  });
});
