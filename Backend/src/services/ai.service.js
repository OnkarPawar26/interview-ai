
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

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


module.exports = generateInterviewReport;


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
//              Zod       Gemini 3.7 Flash
//             validate          │
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



