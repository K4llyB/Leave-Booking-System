describe("Happy path", () => {
  it("staff creates; manager approves", () => {
    cy.visit("/login");
    cy.get('input[type="email"]').type("staff@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.contains("Sign in").click();
    cy.contains("Signed in successfully").should("exist");
    cy.contains("New Request").click();
    cy.get('input[type="date"]').first().type("2025-10-01");
    cy.get('input[type="date"]').last().type("2025-10-02");
    cy.get('button').contains(/submit/i).click();
    cy.contains("My leave requests").should("exist");
    // log out/in as manager
    cy.contains("Log out").click();
    cy.visit("/login");
    cy.get('input[type="email"]').type("manager@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.contains("Sign in").click();
    cy.visit("/manage");
    cy.contains("Approve").first().click();
    cy.contains(/approved/i).should("exist");
  });
});
