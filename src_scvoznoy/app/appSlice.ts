import { Dispatch } from 'redux'
import { authAPI } from '../api/todolists-api'
import { authActions } from 'src/features/Login/authSlice'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'


const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle' as RequestStatusType,
        error: null as null | string,
        isInitialized: false
    },
    reducers: {
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        }
    },
    selectors: {
        selectStatus: state => state.status,
        selectError: state => state.error,
        selectIsInitialized: state => state.isInitialized
    }
})


export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'



export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
        } else {

        }
        dispatch(appActions.setAppInitialized({ isInitialized: true }));
    })
}


export const appActions = slice.actions
export const appReducer = slice.reducer
export const appSliceName = slice.name
export const { selectStatus, selectError, selectIsInitialized } = slice.selectors


export type AppInitialState = ReturnType<typeof slice.getInitialState>