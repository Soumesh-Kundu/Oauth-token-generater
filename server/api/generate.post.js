import google from '@googleapis/gmail'

export default defineEventHandler(async (event)=>{
    const {origin}=getRequestURL(event)
    const {clientId,clientSecret}=await readBody(event)
    const OAuth2Client = new google.auth.OAuth2(clientId, clientSecret, `${origin}/callback`)
    const url = OAuth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope:['https://mail.google.com/']
    })
    return url
})