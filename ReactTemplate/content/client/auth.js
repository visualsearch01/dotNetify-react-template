class Auth {
  url = "/token";
  userid = 747;
  signIn(username, password) {
    return fetch(this.url, {
      method: 'post',
      mode: 'no-cors',
      body: "username=" + username + "&password=" + password + "&grant_type=password&client_id=dotnetifydemo",
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
    })
    .then(response => {
      if (!response.ok) throw new Error(response.status);
        console.log('Auth signin response: ', response);
        return response.json();
    })
    .then(token => {
      console.log('Auth signin token: ', token);
      window.localStorage.setItem("access_token", token.access_token);
    });
  }

  signOut() {
    window.localStorage.removeItem("access_token");
    window.location.href = "/";
  }

  getAccessToken() {
    return window.localStorage.getItem("access_token");
  }

  hasAccessToken() {
    return this.getAccessToken() != null;
  }
}

export default new Auth();
