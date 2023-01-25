// import { getAuthTokens } from "../api/AuthApi"
// import axios from "../api/axiosApi"

export  function refresh (){

}

// export default function RefreshToken () {
//     const auth = getAuthTokens()

//     async function refresh(){
//         if(auth){
//             const response = await axios.post('/token/refresh', {
//                 refresh : auth.refresh
//             })
//             localStorage.setItem('user', JSON.stringify(response.data))
//             return response.data.access
//         }
        
//         return null
//     }

//     return refresh
// }