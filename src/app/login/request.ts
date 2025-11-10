export const userLogin = async (email: string, password: string): Promise<Response> => {
  const request = new Request("http://localhost:3000/api/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    }),
  });
  return fetch(request)
}
