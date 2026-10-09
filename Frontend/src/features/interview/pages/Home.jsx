import React, { useContext, useState } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { Link, useNavigate } from 'react-router'
import LogoutButton from '../../auth/components/LogoutButton.jsx'
import { AuthContext } from '../../auth/auth.context.jsx'
import LoadingState from '../../../components/LoadingState.jsx'

const JOB_DESCRIPTION_CHAR_LIMIT = 5000

const Home = () => {

    const { loading, isGeneratingReport, generateReport, reports } = useInterview()
    const { user } = useContext(AuthContext)
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ resumeFile, setResumeFile ] = useState(null)
    const [ generationError, setGenerationError ] = useState("")
    const isJobDescriptionOverLimit = jobDescription.length > JOB_DESCRIPTION_CHAR_LIMIT

    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        if (isJobDescriptionOverLimit) return

        setGenerationError("")
        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            navigate(`/interview/${data._id}`)
        } catch (error) {
            setGenerationError(
                error.response?.status >= 500
                    ? "We couldn't generate your interview plan right now. Please try again in a moment."
                    : error.response?.data?.message || "Unable to generate your interview plan. Please try again."
            )
        }
    }

    if (isGeneratingReport) {
        return (
            <main className='report-generation-loading' role='status' aria-live='polite'>
                <section className='report-generation-loader'>
                    <div className='report-generation-loader__spinner' aria-hidden='true'>
                        <span />
                    </div>
                    <p className='report-generation-loader__eyebrow'>AI INTERVIEW PLAN</p>
                    <h1>Building your interview strategy</h1>
                    <p className='report-generation-loader__message'>
                        Matching your experience to the role and preparing personalized questions.
                    </p>
                    <div className='report-generation-loader__progress' aria-hidden='true'>
                        <span />
                    </div>
                    <p className='report-generation-loader__hint'>This may take a little while</p>
                </section>
            </main>
        )
    }

    if (loading) {
        return <LoadingState label='Loading your interview plans...' />
    }

    return (
        <div className='home-page'>
            <LogoutButton className='home-logout-control' />

            {/* Page Header */}
            <header className='page-header'>
                <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                            aria-invalid={isJobDescriptionOverLimit}
                            aria-describedby={isJobDescriptionOverLimit ? 'job-description-limit-warning' : undefined}
                        />
                        <div className={`char-counter ${isJobDescriptionOverLimit ? 'char-counter--warning' : ''}`}>
                            {jobDescription.length} / {JOB_DESCRIPTION_CHAR_LIMIT} chars
                        </div>
                        {isJobDescriptionOverLimit && (
                            <p id='job-description-limit-warning' className='char-warning' role='alert'>
                                {jobDescription.length - JOB_DESCRIPTION_CHAR_LIMIT}{' '}
                                {jobDescription.length - JOB_DESCRIPTION_CHAR_LIMIT === 1 ? 'character' : 'characters'} over the limit. Shorten the description to continue.
                            </p>
                        )}
                    </div>

                    {/* Vertical Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel - Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2>{user?.username || 'Your Profile'}</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>
                            <label className={`dropzone ${resumeFile ? 'dropzone--uploaded' : ''}`} htmlFor='resume'>
                                <span className='dropzone__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                </span>
                                <p className='dropzone__title' title={resumeFile?.name}>
                                    {resumeFile ? resumeFile.name : 'Click to upload or drag & drop'}
                                </p>
                                <p className='dropzone__subtitle'>
                                    {resumeFile
                                        ? `${(resumeFile.size / (1024 * 1024)).toFixed(2)} MB · Click to replace`
                                        : 'PDF or DOCX (Max 5MB)'}
                                </p>
                                <input
                                    hidden
                                    type='file'
                                    id='resume'
                                    name='resume'
                                    accept='.pdf,.docx'
                                    onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)}
                                />
                            </label>
                            <p className={`upload-status ${resumeFile ? 'upload-status--success' : ''}`} role='status'>
                                {resumeFile ? 'Resume uploaded successfully.' : 'No resume uploaded. You can use your self-description instead.'}
                            </p>
                        </div>

                        {/* OR Divider */}
                        <div className='or-divider'><span>OR</span></div>

                        {/* Quick Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>

                        {/* Info Box */}
                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                            </span>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                    </div>
                </div>

                {generationError && (
                    <div className='generation-error' role='alert'>
                        <strong>Report generation failed</strong>
                        <p>{generationError}</p>
                    </div>
                )}

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>AI-Powered Strategy Generation &bull; Approx 30s</span>
                    <button
                        onClick={handleGenerateReport}
                        className='generate-btn'
                        disabled={isJobDescriptionOverLimit}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                        Generate My Interview Plan
                    </button>
                </div>
            </div>

            {/* Recent Reports List */}
            {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Page Footer */}
            <footer className='page-footer'>
                <div className='page-footer__top'>
                    <div className='page-footer__brand'>
                        <span className='page-footer__logo' aria-hidden='true'>
                            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor'>
                                <path d='M13.5 12a1.48045 1.48045 0 0 0-.6427.1504L10.70705 10H9v1h1.29295l1.8573 1.8574A1.48325 1.48325 0 0 0 12 13.5a1.5 1.5 0 1 0 1.5-1.5Zm0 2a.5.5 0 1 1 .5-.5.50045.50045 0 0 1-.5.5Z' />
                                <path d='M13.5 6.5a1.4974 1.4974 0 0 0-1.40785 1H9v1h3.09215A1.49735 1.49735 0 1 0 13.5 6.5Zm0 2a.5.5 0 1 1 .5-.5.50045.50045 0 0 1-.5.5Z' />
                                <path d='M13.5 1a1.50165 1.50165 0 0 0-1.5 1.5 1.48285 1.48285 0 0 0 .17405.6865L10.29785 5H9v1h1.70215l2.19945-2.1262A1.49935 1.49935 0 1 0 13.5 1Zm0 2a.5.5 0 1 1 .5-.5.50045.50045 0 0 1-.5.5Z' />
                                <path d='M9 3h1V2H9a1.9878 1.9878 0 0 0-1.5.69115A1.9878 1.9878 0 0 0 6 2h-.5A4.505 4.505 0 0 0 1 6.5v3A4.505 4.505 0 0 0 5.5 14H6a1.9878 1.9878 0 0 0 1.5-.69115A1.9878 1.9878 0 0 0 9 14h1v-1H9a1.00115 1.00115 0 0 1-1-1V4a1.00115 1.00115 0 0 1 1-1ZM6 13h-.5a3.50235 3.50235 0 0 1-3.46-3H3V9H2V7h1.5A1.50165 1.50165 0 0 0 5 5.5v-1H4v1a.50045.50045 0 0 1-.5.5H2.04A3.50235 3.50235 0 0 1 5.5 3H6a1.00115 1.00115 0 0 1 1 1v2H6v1h1v2H6a1.50165 1.50165 0 0 0-1.5 1.5v1h1v-1A.50045.50045 0 0 1 6 10h1v2a1.00115 1.00115 0 0 1-1 1Z' />
                            </svg>
                        </span>
                        <span className='page-footer__wordmark'>Interview<span>.ai</span></span>
                    </div>
                    <div className='page-footer__top-right'>
                        <p className='page-footer__tagline'>AI-powered interview preparation</p>
                        <nav className='page-footer__socials' aria-label='Social links'>
                            <a href='https://github.com/OnkarPawar26/interview-ai' target='_blank' rel='noreferrer' aria-label='GitHub' title='GitHub'>
                                <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'><path d='M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.7 2.63 1.21 3.27.92.1-.72.39-1.21.71-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.12-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.24-5.1 5.51.4.35.76 1.03.76 2.08v3.07c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z' /></svg>
                            </a>
                            <a href='https://www.linkedin.com/in/onkar-pawar/' target='_blank' rel='noreferrer' aria-label='LinkedIn' title='LinkedIn'>
                                <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'><path d='M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.46H4.96V9h2.97v9.46ZM6.45 7.71a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44Zm12.01 10.75h-2.96v-4.6c0-1.1-.02-2.52-1.54-2.52-1.54 0-1.78 1.2-1.78 2.44v4.68H9.22V9h2.84v1.29h.04c.4-.74 1.36-1.52 2.8-1.52 3 0 3.56 1.97 3.56 4.53v5.16Z' /></svg>
                            </a>
                            <a href='mailto:pawaronkar2605@gmail.com' aria-label='Email' title='Email'>
                                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><rect x='3' y='5' width='18' height='14' rx='2' /><path d='m3 7 9 6 9-6' /></svg>
                            </a>
                        </nav>
                    </div>
                </div>

                <div className='page-footer__bottom'>
                    <nav className='page-footer__links' aria-label='Footer links'>
                        <Link to='/help'>Help Center</Link>
                        <span aria-hidden='true'>•</span>
                        <Link to='/privacy-policy'>Privacy Policy</Link>
                        <span aria-hidden='true'>•</span>
                        <Link to='/terms'>Terms of Service</Link>
                        <span aria-hidden='true'>•</span>
                        <a href='mailto:pawaronkar2605@gmail.com?subject=Contact%20Interview.ai'>Contact</a>
                    </nav>
                    <p>© {new Date().getFullYear()} Interview.ai · Built to help you prepare with confidence.</p>
                </div>
            </footer>
        </div>
    )
}

export default Home
