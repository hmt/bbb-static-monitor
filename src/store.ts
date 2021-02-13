import { Writable, writable } from "svelte/store";
import { Server } from './server'

let list: Server[]
let sel: Server

function backup (servers) {
  window.localStorage.setItem(`servers`, JSON.stringify(servers.map(s=>s.to_object()))); 
}
function restore () {
  const servers = window.localStorage.getItem("servers")
  if (servers) {
    return JSON.parse(servers).map(options => server_create(options))
  }
  // legacy migration
    const interval: number = parseInt(window.localStorage.getItem("interval")) || 15;
    const host: string = window.localStorage.getItem("server") || "";
    const secret: string = window.localStorage.getItem("secret") || "";
  const server = server_create({ name: "", host, secret, interval })
  return [server]
}
function server_create (options) {
  const store: Server = new Server(options)
  return store
}

function list_create() {
  const { subscribe, update, set }: Writable<Server[]> = writable(restore());
  return {
    subscribe, set, update,
    add: () => update(server => {
      const new_list = [...server, new Server()]
      selected.set(new_list[list.length])
      settings.set(true)
      return new_list
    }),
    remove: () => update(server => {
      if (server.length === 1) {
        server = [new Server()];
        selected.set(server[0])
        return
      }
      for (let i = 0; i < server.length; i++) {
        if (server[i] === sel) {
          server.splice(i, 1);
          selected.set(server[i] || server[i - 1]);
        }
      }
      settings.set(false)
      return server
    }),
  };
}
interface CustomStore<T> extends Writable<T> { add: () => void, remove: () => void }
export const server_list: CustomStore<Server[]> = list_create()

server_list.subscribe(value => {
  backup(value)
  list = value
})

export const selected: Writable<Server> = writable(list[0]);
selected.subscribe(value => {
  sel = value
  server_list.set(list)
})

export const settings: Writable<boolean> = writable(undefined)