<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <BContainer fluid>
    <SimpleSpinnerComponent :visible="loadingData" />
    <DataSumbitionComponent ref="resWaiter" />

    <BContainer>
      <BRow>
        <BCol><h4>Conference 1 - 45:02 for 2 users</h4></BCol>
      </BRow>
    </BContainer>

    <BModal
      id="modal-create-resource"
      centered
      title="New conference"
      @ok="sendMedia('none')"
      v-model="modal"
      no-close-on-backdrop
      :hide-header-close="resFormWaiting"
      size="xl"
      scrollable
    >
      <BForm @submit.stop.prevent="sendMedia('none')">
        <BRow>
          <BCol>
            <video
              autoplay
              playsinline
              size="md"
              style="width: 20em; height: 11.25em; background-color: black"
              :srcObject.prop="previewStream"
            ></video>
          </BCol>
          <BCol>
            <BInputGroup size="md" class="mt-3 mb-3">
              <p>Select microphone</p>
              <BFormSelect v-model="selectedMicro" :options="soundDevices">
                <template #first>
                  <BFormSelectOption :value="null" disabled
                    >-- Please select a microphone --</BFormSelectOption
                  >
                </template>
              </BFormSelect>
              <p>Select camera</p>
              <BFormSelect
                v-model="selectedCamera"
                :options="cameraDevices"
                @change="changePreview"
              >
                <template #first>
                  <BFormSelectOption :value="null" disabled
                    >-- Please select a camera --</BFormSelectOption
                  >
                </template>
              </BFormSelect>
            </BInputGroup>
          </BCol>
        </BRow>
        <BRow>
          <BCol>
            <BInputGroup>
              <BButton @click="sendMedia('video')" variant="secondary" size="sm" class="p-0 mr-sm-2"
                ><b>Send video</b></BButton
              >
              <BButton @click="sendMedia('audio')" variant="secondary" size="sm" class="p-0 mr-sm-2"
                ><b>Send audio</b></BButton
              >
              <BButton @click="sendMedia('both')" variant="secondary" size="sm" class="p-0 mr-sm-2"
                ><b>Send video + audio</b></BButton
              >
              <BButton
                @click="sendMedia('screen')"
                variant="secondary"
                size="sm"
                class="p-0 mr-sm-2"
                ><b>Send screen</b></BButton
              >
              <BButton @click="sendMedia('none')" variant="secondary" size="sm" class="p-0 mr-sm-2"
                ><b>Send nothing</b></BButton
              >
            </BInputGroup>
          </BCol>
        </BRow>
      </BForm>

      <template v-slot:modal-footer="{ ok, cancel }">
        <BButton variant="success" @click="ok()" ref="btnResOk">OK</BButton>
        <BButton variant="outline-primary" @click="cancel()">Cancel</BButton>
      </template>
    </BModal>

    <BRow>
      <BCol>
        <BListGroup horizontal>
          <BListGroupItem
            v-for="user in users.values()"
            v-bind:key="user.id"
            class="text-center m-0 p-0"
            style="display: flex; flex-direction: column"
          >
            {{ user.name }}
            <table>
              <tr valign="bottom">
                <td v-for="s in user.mediaStreams.values()" v-bind:key="s.id">
                  <table>
                    <tr>
                      <td>
                        <video
                          playsinline
                          autoplay
                          class="videobox"
                          @dblclick="viewPortStream = s"
                          :srcObject.prop="s"
                        ></video>
                      </td>
                    </tr>
                    <tr valign="bottom" v-if="user.id == -1">
                      <td>
                        <BButton variant="success" class="mt-3" @click="toggleMute(s.id)" >Mute</BButton>
                        <BButton variant="success" class="mt-3" @click="stopSingleStream(-1, s.id)">Stop</BButton>

                        <!-- <b-img v-if="s.hasAudio && !s.isMuted" src="../assets/Audio_16x.png" />
                        <b-img v-if="s.hasAudio && s.isMuted" src="../assets/AudioMute_16x.png" /> -->
                      </td>
                    </tr>
                  </table>
                </td>
                <!-- <td v-if="user.id == -1">
                  <table>
                    <tr>
                      <td>
                        <BButton variant="success" class="mt-3">Mute</BButton>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <BButton variant="success" class="mt-3">Stop</BButton>
                      </td>
                    </tr>
                  </table>
                </td> -->
              </tr>
            </table>
          </BListGroupItem>
        </BListGroup>
      </BCol>
    </BRow>

    <BRow class="mt-3">
      <BCol>
        <video
          autoplay
          playsinline
          :srcObject.prop="viewPortStream"
          style="width: 100%; background-color: black"
        ></video>
        <!-- <b-img style="background-color: black" width="1280" heigh="720" /> -->
      </BCol>
      <BCol>
        <BContainer fluid>
          <!-- <BRow>
            <BCol>
              aa
            </BCol>
          </BRow> -->
          <BRow>
            <BCol>
              <BFormGroup>
                <BFormTextarea
                  type="text"
                  placeholder="Chat log"
                  style="/*width:200px;*/"
                  rows="25"
                ></BFormTextarea>
              </BFormGroup>
              <BInputGroup size="md" class="mt-3 mb-3" style="/*width:200px;*/">
                <BFormInput placeholder="Your message" type="text" />
                <template v-slot:append>
                  <BInputGroupText>
                    <BButton variant="link" size="sm" class="p-0 mr-sm-2"><b>Send</b></BButton>
                  </BInputGroupText>
                </template>
              </BInputGroup>
            </BCol>
          </BRow>
        </BContainer>
      </BCol>
    </BRow>
    <BRow>
      <BCol>
        <BButton variant="success" class="mt-3" @click="modal = !modal">SendMedia</BButton>
        <BButton variant="danger" class="mt-3" @click="leaveConference">Leave</BButton>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script setup lang="ts">
