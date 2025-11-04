import React, { Component } from "react";
import "./Dashboard.css";
import { BASEURL, callApi, getSession, setSession } from "./lib";

class Dashboard extends Component {
  state = { username: "", firstName: "" };

  componentDidMount() {
    const username = getSession("sid");
    if (!username) { this.logout(); return; }
    this.setState({ username });
    callApi("POST", BASEURL + "getfullname", JSON.stringify({ email: username }), this.getFirstName);
  }

  getFirstName = res => {
    try {
      const r = typeof res === "string" ? JSON.parse(res) : res;
      this.setState({ firstName: r.firstName || this.state.username });
    } catch {
      this.setState({ firstName: this.state.username });
    }
  };

  logout = () => {
    setSession("sid","",-1);
    window.location.replace("/");
  };

  render() {
    return (
      <div className="dashboard">
        <div className="header">
          <div className="logo">Koneru Lakshmaiah Education Foundation</div>
          <div className="userInfo">{this.state.firstName} <img src="/logout.png" alt="logout" onClick={this.logout} style={{cursor:"pointer"}} /></div>
        </div>
        <div className="menu">Menu</div>
        <div className="workspace">Workspace</div>
        <div className="footer">Copyright @ 2025. All rights reserved.</div>
      </div>
    );
  }
}

export default Dashboard;
