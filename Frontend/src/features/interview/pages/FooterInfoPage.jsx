import React from 'react'
import { Link } from 'react-router'
import './footerInfoPage.scss'

const supportEmail = 'pawaronkar2605@gmail.com'

const footerPages = {
    about: {
        title: 'About Interview.ai',
        intro: 'A focused space to turn interview preparation into a clear, practical plan.',
        sections: [
            {
                title: 'Our purpose',
                paragraphs: [
                    'Preparing for an interview can mean sorting through a job description, deciding which experience to highlight, and figuring out what to practice. Interview.ai brings those pieces together in one place.',
                    'Share the role and your background to get a tailored preparation plan with likely questions, answer guidance, skill areas to review, and a day-by-day study outline.'
                ]
            },
            {
                title: 'Our vision',
                paragraphs: [
                    'We want thoughtful interview preparation to feel more approachable and useful for every candidate. Our vision is to help people understand what a role calls for, recognize where their experience fits, and walk into conversations feeling prepared to explain their strengths.'
                ]
            },
            {
                title: 'People first, AI assisted',
                paragraphs: [
                    'Interview.ai is designed to support your preparation, not make decisions for you. AI suggestions are a starting point: your experience, judgment, and own voice should shape the final answers you bring to an interview.'
                ]
            }
        ]
    },
    help: {
        title: 'Help Center',
        intro: 'Find quick answers about using Interview.ai and your personalized interview plans.',
        sections: [
            {
                id: 'getting-started',
                title: 'Get started in three steps',
                steps: [
                    { title: 'Add the role', details: 'Paste the job description for the position you are preparing for.' },
                    { title: 'Add your background', details: 'Upload your resume or enter a short self-description with your experience and skills.' },
                    { title: 'Build your plan', details: 'Choose Generate My Interview Plan. Find saved plans under My Recent Interview Plans.' }
                ]
            },
            {
                id: 'faq',
                title: 'Frequently asked questions',
                items: [
                    {
                        question: 'What should I include in my profile?',
                        answer: 'A resume or a self-description is required, along with the target job description. Be specific about your experience and skills for more relevant suggestions.'
                    },
                    {
                        question: 'What does an interview plan include?',
                        answer: 'A plan can include a profile match score, technical and behavioral questions with answer guidance, potential skill gaps, and a preparation schedule.'
                    },
                    {
                        question: 'Can I rely on the AI-generated answers as facts?',
                        answer: 'Use them as preparation suggestions. Review and adapt the guidance to your own experience; AI output can be incomplete or inaccurate.'
                    },
                    {
                        question: 'How can I request deletion of my account or reports?',
                        answer: `Email ${supportEmail} from the address associated with your account and ask us to delete your account or specified reports. We may ask you to verify the request.`
                    }
                ]
            },
            {
                id: 'troubleshooting',
                title: 'Troubleshooting',
                paragraphs: [
                    'If generation fails, check that the job description is within the character limit and that you have supplied a resume or self-description. Try again after checking your connection.',
                    `For upload, account, or report problems, email ${supportEmail} and include a short description of the issue. Do not include your password.`
                ]
            }
        ]
    },
    privacy: {
        title: 'Privacy Policy',
        intro: 'This page describes the information Interview.ai handles to provide account and interview preparation features.',
        sections: [
            {
                title: 'Information we collect',
                paragraphs: [
                    'When you create an account, we handle your username, email address, and password (stored as a hash). To generate a report, you may provide resume content, a self-description, and a job description. We store the extracted resume text and these descriptions with the generated report and your account.',
                    'The current report-generation flow processes text and does not record interview audio or video. The uploaded resume file is read for text extraction; the report record stores the extracted text rather than the original file.'
                ]
            },
            {
                title: 'How information is used',
                paragraphs: [
                    'Account details are used to authenticate you. Resume text, your self-description, and the job description are sent to Google Gemini through the Google GenAI API to generate interview preparation content. Generated reports are saved so you can view them later from your account.',
                    'Information sent to Google is also subject to the terms and privacy practices that apply to the Google AI service used by this application.'
                ]
            },
            {
                title: 'Retention and deletion requests',
                paragraphs: [
                    'Interview reports and their source text remain associated with your account until they are removed. The app does not currently provide a self-service deletion control.',
                    `To request access, correction, or deletion of account information or reports, email ${supportEmail} from your account email address. We may ask you to verify your identity before handling the request.`
                ]
            },
            {
                title: 'Cookies and security',
                paragraphs: [
                    'Interview.ai uses an authentication cookie to keep your session signed in. Passwords are hashed before storage. Avoid sharing your sign-in credentials and contact us if you believe your account has been accessed without permission.'
                ]
            },
            {
                title: 'Contact',
                paragraphs: [`Questions or privacy requests can be sent to ${supportEmail}.`]
            }
        ]
    },
    terms: {
        title: 'Terms of Service',
        intro: 'By using Interview.ai, you agree to use the service responsibly and to these basic platform terms.',
        sections: [
            {
                title: 'Your account',
                paragraphs: [
                    'Provide accurate account information, keep your sign-in credentials secure, and take responsibility for activity performed through your account. Contact support if you suspect unauthorized access.'
                ]
            },
            {
                title: 'Acceptable use and submitted content',
                paragraphs: [
                    'Use Interview.ai only for lawful interview preparation. Submit only resumes, descriptions, and job information that you have permission to use. Do not use the service to upload unlawful, harmful, or infringing material, or to interfere with the service or other users.'
                ]
            },
            {
                title: 'AI-generated feedback',
                paragraphs: [
                    'Interview plans, match scores, questions, and answer suggestions are generated by AI and are provided as preparation aids. They may be inaccurate, incomplete, or unsuitable for your circumstances. Review and adapt the content using your own judgment. The service does not guarantee an interview, job offer, or hiring outcome.'
                ]
            },
            {
                title: 'Service availability',
                paragraphs: [
                    'Features may change, be unavailable, or produce errors. Do not rely on Interview.ai as the only copy of important personal or career information.'
                ]
            },
            {
                title: 'Questions',
                paragraphs: [`For questions about these terms, contact ${supportEmail}.`]
            }
        ]
    }
}

