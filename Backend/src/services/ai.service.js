const  {GoogleGenAI} = require('@google/genai')

const ai = new GoogleGenAI({
    apiKey : process.env.GOOGLE_GENAI_API_KEY
});


async function invokeGeminiAI(){
    const response = await ai.models.generateContent({
        model : "gemini-3.8-flash",
        contents : "Hello gemini ! Explain what is interview ?"
    })

    console.log(response.text)

}
module.exports = invokeGeminiAI;