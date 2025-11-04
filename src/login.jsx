import React, { Component } from "react";
import "./css/login.css";
import { BASEURL, callApi, getSession, setSession } from "./lib";

class Login extends Component {
  state = {
    signup: false,
    signupData: { firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" },
    loginData: { email: "", password: "" },
    errData: {}
  };

  handleSignUpInput = e => this.setState({ signupData: { ...this.state.signupData, [e.target.name]: e.target.value } });
  handleLoginInput = e => this.setState({ loginData: { ...this.state.loginData, [e.target.name]: e.target.value } });

  validateSignup = () => {
    const { signupData } = this.state;
    const err = {};
    if (!signupData.firstName.trim()) err.firstName = "Required";
    if (!signupData.lastName.trim()) err.lastName = "Required";
    if (!signupData.email.trim()) err.email = "Required";
    if (!signupData.phone.trim()) err.phone = "Required";
    if (signupData.password.length < 8) err.password = "Min 8 characters";
    if (signupData.confirmPassword !== signupData.password) err.confirmPassword = "Passwords do not match";
    this.setState({ errData: err });
    return Object.keys(err).length === 0;
  };

  registerUser = () => {
    if (!this.validateSignup()) return;
    const { signupData } = this.state;
    const data = JSON.stringify(signupData);
    callApi("POST", BASEURL + "signup", data, res => {
      if (res.insertedId || res.code === "300") {
        alert(res.message || "Signup successful");
        this.setState({ signup: false, signupData: { firstName:"",lastName:"",email:"",phone:"",password:"",confirmPassword:"" }, errData:{} });
      } else alert(res.message || "Signup failed");
    });
  };
   loginResponse(res){
        let rdata = JSON.parse(res).split("::");
        if(rdata[0] === "300"){
            const {loginData} = this.state
            setSession("sid", loginData.email, 1);
            window.location.replace("/dashboard");
        }
        else
            alert(rdata[1]);

        this.setState({loginData: {
            email: "",
            password: ""
        }});
    }

  validateLogin = () => {
    const { loginData } = this.state;
    const err = {};
    if (!loginData.email.trim()) err.email = "Required";
    if (!loginData.password.trim()) err.password = "Required";
    this.setState({ errData: err });
    return Object.keys(err).length === 0;
  };

  loginUser = () => {
    if (!this.validateLogin()) return;
    const { loginData } = this.state;
    const data = JSON.stringify({ email: loginData.email, password: loginData.password });
    callApi("POST", BASEURL + "login", data, res => {
      let r = typeof res === "string" ? JSON.parse(res) : res;
      if (r.code === "300") {
        setSession("sid", loginData.email, 1);
        window.location.replace("/dashboard");
      } else alert(r.message || "Login failed");
      this.setState({ loginData: { email: "", password: "" } });
    });
  };

  render() {
    const { signup, signupData, loginData, errData } = this.state;
    return (
      <div className="login">
        <div className="leftpanel">
          <h1>Welcome Back!</h1>
          <p>Access and manage your tasks efficiently</p>
        </div>
        <div className="rightpanel">
          <div className="card">
            <h2>Login</h2>
            <input name="email" placeholder="Email" value={loginData.email} onChange={this.handleLoginInput} style={errData.email ? { border:"1px solid red" } : {}} />
            <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={this.handleLoginInput} style={errData.password ? { border:"1px solid red" } : {}} />
            <button onClick={this.loginUser}>Login</button>
            <p>Don't have an account? <span className="link" onClick={() => this.setState({signup:true})}>Sign Up</span></p>
          </div>
        </div>

        {signup && (
          <div className="overlay">
            <div className="signup">
              <button className="close" onClick={() => this.setState({signup:false})}>X</button>
              <h2>Create an account</h2>
              {["firstName","lastName","email","phone","password","confirmPassword"].map(field => (
                <div key={field}>
                  <label>{field.replace(/([A-Z])/g," $1")} *</label>
                  <input type={field.includes("password")?"password":"text"} name={field} placeholder={field} value={signupData[field]} onChange={this.handleSignUpInput} style={errData[field]?{border:"1px solid red"}:{}} />
                </div>
              ))}
              <button onClick={this.registerUser}>Register</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Login;
