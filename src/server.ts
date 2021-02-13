import parser from "fast-xml-parser";
import sha1 from "jssha/dist/sha1"
import type { meeting } from './types'

export class Server {
  host: string
  secret: string
  name: string
  interval: number

  url: string
  status: string
  interval_id: number
  meetings: meeting[]
  audio: number
  video: number
  teilnehmer: number

  subs: Array<any> = []

  constructor (options = {name: 'Neuer Server', host: '', secret: '', interval: 15}) {
    this.name = options.name
    this.host = options.host
    this.secret = options.secret
    this.interval = options.interval
    this.status = "danger"
    try {
      this.update()
    } catch(e) {console.log('Neuer Server angelegt')}
  }
  update (): void {
    if (this.interval_id) clearInterval(this.interval_id)
    try {
      this.url = this.set_url()
      this.get_stats()
      this.interval_id = setInterval(this.get_stats, this.interval * 1000);
    } catch(e) {
      this.reset()
    }
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
    else throw Error
  }
  get_hash(message: string) {
    const hash = new sha1("SHA-1", "TEXT");
    hash.update(`getMeetings${message}`);
    return hash.getHash("HEX");
  }
  get_stats = async (): Promise<void> => {
    try {
      this.status = "warning";
      const res = await fetch(this.url);
      if (!res.ok) throw "Fehler beim Laden der Seite";
      const xml = await res.text();
      this.handle_data(xml)
    } catch (e) {
      console.log("Server nicht erreichbar: ", e);
      this.reset()
    }
    this.notify_subs()
  }
  handle_data (xml) {
    const json = parser.parse(xml);
    if (json.response.returncode === "SUCCESS") {
      this.status = "success"
      this.meetings = [json.response.meetings?.meeting].flat().filter(Boolean);
      this.teilnehmer = this.meetings.reduce((sum, m) => sum + m.participantCount, 0)
      this.audio = this.meetings.reduce((sum, m) => sum + m.voiceParticipantCount, 0)
      this.video = this.meetings.reduce((sum, m) => sum + m.videoCount, 0)
    } else { this.status = "danger"}
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