import DataSumbitionComponent from '../components/DataSumbitionComponent.vue'
import SimpleSpinnerComponent from '../components/SimpleSpinnerComponent.vue'
import api from '../api'
// import * as x from '../../xml/my-json-types'
/* eslint-disable */
// @ts-ignore
import { computed, nextTick, onMounted, ref, type ComponentPublicInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { commands, ListViewItem, SentMediaStream } from '@/components/data'
/* eslint-enable */

class UserMediaStreamInfo {
  public constructor(
    public id: number,
    public name: string,
    public image: any,
    public hasAudio: boolean,
    public isMuted: boolean
  ) {}
}

class UserInfo {
  public constructor(
    public id: number,
    public name: string,
    public mediaStreams: Map<string, MediaStream>,
    public connection?: RTCPeerConnection
  ) {}
}

const loadingData = ref(true)
const tmp = ref('')
const keyword = ref('')
const isProfileActivated = ref(false)
const devices = ref(new Array<MediaDeviceInfo>())
const users = ref(new Map<number, UserInfo>())

const resWaiter = ref<ComponentPublicInstance | null>(null)

const router = useRouter()
const currentRoute = useRoute()

const resFormWaiting = ref(false)
const selectedMicro = ref<string | null>(null)
const selectedCamera = ref<string | null>(null)
const modal = ref(false)

const previewStream = ref<MediaStream|null>(null);
const viewPortStream = ref<MediaStream>()

const isConnected = ref(false)

let peer_connection: RTCPeerConnection | null
let sck = ref<WebSocket | null>(null)
let senders: Map<string, Array<RTCRtpSender>> = new Map()

const username = ref(localStorage.getItem('username') || 'Guest')

const soundDevices = computed(() => {
  return devices.value
    .filter((it) => it.kind === 'audioinput')
    .map((it) => {
      return { value: it.deviceId, text: it.label }
    })
})

const cameraDevices = computed(() => {
  return devices.value
    .filter((it) => it.kind === 'videoinput')
    .map((it) => {
      return { value: it.deviceId, text: it.label }
    })
})

function gainDevices() {
  navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
    devices.value = mediaDevices
  })
}

