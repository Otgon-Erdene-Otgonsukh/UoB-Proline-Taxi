import { bookingStatusMap } from "@/model/models";

describe("bookingStatusMap", () => {
  test("maps 0 to Pending", () => {
    expect(bookingStatusMap(0)).toBe("Pending");
  });

  test("maps 1 to Approved", () => {
    expect(bookingStatusMap(1)).toBe("Approved");
  });

  test("maps 2 to Rejected", () => {
    expect(bookingStatusMap(2)).toBe("Rejected");
  });

  test("falls back to Pending for unknown values", () => {
    expect(bookingStatusMap(99)).toBe("Pending");
    expect(bookingStatusMap(-1)).toBe("Pending");
  });
});
