import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { appActions } from 'src/app/appSlice'
import { TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType, todolistsAPI } from '../../api/todolists-api'
import { AppThunk } from '../../app/store'
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils'
import { todolistsActions } from './todolistsSlice'
import { createAppAsyncThunk } from 'src/utils/createAppAsyncThunk'

const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {
        removeTask: (state, action: PayloadAction<{ taskId: string, todolistId: string }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) {
                tasks.splice(index, 1)
            }
        },
        addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
            const tasks = state[action.payload.task.todoListId]
            tasks.unshift(action.payload.task)
        },
        updateTask: (state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) {
                tasks[index] = { ...tasks[index], ...action.payload.model }
            }
        },
        // setTasks: (state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) => {
        //     state[action.payload.todolistId] = action.payload.tasks
        // }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => { // то что вернули в санке придет в action.payload
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                // debugger
            })
            .addCase(todolistsActions.addTodolist, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todolistsActions.setTodolists, (state, action) => {
                action.payload.todolists.forEach((tl) => {
                    state[tl.id] = []
                })
            })
            .addCase(todolistsActions.clearTodosData, (state, action) => {
                return {}
            })
    },
    selectors: {
        selectTasks: state => state
    }
})

// thunks
export const fetchTasks = createAppAsyncThunk<{
    tasks: TaskType[]
    todolistId: string
}, string
>(`${slice.name}/fetchTasks`, async (todolistId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        const res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items
        // dispatch(tasksActions.setTasks({ tasks, todolistId }))
        dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        return { tasks, todolistId }
    }
    catch (err: any) {
        handleServerNetworkError(err, dispatch)
        return rejectWithValue(null)
    }
})


export const removeTaskTC = (taskId: string, todolistId: string): AppThunk => (dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            const action = tasksActions.removeTask({ taskId, todolistId })
            dispatch(action)
        })
}

export const addTaskTC = (title: string, todolistId: string): AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                const action = tasksActions.addTask({ task })
                dispatch(action)
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
    (dispatch, getState) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(tasksActions.updateTask({ taskId, model: domainModel, todolistId }))
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })
    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}


export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const { selectTasks } = slice.selectors
export const tasksSliceName = slice.name
