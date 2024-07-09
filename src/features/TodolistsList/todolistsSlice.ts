
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from 'src/common/utils/createAppAsyncThunk';
import { fetchTasks } from './tasksSlice';
import { TodolistType, todolistsAPI } from 'src/api/todolists-api';
import { RequestStatusType, appActions } from 'src/app/appSlice';
import { handleServerNetworkError } from 'src/common/utils/handleServerNetworkError';


const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: {
        changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, status: RequestStatusType }>) => {
            const todolist = state.find(todo => todo.id === action.payload.id)
            if (todolist) todolist.entityStatus = action.payload.status
        },
        setTodolists: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
            action.payload.todolists.forEach(tl =>
                state.push({ ...tl, filter: 'all', entityStatus: 'idle' }))
        },
        clearTodosData: (state, action: PayloadAction<null>) => {
            return []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                action.payload?.todolists.forEach((tl: TodolistType) =>
                    state.push({ ...tl, filter: 'all', entityStatus: 'idle' }))
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.todolistId)
                if (index !== -1) state.splice(index, 1)
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.id)
                if (index !== -1) state[index].title = action.payload.title
            })
    }
    ,
    selectors: {
        selectTodolists: state => state
    }
})


// thunks
export const fetchTodolists = createAppAsyncThunk(`${slice.name}/fetchTasks`, async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI
    try {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        const res = await todolistsAPI.getTodolists()
        if (res.data) {
            const todolists = res.data
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            todolists.forEach((todo) => {
                dispatch(fetchTasks(todo.id))
            })
            return { todolists }
        }
    }
    catch (err) {
        handleServerNetworkError(err, dispatch)
        return rejectWithValue(null)
    }

})

export const removeTodolist = createAppAsyncThunk<{ todolistId: string }, { todolistId: string }>(
    `${slice.name}/removeTodolist`, async (arg, thunkAPI) => {
        const { dispatch } = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistsAPI.deleteTodolist(arg.todolistId)
            if (res.data) {
                dispatch(todolistsActions.changeTodolistEntityStatus({ id: arg.todolistId, status: 'loading' }))
                // dispatch(todolistsActions.removeTodolist({ id: arg.todolistId }))
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            }
            return { todolistId: arg.todolistId }
        }
        catch (err) {
            handleServerNetworkError(err, dispatch)
            return rejectWithValue(null)
        }
    })

export const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>(
    `${slice.name}/addTodolist`, async (arg, thunkAPI) => {
        const { dispatch } = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistsAPI.createTodolist(arg.title)
            if (res.data.resultCode === 0)
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { todolist: res.data.data.item }

        }
        catch (err) {
            handleServerNetworkError(err, dispatch)
            return rejectWithValue(null)
        }

    })

export const changeTodolistTitle = createAppAsyncThunk<any, any>(`${slice.name}/changeTodolistTitle`, async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI
    try {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        const res = await todolistsAPI.updateTodolist(arg.id, arg.title)
        dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        return { id: arg.id, title: arg.title }
    } catch (err) {
        handleServerNetworkError(err, dispatch)
        return rejectWithValue(null)
    }
})

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

function rejectWithValue(arg0: null): any {
    throw new Error('Function not implemented.');
}
