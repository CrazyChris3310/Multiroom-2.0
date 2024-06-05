// import * as cxml from '@wikipathways/cxml'
// import * as cxsd from '@wikipathways/cxsd'
// import fetch, { Headers, Response } from 'node-fetch'
import * as x from '../xml/my-json-types'
import router from './router'

export function p<T>(arg: Partial<T>): T {
  return arg as T
}

function p2<T, R>(arg: Partial<T>): R {
  return arg as R
}

enum HttpMethod {
  Get,
  Post,
  Delete
}

class HelperImpl {
  private httpMethodNames = new Map<HttpMethod, string>([
    [HttpMethod.Get, 'GET'],
    [HttpMethod.Post, 'POST'],
    [HttpMethod.Delete, 'DELETE']
  ])

  private rootUrl: string

  private cookies = new Map<string, string>()

  public constructor(rootUrl: string) {
    this.rootUrl = rootUrl
  }

  private async request(method: HttpMethod, url: string, arg?: any): Promise<Response> {
    let bodyContent = null
    const headers = new Headers()
    headers.set('Accept', 'application/json')

    if (arg !== undefined) {
      if (arg instanceof FormData) {
        bodyContent = arg
      } else {
        headers.set('Content-Type', 'application/json')
        bodyContent = JSON.stringify(arg)
      }
    }
    if (this.cookies.size > 0) {
      headers.set(
        'Cookie',
        Array.from(this.cookies)
          .map((e) => e.join('='))
          .join(';')
      )
    }

    const response = await fetch(this.rootUrl + url, {
      body: bodyContent,
      method: this.httpMethodNames.get(method),
      headers: headers,
      credentials: 'include'
    } as any)

    response.headers.forEach((h, s) => {
      if (h === 'Set-Cookies') {
        const kv = s.split(';')[0].split('=')
        this.cookies.set(kv[0], kv[1])
      }
    })

    if (response.ok) {
      return Promise.resolve(response)
    } else {
      let errMsg = ''

      if (response.headers.get('Content-Type')?.startsWith('application/json') === true) {
        let err = await this.parse<x.ErrorInfoType>(response)
        while (err) {
          errMsg += err.Message + '\n'
          err = err.InnerError
        }
      } else {
        errMsg = response.statusText
      }

      console.warn(`Response (status ${response.status}) error message: ${errMsg}`)
      throw new Error(errMsg)
    }
  }

  private async parse<T>(response: Response): Promise<T> {
    const responseText = await response.text()
    if (responseText.length > 0) {
      // const p = new cxml.Parser({ "": "" })
      // const doc = await p.parse(await response.text(), x.document)
      // const doc = x.document
      // return part(doc)
      return Promise.resolve(JSON.parse(responseText) as T)
    } else {
      throw new Error('Expected result but has nothing in response')
    }
  }

  public async delete(url: string): Promise<void> {
    await this.request(HttpMethod.Delete, url)
  }

  public async post(url: string, arg?: any): Promise<Response> {
    return await this.request(HttpMethod.Post, url, arg)
  }

  /*
  public async post<T> (url: string, arg?: Partial<T>): Promise<void> {
    await this.request(HttpMethod.Post, url, arg)
  }
  */

  public async postAndParse<R>(url: string, arg?: any): Promise<R> {
    return await this.parse<R>(await this.request(HttpMethod.Post, url, arg))
  }

  /*
  public async postAndParse<T, R> (url: string, arg?: Partial<T>): Promise<R> {
    return await this.parse<R>(await this.request(HttpMethod.Post, url, arg))
  }
  */

  public async get<R>(url: string): Promise<R> {
    return await this.parse<R>(await this.request(HttpMethod.Get, url))
  }

  public async getText(url: string): Promise<string> {
    return (await this.request(HttpMethod.Get, url)).text()
  }
}

class FormDataBuilder {
  public readonly data = new FormData()

  public append(name: string, value: Blob, fileName?: string): FormDataBuilder {
    this.data.append(name, value, fileName)
    return this
  }

  public static create(): FormDataBuilder {
    return new FormDataBuilder()
  }
}

// const helper = new HelperImpl('http://' + location.hostname + '/mysvc')
const helper = new HelperImpl('https://' + location.hostname + ':443')

/*
./node_modules/.bin/cxsd file://MicroLearningSvc.expanded.xsd
*/

// let _profileFootprint = helper.get<x.ProfileFootprintInfoType>('/profile')

