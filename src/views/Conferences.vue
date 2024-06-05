<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <BContainer class="bv-example-row" id="table">
    <SimpleSpinnerComponent :visible="loadingData" />
    <DataSumbitionComponent ref="resWaiter" />

    <BModal
      id="modal-create-resource"
      centered
      title="New conference"
      @show="resResetModal(true)"
      @hidden="resResetModal(false)"
      @ok="resHandleOk"
      no-close-on-backdrop
      :hide-header-close="resFormWaiting"
      size="xl"
      scrollable
    >
      <BForm @submit.stop.prevent="resHandleSubmit">
        <BFormGroup label="Title:">
          <BFormInput
            v-model="resFormName"
            type="text"
            placeholder="Conference title"
            required
          ></BFormInput>
        </BFormGroup>
        <BFormGroup label="Description:">
          <BFormTextarea
            v-model="resFormGrammarText"
            type="text"
            placeholder="Conference agenda description"
            rows="6"
            required
          ></BFormTextarea>
        </BFormGroup>
        <BRow>
          <BCol>
            <BFormGroup label="Users to invite:">
              <ListView v-bind:itemsSource="resFormImportersFiltered">
                <template v-slot:title="item">{{ (item as UsersListItem).name }}</template>
                <template v-slot:titleStatus="item">
                  <BButton variant="success" @click="selectUser(item.id)"
                    ><strong>+</strong></BButton
                  >
                </template>
              </ListView>
              <BCard
                v-if="resFormImportersFiltered.length == 0"
                title="No users"
                sub-title="were met"
                class="text-center"
              >
                <BCard-text class="text-center">Change the filter or create a new one</BCard-text>
              </BCard>
            </BFormGroup>
            <BInputGroup size="md" class="mt-3 mb-3">
              <BFormInput
                v-model="resFormImportersKeywords"
                placeholder="Filter participants"
                type="text"
              />
              <BInputGroupText slot="append">
                <BButton
                  v-if="resFormImportersFilterApplied"
                  variant="link"
                  size="sm"
                  class="p-0 mr-sm-2"
                  ><b>x</b></BButton
                >
                <BButton
                  v-bind:disabled="resFormImportersKeywords.length < 1"
                  variant="link"
                  size="sm"
                  class="p-0 mr-sm-2"
                  ><b>Filter</b></BButton
                >
              </BInputGroupText>
            </BInputGroup>
          </BCol>
          <BCol>
            <BFormGroup label="Invited users:">
              <ListView v-bind:itemsSource="resFormImportersSelected">
                <template v-slot:title="item">{{ (item as UsersListItem).name }}</template>
                <template v-slot:titleStatus="item">
                  <BButton variant="outline-primary" @click="deselectUser(item.id)"
                    ><strong>-</strong></BButton
                  >
                </template>
              </ListView>
              <BCard
                v-if="resFormImportersSelected.length == 0"
                title="No importers"
                sub-title="were choosen"
                class="text-center"
              >
                <BCard-text class="text-center">Choose them from the list on the right</BCard-text>
              </BCard>
            </BFormGroup>
          </BCol>
          <BCol>
            <BForm-checkbox v-model="resStartNow">Start now</BForm-checkbox>
            <BFormCheckbox v-model="isPublic">Public conference</BFormCheckbox>
            <BCollapse id="resStartCollapse" class="mt-2" :visible="!resStartNow">
              <BCard>
                When the conference planned to start?
                <BFormInput type="date" class="mt-2"></BFormInput>
                <BFormInput type="time" class="mt-2"></BFormInput>
              </BCard>
            </BCollapse>
          </BCol>
        </BRow>
      </BForm>

      <template v-slot:modal-footer="{ ok, cancel }">
        <BButton :disabled="resFormWaiting" variant="success" @click="ok()" ref="btnResOk"
          >OK</BButton
        >
        <BButton :disabled="resFormWaiting" variant="outline-primary" @click="cancel()"
          >Cancel</BButton
        >
      </template>
    </BModal>

    <BRow class="justify-content-md-center">
      <BCol cols="1">
        <BInputGroup size="md" class="mt-5 mb-3">
          <BButton variant="outline-primary" class="mt-5" v-BModal.modal-create-resource
            ><strong>+</strong></BButton
          >
        </BInputGroup>
      </BCol>
      <BCol cols="10">
        <b-alert v-if="!isProfileActivated" show variant="danger"
          >Please, activate your profile first!</b-alert
        >

        <BInputGroup size="md" class="mt-3 mb-3">
          <BFormInput
            v-model="keyword"
            placeholder="Search"
            type="text"
            ref="txtSearchBox"
            @keydown="onSearchBoxKeyDown"
          />
          <BInputGroupText slot="append">
            <BButton
              v-if="filterApplied"
              variant="link"
              size="sm"
              @click="doResetSearch()"
              class="mr-sm-2"
              ><b>x</b></BButton
            >
            <BButton
              v-bind:disabled="keyword.length < 1"
              variant="link"
              size="sm"
              @click="doSearch()"
              class="p-0 mr-sm-2"
              ><b>Search</b></BButton
            >
          </BInputGroupText>
        </BInputGroup>

        <ListView v-bind:itemsSource="items" @itemClick="onClickInfo">
          <template v-slot:title="item">{{ (item as ConferenceListItem).title }}</template>
          <template v-slot:titleStatus="item">
            <em
              >{{ (item as ConferenceListItem).duration }} for
              {{ (item as ConferenceListItem).membersOnline }} users</em
            >
            &nbsp;
            <BButton
              v-if="!(item as ConferenceListItem).isFinished"
              variant="success"
              class="mb-0"
              size="sm"
              @click="onClickInfo(item as ConferenceListItem)"
              >Open</BButton
            >
            <BButton
              v-if="(item as ConferenceListItem).isFinished"
              variant="outline-success"
              class="mb-0"
              size="sm"
              @click="onClickInfo(item as ConferenceListItem)"
              >Review</BButton
            >
          </template>
          <template v-slot:content="item">{{ (item as ConferenceListItem).description }}</template>
          <template v-slot:tags="item"
            ><em>{{ (item as ConferenceListItem).statusStamp }}</em></template
          >
        </ListView>

        <BCard v-if="items.length == 0 && !loadingData" title="Nothing found" sub-title="0 results">
          <BCard-text class="text-center">
            May be we have nothing about your topic, or your can try different keywords
          </BCard-text>
        </BCard>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script setup lang="ts">
