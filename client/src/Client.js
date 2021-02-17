import fetch from "isomorphic-fetch";

const SESSION_STORAGE_KEY = process.env.SESSION_STORAGE_KEY;

class Client {
  constructor() {
    this.useSessionStorage = typeof sessionStorage !== "undefined";
    this.subscribers = [];

    if (this.useSessionStorage) {
      this.token = sessionStorage.getItem(SESSION_STORAGE_KEY);

      if (this.token) {
        this.isTokenValid().then((bool) => {
          if (!bool) {
            this.token = null;
          }
        });
      }
    }
  }

  isLoggedIn() {
    return !!this.token;
  }

  subscribe(cb) {
    this.subscribers.push(cb);
  }

  notifySubscribers() {
    this.subscribers.forEach((cb) => cb(this.isLoggedIn()));
  }

  setToken(token) {
    this.token = token;

    if (this.useSessionStorage) {
      sessionStorage.setItem("SESSION_STORAGE_KEY", token);
    }
  }

  removeToken() {
    this.token = null;

    if (this.useSessionStorage) {
      sessionStorage.removeItem("SESSION_STORAGE_KEY");
    }
  }

  isTokenValid() {
    const url = "/api/check_token?token=" + this.token;
    return fetch(url, {
      method: "get",
      headers: {
        accept: "application/json",
      },
    })
      .then(this.checkStatus)
      .then(this.parseJson)
      .then((json) => json.valid === true);
  }

  getAlbum(albumId) {
    return this.getAlbums([albumId], (albums) => albums[0]);
  }

  getAlbums(albumIds) {
    const url = "/api/albums?ids=" + albumIds.join(",") + "&token=" + this.token;
    return fetch(url, {
      method: "get",
      headers: {
        accept: "application/json",
      },
    })
      .then(this.checkStatus)
      .then(this.parseJson)
      .catch((error) => console.log(error));
  }

  login() {
    return fetch("/api/login", {
      method: "post",
      headers: {
        accept: "application/json",
      },
    })
      .then(this.checkStatus)
      .then(this.parseJson)
      .then((json) => this.setToken(json.token))
      .catch((error) => console.log(error));
  }

  logout() {
    this.removeToken();
  }

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(`HTTP Error ${response.statusText}`);
      error.status = response.statusText;
      error.response = response;
      console.log(error);
      throw error;
    }
  }

  parseJson(response) {
    return response.json();
  }
}

export const client = new Client();
