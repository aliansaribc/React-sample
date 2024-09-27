import { Component,createRef } from "react";
import Navbar from "./navbar";
import axios from "axios";
import * as yup from 'yup';

class User extends Component {
  state = { 
      user : {
        id:'', fullName:'', phone:'', email:'', postal:'', address:''
      },
      errors : [],
      sending : false
  }

  schema = yup.object().shape({
      fullName : yup.string('full name should be string').required('full name is required'),
      phone : yup.string('phone should be number').max(10,'phone should be 10 max').required('phone is required'),
      email : yup.string().email('email should be email').required('email is required'),
      postal : yup.string('postal code should be string').required('postal code is required'),
      address : yup.string('address should be string').required('address is required')    
    })

  fullName = createRef(); phone = createRef(); email = createRef(); postal = createRef(); address = createRef();   

  async componentDidMount(){
    const token = localStorage.getItem('token');
    let urlElements = window.location.pathname.split('/');
    if(token && urlElements[2])
    {   
      this.isUserLogin();
        const url = "https://api.aliansari.net/user/"+urlElements[2]+"?token="+token;   
        const res = await axios.get(url);
        this.setState({user:res.data});
    }
  }
  
  handleChange = async (e) =>
  {
    const input = e.currentTarget;
    const user = {...this.state.user};
    user[input.name] = input.value;
    this.setState({user});
  }

  render() { 
    return (        
      <>      
        <Navbar lnk="home"/>
        <div className="row justify-content-center align-items-center m-5">
            <div className="col-xl-4 text-center card bg-light">
                <form className="card-body p-5 text-center">   
                {
                  this.state.user.id ? <h3 className="mb-5">edit user {this.state.user.id}</h3> : <h3 className="mb-5">add new user</h3>  
                }           
                <div className="form-outline mb-4">
                    <input onChange={this.handleChange} type="text" id="fullName" name="fullName" className="form-control" placeholder="enter full name" value={this.state.user.fullName} ref={this.fullName}/>                      
                </div>
                <div className="form-outline mb-4">
                    <input onChange={this.handleChange} type="text" id="phone" name="phone" className="form-control" placeholder="enter phone" value={this.state.user.phone} ref={this.phone}/>                      
                </div>
                <div className="form-outline mb-4">
                    <input onChange={this.handleChange} type="email" id="email" name="email" className="form-control" placeholder="enter email" value={this.state.user.email} ref={this.email}/>                      
                </div>
                <div className="form-outline mb-4">
                    <input onChange={this.handleChange} type="text" id="postal" name="postal" className="form-control" placeholder="enter postal code" value={this.state.user.postal} ref={this.postal}/>                      
                </div>
                <div className="form-outline mb-4">
                    <input onChange={this.handleChange} type="text" id="address" name="address" className="form-control" placeholder="enter address" value={this.state.user.address} ref={this.address}/>                      
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
                <button disabled={this.state.sending} className="btn btn-outline-primary btn-block" type="submit" onClick={this.handlesubmit}>submit</button>
                </form>
            </div>
          </div>
      </>
    );
  }

  isUserLogin = async () =>
  {  
      const token = localStorage.getItem('token');
      const url = "https://api.aliansari.net/login?token=" + token;
      const res = await axios.get(url);    
      if(res.data ==='token:0')
      {
          localStorage.clear();
          window.location.href = '/login';
      }     
  }

  validate = async () =>
  {
    try { 
      this.setState({errors:[]});
      this.state.user = {id:this.state.user.id, fullName:this.fullName.current.value,phone:this.phone.current.value,
          email:this.email.current.value,postal:this.postal.current.value,address:this.address.current.value
      };
      const resault = await this.schema.validate(this.state.user,{abortEarly:false});
      return resault;
    } 
    catch (err) {
      this.setState({errors:err.errors});
    }
  }

  handlesubmit = async (e) =>
  {
    e.preventDefault();    
    this.isUserLogin();
    const resVal = await this.validate();   
    if(resVal)
    {      
      this.setState({sending:true});
      const token = localStorage.getItem('token');
      let res = null;
      if(this.state.user.id){   
        const url = "https://api.aliansari.net/user?id="+ this.state.user.id +"&fullName=" + resVal.fullName + "&phone=" + resVal.phone
          + "&email=" + resVal.email + "&postal=" + resVal.postal + "&address=" + resVal.address + "&token=" + token;
          res = await axios.put(url);
      }
      else{
        const url = "https://api.aliansari.net/user?fullName=" + resVal.fullName + "&phone=" + resVal.phone
          + "&email=" + resVal.email + "&postal=" + resVal.postal + "&address=" + resVal.address + "&token=" + token;
          res = await axios.post(url);
      }  
      console.log('done');    
      this.setState({sending:false});
      if(res.data ==='token:0')
      {
        this.setState({errors:['you are not login']});
      }   
      else{
        window.location.href = '/';
      }       
    }   
  }
}
 
export default User;