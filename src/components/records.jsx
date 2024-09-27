import { Component,createRef } from "react";
import LoadingUsers from "./loading";
import Navbar from "./navbar";
import axios from "axios";  
import { Link } from "react-router-dom";

class Recordsc extends Component {

    state = { 
        users : [],
        dblusers : [],
        isLoading:true,
        isLogin:false
    } 

    async componentDidMount(){
        const url = "https://api.aliansari.net/user";
        const res = await axios.get(url);
        this.setState({users:res.data,dblusers:res.data,isLoading:false});
        
        const token = localStorage.getItem('token');
        if(token)
        {
            this.setState({isLogin:true});
        }
    }

    ID = createRef(); fullName = createRef(); phone = createRef(); email = createRef(); postal = createRef(); address = createRef();    

    render() { 
        return (
            <>  
                {
                    this.state.isLogin ? <Navbar lnk="logout"/>:<Navbar lnk="login"/>
                }
                <div className="p-3">
                    <div className="row">   
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <p> {this.state.users.length} records fetched from database by API and need to be authorised for every action, except filter..</p>
                        </div> 
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th className="text-center col-md-1"><input className="form-control text-center" type="number" placeholder="ID" ref={this.ID} onKeyDown={this.search}></input></th>
                                        <th className="text-center col-md-2"><input className="form-control text-center" placeholder="full name" ref={this.fullName} onKeyDown={this.search}></input></th>
                                        <th className="text-center col-md-3"><input className="form-control text-center" type="email" placeholder="email" ref={this.email} onKeyDown={this.search}></input></th>
                                        <th className="text-center col-md-3"><input className="form-control text-center" placeholder="address" ref={this.address} onKeyDown={this.search}></input></th>
                                        <th className="text-center col-md-1"><input className="form-control text-center" placeholder="postal" ref={this.postal} onKeyDown={this.search}></input></th>
                                        <th className="text-center col-md-1"><input className="form-control text-center" type="number" placeholder="phone" ref={this.phone} onKeyDown={this.search}></input></th>
                                        <td className="text-center col-md-1 align-middle">
                                            <input type="submit" value="filter" onClick={this.filterList} className="btn btn-outline-success btn-sm m-1"></input>
                                            {this.state.isLogin ? 
                                            <Link className="btn btn-outline-primary btn-sm m-1" to="/user">add</Link> :
                                            <Link className="btn btn-outline-primary btn-sm m-1" to="#">add</Link>}
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>     
                                    {
                                        this.state.isLoading ? (<LoadingUsers/>) : 
                                        (                                
                                            this.state.users.map((user,i) =>              
                                            <tr key={i}>
                                                <td className="text-center align-middle col-md-1">{user.id}</td>
                                                <td className="text-center align-middle col-md-2">{user.fullName}</td>
                                                <td className="text-center align-middle col-md-3">{user.email}</td>
                                                <td className="text-center align-middle col-md-3">{user.address}</td>                                    
                                                <td className="text-center align-middle col-md-1">{[user.postal.slice(0, 3), " ", user.postal.slice(3,6)].join('')}</td>
                                                <td className="text-center align-middle col-md-1">{[user.phone.slice(0, 3), " ", user.phone.slice(3,6), " ", user.phone.slice(6)].join('')}</td>
                                                <td className="text-center align-middle col-md-1">
                                                    <Link to={"/user/" + user.id} className="btn btn-outline-warning btn-sm m-1">edit</Link>
                                                    <input disabled={!this.state.isLogin} type="submit" value="del" onClick={this.deleteuser} id={user.id} className="btn btn-outline-danger btn-sm m-1"></input>
                                                </td>
                                            </tr>)
                                        )
                                    }      
                                </tbody>
                            </table>  
                        </div>                               
                    </div>
                </div>
            </>
        );
    }

    phoneStyle(e)
    {
        let phone = [e.slice(0, 3), " ", e.slice(3,6), " ", e.slice(6)].join('');
        return phone;
    }

    postalStyle(e)
    {
        let postal = [e.slice(0, 3), " ", e.slice(3,6)].join('');
        return postal;
    }

    search = (e) => { if(e.keyCode == 13) { this.filterList(); } }

    filterList = () => {
       this.isLoading = true;
       const newUsers = this.state.dblusers.filter(item => 
            (item.id.toString().indexOf(this.ID.current.value) > -1) &&
            (item.fullName.toLowerCase().indexOf(this.fullName.current.value) > -1) && 
            (item.phone.toLowerCase().indexOf(this.phone.current.value) > -1) && 
            (item.email.toLowerCase().indexOf(this.email.current.value) > -1) && 
            (item.postal.toLowerCase().indexOf(this.postal.current.value) > -1) && 
            (item.address.toLowerCase().indexOf(this.address.current.value) > -1));
       this.setState({users:newUsers});
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

    deleteuser = async (event) => {
        const id = event.target.id;
        event.target.disabled = true;
        this.isLoading = true;
        this.isUserLogin();
        const token = localStorage.getItem('token');
        const url = "https://api.aliansari.net/user/"+id+"?token=" + token;
        const res = await axios.delete(url);
        event.target.disabled = false;
        this.setState({users:res.data,dblusers:res.data,isLoading:false});
    }    
}
 
export default Recordsc;