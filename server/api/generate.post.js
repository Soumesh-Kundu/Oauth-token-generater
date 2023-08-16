import google from '@googleapis/gmail'

export default defineEventHandler(async (event)=>{
    const {clientId,clientSecret}=await readBody(event)
    const OAuth2Client = new google.auth.OAuth2(clientId, clientSecret,  `https://oauth-token-generater.vercel.app/callback`)
    const url = OAuth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope:['https://mail.google.com/']
    })
    return url
})