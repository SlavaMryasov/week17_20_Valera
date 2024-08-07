import { Menu } from '@mui/icons-material'
import {
	AppBar,
	Button,
	CircularProgress,
	Container,
	IconButton,
	LinearProgress,
	Toolbar,
	Typography
} from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from '../features/auth/ui/Login'
import { TodolistsList } from '../features/TodolistsList/TodolistsList'
import './App.css'
import { selectIsInitialized, selectStatus } from './appSlice'
import { selectIsLoggedIn, logout, initializeApp } from 'src/features/auth/model/authSlice'
import { ErrorSnackbar } from 'src/common/components'


type PropsType = {
	demo?: boolean
}

function App({ demo = false }: PropsType) {
	const status = useSelector(selectStatus)
	const isInitialized = useSelector(selectIsInitialized)
	const isLoggedIn = useSelector(selectIsLoggedIn)
	const dispatch = useDispatch<any>()

	useEffect(() => {
		dispatch(initializeApp(true))
	}, [])

	const logoutHandler = useCallback(() => {
		dispatch(logout())
	}, [])

	if (!isInitialized) {
		return <div
			style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
			<CircularProgress />
		</div>
	}

	return (
		<BrowserRouter>
			<div className="App">
				<ErrorSnackbar />
				<AppBar position="static">
					<Toolbar>
						<IconButton edge="start" color="inherit" aria-label="menu">
							<Menu />
						</IconButton>
						<Typography variant="h6">
							News
						</Typography>
						{isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
					</Toolbar>
					{status === 'loading' && <LinearProgress />}
				</AppBar>
				<Container fixed>
					<Routes>
						<Route path={'/'} element={<TodolistsList demo={demo} />} />
						<Route path={'/login'} element={<Login />} />
					</Routes>
				</Container>
			</div>
		</BrowserRouter>
	)
}

export default App
