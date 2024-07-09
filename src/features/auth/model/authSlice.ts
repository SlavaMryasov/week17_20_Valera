import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LoginParamsType, authAPI } from "src/api/todolists-api"
import { appActions } from "src/app/appSlice"
import { AppThunk } from "src/app/store"
import { handleServerAppError } from "src/common/utils/handleServerAppError"
import { handleServerNetworkError } from "src/common/utils/handleServerNetworkError"
import { todolistsActions } from "../TodolistsList/todolistsSlice"


const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
            // return {...state, isLoggedIn: action.payload.isLoggedIn}
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    selectors: {
        selectIsLoggedIn: state => state.isLoggedIn
    }
})

// thunks
export const loginTC = (data: LoginParamsType): AppThunk => (dispatch) => {
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
export const logoutTC = (): AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                // dispatch(setIsLoggedInAC(false))
                dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }))
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
                dispatch(todolistsActions.clearTodosData(null))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}


export const authReducer = slice.reducer
export const authActions = slice.actions
export const { selectIsLoggedIn } = slice.selectors
export const authSliceName = slice.name