const FooterInfoPage = ({ page }) => {
    const content = footerPages[page] ?? footerPages.help

    return (
        <main className='footer-info-page'>
            <article className='footer-info-card'>
                <div className='footer-info-topbar'>
                    <Link className='footer-info-brand' to='/' aria-label='Interview.ai home'>
                        <span className='footer-info-logo' aria-hidden='true'>
                            <svg viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                                <path d='M13.5 12a1.48045 1.48045 0 0 0-.6427.1504L10.70705 10H9v1h1.29295l1.8573 1.8574A1.48325 1.48325 0 0 0 12 13.5a1.5 1.5 0 1 0 1.5-1.5Zm0 2a.5.5 0 1 1 .5-.5.50045.50045 0 0 1-.5.5Z' />
                                <path d='M13.5 6.5a1.4974 1.4974 0 0 0-1.40785 1H9v1h3.09215A1.49735 1.49735 0 1 0 13.5 6.5Zm0 2a.5.5 0 1 1 .5-.5.50045.50045 0 0 1-.5.5Z' />
                                <path d='M13.5 1a1.50165 1.50165 0 0 0-1.5 1.5 1.48285 1.48285 0 0 0 .17405.6865L10.29785 5H9v1h1.70215l2.19945-2.1262A1.49935 1.49935 0 1 0 13.5 1Zm0 2a.5.5 0 1 1 .5-.5.50045.50045 0 0 1-.5.5Z' />
                                <path d='M9 3h1V2H9a1.9878 1.9878 0 0 0-1.5.69115A1.9878 1.9878 0 0 0 6 2h-.5A4.505 4.505 0 0 0 1 6.5v3A4.505 4.505 0 0 0 5.5 14H6a1.9878 1.9878 0 0 0 1.5-.69115A1.9878 1.9878 0 0 0 9 14h1v-1H9a1.00115 1.00115 0 0 1-1-1V4a1.00115 1.00115 0 0 1 1-1ZM6 13h-.5a3.50235 3.50235 0 0 1-3.46-3H3V9H2V7h1.5A1.50165 1.50165 0 0 0 5 5.5v-1H4v1a.50045.50045 0 0 1-.5.5H2.04A3.50235 3.50235 0 0 1 5.5 3H6a1.00115 1.00115 0 0 1 1 1v2H6v1h1v2H6a1.50165 1.50165 0 0 0-1.5 1.5v1h1v-1A.50045.50045 0 0 1 6 10h1v2a1.00115 1.00115 0 0 1-1 1Z' />
                            </svg>
                        </span>
                        <span>Interview<span className='footer-info-brand-accent'>.ai</span></span>
                    </Link>
                    <Link className='footer-info-back' to='/'>Back to app <span aria-hidden='true'>→</span></Link>
                </div>
                <header className='footer-info-header'>
                    <span className='footer-info-eyebrow'>{page === 'help' ? 'SUPPORT' : 'INTERVIEW.AI'}</span>
                    <h1>{content.title}</h1>
                    <p>{content.intro}</p>
                </header>

                <div className={`footer-info-sections ${page === 'help' ? 'footer-info-sections--help' : ''}`}>
                    {content.sections.map((section) => (
                        <section className={`footer-info-section ${section.id ? `footer-info-section--${section.id}` : ''}`} key={section.title}>
                            <h2>{section.title}</h2>
                            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                            {section.steps && (
                                <ol className='footer-info-steps'>
                                    {section.steps.map((step, index) => (
                                        <li key={step.title}>
                                            <span className='footer-info-step-number'>{String(index + 1).padStart(2, '0')}</span>
                                            <div>
                                                <h3>{step.title}</h3>
                                                <p>{step.details}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            )}
                            {section.items?.map((item) => (
                                <details className='footer-info-faq' key={item.question}>
                                    <summary>{item.question}</summary>
                                    <p>{item.answer}</p>
                                </details>
                            ))}
                        </section>
                    ))}
                </div>

                <div className='footer-info-bottom'>
                    <nav className='footer-info-related' aria-label='Information pages'>
                        <span>More resources</span>
                        <Link to='/about'>About Us</Link>
                        <Link to='/help'>Help Center</Link>
                        <Link to='/privacy-policy'>Privacy Policy</Link>
                        <Link to='/terms'>Terms of Service</Link>
                    </nav>
                    <a className='footer-info-contact' href={`mailto:${supportEmail}?subject=Interview.ai%20Support`}>
                        Contact support <span aria-hidden='true'>↗</span>
                    </a>
                </div>
            </article>
        </main>
    )
}

export default FooterInfoPage
