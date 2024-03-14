describe("HomePage", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("successfully loads", () => {
    cy.visit("/");
  });

  it("has a title", () => {
    cy.get("h1").contains("JackBlack");
  });

  it('has a button with the text "Start Game"', () => {
    cy.get("button").contains("Start Game");
  });
});
