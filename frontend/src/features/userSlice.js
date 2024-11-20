import {createSlice} from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            const user = action.payload.data

            //set state
            state.user = user

            //set localstorage
            localStorage.setItem('user', JSON.stringify(user))
        },
        logoutUser: (state) => {
            state.user = null
            localStorage.removeItem('user')
            toast.success("Berhasil logout")
        }
    }
})

export const { loginUser, logoutUser } = userSlice.actions

export default userSlice.reducer