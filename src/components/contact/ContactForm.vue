<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import CloseIcon from '@/assets/icons/CloseIcon.vue'

const router = useRouter()

const formData = reactive({
    name: '',
    email: '',
    message: ''
})

function encode(data) {
    return Object.keys(data)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&')
}

const handleSubmit = () => {
    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
            'form-name': 'contactMe',
            ...formData
        })
    })
        .then(() => {
            // modal success
            console.log('jaime ~ success')
        })
        .catch((error) => {
            console.error('jaime ~ handleSubmit ~ error:', error)
            // modal error
        })
}
</script>
<template>
    <div class="form-container bloom-effect-layout">
        <button class="button-back pointer" @click="router.back()"><CloseIcon /></button>
        <FormKit type="form" netlify data-netlify="true" data-netlify-honeypot="bot-field"
            @submit.prevent="handleSubmit" :config="{ validationVisibility: 'submit' }" method="POST" name="contactMe"
            submit-label="Send" :submit-attrs="{
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
                validation="required|min:10" :input-class="{
            'formkit-input': false,
            'input-form': true,
        }" messages-class="error-text" inner-class="py-s" outer-class="mb-form" />
        </FormKit>
    </div>
</template>
<style>
.form-container {
    outline: 1px solid #f7f7f7;
    border-radius: 2px;
    padding: 2rem 1rem;
    background-color: rgba(1, 1, 1, 0.75);
    position: relative;
}

.button-back {
    position: absolute;
    top: 2%;
    right: 2.5%;
    border-radius: 4px;

}

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
    box-shadow:  inset 0 0 4px 1.5px rgba(1, 1, 1, 0.5);
    color: #111;
    border: none;
    width: 100%;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
}

.error-text {
    font-size: var(--text-size--2);
    text-decoration: underline;
    margin-block-end: 1rem;
}

.mb-form {
    margin-bottom: 1rem;
}
.first-item-margin{
    margin-top: 1rem;
}
</style>