const api = {
  authorized: async function () {
    try {
      await helper.get<x.ProfileFootprintInfoType>('/profile')
      return true
    } catch {
      return false
    }
  },
  currentProfile: async function (): Promise<x.ProfileFootprintInfoType> {
    return await helper.get<x.ProfileFootprintInfoType>('/profile')
  },
  updateCurrentProfile: async function (): Promise<x.ProfileFootprintInfoType> {
    const _profileFootprint = helper.get<x.ProfileFootprintInfoType>('/profile')
    return await _profileFootprint
  },
  login: async function (login: string, pwd: string): Promise<void> {
    await helper.post('/profile?action=login', p<x.LoginSpecType>({ Login: login, Password: pwd }))
    await this.updateCurrentProfile()
  },
  logout: async function (): Promise<void> {
    document.cookie = ""
    router.push("/");
    // await helper.post('/profile?action=logout')
    // try {
    //   await this.updateCurrentProfile()
    //   // eslint-disable-next-line no-empty
    // } catch {}
  },
  register: async function (login: string, pwd: string, email: string): Promise<Response> {
    return helper.post(
      '/profile?action=register',
      p<x.RegisterSpecType>({ Login: login, Password: pwd, Email: email })
    )
  },
  setEmail: async function (oldEmail: string, newEmail: string, password: string): Promise<void> {
    await helper.post(
      '/profile?action=set-email',
      p<x.ChangeEmailSpecType>({ OldEmail: oldEmail, NewEmail: newEmail, Password: password })
    )
    await this.updateCurrentProfile()
  },
  setPassword: async function (oldEmail: string, newPassword: string): Promise<Response> {
    return helper.post(
      '/profile?action=set-password',
      p<x.ChangePasswordSpecType>({ Email: oldEmail, NewPassword: newPassword })
    )
  },
  requestActivation: async function (email: string): Promise<Response> {
    return helper.post('/profile?action=activate', p<x.RequestActivationSpecType>({ Email: email }))
  },
  requestAccessRestore: async function (login: string, email: string): Promise<Response> {
    return helper.post(
      '/profile?action=restore',
      p<x.ResetPasswordSpecType>({ Email: email, Login: login })
    )
  },
  performActivateAction: async function (key: string): Promise<void> {
    await helper.get('/profile?action=activate&key=' + key)
    await this.updateCurrentProfile()
  },
  performRestoreAccessAction: async function (key: string): Promise<void> {
    await helper.get('/profile?action=restore&key=' + key)
    await this.updateCurrentProfile()
  },
  //
  //
  getConferences: function (): Promise<x.ListType> {
    return helper.get<x.ListType>('/rooms')
  },
  getConferenceInfo: function(id: string): Promise<x.ConferenceInfoType> {
    return helper.get<x.ConferenceInfoType>('/rooms?id=' + id)
  },
  createConference: async function(conferenceInfo: x.ConferenceInfoType): Promise<x.ConferenceCreationResponse> {
    return helper.postAndParse<x.ConferenceCreationResponse>("/rooms", conferenceInfo)
  },
  getAllUsers: function(): Promise<x.ListType> {
    return helper.get<x.ListType>('/profile/all');
  }
  // getConferencesRange: async function (skip: number, take: number): Promise<x.ListType> {
  //   return helper.get<x.ListType>(`/conferences/?from=${skip}&count=${take}`)
  // },
  // getConferenceParticipants: async function (confId: number): Promise<x.ListType> {
  //   return helper.get<x.ListType>(`/conferences/${confId}/participants`)
  // }
  /*
  [OperationContract, WebInvoke(UriTemplate = "/profile?action=delete", Method = "POST")]
  void DeleteProfile();
  */

  // createImporter: async function (name: string, fileNamePattern: string, grammarText: string): Promise<x.ImporterInfoType> {
  //   const spec = p<x.ImporterInfoType>({
  //     Name: name,
  //     FileNamePattern: fileNamePattern,
  //     ParserGrammarText: grammarText
  //   })
  //   return helper.postAndParse<x.ImporterInfoType>('/importers?action=create', spec)
  // },
  // updateImporter: async function (id: number, name: string, fileNamePattern: string, grammarText: string): Promise<x.ImporterInfoType> {
  //   const spec = p<x.ImporterInfoType>({
  //     Id: id,
  //     Name: name,
  //     FileNamePattern: fileNamePattern,
  //     ParserGrammarText: grammarText
  //   })
  //   return helper.postAndParse<x.ImporterInfoType>(`/importers/${id}?action=update`, spec)
  // },
  // getImporterById: async function (id: number): Promise<x.ImporterInfoType> {
  //   return helper.get<x.ImporterInfoType>(`/importers/${id}`)
  // },
  // getImporters: async function (): Promise<x.ListType> {
  //   return helper.get<x.ListType>('/importers/')
  // },
  // getImportersRange: async function (skip: number, take: number): Promise<x.ListType> {
  //   return helper.get<x.ListType>(`/importers/?from=${skip}&count=${take}`)
  // },
  // deleteImporter: async function (id: number): Promise<void> {
  //   return helper.delete(`/importers/${id}`)
  // },

  // createAnalysis: async function (name: string, queryText: string, requiresExistence: boolean): Promise<x.ModelAnalysisInfoType> {
  //   const spec = p<x.ModelAnalysisInfoType>({
  //     Name: name,
  //     GraphQueryText: queryText,
  //     IsPositiveRequirement: requiresExistence
  //   })
  //   return helper.postAndParse<x.ModelAnalysisInfoType>('/analyzes?action=create', spec)
  // },
  // updateAnalysis: async function (id: number, name: string, queryText: string, requiresExistence: boolean): Promise<x.ModelAnalysisInfoType> {
  //   const spec = p<x.ModelAnalysisInfoType>({
  //     Id: id,
  //     Name: name,
  //     GraphQueryText: queryText,
  //     IsPositiveRequirement: requiresExistence
  //   })
  //   return helper.postAndParse<x.ModelAnalysisInfoType>(`/analyzes/${id}?action=update`, spec)
  // },
  // getAnalysisById: async function (id: number): Promise<x.ModelAnalysisInfoType> {
  //   return helper.get<x.ModelAnalysisInfoType>(`/analyzes/${id}`)
  // },
  // getAnalyzes: async function (): Promise<x.ListType> {
  //   return helper.get<x.ListType>('/analyzes/')
  // },
  // getAnalyzesRange: async function (skip: number, take: number): Promise<x.ListType> {
  //   return helper.get<x.ListType>(`/analyzes/?from=${skip}&count=${take}`)
  // },
  // deleteAnalysis: async function (id: number): Promise<void> {
  //   return helper.delete(`/analyzes/${id}`)
  // },

  // createPipeline: async function (name: string, importerIds: number[], analysisIds: number[]): Promise<x.AnalysisPipelineInfoType> {
  //   const spec = p<x.AnalysisPipelineInfoType>({
  //     Name: name,
  //     Importers: importerIds.map(x => p<x.AnalysisPipelineInfoTypeImporter>({ Id: x })),
  //     Analyzes: analysisIds.map(x => p<x.AnalysisPipelineInfoTypeAnalysis>({ Id: x }))
  //   })
  //   return helper.postAndParse<x.AnalysisPipelineInfoType>('/pipelines?action=create', spec)
  // },
  // updatePipeline: async function (id: number, name: string, importerIds: number[], analysisIds: number[]): Promise<x.AnalysisPipelineInfoType> {
  //   const spec = p<x.AnalysisPipelineInfoType>({
  //     Id: id,
  //     Name: name,
  //     Importers: importerIds.map(x => p<x.AnalysisPipelineInfoTypeImporter>({ Id: x })),
  //     Analyzes: analysisIds.map(x => p<x.AnalysisPipelineInfoTypeAnalysis>({ Id: x }))
  //   })
  //   return helper.postAndParse<x.AnalysisPipelineInfoType>(`/pipelines/${id}?action=update`, spec)
  // },
  // getPipelineById: async function (id: number): Promise<x.AnalysisPipelineInfoType> {
  //   return helper.get<x.AnalysisPipelineInfoType>(`/pipelines/${id}`)
  // },
  // getPipelines: async function (): Promise<x.ListType> {
  //   return helper.get<x.ListType>('/pipelines/')
  // },
  // getPipelinesRange: async function (skip: number, take: number): Promise<x.ListType> {
  //   return helper.get<x.ListType>(`/pipelines/?from=${skip}&count=${take}`)
  // },
  // deletePipeline: async function (id: number): Promise<void> {
  //   return helper.delete(`/pipelines/${id}`)
  // },

  // startJobByPipelineId: async function (id: number, sources: { name: string; content: string|Blob }[]): Promise<x.AnalysisJobInfoType> {
  //   const sourcesData = await sources.reduce((b, s) => b.append(s.name, s.content, s.name), FormDataBuilder.create())
  //   return helper.postAndParse<x.AnalysisJobInfoType>(`/pipelines/${id}?action=start`, sourcesData.data)
  // },
  // getJobById: async function (id: number): Promise<x.AnalysisJobInfoType> {
  //   return helper.get<x.AnalysisJobInfoType>(`/jobs/${id}`)
  // },
  // getJobLogById: async function (id: number): Promise<string> {
  //   return helper.getText(`/jobs/${id}/log`)
  // },
  // queryJobGraph: async function (id: number, queryText: string): Promise<x.AnalysisJobImmediateQueryResultInfoType> {
  //   const spec = p<x.AnalysisJobImmediateQueryCommandInfoType>({
  //     Text: queryText,
  //     IsGremlin: false
  //   })
  //   return helper.postAndParse<x.AnalysisJobImmediateQueryResultInfoType>(`/jobs/${id}?action=query&mode=command`, spec)
  // },
  // getJobs: async function (): Promise<x.ListType> {
  //   return helper.get<x.ListType>('/jobs/')
  // },
  // getJobsRange: async function (skip: number, take: number): Promise<x.ListType> {
  //   return helper.get<x.ListType>(`/jobs/?from=${skip}&count=${take}`)
  // }
  // // deleteJob: async function (id: number): Promise<void> {
  // //   return helper.delete(`/jobs/${id}`)
  // // },
}

export default api
