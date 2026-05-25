import { formatCurrency } from "./format";

describe("formatCurrency", () => {
  it("formats integer minor units as currency", () => {
    expect(formatCurrency(184250)).toBe("$1,842.50");
  });
});
