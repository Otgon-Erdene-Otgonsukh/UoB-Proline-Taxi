import { easyGetRequest, easyPostRequest } from "@/utils/easyRequest";

describe("easyRequest helpers", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(new Response("ok"));
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  test("easyGetRequest builds a GET request with serialized query params", async () => {
    await easyGetRequest("bookings", { page: 2, search: "foo", flag: true });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.method).toBe("GET");
    expect(request.url).toContain("/api/bookings?");
    const url = new URL(request.url, "http://localhost");
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("search")).toBe("foo");
    expect(url.searchParams.get("flag")).toBe("true");
  });

  test("easyPostRequest sends a POST with JSON-encoded body", async () => {
    await easyPostRequest("bookings/create", { id: 1, name: "Bob" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.method).toBe("POST");
    expect(request.url).toContain("/api/bookings/create");
    const body = await request.text();
    expect(JSON.parse(body)).toEqual({ id: 1, name: "Bob" });
  });
});
