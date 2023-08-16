<template>
    <main class="grid place-items-center max-w-md mx-auto h-[100dvh]">
        <form class="w-full flex flex-col gap-10 items-center" @submit.prevent="onSubmit">
            <label class="w-full">
                Client Id
                <input type="text" id=""
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5"
                    placeholder="" v-model="input.clientId">
            </label>
            <label class="w-full">
                Client Secret
                <input type="password" id=""
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="" v-model="input.clientSecret">

            </label>
            <span>Or</span>
            <label for="token" class="px-5 py-3 bg-green-600 text-white font-medium text-lg rounded-md">
                choose
                Credentials.json
            </label>
            <input type="file" name="" id="token" accept="json" @change="readJson" hidden>
            <button type="submit" class="px-5 py-3 bg-blue-600 text-white font-medium text-lg rounded-md">Authorize</button>
        </form>
    </main>
</template>

<script setup>
// import google from '@googleapis/gmail'

const input = ref({
    clientId: "",
    clientSecret: ""
})
function readJson(e) {
    const reader = new FileReader()
    reader.onload = onReaderLoad
    reader.readAsText(e.target.files[0])
}
function onReaderLoad(event) {
    const {web:{client_id,client_secret}}=JSON.parse(event.target.result)
    input.value.clientId=client_id
    input.value.clientSecret=client_secret
}
async function onSubmit(){
    const {clientId,clientSecret}=input.value
    const {data}=await useFetch('/api/generate',{
        method:"POST",
        body:{
            clientId,clientSecret
        }
    })
    sessionStorage.setItem('clientId',clientId)
    sessionStorage.setItem('clientSecret',clientSecret)
    const url=data.value
    window.location.href=url
}
</script>
