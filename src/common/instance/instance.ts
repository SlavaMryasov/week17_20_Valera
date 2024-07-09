import axios from "axios"

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '86733bb9-ad8a-4d47-8c3a-d6599f563d11'
    }
}

export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    ...settings
})
