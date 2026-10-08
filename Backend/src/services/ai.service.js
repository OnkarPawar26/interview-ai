
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// --------------------------------------------------
// ZOD SCHEMA
// --------------------------------------------------

const interviewReportSchema = z.object({
    matchScore: z
        .number()
        .min(0)
        .max(100)
        .describe(
            "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
        ),

    technicalQuestions: z
        .array(
            z.object({
                question: z
                    .string()
                    .describe("The technical question that can be asked during the interview"),

                intension: z
                    .string()
                    .describe(
                        "The intention of the interviewer behind asking this question"
                    ),

                answer: z
                    .string()
                    .describe(
                        "How to answer this question, what points to cover, what approach to take, and what mistakes to avoid"
                    )
            })
        )
        .describe(
            "Technical questions along with interviewer intention and how to answer them"
        ),

    behavioralQuestions: z
        .array(
            z.object({
                question: z
                    .string()
                    .describe("The behavioral question that can be asked during the interview"),

                intension: z
                    .string()
                    .describe(
                        "The intention of the interviewer behind asking this question"
                    ),

                answer: z
                    .string()
                    .describe(
                        "How to answer this question, what points to cover, what approach to take, and what mistakes to avoid"
                    )
            })
        )
        .describe(
            "Behavioral questions along with interviewer intention and how to answer them"
        ),

    skillGaps: z
        .array(
            z.object({
                skill: z
                    .string()
                    .describe("The skill that the candidate is lacking"),

                severity: z
                    .enum(["low", "medium", "high"])
                    .describe("The severity of the skill gap")
            })
        )
        .describe("List of skill gaps in the candidate's profile"),

    preparationPlan: z
        .array(
            z.object({
                day: z
                    .number()
                    .describe("The day number of the preparation plan, starting from Day 1"),

                focus: z
                    .string()
                    .describe(
                        'The focus of this day, e.g. "Data Structures and Algorithms", "System Design", "Behavioral Questions", "Mock Interviews"'
                    ),

                tasks: z
                    .array(z.string())
                    .describe("List of tasks to be completed on this day")
            })
        )
        .describe(
            "A day-wise preparation plan for the candidate"
        )
});

const interviewReportJsonSchema = z.toJSONSchema(interviewReportSchema);

delete interviewReportJsonSchema.$schema;


// --------------------------------------------------
// GEMINI MODELS
// --------------------------------------------------

const models = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash"
];


// --------------------------------------------------
// GENERATE INTERVIEW REPORT
// --------------------------------------------------

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
Generate an interview report for a candidate with the following details:

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

    let lastError;

    // Try each model one by one
    for (const model of models) {

        try {

            console.log(`Trying Gemini model: ${model}`);

            const response = await ai.models.generateContent({

                model: model,

                contents: prompt,

                config: {
                    responseMimeType: "application/json",
                    responseJsonSchema: interviewReportJsonSchema
                }
            });


            // Check if Gemini returned empty response
            if (!response.text) {
                throw new Error(
                    `${model} returned an empty response`
                );
            }

            return JSON.parse(response.text);

            
            // console.log(response.text);
            // Convert JSON string into JavaScript object
            // const report = JSON.parse(response.text);


            // // Validate AI response using Zod
            // const validatedReport =
            //     interviewReportSchema.parse(report);

            // console.log(
            //     `Successfully generated report using ${model}`
            // );

            // console.log("Validated Report:", validatedReport);

            // return validatedReport;


        } catch (error) {

            lastError = error;

            console.error(
                `Model ${model} failed:`,
                error.message
            );


            // ------------------------------------------
            // CHECK ERROR STATUS
            // ------------------------------------------

            const status = error.status;


            // If the model is temporarily unavailable,
            // try the next model.
            if (
                status === 503 ||
                status === 429 ||
                status === 500
            ) {

                console.log(
                    `Trying next Gemini model...`
                );

                continue;
            }


            // For errors like 400, 401, 403,
            // don't blindly try other models.
            throw error;
        }
    }


    // ------------------------------------------
    // ALL MODELS FAILED
    // ------------------------------------------

    console.error(
        "All Gemini models failed."
    );


    throw new Error(
        "All Gemini AI models are currently unavailable. Please try again later."
    );
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "10mm",
            bottom: "10mm",
            left: "10mm",
            right: "10mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })
    const resumePdfJsonSchema = z.toJSONSchema(resumePdfSchema);
    delete resumePdfJsonSchema.$schema;

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: resumePdfJsonSchema,
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }


// Now the architecture becomes:


//                  HTTP Request
//                       │
//                       ▼
//                  Controller
//                       │
//                       ▼
//           generateInterviewReport()
//                       │
//                       ▼
//               Gemini 3.8 Flash
//                  /          \
//              success       503
//                │             │
//                ▼             ▼
//                |       Gemini 3.7 Flash
//                |              │
//                │           503?
//                │             │
//                │             ▼
//                │       Gemini 3.6 Flash
//                │             │
//                │           503?
//                │             │
//                │             ▼
//                │       Gemini 3.5 Flash
//                │             │
//                ▼             ▼
//              Report       success
//                │             │
//                └──────┬──────┘
//                       ▼
//                   Controller
//                       │
//                       ▼
//                  HTTP Response



