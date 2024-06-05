import * as x from '../../xml/my-json-types'

export class SubmissionContext {
  public confirmationCallback?: () => void
  public cancelCallback?: () => void
  public successCallback?: () => void
}

export class ListViewItem {
  private static _id = 0

  public id: number

  public constructor() {
    this.id = ListViewItem._id++
  }

  public key(): any {
    return this.id
  }
}

export class ConferenceListItem extends ListViewItem {
  public info: x.ConferenceInfoType
  public title = ''
  public description = ''
  public statusStamp = ''
  public duration = ''
  public membersOnline = 0
  public isFinished = false

  public constructor(info: x.ConferenceInfoType) {
    super()
    this.info = info
    this.title = info.Title
    this.description = info.Description
    // TODO other props
  }

  public key(): any {
    return this.info.Id
  }
}

export class UsersListItem extends ListViewItem {
  public name = ''

  public constructor(name: string) {
    super()
    this.name = name
  }

  public key(): any {
    return name
  }
}

export enum HomePageMode {
  Login='Login',
  Register='Register',
  Recover='Recover'
}

export const commands = {
  REMOVE_PEER: 0,
  REMOVE_STREAM: 1
}

export class SentMediaStream {
  public constructor(
    public id: string,
    public type: string,
    public audioDevice?: string,
    public videoDevice?: string
  ) {}
}