function changePreview() {
  getDeviceMedia('video').then(stream => previewStream.value = stream);
}

function toggleMute(streamId: string) {
  users.value.get(-1)!.mediaStreams.get(streamId)?.getAudioTracks().forEach(it => it.enabled = !it.enabled)
}

function doConnect() {
  sck.value?.send('HELLO ' + username.value)
  peer_connection
    ?.createOffer()
    .then((offer) => {
      peer_connection?.setLocalDescription(offer)
      return offer
    })
    .then((offer) => {
      sck.value?.send(JSON.stringify({ sdp: { sdp: offer }, dest: -1 }))
    })
}

function sendMedia(type: string, mediaInfo?: SentMediaStream) {
  let promise
  if (type === 'none') {
    getOrCreateUser(-1, username.value)
    if (!isConnected.value) {
      doConnect()
    }
    modal.value = false
    return
  }

  if (type === 'screen') {
    promise = getScreenMedia()
  } else {
    promise = getDeviceMedia(type, mediaInfo)
  }

  promise.then((stream: MediaStream) => {
    let foundUser = getOrCreateUser(-1, username.value)
    foundUser.mediaStreams.set(stream.id, stream)
    let sendersVar = new Array<RTCRtpSender>()
    stream
      .getTracks()
      .forEach((track) => {
        sendersVar.push(peer_connection!!.addTrack(track, stream))
      })
    senders.set(stream.id, (senders.get(stream.id)||[]).concat(sendersVar))
    if (!mediaInfo && type != 'screen') {
        const sentMediaStreams = JSON.parse(localStorage.getItem('sentMedia')||'[]') as Array<SentMediaStream>
        sentMediaStreams.push(createSentMedia(type, stream))
        localStorage.setItem('sentMedia', JSON.stringify(sentMediaStreams))
    }
    // previewStream.value = null
    previewStream.value = null
    if (!isConnected.value) {
      doConnect()
    }
    modal.value = false
  })
}

function createSentMedia(type: string, stream: MediaStream) {
  let media = new SentMediaStream(stream.id, type)
  if (type == 'video') {
    media.videoDevice = stream.getTracks()[0].getSettings().deviceId!
  } else if (type == 'audio') {
    media.videoDevice = stream.getTracks()[0].getSettings().deviceId!
  } else if (type == 'both') {
    media.videoDevice = stream.getTracks().find(it => it.kind == 'video')!.getSettings().deviceId!
    media.audioDevice = stream.getTracks().find(it => it.kind == 'video')!.getSettings().deviceId!
  } else if (type == 'screen') {
    media.videoDevice = stream.getTracks()[0].getSettings().deviceId!
  }
  return media
}

// function getOrCreateStream(id: number, streamId: string, username: string?) {
//     const userInfo = getOrCreateUser(id, username)
//     let userStream = userInfo.mediaStreams.get(streamId)
// }

function getOrCreateUser(id: number, username?: string) {
  let foundUser = users.value.get(id)
  if (!foundUser) {
    foundUser = new UserInfo(id, username!, new Map())
    users.value.set(id, foundUser)
  }
  return foundUser
}

function getDeviceMedia(type: string, mediaInfo?: SentMediaStream) {
  let options = {}
  if (type === 'video') {
    options = { video: { width: 1280, height: 720, deviceId: mediaInfo?.videoDevice || selectedCamera.value }, audio: false }
  } else if (type === 'audio') {
    options = { video: false, audio: { deviceId: mediaInfo?.audioDevice || selectedMicro.value } }
  } else if (type === 'both') {
    options = {
      video: { width: 1280, height: 720, deviceId: mediaInfo?.videoDevice || selectedCamera.value },
      audio: { deviceId: mediaInfo?.audioDevice || selectedMicro.value }
    }
  }
  return navigator.mediaDevices.getUserMedia(options)
}

