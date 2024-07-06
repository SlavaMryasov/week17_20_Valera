import { Grid, Paper } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { TaskStatuses } from '../../api/todolists-api'
import { AddItemForm } from '../../components/AddItemForm/AddItemForm'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { selectIsLoggedIn } from '../Login/authSlice'
import { Todolist } from './Todolist/Todolist'
import { addTask, removeTask, selectTasks, updateTask } from './tasksSlice'
import {
    FilterValuesType,
    addTodolist,
    changeTodolistTitle,
    fetchTodolists,
    removeTodolist,
    selectTodolists,
    todolistsActions
} from './todolistsSlice'

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
    const todolists = useSelector(selectTodolists)
    const tasks = useSelector(selectTasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        // const thunk = fetchTodolistsTC()
        // dispatch(thunk)
        dispatch(fetchTodolists())
    }, [])

    const removeTaskHandler = useCallback(function (id: string, todolistId: string) {

        dispatch(removeTask({ taskId: id, todolistId }))
    }, [])

    const addTaskHandler = useCallback(function (title: string, todolistId: string) {
        dispatch(addTask({ title, todolistId }))
    }, [])

    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        const thunk = updateTask({ taskId, domainModel: { status }, todolistId })
        dispatch(thunk)
    }, [])

    const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
        const thunk = updateTask({ taskId, domainModel: { title }, todolistId })
        dispatch(thunk)
    }, [])

    const changeFilter = useCallback(function (filter: FilterValuesType, todolistId: string) {
        dispatch(todolistsActions.changeTodolistFilter({ id: todolistId, filter }))
    }, [])

    const removeTodolistHandler = useCallback(function (todolistId: string) {
        dispatch(removeTodolist({ todolistId }))
    }, [])

    const changeTodolistTitleHandler = useCallback(function (id: string, title: string) {
        dispatch(changeTodolistTitle({ id, title }))
    }, [])

    const addTodolistHandler = useCallback((title: string) => {
        dispatch(addTodolist({ title }))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to={"/login"} />
    }

    return <>
        <Grid container style={{ padding: '20px' }}>
            <AddItemForm addItem={addTodolistHandler} />
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{ padding: '10px' }}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTaskHandler}
                                changeFilter={changeFilter}
                                addTask={addTaskHandler}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolistHandler}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitleHandler}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
