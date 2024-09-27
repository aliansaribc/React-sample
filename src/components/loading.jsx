import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

 const LoadingUsers = () => {
    return Array(15).fill({}).map(()=>{
        return(
            <tr>
                <td className="text-center align-middle"><Skeleton width={20} /></td>
                <td className="text-center align-middle"><Skeleton width={75} /></td>
                <td className="text-center align-middle"><Skeleton width={75} /></td>
                <td className="text-center align-middle"><Skeleton width={75} /></td>
                <td className="text-center align-middle"><Skeleton width={75} /></td>
                <td className="text-center align-middle"><Skeleton width={75} /></td>
                <td className="text-center align-middle">
                    <div><Skeleton className="m-2" width={25} inline={true} count={2} /></div>                    
                </td>
            </tr>
        )
    });
 }
  
 export default LoadingUsers;