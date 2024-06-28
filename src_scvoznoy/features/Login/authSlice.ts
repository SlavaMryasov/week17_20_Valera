import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'
import { authAPI, LoginParamsType } from '../../api/todolists-api'
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils'
import { AppThunk } from 'src/app/store'
import { appActions } from 'src/app/appSlice'


const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    selectors: {
        selectIsLoggedIn: state => state.isLoggedIn
    }
})



// thunks
export const loginTC = (data: LoginParamsType): AppThunk => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }))
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

// types


export const authReducer = slice.reducer
export const authActions = slice.actions
export const authSliceName = slice.name
export const { selectIsLoggedIn } = slice.selectors