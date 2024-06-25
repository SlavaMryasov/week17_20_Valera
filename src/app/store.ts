import { UnknownAction, configureStore } from "@reduxjs/toolkit";
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { authReducer, authSliceName } from '../features/Login/authSlice';
import { tasksReducer, tasksSliceName } from '../features/TodolistsList/tasksSlice';
import { todolistsReducer, todolistsSliceName } from '../features/TodolistsList/todolistsSlice';
import { appReducer, appSliceName } from './appSlice';


// ❗старая запись, с новыми версиями не работает
//  const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const store = configureStore({
	reducer: {
		[tasksSliceName]: tasksReducer,
		[todolistsSliceName]: todolistsReducer,
		[appSliceName]: appReducer,
		[authSliceName]: authReducer
	}
},)

export type AppRootStateType = ReturnType<typeof store.getState>

// ❗ UnknownAction вместо AnyAction
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>

// export type AppDispatch = typeof store.dispatch
// ❗ UnknownAction вместо AnyAction
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, UnknownAction>

//@ts-ignore
window.store = store;