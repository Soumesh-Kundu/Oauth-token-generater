<template>
    <main class="grid place-items-center max-w-screen-2xl mx-8 2xl:mx-auto h-[100dvh]">
        <form class="grid justify-start w-full grid-cols-2 gap-5" @submit.prevent="onSubmit">
            <div class="flex flex-col items-center gap-5">
                <label class="w-full mb-5">
                    Client Id
                    <input type="text" id=""
                        class="bg-gray-50 mt-2 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5"
                        placeholder="" v-model="input.clientId">
                </label>
                <label class="w-full mb-5">
                    Client Secret
                    <input type="password" id=""
                        class="bg-gray-50 mt-2 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="" v-model="input.clientSecret">

                </label>
                <span>Or</span>
                <label for="token" class="px-5 py-3 my-5 text-lg font-medium text-white bg-green-600 rounded-md">
                    Upload
                    Credentials.json
                </label>
            </div>
            <div class="flex flex-col justify-start">
                <label class="w-full mb-5">
                    Scopes for API <span v-if="scopeArray.length && !valid" class="font-medium text-red-500">({{
                        scopeArray.length < 2 ? "scope is not valid" : "one of the scope is not valid" }})</span>
                            <input type="text" id=""
                                class="bg-gray-50 border mt-2 border-gray-300 text-base text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="" v-model="input.scopes" @input="onBlur">
                            <span class="my-3 font-semibold">* scopes links should be separted by coma(,)</span>

                </label>
                <ul class="flex flex-wrap items-center justify-center gap-3 mb-10">
                    <li v-for="(item, index) in scopeArray" :key="index">
                        <span class="flex items-center gap-2 px-3 py-2 font-medium bg-gray-200 rounded-full"
                            v-if="item.length > 0">
                            {{ item }} <button type="button" @click="onCancel(index)" class="p-1.5 cursor-pointer bg-white rounded-full">
                                <IconsXMark class="w-4 h-4" />
                            </button>
                        </span>
                    </li>
                </ul>
            </div>
            <div class="flex flex-col items-center col-span-2 gap-4">
                <span class="p-2 bg-gray-300 rounded-lg" v-html="url"></span>
                <input type="file" name="" id="token" accept="json" @change="readJson" hidden>
                <button type="submit"
                    class="px-5 py-3 text-lg font-medium text-white bg-blue-600 rounded-md">Authorize</button>
            </div>
        </form>
    </main>
</template>

<script setup>
// import google from '@googleapis/gmail'
const valid = ref(true)
const input = ref({
    clientId: "",
    clientSecret: "",
    scopes: ""
})
const url=ref("")
onMounted(()=>{
    url.value=`add <span class="p-1 font-semibold bg-white rounded-lg">${location.protocol}//${location.host}/callback</span> this in your redirect Uri on your OAuth credentials`
})
function readJson(e) {
    const reader = new FileReader()
    reader.onload = onReaderLoad
    reader.readAsText(e.target.files[0])
}
function onReaderLoad(event) {
    const { web: { client_id, client_secret } } = JSON.parse(event.target.result)
    input.value.clientId = client_id
    input.value.clientSecret = client_secret
}
const scopeArray = ref([])
function onBlur() {
    scopeArray.value=input.value.scopes.split(',').map(item => item.trim()).filter(item=>item.length>0)
    if (input.value.scopes.length < 1) {
        valid.value = true
        return
    }
    if (scopeArray.value.every(item => /^https:\/\/*(.google)*/.test(item))) {
        valid.value = true;
    }
    else {
        valid.value = false
    }
}
async function onSubmit() {
    if(!valid.value || input.value.clientId.length<1 || input.value.clientSecret <1 || scopeArray.value.length <1){
        return
    }
    const { clientId, clientSecret } = input.value
    const { data } = await useFetch('/api/generate', {
        method: "POST",
        body: {
            clientId, clientSecret,scopes:scopeArray.value,redirectUri:`${location.protocol}//${location.host}/callback`
        }
    })
    sessionStorage.setItem('clientId', clientId)
    sessionStorage.setItem('clientSecret', clientSecret)
    const url = data.value
    window.location.href = url
}
function onCancel(deleteIndex){
    scopeArray.value.splice(deleteIndex,1)
    input.value.scopes=scopeArray.value.join(', ')
    onBlur()
}
</script>