function getScreenMedia(mediaInfo?: SentMediaStream) {
  let video: boolean|MediaTrackConstraints = mediaInfo ? { deviceId: mediaInfo!.videoDevice } : true
  return navigator.mediaDevices.getDisplayMedia({ video: video, audio: false })
}

// async function created() {
//   isProfileActivated.value = await api.currentProfile().then((t) => t.IsActivated)
// }

function getResWaiter(): ComponentPublicInstance | null {
  return resWaiter.value
}

onMounted(async () => {
  // on displayed
  gainDevices()
  // sendMedia('none')

  sck.value = createWebSocket()
  peer_connection = createPeer(-1)

  const mediaString = localStorage.getItem('sentMedia')
  if (mediaString) {
    let sentMedia = JSON.parse(mediaString!) as Array<SentMediaStream>
    sentMedia.forEach(mediaInfo => {
      sendMedia(mediaInfo.type, mediaInfo)
    })
  } else {
    sendMedia('none')
  }


  const id = currentRoute.params.conferenceId as string
  if (id) {
    await nextTick()
    // this.onClickInfo(new ConferenceListItem(await api.getConferenceById(Number.parseInt(id))))
  } else {
    // this.$router.push('/app/conferences')
  }

  loadingData.value = false
})

function createWebSocket() {
  function makeWsUrl(ep: string) {
    let protocol = 'ws'
    if (window.location.protocol.startsWith('https')) protocol = 'wss'

    let host = window.location.hostname
    let port = window.location.port || (protocol === 'wss' ? 443 : 80)

    return protocol + '://' + host + ':' + 443 + (ep.startsWith('/') ? ep : ('/' + ep));
    // return 'wss://localhost:443' + (ep.startsWith('/') ? ep : '/' + ep)
  }

  function removeSocket() {
    if (peer_connection) {
      peer_connection.close()
      peer_connection = null
    }

    users.value.forEach((it) => it.connection?.close())
    users.value = new Map()

    sck.value = null
  }

  let pathSegments = window.location.pathname.split('/')
  let roomId = pathSegments[pathSegments.length - 1]

  let socket = new WebSocket(makeWsUrl('/sck?roomId=' + roomId))
  socket.onopen = (event) => {
    console.log('Connected to server')
  }
  socket.onerror = function (event) {
    console.error('web socket error', event)
  }
  socket.onmessage = function (event) {
    console.log('received ' + event.data)
    let msg = JSON.parse(event.data)
    if (msg.chat) {
      let element = document.createElement('div')
      element.classList.add('message')
      element.innerHTML = msg.username + ': ' + msg.chat.text
      // todo: add messages to chat
    } else if (msg.sdp) {
      if (msg.sdp.sdp != null) {
        let connection = getOrCreatePeer(msg.dest, msg.username)
        connection.setRemoteDescription(msg.sdp.sdp).then(() => {
          if (msg.sdp.sdp.type === 'offer') {
            connection
              .createAnswer()
              .then((answer) => {
                connection.setLocalDescription(answer)
                return answer
              })
              .then((answer) => {
                console.log(
                  'Sending answer: ' + JSON.stringify({ sdp: { sdp: answer }, dest: msg.dest })
                )
                sck.value!.send(JSON.stringify({ sdp: { sdp: answer }, dest: msg.dest }))
                getOrCreateUser(msg.dest)
              })
              .catch(console.warn)
          }
        })
      } else if (msg.sdp.ice != null) {
        let candidate = new RTCIceCandidate(msg.sdp.ice)
        console.log('remote ice candidate received: ' + JSON.stringify(msg.sdp.ice))
        let connection = getOrCreatePeer(msg.dest, msg.username)
        connection
          .addIceCandidate(candidate)
          .then(() => console.log('Remote candidate added'))
          .catch(console.error)
      } else {
        console.error('Unknown incoming JSON: ' + msg)
      }
    } else if (msg.control) {
      if (msg.control.type === commands.REMOVE_PEER) {
        const user = getOrCreateUser(msg.dest, msg.username)
        user.connection?.close()
        user.connection = undefined

        users.value.delete(user.id)
      } else if (msg.control.type === commands.REMOVE_STREAM) {
        stopSingleStream(msg.dest, msg.control.streamId)
      }
    }
  }
  socket.onclose = function () {
    console.warn('Disconnected from server')
    removeSocket()
  }

  return socket
}