import DataSumbitionComponent from '../components/DataSumbitionComponent.vue'
import SimpleSpinnerComponent from '../components/SimpleSpinnerComponent.vue'
import ListView from '../controls/ListView.vue'
import api, { p } from '../api'
import { onMounted, ref, type ComponentPublicInstance, type Ref } from 'vue'
import { BFormInput, BvEvent, useToast } from 'bootstrap-vue-next'
import { useRouter } from 'vue-router'
import { ConferenceListItem, UsersListItem } from '@/components/data'
import * as x from '../../xml/my-json-types'

const tmp = ref('')
const keyword = ref('')
const isProfileActivated = ref(false)

const noItem = ref(new ConferenceListItem({ Id: "" } as x.ConferenceInfoType))

const loadingData = ref(true)
const items = ref(new Array<ConferenceListItem>())
const filterApplied = ref(false)
const item = ref(noItem)

const resFormImportersSelected = ref(new Array<UsersListItem>())
const resFormImportersFiltered = ref(new Array<UsersListItem>())
const resFormImportersFilterApplied = ref(true)
const resFormImportersKeywords = ref('user')
const isPublic = ref(true)

const resWaiter = ref<InstanceType<typeof DataSumbitionComponent> | null>(null)
const txtSearchBox = ref<HTMLInputElement | null>(null)
const btnResOk = ref<HTMLElement>()

const toast = useToast()
const router = useRouter()

onMounted(async () => {
  doResetSearch();

  // isProfileActivated.value = await api.currentProfile().then((t) => t.IsActivated)

  api.getAllUsers().then(items => 
    resFormImportersFiltered.value = items.Items.map(it => new UsersListItem((it as x.UserInfoType).Name))
  )
})

// TODO: restore streams only for the necessary room

function selectUser(id: number) {
  let foundId = resFormImportersFiltered.value.findIndex(it => it.id == id)
  if (foundId > -1) {
    resFormImportersSelected.value.push(resFormImportersFiltered.value[foundId])
    resFormImportersFiltered.value.splice(foundId, 1)
  }
}

