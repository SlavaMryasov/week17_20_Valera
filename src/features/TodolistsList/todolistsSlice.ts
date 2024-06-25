import { todolistsAPI, TodolistType } from '../../api/todolists-api'
import { Dispatch } from 'redux'
import { appActions, RequestStatusType } from '../../app/appSlice'
import { handleServerNetworkError } from '../../utils/error-utils'
import { AppThunk } from '../../app/store';
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { fetchTasksTC } from './tasksSlice';


const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: {
        removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
        },
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            let a = current(state)
            debugger
            state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
        },
        changeTodolistTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state[index].title = action.payload.title
        },
        changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, status: RequestStatusType }>) => {
            const todolist = state.find(todo => todo.id === action.payload.id)
            if (todolist) todolist.entityStatus = action.payload.status
        },
        setTodolists: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
            // return action.todolists.map(tl => ({ ...tl, filter: 'all', entityStatus: 'idle' }))
            action.payload.todolists.forEach(tl =>
                state.push({ ...tl, filter: 'all', entityStatus: 'idle' }))
        },
        clearTodosData: (state, action: PayloadAction<null>) => {
            return []
        }
    },
    selectors: {
        selectTodolists: state => state
    }
})


// thunks
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(todolistsActions.setTodolists({ todolists: res.data }))
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
                return res.data
            })
            .then(todos => {
                todos.forEach((todo) => {
                    dispatch(fetchTasksTC(todo.id))
                })
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch);
            })
    }
}
export const removeTodolistTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, status: 'loading' }))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(todolistsActions.removeTodolist({ id: todolistId }))
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            })
    }
}
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(todolistsActions.addTodolist({ todolist: res.data.data.item }))
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
    return (dispatch) => {
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(todolistsActions.changeTodolistTitle({ id, title }))
            })
    }
}

// types
// 
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}


export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const { selectTodolists } = slice.selectors
export const todolistsSliceName = slice.name