const { GoogleGenAI } = require('@google/genai')
const { z } = require('zod');



const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number().describe('A score between 0 and 100 indicating how well the candidate\'s profile matches the job description'),
    technicalQuestions: z.array(z.object({
        question: z.string().describe('The technical question can be asked during the interview'),
        intension: z.string().describe('The intension of interviewer behind the asking this question'),
        answer: z.string().describe('How to answer this questions,what points to cover, what approach to take, what mistakes to avoid etc')
    })).describe('Technical questions that can be asked during the interview along with the intension of interviewer and how to answer them'),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe('The behavioral question can be asked during the interview'),
        intension: z.string().describe('The intension of interviewer behind the asking this question'),
        answer: z.string().describe('How to answer this questions,what points to cover, what approach to take, what mistakes to avoid etc')
    })).describe('Behavioral questions that can be asked during the interview along with the intension of interviewer and how to answer them'),

    skillGaps: z.array(z.object({
        skill: z.string().describe('The skill that the candidate is lacking'),
        severity: z.enum(['low', 'medium', 'high']).describe('The severity of the skill gap')
    })).describe('List of Skill gaps in the candidate\'s profile along with their severity and type'),

    preparationPlan: z.array(z.object({
        day: z.number().describe('The day number of the preparation plan,starting from Day 1'),
        focus: z.string().describe('The focus of this day in preparation plan, e.g "Data Structures and Algorithms", "System Design", "Behavioral Questions" , "Mock Interviews" etc'),
        tasks: z.array(z.string()).describe('List of tasks to be done on that day')
    })).describe('A day-wise preparation plan for the candidate to follow in order to prepare for the interview, including the focus of each day and the tasks to be completed')
}).describe('Interview report containing technical questions, behavioral questions, skill gaps and preparation plan');

const interviewReportJsonSchema = z.toJSONSchema(interviewReportSchema);
delete interviewReportJsonSchema.$schema;

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}`;

    const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseJsonSchema: interviewReportJsonSchema
        }
    });

    if (!response.text) {
        throw new Error('Gemini returned an empty interview report');
    }

    console.log(interviewReportSchema.parse(JSON.parse(response.text)));
}

async function invokeGeminiAI() {
    const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: "Hello gemini ! Explain what is interview ?"
    })

    console.log(response.text)

}
module.exports = generateInterviewReport;
