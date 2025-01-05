<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const error = ref(null)
const router = useRouter()

function encode(data) {
    return Object.keys(data)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&')
}

const handleSubmit = (e) => {
    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
            'form-name': 'contactMe',
            ...e
        })
    })
        .then(() => {
            router.push({ name: 'Success', params: { name: e.name } })
        })
        .catch((e) => {
            error.value = e
            console.error('jaime ~ handleSubmit ~ error:', e)
        })
}

</script>
<template>
        <FormKit type="form" netlify data-netlify="true" data-netlify-honeypot="bot-field" @submit="handleSubmit"
            :config="{ validationVisibility: 'submit' }" method="POST" name="contactMe" submit-label="Send"
            :submit-attrs="{
            inputClass: 'submit-button',
            wrapperClass: 'width-100',
            outerClass: 'flex flex-center width-100'
        }">
            <input type="hidden" name="form-name" value="contactMe" />

            <FormKit type="text" name="name" id="name" label="Name" placeholder="Jaime A."
                validation="required|alpha_spaces:latin" :input-class="{
            'formkit-input': false,
            'input-form': true,
        }" messages-class="error-text " inner-class="py-s" outer-class="mb-form first-item-margin" />

            <FormKit type="email" name="email" id="email" label="Email" placeholder="google@gmail.com"
                validation="required|email" messages-class="error-text" inner-class="py-s" outer-class="mb-form"
                :input-class="{
            'formkit-input': false,
            'input-form': true,
        }" />
            <FormKit type="textarea" name="message" id="message" label="Message" placeholder="Hi! how are you?" rows="5"
                validation="required" :input-class="{
            'formkit-input': false,
            'input-form': true,
        }" messages-class="error-text" inner-class="py-s" outer-class="mb-form" />
        </FormKit>
        <pre v-show="error">
            {{ error }}
        </pre>
</template>
<style>
.input-form {
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    padding: 1rem;
    color: #f7f7f7;
    font-family: inherit;
    min-width: 300px;
    background-color: transparent;
}

.submit-button {
    background-color: #e4e4e4;
    box-shadow: inset 0 0 4px 1.5px rgba(1, 1, 1, 0.5);
    color: #111;
    border: none;
    width: 100%;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
}

.error-text {
    font-size: 0.75rem;
    color: var(--gold);
    text-decoration: underline;
    margin-block-end: 0.5rem 0;
}

.mb-form {
    margin-bottom: 1rem;
}

.first-item-margin {
    margin-top: 1rem;
}
</style>