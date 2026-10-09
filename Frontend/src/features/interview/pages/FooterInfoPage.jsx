import React from 'react'
import { Link } from 'react-router'
import './footerInfoPage.scss'

const supportEmail = 'pawaronkar2605@gmail.com'

const footerPages = {
    help: {
        title: 'Help Center',
        intro: 'Find quick answers about using Interview.ai and your personalized interview plans.',
        sections: [
            {
                title: 'Getting started',
                paragraphs: [
                    'Add the job description you are preparing for, then upload a resume or write a short self-description. Select Generate My Interview Plan to create role-specific preparation guidance.',
                    'Your generated plans appear under My Recent Interview Plans on the home page. Select a plan to review its questions, skill gaps, and preparation schedule.'
                ]
            },
            {
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
                <Link className='footer-info-back' to='/'>← Back to Interview.ai</Link>
                <header className='footer-info-header'>
                    <span>INTERVIEW.AI</span>
                    <h1>{content.title}</h1>
                    <p>{content.intro}</p>
                </header>

                <div className='footer-info-sections'>
                    {content.sections.map((section) => (
                        <section className='footer-info-section' key={section.title}>
                            <h2>{section.title}</h2>
                            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                            {section.items?.map((item) => (
                                <div className='footer-info-faq' key={item.question}>
                                    <h3>{item.question}</h3>
                                    <p>{item.answer}</p>
                                </div>
                            ))}
                        </section>
                    ))}
                </div>

                <a className='footer-info-contact' href={`mailto:${supportEmail}`}>
                    Contact support
                </a>
            </article>
        </main>
    )
}

export default FooterInfoPage
