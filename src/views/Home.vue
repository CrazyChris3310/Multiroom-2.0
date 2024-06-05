<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <BContainer
    style="position: relative"
    class="bv-example-row bv-example-row-flex-cols d-flex align-items-center min-vh-50"
  >
    <BRow  align-v="center" align-h="center" style="margin-top: 6em" class="container text-center">
      <BCol>
      </BCol>
      <BCol>
        <SimpleSpinnerComponent :visible="working" />

        <BForm @submit="doSubmit" @reset="doReset" ref="form">
          <BCard class="mt-3" v-bind:header="mode.toString()">
            <BFormGroup>
              <BFormInput
                v-model="login"
                required
                type="text"
                placeholder="Enter login"
                ref="txtLogin"
              ></BFormInput>
            </BFormGroup>
              <BFormGroup v-if="mode !== HomePageMode.Login">
                <BFormInput
                  v-model="email"
                  v-bind:state="isEmailOk"
                  @input="onEmailChange"
                  required
                  type="email"
                  placeholder="Enter email"
                ></BFormInput>
              </BFormGroup>
              <BFormGroup v-if="mode === HomePageMode.Recover">
                <BFormInput
                  v-model="email2"
                  v-bind:state="isEmailOk"
                  @input="onEmailChange"
                  required
                  type="email"
                  placeholder="Repeat email"
                ></BFormInput>
              </BFormGroup>
              <BFormGroup v-if="mode !== HomePageMode.Recover">
                <BFormInput
                  v-model="password"
                  v-bind:state="isPasswordOk"
                  @input="onPasswordChange"
                  required
                  type="password"
                  placeholder="Enter password"
                ></BFormInput>
              </BFormGroup>
              <BFormGroup v-if="mode === HomePageMode.Register">
                <BFormInput
                  v-model="password2"
                  v-bind:state="isPasswordOk"
                  @input="onPasswordChange"
                  required
                  type="password"
                  placeholder="Repeat password"
                ></BFormInput>
              </BFormGroup>

            <BFormGroup v-if="mode === HomePageMode.Register" style="margin-top: 1em">
              <BButton variant="outline-primary" @click="doSwitchRegisterMode">Back</BButton>
              &nbsp;
              <BButton type="submit" variant="success">Sign-up!</BButton>
              &nbsp;
              <BButton type="reset" variant="outline-primary">Reset</BButton>
            </BFormGroup>
            <BFormGroup v-if="mode === HomePageMode.Login" style="margin-top: 1em">
              <BButton variant="outline-primary" @click="doSwitchRegisterMode">Register</BButton>
              &nbsp;
              <BButton type="submit" variant="success">Sign-in!</BButton>
              &nbsp;
              <BButton type="reset" variant="outline-primary" @click="doSwitchRecoverMode"
                >Recover</BButton
              >
            </BFormGroup>
            <BFormGroup v-if="mode === HomePageMode.Recover" style="margin-top: 1em">
              <BButton type="reset" variant="outline-primary">Reset</BButton>
              &nbsp;
              <BButton type="submit" variant="success">Recover!</BButton>
              &nbsp;
              <BButton type="reset" variant="outline-primary" @click="doSwitchRecoverMode"
                >Back</BButton
              >
            </BFormGroup>
          </BCard>
        </BForm>

        <transition name="fade">
          <BAlert
            v-if="mode === HomePageMode.Register && registerSubmitted && password !== password2"
            show
            variant="warning"
            >Passwords are not matched</BAlert
          >
        </transition>
        <transition name="fade">
          <BAlert
            v-if="mode === HomePageMode.Recover && recoverSubmitted && email !== email2"
            show
            variant="warning"
            >Emails are not matched</BAlert
          >
        </transition>
        <transition name="fade">
          <BAlert v-if="errorMessage.length > 0" show variant="warning">{{
            errorMessage
          }}</BAlert>
        </transition>
      </BCol>
      <BCol>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script setup lang="ts">
// @ is an alias to /src
import SimpleSpinnerComponent from '../components/SimpleSpinnerComponent.vue'
// import * as x from '../../xml/my-json-types'
import api from '../api'
import { ref } from 'vue'
import { HomePageMode } from '@/components/data'
import { useRouter } from 'vue-router'
import { useToast } from 'bootstrap-vue-next'

// const HomePageMode = { Login: HomePageMode.Login, Register: HomePageMode.Register, Recover: HomePageMode.Recover }
// const HomePageModeEnum = HomePageMode
const mode = ref(HomePageMode.Login)
const registerSubmitted = ref(false)
const recoverSubmitted = ref(false)
const isPasswordOk = ref<boolean | null>(null)
const isEmailOk = ref<boolean | null>(null)

const login = ref('')
const email = ref('')
const email2 = ref('')
const password = ref('')
const password2 = ref('')

const errorMessage = ref('')
const working = ref(false)

const txtLogin = ref<HTMLInputElement>()

const router = useRouter()
const toast = useToast()

async function onPasswordChange() {
  if (mode.value === HomePageMode.Register) {
    if (password.value.length > 0 || password2.value.length > 0) {
      isPasswordOk.value = password.value === password2.value
    } else {
      isPasswordOk.value = null
    }
  } else {
    isPasswordOk.value = null
  }
}

async function onEmailChange() {
  if (mode.value === HomePageMode.Recover) {
    if (email.value.length > 0 || email2.value.length > 0) {
      isEmailOk.value = email.value === email2.value
    } else {
      isEmailOk.value = null
    }
  } else {
    isEmailOk.value = null
  }
}

async function doSwitchRegisterMode() {
  if (mode.value === HomePageMode.Login) {
    mode.value = HomePageMode.Register
  } else {
    mode.value = HomePageMode.Login
  }
  doReset()
}

async function doSwitchRecoverMode() {
  if (mode.value === HomePageMode.Login) {
    mode.value = HomePageMode.Recover
  } else {
    mode.value = HomePageMode.Login
  }
  doReset()
}

async function doReset() {
  login.value = ''
  email.value = ''
  email2.value = ''
  password.value = ''
  password2.value = ''
  registerSubmitted.value = false
  recoverSubmitted.value = false
  errorMessage.value = ''
  isPasswordOk.value = null
  isEmailOk.value = null
  txtLogin.value?.focus()
}

async function doSubmit(e: Event) {
  e.preventDefault()
  working.value = true
  try {
    switch (mode.value) {
      case HomePageMode.Login:
        await api.login(login.value, password.value)
        localStorage.setItem('username', login.value)
        router.push('/app/conferences')
        break
      case HomePageMode.Register:
        registerSubmitted.value = true
        if (password.value === password2.value) {
          await api.register(login.value, password.value, email.value)
          toast.show?.({
            props: {
              body: 'Email having activation link was sent to your email',
              title: 'Register',
              solid: true
            }
          })
          doSwitchRegisterMode()
        }
        break
      case HomePageMode.Recover:
        recoverSubmitted.value = true
        if (email.value === email2.value) {
          await api.requestAccessRestore(login.value, email.value)
          toast.show?.({
            props: {
              body: 'Email having restore link was sent to your email',
              title: 'Access restore',
              solid: true
            }
          })
          doSwitchRecoverMode()
        }
        break
      default:
        throw new Error('Unknown Home page mode ' + mode.value)
    }
    errorMessage.value = ''
  } catch (err) {
    errorMessage.value = (err as Error).message
  } finally {
    working.value = false
  }
}
</script>