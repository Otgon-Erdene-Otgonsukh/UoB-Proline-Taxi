import { generateUuid } from "@/backend/utils/uuid";

describe("generateUuid", () => {
  test("returns a string in canonical UUID v4 layout", () => {
    const uuid = generateUuid();
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  test("places version digit 4 at index 14 and a valid variant nibble at index 19", () => {
    const uuid = generateUuid();
    expect(uuid[14]).toBe("4");
    expect("89ab").toContain(uuid[19]);
  });

  test("generates distinct values across calls", () => {
    const uuids = new Set(Array.from({ length: 50 }, () => generateUuid()));
    expect(uuids.size).toBe(50);
  });
});
