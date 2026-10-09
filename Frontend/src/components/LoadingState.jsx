import React from 'react'
import '../style/loading.scss'

const LoadingState = ({ label = 'Loading...' }) => (
    <main className='theme-loading' role='status' aria-live='polite'>
        <span className='theme-loading__spinner' aria-hidden='true' />
        <p>{label}</p>
    </main>
)

export default LoadingState
