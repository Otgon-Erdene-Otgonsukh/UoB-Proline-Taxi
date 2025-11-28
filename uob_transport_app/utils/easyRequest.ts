
export const easyGetRequest = (url: string, params: Record<string, string | number | boolean>, needAuth: boolean): Promise<Response> => {
  const headers = new Headers()
  if (needAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      return new Promise((_, reject) => {
        reject('Login needed')
      })
    }
    headers.append('token', localStorage.getItem('token')!)
  }

  const searchParams = new URLSearchParams();
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      searchParams.append(key, params[key].toString());
    }
  }

  const request = new Request(`/api/${url}?${searchParams.toString()}`, {
    method: "GET",
    headers: headers,
  });

  return fetch(request);
}

export const easyPostRequest = (url: string, data: Record<string, unknown>, needAuth: boolean): Promise<Response> => {
  const headers = new Headers()
  if (needAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      return new Promise((_, reject) => {
        reject('Login needed')
      })
    }
    headers.append('token', localStorage.getItem('token')!)
  }

  const request = new Request(`/api/${url}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: headers,
  });
  return fetch(request)
}
