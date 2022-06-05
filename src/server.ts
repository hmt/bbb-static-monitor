import { XMLParser } from "fast-xml-parser";
import sha1 from "jssha/dist/sha1"
import type { meeting } from './types'
import type {ApexOptions} from 'apexcharts'

export class Server {
  host: string
  secret: string
  name: string
  interval: number

  url: string
  status: string
  interval_id: NodeJS.Timer
  meetings: meeting[]
  audio: number
  video: number
  teilnehmer: number
  m: [number, number][]
  t: [number, number][]
  a: [number, number][]
  v: [number, number][]
  max_m: number
  max_t: number
  max_a: number
  max_v: number

  subs: Array<any> = []

  constructor (options = {name: 'Neuer Server', host: '', secret: '', interval: 15}) {
    this.name = options.name
    this.host = options.host
    this.secret = options.secret
    this.interval = options.interval
    this.status = "danger"
    this.m = []
    this.t = []
    this.a = []
    this.v = []
    this.max_m = 0
    this.max_t = 0
    this.max_a = 0
    this.max_v = 0

    try {
      this.update()
    } catch(e) {console.log('Neuer Server angelegt')}
  }
  get options (): ApexOptions {
    return {
      chart: {
        height: 200,
        width: "100%",
        type: "line",
      },
      series: [
        { name: `Räume (max. ${this.max_m})`, data: this.m },
        { name: `Teilnehmer (max. ${this.max_t})`, data: this.t },
        { name: `Audio (max. ${this.max_a})`, data: this.a },
        { name: `Video (max. ${this.max_v})`, data: this.v },
      ],
      stroke: {
        width: 1,
        curve: "straight",
      },
      xaxis: {
        labels: {datetimeUTC: false},
        type: "datetime",
      },
    }
  }
  update (): void {
    if (this.interval_id) clearInterval(this.interval_id)
    try {
    this.url = this.set_url()
    this.get_stats()
    this.interval_id = setInterval(this.get_stats, this.interval * 1000);
    } catch(e) {
      console.log(e)
    }
  }
  stop_updating (): void {
    clearInterval(this.interval_id)
  }
  to_object () {
    return {name: this.name, host: this.host, secret: this.secret, interval: this.interval}
  }
  reset = () => {
    this.url = null
    this.meetings = null
    this.status = 'danger'
  }
  set_url () {
    if (this.host && this.secret)
      return `${this.host}/bigbluebutton/api/getMeetings?checksum=${this.get_hash(this.secret)}`
    else throw 'Kein Host angegeben'
  }
  get_hash(message: string) {
    const hash = new sha1("SHA-1", "TEXT");
    hash.update(`getMeetings${message}`);
    return hash.getHash("HEX");
  }
  get_stats = async (): Promise<void> => {
    try {
      if (this.status === 'success') this.status = "warning";
      const res = await fetch(this.url);
      if (!res.ok) throw `Fehler beim Laden der Seite: ${res.status}`;
      const xml = await res.text();
      this.handle_data(xml)
    } catch (e) {
      console.log("Server nicht erreichbar: ", e);
      this.reset()
    }
    this.notify_subs()
  }
  handle_data (xml) {
    const parser = new XMLParser();
    const json = parser.parse(xml);
    if (json.response.returncode === "SUCCESS") {
      this.status = "success"
      this.meetings = [json.response.meetings?.meeting].flat().filter(Boolean);
      this.teilnehmer = this.meetings.reduce((sum, m) => sum + m.participantCount, 0)
      this.audio = this.meetings.reduce((sum, m) => sum + m.voiceParticipantCount, 0)
      this.video = this.meetings.reduce((sum, m) => sum + m.videoCount, 0)
      this.max_m = Math.max(this.max_m, this.meetings.length)
      this.max_t = Math.max(this.max_t, this.teilnehmer)
      this.max_a = Math.max(this.max_a, this.audio)
      this.max_v = Math.max(this.max_v, this.video)
      const t = Date.now();
      this.m.push([t, this.meetings.length])
      this.t.push([t, this.teilnehmer])
      this.a.push([t, this.audio])
      this.v.push([t, this.video])
    } else throw "Fehler beim Parsen des XML (keine SUCCESS-Meldung)"
  }
	subscribe (handler) {
    this.subs = [...this.subs, handler]
    handler(this)
    return () => this.subs = this.subs.filter(sub => sub !== handler)
  }
  notify_subs () {
    this.subs.forEach(sub => sub(this))
  }
}