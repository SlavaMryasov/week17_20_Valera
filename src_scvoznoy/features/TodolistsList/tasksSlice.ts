

import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from '../../api/todolists-api'
import { Dispatch } from 'redux'
import { AppRootStateType, AppThunk } from '../../app/store'
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils'
import { appActions } from 'src/app/appSlice'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: TasksStateType = {}

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
            // return {
            //     ...state,
            //     [action.todolistId]: state[action.todolistId]
            //         .map(t => t.id === action.taskId ? { ...t, ...action.model } : t)
            // }

            // const tasks = state[action.payload.todolistId]
            // const index = tasks.findIndex(t => t.id === action.payload.taskId)
            // if (index !== -1) {
            //     tasks[index] = { ...tasks[index], ...action.payload.model }
            // }
            const tasks = state[action.payload.todolistId]
            const task = tasks.find(t => t.id === action.payload.taskId)
            if (task) {
                tasks[task.id]: {...t, ...action.payload.model
    }
}
          
        }
    }
})



export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {


        case 'ADD-TODOLIST':
            return { ...state, [action.todolist.id]: [] }
        case 'REMOVE-TODOLIST':
            const copyState = { ...state }
            delete copyState[action.id]
            return copyState
        case 'SET-TODOLISTS': {
            const copyState = { ...state }
            action.todolists.forEach((tl: any) => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS':
            return { ...state, [action.todolistId]: action.tasks }
        default:
            return state
    }
}




export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({ type: 'SET-TASKS', tasks, todolistId } as const)

// thunks
export const fetchTasksTC = (todolistId: string): AppThunk => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(setTasksAC(tasks, todolistId))
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        })
}
export const removeTaskTC = (taskId: string, todolistId: string): AppThunk => (dispatch: Dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            const action = tasksActions.removeTask({ taskId, todolistId })
            dispatch(action)
        })
}
export const addTaskTC = (title: string, todolistId: string): AppThunk => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                const action = addTaskAC(task)
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
                    const action = updateTaskAC(taskId, domainModel, todolistId)
                    dispatch(action)
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