import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useAppDispatch } from 'src/common/hooks/useAppDispatch'
import { login, selectIsLoggedIn } from '../model/authSlice'

export const Login = () => {
    const dispatch = useAppDispatch()

    const isLoggedIn = useSelector(selectIsLoggedIn);

    const formik = useFormik({
        // validate: (values) => {
        //     if (!values.email) {
        //         return {
        //             email: 'Email is required'
        //         }
        //     }
        //     if (!values.password) {
        //         return {
        //             password: 'Password is required'
        //         }
        //     }

        // },
        initialValues: {
            email: process.env.REACT_APP_EMAIL || '',
            password: process.env.REACT_APP_PASSWORD || '',
            rememberMe: false
        },
        onSubmit: (values, formikHelpers) => {
            dispatch(login(values))
                .unwrap() // пропуск then
                .catch(err => {
                    if (err.fieldsErrors) {
                        err.fieldsErrors.forEach((el: any) => {
                            formikHelpers.setFieldError(el.field, el.error)
                        })
                    }
                })
        },
    })

    if (isLoggedIn) {
        return <Navigate to={"/"} />
    }


    return <Grid container justifyContent="center">
        <Grid item xs={4}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>
                            To log in get registered <a href={'https://social-network.samuraijs.com/'}
                                target={'blank'}>here</a>
                        </p>
                        <p>
                            or use common test account credentials:
                        </p>
                        <p> Email: free@samuraijs.com
                        </p>
                        <p>
                            Password: free
                        </p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps("email")}
                        />
                        {formik.errors.email ? <div style={{ color: 'red' }}>{formik.errors.email}</div> : null}
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps("password")}
                        />
                        {formik.errors.password ? <div style={{ color: 'red' }}>{formik.errors.password}</div> : null}
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox
                                {...formik.getFieldProps("rememberMe")}
                                checked={formik.values.rememberMe}
                            />}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}
