<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <BContainer class="bv-example-row" id="profile-page">
    <BRow class="justify-content-md-center">
      <BCol>
        <BCard style="margin-left: 10%" header="Your profile settings">
          <SimpleSpinnerComponent :visible="loadingData" />

          <BFormGroup label="Login:" description="Your username cannot be changed.">
            <BFormInput id="data-login" v-model="currentLogin" type="text" disabled></BFormInput>
          </BFormGroup>

          <BForm inline @submit="onSubmitNewEmail">
            <BFormGroup label="Email:" description="Reenter old one to change it">
              <BFormInput
                id="data-current-email"
                v-bind:disabled="emailChanged"
                v-model="mailCurrentEmail"
                type="email"
                required
                v-bind:placeholder="currentEmail"
              ></BFormInput>
            </BFormGroup>
            <div class="break"></div>
            <BFormGroup>
              <BFormInput
                id="data-mail-new-email"
                v-bind:disabled="emailChanged"
                v-model="mailNewEmail"
                v-bind:state="isEmailOk"
                type="email"
                @input="onEmailChange"
                required
                placeholder="New email"
              ></BFormInput>
            </BFormGroup>
            <BFormGroup>
              <BFormInput
                id="data-mail-repeat-email"
                v-bind:disabled="emailChanged"
                v-model="mailNewEmail2"
                v-bind:state="isEmailOk"
                type="email"
                @input="onEmailChange"
                required
                placeholder="Repeat new email"
              ></BFormInput>
            </BFormGroup>
            <BFormGroup>
              <BFormInput
                id="data-mail-password"
                v-bind:disabled="emailChanged"
                v-model="mailCurrentPassword"
                type="password"
                required
                placeholder="Current password"
              ></BFormInput>
            </BFormGroup>
            <BButton type="submit" v-bind:disabled="emailChanged" variant="success"
              >Change email!</BButton
            >
          </BForm>

          <BForm inline @submit="onSubmitNewPassword">
            <BFormGroup label="Password:">
              <BFormInput
                id="data-password-current-password"
                v-model="currentPassword"
                type="password"
                v-bind:placeholder="currentPassword"
                disabled
              ></BFormInput>
            </BFormGroup>
            <div class="break"></div>
            <BFormGroup>
              <BFormInput
                id="data-password-new-password"
                v-bind:disabled="passwordChanged"
                v-model="passwordNewPassword"
                v-bind:state="isPasswordOk"
                @input="onPasswordChange"
                type="password"
                required
                placeholder="New password"
              ></BFormInput>
            </BFormGroup>
            <BFormGroup>
              <BFormInput
                id="data-password-repeat-password"
                v-bind:disabled="passwordChanged"
                v-model="passwordNewPassword2"
                v-bind:state="isPasswordOk"
                @input="onPasswordChange"
                type="password"
                required
                placeholder="Repeat new password"
              ></BFormInput>
            </BFormGroup>
            <BFormGroup>
              <BFormInput
                id="data-password-current-email"
                v-bind:disabled="passwordChanged"
                v-model="passwordCurrentEmail"
                type="email"
                required
                placeholder="Current email"
              ></BFormInput>
            </BFormGroup>
            <BButton type="submit" v-bind:disabled="passwordChanged" variant="success"
              >Change password!</BButton
            >
          </BForm>

          <BForm v-if="!isProfileActivated" inline @submit="onRequestActivation">
            <BFormGroup description="Reenter email to ensure">
              <label>Request activation link to the current email:</label>
            </BFormGroup>
            <div class="break"></div>
            <BFormGroup>
              <BFormInput
                id="data-activation-email"
                v-model="activationCurrentEmail"
                type="email"
                required
                v-bind:placeholder="currentEmail"
              ></BFormInput>
            </BFormGroup>
            <BButton type="submit" variant="success" class="align-bottom"
              >Request new activation link!</BButton
            >
          </BForm>
        </BCard>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '../api'
import SimpleSpinnerComponent from '../components/SimpleSpinnerComponent.vue'
import { useToast } from 'bootstrap-vue-next'

const currentLogin = ref('')
const currentEmail = ref('')
const currentPassword = ref('')
const mailCurrentEmail = ref('')
const mailNewEmail = ref('')
const mailNewEmail2 = ref('')
const mailCurrentPassword = ref('')
const passwordNewPassword = ref('')
const passwordNewPassword2 = ref('')
const passwordCurrentEmail = ref('')
const activationCurrentEmail = ref('')
const isProfileActivated = ref(false)
const profileEmail = ref('')
const emailChanged = ref(false)
const passwordChanged = ref(false)
const loadingData = ref(false)

const isPasswordOk = ref<boolean | null>(null)
const isEmailOk = ref<boolean | null>(null)

const toast = useToast()

async function created() {
  await setup()
}

async function setup() {
  const profile = await api.currentProfile()
  isProfileActivated.value = profile.IsActivated
  currentLogin.value = profile.Login
  currentEmail.value = profile.EmailFootprint
  currentPassword.value = '********'
}

async function onPasswordChange() {
  if (passwordNewPassword.value.length > 0 || passwordNewPassword2.value.length > 0) {
    isPasswordOk.value = passwordNewPassword.value === passwordNewPassword2.value
  } else {
    isPasswordOk.value = null
  }
}

async function onEmailChange() {
  if (mailNewEmail.value.length > 0 || mailNewEmail2.value.length > 0) {
    isEmailOk.value = mailNewEmail.value === mailNewEmail2.value
  } else {
    isEmailOk.value = null
  }
}

async function onSubmitNewEmail(e: Event) {
  e.preventDefault()
  try {
    loadingData.value = true
    if (
      mailCurrentEmail.value !== mailNewEmail.value &&
      mailNewEmail.value === mailNewEmail2.value &&
      mailNewEmail2.value !== '' &&
      mailCurrentEmail.value !== ''
    ) {
      await api.setEmail(mailCurrentEmail.value, mailNewEmail.value, mailCurrentPassword.value)
      toast.show?.({
        props: {
          body: 'Your email was successfully changed',
          title: 'Email',
          solid: true
        }
      })
      await setup()
      emailChanged.value = true
    }
  } catch (err) {
    toast.show?.({
      props: {
        body: (err as Error).message,
        title: 'Error changing email',
        variant: 'warning',
        solid: true
      }
    })
  } finally {
    loadingData.value = false
  }
}

async function onSubmitNewPassword(e: Event) {
  e.preventDefault()
  try {
    loadingData.value = true
    if (
      passwordCurrentEmail.value !== '' &&
      passwordNewPassword.value === passwordNewPassword2.value
    ) {
      await api.setPassword(passwordCurrentEmail.value, passwordNewPassword.value)
      toast.show?.({
        props: {
          body: 'Your password was successfully changed',
          title: 'Password',
          solid: true
        }
      })
      await setup()
      passwordChanged.value = true
    }
  } catch (err) {
    toast.show?.({
      props: {
        body: (err as Error).message,
        title: 'Error changing password',
        variant: 'warning',
        solid: true
      }
    })
  } finally {
    loadingData.value = false
  }
}

async function onRequestActivation(e: Event) {
  e.preventDefault()
  if (activationCurrentEmail.value !== '') {
    await api.requestActivation(activationCurrentEmail.value)
    toast.show?.({
      props: {
        body: 'Email having activation link was sent to your email',
        title: 'Activation',
        solid: true
      }
    })
  }
}
</script>
