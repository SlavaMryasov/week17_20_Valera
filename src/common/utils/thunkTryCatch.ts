import { appActions } from "src/app/appSlice";
import { handleServerNetworkError } from "./handleServerNetworkError";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { AppDispatch, AppRootStateType } from "src/app/store";
import { BaseResponse } from "../types";


type ThunkApi = BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponse>

export const thunkTryCatch = async <T>(thunkAPI: ThunkApi, logic: () => Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>>) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        return await logic()
    }
    catch (err) {
        handleServerNetworkError(err, dispatch)
        return rejectWithValue(null)
    }
    finally {
        dispatch(appActions.setAppStatus({ status: 'idle' }))
    }
};
