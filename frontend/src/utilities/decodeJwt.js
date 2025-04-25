import jwt_decode from 'jwt-decode'

const getUserInfo = () => {
    const token = localStorage.getItem("token")
    if(!token) return undefined
    return jwt_decode(token)
}

export default getUserInfo;