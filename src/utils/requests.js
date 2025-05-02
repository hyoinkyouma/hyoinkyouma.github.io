import axios from "axios";

export default class Requests {
  constructor() {
    this.url = process.env.REACT_APP_API_BASEURL;
  }
  async post(endpoint, body) {
    return await axios.post(`${this.url}${endpoint}`, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  async get(endpoint) {
    return await axios.get(`${this.url}${endpoint}`);
  }
}
