export const BASEURL = "http://localhost:5000/";

export function callApi(reqMethod, url, data, responseHandler) {
  let options;

  if (reqMethod === "GET" || reqMethod === "DELETE") {
    options = { method: reqMethod, headers: { 'Content-Type': 'application/json' } };
  } else {
    options = { method: reqMethod, headers: { 'Content-Type': 'application/json' }, body: data };
  }

  fetch(url, options)
    .then(response => {
      if (!response.ok) throw new Error(response.status + ': ' + response.statusText);
      return response.text(); // use text to handle both JSON and string
    })
    .then(text => {
      try {
        const res = JSON.parse(text);
        responseHandler(res);
      } catch {
        responseHandler(text);
      }
    })
    .catch(err => alert("API Error: " + err.message));
}

// Set cookie session (works on localhost)
export function setSession(sesName, sesValue, expInDays) {
  const D = new Date();
  D.setTime(D.getTime() + expInDays * 86400000);
  document.cookie = `${sesName}=${sesValue};expires=${D.toUTCString()};path=/`;
}

// Read cookie session
export function getSession(sesName) {
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieData = decodedCookie.split(";").map(c => c.trim());
  for (let c of cookieData) {
    if (c.startsWith(sesName + "=")) return c.substring(sesName.length + 1);
  }
  return "";
}
