import google from '@googleapis/gmail'

export default defineEventHandler(async (event)=>{
    const {clientId,clientSecret,redirectUri,scopes}=await readBody(event)
    const OAuth2Client = new google.auth.OAuth2(clientId, clientSecret,redirectUri)
    const url = OAuth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope:scopes
    })
    return url
})
