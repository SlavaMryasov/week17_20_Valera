import { Dispatch } from "redux"
import { appActions } from "src/app/appSlice"

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(appActions.setAppError({ error: data.messages[0] }))
    } else {
        appActions.setAppError({ error: 'Some error occurred' })
    }
    dispatch(appActions.setAppStatus({ status: 'failed' }))
}
