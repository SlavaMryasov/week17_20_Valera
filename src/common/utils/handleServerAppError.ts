import { Dispatch } from "redux"
import { appActions } from "src/app/appSlice"
import { BaseResponse } from "../types"

/**
 *handleServerAppError 
 * @param data 
 * @param dispatch 
 * @param isShowGlobalError 
 * @returns ничего не возвращает
 */

export const handleServerAppError = <D>(data: BaseResponse<D>, dispatch: Dispatch, isShowGlobalError: boolean = true) => {
    if (isShowGlobalError) {
        dispatch(appActions.setAppError({ error: data.messages.length ? data.messages[0] : 'Some error occurred' }))
    }

    dispatch(appActions.setAppStatus({ status: 'failed' }))
}
