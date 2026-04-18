/**
 * @jest-environment node
 */

import { easyGetRequest, easyPostRequest } from "@/utils/easyRequest";

class StubRequest {
  url: string;
  method: string;
  body?: string;
  constructor(url: string, init?: { method?: string; body?: string }) {
    this.url = url;
    this.method = init?.method ?? "GET";
    this.body = init?.body;
  }
}

describe("easyRequest helpers", () => {
  const fetchMock = jest.fn();
  const originalRequest = globalThis.Request;

  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof fetch;
    (globalThis as unknown as { Request: typeof StubRequest }).Request =
      StubRequest;
  });

  afterAll(() => {
    (globalThis as unknown as { Request: typeof Request }).Request =
      originalRequest;
  });

  test("easyGetRequest builds a GET request with serialized query params", async () => {
    await easyGetRequest("bookings", { page: 2, search: "foo", flag: true });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const request = fetchMock.mock.calls[0][0] as StubRequest;
    expect(request.method).toBe("GET");
    expect(request.url).toContain("/api/bookings?");
    expect(request.url).toContain("page=2");
    expect(request.url).toContain("search=foo");
    expect(request.url).toContain("flag=true");
  });

  test("easyPostRequest sends a POST with JSON-encoded body", async () => {
    await easyPostRequest("bookings/create", { id: 1, name: "Bob" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const request = fetchMock.mock.calls[0][0] as StubRequest;
    expect(request.method).toBe("POST");
    expect(request.url).toBe("/api/bookings/create");
    expect(JSON.parse(request.body!)).toEqual({ id: 1, name: "Bob" });
  });
});
