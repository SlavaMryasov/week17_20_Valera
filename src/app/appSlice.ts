import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from 'src/common/utils';
import { authAPI } from 'src/features/auth/api/authApi';
import { authActions } from 'src/features/auth/model/authSlice';





const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle' as RequestStatusType,
        error: null as string | null,
        isInitialized: false
    },
    reducers: {
        setAppError: (state, action: PayloadAction<{ error: null | string }>) => {
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
        selectStatus: sliceState => sliceState.status,
        selectError: sliceState => sliceState.error,
        selectIsInitialized: sliceState => sliceState.isInitialized
    }
})



// export const initializeAppTC = () => (dispatch: Dispatch) => {
//     authAPI.me().then(res => {
//         if (res.data.resultCode === 0) {
//             dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
//         } else {
//         }
//         dispatch(appActions.setAppInitialized({ isInitialized: true }));
//     })
// }

export const appReducer = slice.reducer
export const appActions = slice.actions
export const { selectStatus, selectError, selectIsInitialized } = slice.selectors
export const appSliceName = slice.name

export type AppInitialState = ReturnType<typeof slice.getInitialState> // для тестов



export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
// export type InitialStateType = {
//     status: RequestStatusType
//     error: string | null
//     isInitialized: boolean
// }
