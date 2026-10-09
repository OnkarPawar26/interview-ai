import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const { handleLogin } = useAuth()
    const navigate = useNavigate()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ errorMessage, setErrorMessage ] = useState("")
    const [ isSubmitting, setIsSubmitting ] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("")
        setIsSubmitting(true)

        try {
            await handleLogin({ email, password })
            navigate('/')
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Unable to log in. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <main className='auth-page'>
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address'
                            autoComplete='email' required aria-invalid={Boolean(errorMessage)}
                            aria-describedby={errorMessage ? 'login-error' : undefined} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password'
                            autoComplete='current-password' required aria-invalid={Boolean(errorMessage)}
                            aria-describedby={errorMessage ? 'login-error' : undefined} />
                    </div>
                    {errorMessage && <p id='login-error' className='form-error' role='alert'>{errorMessage}</p>}
                    <button className='button primary-button' type='submit' disabled={isSubmitting} aria-busy={isSubmitting}>
                        {isSubmitting && <span className='button-spinner' aria-hidden='true' />}
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p>Don't have an account? <Link to={"/register"} >Register</Link> </p>
            </div>
        </main>
    )
}

export default Login
