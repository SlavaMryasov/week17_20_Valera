// import { setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType } from '../app/appSlice'
import { appActions } from 'src/app/appSlice'
import { ResponseType } from '../api/todolists-api'
import { Dispatch } from 'redux'

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(appActions.setAppError({ error: data.messages[0] }))
    } else {
        appActions.setAppError({ error: 'Some error occurred' })
    }
    dispatch(appActions.setAppStatus({ status: 'failed' }))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
    dispatch(appActions.setAppError({ error: error.message ? error.message : 'Some error occurred' }))
    dispatch(appActions.setAppStatus({ status: 'failed' }))
}
