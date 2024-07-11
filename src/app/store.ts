import { configureStore } from "@reduxjs/toolkit";
import { authReducer, authSliceName } from "src/features/auth/model/authSlice";
import { tasksReducer, tasksSliceName } from '../features/TodolistsList/tasksSlice';
import { todolistsReducer, todolistsSliceName } from '../features/TodolistsList/todolistsSlice';
import { appReducer, appSliceName } from './appSlice';

export const store = configureStore({
	reducer: {
		[tasksSliceName]: tasksReducer,
		[todolistsSliceName]: todolistsReducer,
		[appSliceName]: appReducer,
		[authSliceName]: authReducer
	}
},)

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


//@ts-ignore
window.store = store;