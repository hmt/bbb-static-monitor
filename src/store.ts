import { Writable, writable } from "svelte/store";
import type { server, CustomStore } from "./types";

let sel: server, list: server[]

function server_create() {
  const { subscribe, update, set }: Writable<server[]> = writable(JSON.parse(window.localStorage.getItem("servers")) || [{ name: "", host: "", secret: "", interval: 15 }]);

  return {
    subscribe, set, update,
    add: () => update(server => {
      const new_list = [...server,
      {
        name: "",
        host: "",
        secret: "",
        interval: 15
      }
      ]
      selected.set(new_list[list.length])
      settings.set(true)
      return new_list
    }),
    remove: () => update(server => {
      if (server.length === 1) {
        server = [{ name: "", host: "", secret: "", interval: 15 }];
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

export const server_list: CustomStore<server[]> = server_create()

server_list.subscribe(value => {
  window.localStorage.setItem(`servers`, JSON.stringify(value));
  list = value
})

export const selected: Writable<server> = writable(list[JSON.parse(window.localStorage.getItem("selected")) || 0]);
selected.subscribe(value => {
  window.localStorage.setItem(`selected`, JSON.stringify(list.findIndex(s=>s === value)));
  sel = value
  server_list.set(list)
})

export const settings: Writable<boolean> = writable(undefined)