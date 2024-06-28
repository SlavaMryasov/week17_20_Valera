import { appActions } from './../../src_17/app/appSlice';
import { AppInitialState, appReducer } from './appSlice'

let startState: AppInitialState

beforeEach(() => {
	startState = {
		error: null,
		status: 'idle',
		isInitialized: false
	}
})

test('correct error message should be set', () => {
	const endState = appReducer(startState, appActions.setAppError({ error: 'some error' }))
	expect(endState.error).toBe('some error');
})

test('correct status should be set', () => {
	const endState = appReducer(startState, appActions.setAppError({ error: 'loading' }))
	expect(endState.status).toBe('loading');
})

