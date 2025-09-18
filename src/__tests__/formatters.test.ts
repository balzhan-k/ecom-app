import {
    formatPrice,
    formatPercentage,
    formatNumber,
    formatDimensions,
    formatText,
    calculateDiscountedPrice,
    getProductDisplayTitle,
    toCents,
  } from "@/utils/formatters";
  
  describe("formatters utils", () => {
    test("formatPrice", () => {
      expect(formatPrice(10)).toBe("$10.00");
      expect(formatPrice(10.5)).toBe("$10.50");
      expect(formatPrice(undefined)).toBe("N/A");
    });
  
    test("formatPercentage", () => {
      expect(formatPercentage(20)).toBe("20%");
      expect(formatPercentage(undefined)).toBe("0%");
    });
  
    test("formatNumber", () => {
      expect(formatNumber(123)).toBe("123");
      expect(formatNumber(undefined)).toBe("N/A");
    });
  
    test("formatDimensions", () => {
      expect(formatDimensions({ width: 10, height: 20, depth: 30 }))
        .toBe("W: 10cm, H: 20cm, D: 30cm");
      expect(formatDimensions({ width: 15 })).toBe("W: 15cm, H: N/Acm, D: N/Acm");
      expect(formatDimensions(undefined)).toBe("N/A");
    });
  
    test("formatText", () => {
      expect(formatText("Hello")).toBe("Hello");
      expect(formatText(123)).toBe("123");
      expect(formatText(true)).toBe("true");
      expect(formatText(undefined)).toBe("N/A");
      expect(formatText("")).toBe("N/A");
    });
  
    test("calculateDiscountedPrice", () => {
      expect(calculateDiscountedPrice(100, 20)).toBe(80);
      expect(calculateDiscountedPrice(100, 0)).toBe(100);
      expect(calculateDiscountedPrice(100, undefined)).toBe(100);
    });
  
    test("getProductDisplayTitle", () => {
      expect(getProductDisplayTitle({ brand: "Apple", title: "iPhone" }))
        .toBe("Apple. iPhone");
    });
  
    test("toCents", () => {
      expect(toCents(10)).toBe(1000);
      expect(toCents(10.55)).toBe(1055);
      expect(toCents(undefined)).toBe(0);
    });
  });
  