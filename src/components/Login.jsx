import React, { useState } from "react";
const { emailId, setemailId } = useState("");
const { password, setpassword } = useState("");
const Login = () => {
  return (
    <div className="flex justify-center my-10">
      <div className="card card-border bg-base-300 w-100">
        <fieldset className="fieldset mx-5">
          <legend className="fieldset-legend">Email Id</legend>
          <input
            type="text"
            value={emailId}
            className="input"
            placeholder="Type here"
          />
          onChange= {(e) => setemailId(e.target.value)}
        </fieldset>
        <fieldset className="fieldset mx-5">
          <legend className="fieldset-legend">Password</legend>
          <input
            type="text"
            value={password}
            className="input"
            placeholder="Type here"
          />
          onChange={(e) => setpassword(e.target.value)}
        </fieldset>
        <div className="card-body">
          <div className="card-actions justify-center">
            <button className="btn btn-primary">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
