import google from '@googleapis/gmail'

export default defineEventHandler(async (event)=>{
    try {
        const {code}=getQuery(event)
        const {origin}=getRequestURL(event)
        const {clientId,clientSecret}=await readBody(event)
        const OAuth2Client = new google.auth.OAuth2(clientId, clientSecret, `${origin}/callback`)
        const {tokens}=await OAuth2Client.getToken(code);
        return tokens
    } catch (error) {
        console.log(error)
    }
})