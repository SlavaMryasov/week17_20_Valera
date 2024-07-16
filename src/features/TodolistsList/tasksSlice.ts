import { thunkTryCatch } from 'src/common/utils/thunkTryCatch';
import { createSlice } from "@reduxjs/toolkit"
import { AddTaskArgType, TaskType, todolistsAPI, UpdateTaskModelType } from "src/api/todolists-api"
import { appActions } from "src/app/appSlice"
import { createAppAsyncThunk, handleServerNetworkError, handleServerAppError } from "src/common/utils"
import { addTodolist, removeTodolist, todolistsActions } from "./todolistsSlice"
import { TaskPriorities, TaskStatuses } from "src/common/enum"



const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => { // то что вернули в санке придет в action.payload
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(addTask.fulfilled, (state, action) => {
                console.log(action.payload)
                const tasks = state[action.payload.task.todoListId]
                tasks.unshift(action.payload.task)
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) {
                    tasks.splice(index, 1)
                }
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) {
                    tasks[index] = { ...tasks[index], ...action.payload.model }
                }
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.todolistId]
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
        return { tasks, todolistId }
    }
    catch (err) {
        handleServerNetworkError(err, dispatch)
        return rejectWithValue(null)
    }
    finally {
        dispatch(appActions.setAppStatus({ status: 'succeeded' }))
    }
})


export const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>(
    `${slice.name}/addTask`,
    (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        return thunkTryCatch(thunkAPI, async () => {
            const res = await todolistsAPI.createTask(arg)
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                return { task }
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null)
            }
        })
    })

export const removeTask = createAppAsyncThunk<{ taskId: string, todolistId: string }, { taskId: string, todolistId: string }>(
    `${slice.name}/removeTask`, async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId)
            return { todolistId: arg.todolistId, taskId: arg.taskId }
        }
        catch (err) {
            return rejectWithValue(null)
        }
        finally {
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        }
    })


export const updateTask = createAppAsyncThunk<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }, { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }>(
    `${slice.name}/updateTask`, async (arg, thunkAPI) => {
        const { dispatch, getState, rejectWithValue } = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const state = getState()
            const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
            if (!task) {
                return rejectWithValue(null)
            }
            const apiModel: UpdateTaskModelType = {
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                title: task.title,
                status: task.status,
                ...arg.domainModel
            }

            const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
            if (res.data.resultCode === 0) {
                return { taskId: arg.taskId, model: arg.domainModel, todolistId: arg.todolistId }
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null)
            }

        }
        catch (err) {
            handleServerNetworkError(err, dispatch);
            return rejectWithValue(null)
        }
        finally {
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        }
    })


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