function getOrCreatePeer(dest: number, destName: string): RTCPeerConnection {
  let user = getOrCreateUser(dest, destName)
  if (user.connection == null) {
    if (dest == -1) {
      user.connection = peer_connection!
    } else {
      user.connection = createPeer(dest)
    }
  }
  return user.connection
}

let rtc_configuration = {
  iceServers: [{ urls: 'stun:stun.services.mozilla.com' }, { urls: 'stun:stun.l.google.com:19302' }]
}

function createPeer(dest: number) {
  let peer = new RTCPeerConnection(rtc_configuration)

  peer.onicecandidate = (event) => {
    if (event.candidate != null) {
      sck.value!.send(JSON.stringify({ sdp: { ice: event.candidate }, dest: dest }))
    }
  }

  peer.onconnectionstatechange = (ev) => {
    console.log('Connection state of ' + dest + ' changed to ' + peer_connection!!.connectionState)
    if (peer.connectionState === 'connected') {
      isConnected.value = true
    }
  }

  peer.oniceconnectionstatechange = (event) => {
    console.log('Ise state of ' + dest + ' changed: ' + peer_connection!!.iceConnectionState)
  }

  peer.onicecandidateerror = (event) => console.error(JSON.stringify(event))

  peer.ontrack = (event) => {
    let user = getOrCreateUser(dest, '')
    if (!user.mediaStreams.has(event.streams[0].id)) {
      user.mediaStreams.set(event.streams[0].id, event.streams[0])
    }

    // let element = getOrCreateStream(dest, event.streams[0].id);

    // if (element.video.srcObject !== event.streams[0]) {
    //     console.log('Incoming stream');
    //     element.video.srcObject = event.streams[0];
    // }
  }

  peer.onnegotiationneeded = () => {
    if (isConnected.value) {
      console.warn('Need renegotiation')
      peer_connection!
        .createOffer()
        .then((offer) => {
          peer_connection!.setLocalDescription(offer)
          return offer
        })
        .then((offer) => {
          sck.value!.send(JSON.stringify({ sdp: { sdp: offer }, dest: -1 }))
        })
    }
  }

  return peer
}

function stopSingleStream(dest: number, streamId: string) {
    let user = getOrCreateUser(dest)
    user.mediaStreams.get(streamId)?.getTracks().forEach(it => it.stop())
    user.mediaStreams.delete(streamId)
    if (dest == -1) {
      senders.get(streamId)?.forEach(it => peer_connection?.removeTrack(it))
      sck.value!.send(JSON.stringify({ control: { type: commands.REMOVE_STREAM, streamId: streamId } }));

      const mediaString = localStorage.getItem('sentMedia')
      if (mediaString) {
        let sentMedia = JSON.parse(mediaString!) as Array<SentMediaStream>
        let streamIdx = sentMedia.findIndex(it => it.id == streamId)
        if (streamIdx > -1) {
          sentMedia.splice(streamIdx, 1)
        }
        localStorage.setItem('sentMedia', JSON.stringify(sentMedia))
      }
    }
}

function leaveConference() {
  sck.value!.close()
  sck.value = null
  localStorage.removeItem('sentMedia')
  router.push("/app/conferences")
}
</script>

<style lang="scss">
#table {
  .input-group-text {
    padding: 0 0.5em 0 0.5em;

    .fa {
      font-size: 12px;
    }
  }
}

.videobox {
  width: 9em;
  height: 5.062em;
  background-color: black;
  margin: 0.2em;
  border: 0.13em solid rgb(100, 100, 100);
  border-radius: 0.5em;
}
</style>
