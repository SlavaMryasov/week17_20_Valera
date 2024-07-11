import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { appActions } from "src/app/appSlice"
import { handleServerAppError } from "src/common/utils/handleServerAppError"
import { handleServerNetworkError } from "src/common/utils/handleServerNetworkError"
import { todolistsActions } from "src/features/TodolistsList/todolistsSlice"
import { LoginParamsType, authAPI } from "../api/authApi"
import { createAppAsyncThunk } from "src/common/utils"



const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        // setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
        //     state.isLoggedIn = action.payload.isLoggedIn
        // }
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
    },
    selectors: {
        selectIsLoggedIn: state => state.isLoggedIn
    }
})

// thunks

export const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
    `${slice.name}/login`, async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await authAPI.login(arg)
            if (res.data.resultCode === 0) {
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
                return { isLoggedIn: true }
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        }
        catch (err) {
            handleServerNetworkError(err, dispatch)
            return rejectWithValue(null)
        }
    })
export const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
    `${slice.name}/logout`, async (_, thunkAPI) => { // вместо arg ставим землю, потому что не используем
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await authAPI.logout()
            if (res.data.resultCode === 0) {
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
                dispatch(todolistsActions.clearTodosData(null))
                return { isLoggedIn: false }
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        }
        catch (err) {
            handleServerNetworkError(err, dispatch)
            return rejectWithValue(null)
        }
    })


export const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, any>(
    `${slice.name}/initializeApp`, async (_, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            const res = await authAPI.me()
            if (res.data.resultCode === 0) {
                return { isLoggedIn: true };
            } else {
                // handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        }
        catch (err) {
            handleServerNetworkError(err, dispatch)
            return rejectWithValue(null)
        }
        finally {
            dispatch(appActions.setAppInitialized({ isInitialized: true }));
        }
    })

export const authReducer = slice.reducer
export const authActions = slice.actions
export const { selectIsLoggedIn } = slice.selectors
export const authSliceName = slice.name