function deselectUser(id: number) {
  let foundId = resFormImportersSelected.value.findIndex(it => it.id == id)
  if (foundId > -1) {
    resFormImportersFiltered.value.push(resFormImportersSelected.value[foundId])
    resFormImportersSelected.value.splice(foundId, 1)
  }
}

function getResWaiter(): ComponentPublicInstance | null {
  return resWaiter.value
}
async function doResetSearch() {
  loadingData.value = true
  filterApplied.value = false
  try {
    const conferences = await api.getConferences()
    if (conferences.Items) {
      (conferences.Items as x.ConferenceInfoType[]).forEach(r => items.value.push(new ConferenceListItem(r)))
    }

    const inputBox = txtSearchBox.value
    if (inputBox) {
      inputBox.selectionStart = 0
      inputBox.selectionEnd = inputBox.value.length
      inputBox.focus()
    }
  } catch (err) {
    toast.show?.({
      props: {
        title: 'Error retrieving resources',
        variant: 'warning',
        solid: true,
        body: (err as Error).message
      }
    })
  } finally {
    loadingData.value = false
  }
}

async function doSearch() {
  loadingData.value = true
  try {
    const rooms = await api.getConferences() // filter?
    items.value = new Array<ConferenceListItem>()
    if (rooms.Items) {
      (rooms.Items as x.ConferenceInfoType[])
        .filter((x) => [x.Title, x.Description].filter((s) => s.includes(keyword.value)).length > 0)
        .forEach((r) => items.value.push(new ConferenceListItem(r)))
    }

    filterApplied.value = true
  } catch (err) {
    toast.show?.({
      props: {
        title: 'Error searching',
        variant: 'warning',
        solid: true,
        body: (err as Error).message
      }
    })
  } finally {
    loadingData.value = false
  }
}

async function onSearchBoxKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    // 13
    doSearch()
  } else if (e.key === 'Escape') {
    //27
    doResetSearch()
  }
}

async function onClickInfo(itemParam: ConferenceListItem) {
  item.value = itemParam
  // $bvModal.show('modal-create-resource')
  router.push('/app/conferences/' + itemParam.info.Id)
}

const resFormName = ref('')
const resFormFileNamePattern = ref('')
const resFormGrammarText = ref('')
const resFormWaiting = ref(false)
const resStartNow = ref(true)

async function resResetModal(show: boolean) {
  if (item.value && show) {
    // resFormName = item.info.Name
    // resFormFileNamePattern = item.info.FileNamePattern
    // resFormGrammarText = item.info.ParserGrammarText
  } else {
    resFormName.value = ''
    resFormFileNamePattern.value = ''
    resFormGrammarText.value = ''
    // item = undefined
  }
}

async function resHandleOk(bvModalEvt: BvEvent) {
  bvModalEvt.preventDefault() // Prevent modal from closing
  resHandleSubmit()
}

async function resHandleSubmit() {
  resFormWaiting.value = true
  const conferenceInfo = {
      Title: resFormName.value,
      Description: resFormGrammarText.value
  } as x.ConferenceInfoType
  const response =  await api.createConference(conferenceInfo)
  resFormWaiting.value = false
  router.push("/app/conferences/" + response.RoomId);

  // await resWaiter.value?.doShow({
  //   confirmationCallback: async () => {
  //     try {
  //       // if (resFormName.trim().length === 0) {
  //       //   throw new Error('Name should not be empty')
  //       // }
  //       // if (item) {
  //       //   const resource = await api.updateImporter(item.info.Id, resFormName, resFormFileNamePattern, resFormGrammarText)
  //       //   items.splice(items.findIndex(x => x.info.Id === item?.info.Id), 1, new ImporterListItem(resource))
  //       //   item = undefined
  //       // } else {
  //       //   const resource = await api.createImporter(resFormName, resFormFileNamePattern, resFormGrammarText)
  //       //   items.splice(0, 0, new ImporterListItem(resource))
  //       // }
  //       // nextTick(() => toast.remove() $bvModal.hide('modal-create-resource'))
  //     } catch (err) {
  //       toast.show?.({
  //         props: {
  //           title: 'Error submitting',
  //           variant: 'warning',
  //           solid: true,
  //           body: (err as Error).message
  //         }
  //       })
  //     } finally {
  //       resWaiter.value?.doFinish()
  //     }
  //   },
  //   cancelCallback: async () => {
  //     btnResOk.value?.focus()
  //   }
  // })
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
</style>
