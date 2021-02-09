<script lang="ts">
  import { selected, settings, server_list } from "./store";
  export let status: string | undefined;
</script>

<div class="modal" class:is-active={$settings}>
  <div class="modal-background" on:click={(_) => ($settings = false)} />
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">BigBlueButton-Monitor</p>
    </header>
    <section class="modal-card-body">
      <div class="field">
        <div class="control">
          <label class="label"
            >Name
            <input
              class="input"
              type="text"
              placeholder="Mein BBB-Server"
              bind:value={$selected.name}
            />
          </label>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <label class="label"
            >Server
            <input
              class="input"
              type="text"
              placeholder="Server z.B. https://bbb.schule.de"
              bind:value={$selected.host}
            />
          </label>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <label class="label"
            >Secret
            <input
              class="input"
              type="password"
              placeholder="Secret"
              bind:value={$selected.secret}
            />
          </label>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <label class="label"
            >Abfrageintervall in Sekunden
            <input
              class="input"
              type="number"
              placeholder="Interval"
              bind:value={$selected.interval}
            />
          </label>
        </div>
      </div>
      Es werden keine Daten zum Server übertragen, die Kommunikation findet
      ausschließlich zwischen Browser und BBB-Server statt. Aus diesem Grund
      müssen CORS-Header vom BBB-Server gesetzt werden (oder eine
      Browser-Erweiterung, z.B. CORS Everywhere). Weitere Informationen auf der
      Projektseite des <a href="https://github.com/hmt/bbb-static-monitor">BBB-Monitors</a>
      <br />Verbindungsdaten werden im localStorage des Browsers gespeichert.
    </section>
    <footer class="modal-card-foot">
      <button
        class="is-extended button is-primary"
        on:click={(_) => ($settings = false)}>Schließen</button
      >
      {#if status}
        <span class="ml-4 mr-4">
          Verbindung:
          <span
            class="tag"
            class:is-success={status === "ok"}
            class:is-danger={status.startsWith("Fehler")}
            class:is-warning={status === "laden"}
          >
            {status}
          </span>
        </span>
      {/if}
      <button class="is-extended button is-danger" on:click={server_list.remove}>Löschen</button>
    </footer>
  </div>
</div>
