import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './css/login.css'

export default class Login extends Component {
  render() {
    return (
      <div className='login'>
        <div className='leftPanel'>
          <h2>Welcome to s201 ERP project</h2>
          <p>Check all the ERP options here</p>
        </div>

        <div className='rightPanel'>
          <div className='card'>
            <input type='text' placeholder='Enter the Username' />
            <br /><br />
            <input type='password' placeholder='Enter the Password' />
            <br /><br />
            <button>Login</button>
            <p>
              Don&apos;t have an account?{' '}
              <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }
}
