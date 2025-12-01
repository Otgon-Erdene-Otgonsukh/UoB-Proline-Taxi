
export const easyGetRequest = (url: string, params: Record<string, string | number | boolean>): Promise<Response> => {
  const searchParams = new URLSearchParams();
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      searchParams.append(key, params[key].toString());
    }
  }

  const request = new Request(`/api/${url}?${searchParams.toString()}`, {
    method: "GET",
  });

  return fetch(request);
}

export const easyPostRequest = (url: string, data: Record<string, unknown>): Promise<Response> => {
  const request = new Request(`/api/${url}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return fetch(request)
}
