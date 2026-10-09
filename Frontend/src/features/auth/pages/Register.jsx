import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"

const Register = () => {

    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const {handleRegister} = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrorMessage("")
        try {
            await handleRegister({username,email,password})
            navigate("/")
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Unable to create your account. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className='auth-page'>
            <div className="form-container">
                <h1>Register</h1>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text" id="username" name='username' placeholder='Enter username'
                            autoComplete='username' required aria-invalid={Boolean(errorMessage)}
                            aria-describedby={errorMessage ? 'register-error' : undefined} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address'
                            autoComplete='email' required aria-invalid={Boolean(errorMessage)}
                            aria-describedby={errorMessage ? 'register-error' : undefined} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password'
                            autoComplete='new-password' required aria-invalid={Boolean(errorMessage)}
                            aria-describedby={errorMessage ? 'register-error' : undefined} />
                    </div>

                    {errorMessage && <p id='register-error' className='form-error' role='alert'>{errorMessage}</p>}

                    <button className='button primary-button' type='submit' disabled={isSubmitting} aria-busy={isSubmitting}>
                        {isSubmitting && <span className='button-spinner' aria-hidden='true' />}
                        {isSubmitting ? 'Creating account...' : 'Register'}
                    </button>

                </form>

                <p>Already have an account? <Link to={"/login"} >Login</Link> </p>
            </div>
        </main>
    )
}

export default Register
