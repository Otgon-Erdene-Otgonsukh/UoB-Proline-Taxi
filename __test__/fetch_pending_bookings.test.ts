/**
 * @jest-environment node
 */
import { GET } from "../src/app/api/get_pending_bookings/route";

test("check if the res status is good", async () => {
  const res = await GET();
  expect(res.status).toBe(200);

  const data = await res.json();
  expect(data).toBeDefined();
});