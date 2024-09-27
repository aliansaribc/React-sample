import { Component,createRef } from "react";
import Navbar from "./navbar";
import axios from "axios";
import * as yup from 'yup';

class Login extends Component {

  state = { 
    account : {
      userName:'',
      pass:''
    },
    errors : [],
    sending : false
  }

  schema = yup.object().shape({
    userName : yup.string('user name should be string ').required('user name is required '),
    pass : yup.string('password should be number ').required('password is required ')       
  })

  userName = createRef();
  pass = createRef();

  render() { 
    return (
      <>
        <Navbar lnk="home" />
        <div className="row justify-content-center align-items-center m-5">
          <div className="col-md-3 text-center card bg-light">
            <form className="card-body p-5 text-center">              
              <h3 className="mb-5">Sign in</h3>              
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="userName">user name</label>
                <input type="text" id="userName" className="form-control" placeholder="user name is : ali" ref={this.userName}/>                      
              </div>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="pass">Password</label>
                <input type="password" id="pass" className="form-control" placeholder="password is : 123456" ref={this.pass}/>                      
              </div>
              {
                this.state.errors.length !== 0 && (
                  <div className="alert alert-danger">
                    <ul>
                      {this.state.errors.map((e,i)=><li key={i}>{e}</li>)}
                    </ul>
                  </div>
                )
              }              
              <button disabled={this.state.sending} className="btn btn-outline-primary btn-block" type="submit" onClick={this.handleLogin}>Login</button>
            </form>
          </div>
        </div>
      </>
    );
  }

  validate = async () =>
  {
    try { 
      this.setState({errors:[]});
      this.state.account = {userName:this.userName.current.value,pass:this.pass.current.value};
      const resault = await this.schema.validate(this.state.account,{abortEarly:false});
      return resault;
    } 
    catch (err) {
      this.setState({errors:err.errors});
    }
  }

  handleLogin = async (e) =>
  {
    e.preventDefault();    
    const resVal = await this.validate();   
    if(resVal)
    {
      this.setState({sending:true});
      const url = "https://api.aliansari.net/login?userName=" + resVal.userName + "&password=" + resVal.pass;
      const res = await axios.post(url);
      this.setState({sending:false});
      if(res.data ==='token:0')
      {
        this.setState({errors:['user is not valid']});
      }   
      else{
        localStorage.setItem('token',res.data.replace("token:",""));
        window.location.href = '/';
      }       
    }   
  }
}
 
export default Login;