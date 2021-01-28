<script lang="ts">
  import "bulma/css/bulma.css";
  import parser from "fast-xml-parser";
  import sha1 from "jssha/dist/sha1";
  import Room from "./Room.svelte";

  let server: string;
  let secret: string;
  let json;
  let laden: boolean;

  $: url =
    server && secret
      ? `${server}/bigbluebutton/api/getMeetings?checksum=${getHash(secret)}`
      : undefined;
  $: url && get_stats();
  $: console.log(json);

  function getHash(message) {
    const hash = new sha1("SHA-1", "TEXT");
    hash.update(`getMeetings${message}`);
    return hash.getHash("HEX");
  }

  async function get_stats() {
    if (!url) {
      json = null;
      return;
    }
    try {
      laden = true;
      const res = await fetch(url);
      if (!res.ok) throw "Fehler beim Laden der Seite";
      const xml = await res.text();
      json = parser.parse(xml);
    } catch (e) {
      console.log("Server nicht erreichbar: ", e);
      json = null;
    }
    laden = false;
  }
  setInterval(get_stats, 5000);
</script>

<div class="container">
  <section class="section">
    <div class="field is-horizontal">
      <div class="field-body">
        <div class="field">
          <p class="control is-expanded">
            <input
              class="input"
              type="text"
              placeholder="Server z.B. https://bbb.schule.de"
              bind:value={server}
            />
          </p>
        </div>
        <div class="field">
          <p class="control is-expanded">
            <input
              class="input"
              type="email"
              placeholder="Secret"
              bind:value={secret}
            />
          </p>
        </div>
        <button
          class="button"
          class:is-success={json?.response.returncode === "SUCCESS"}
          class:is-warning={!json}
          class:is-danger={json?.response.returncode !== "SUCCESS"}
          class:is-loading={laden}
        />
      </div>
    </div>
    {#if json?.response.returncode === "SUCCESS" && json?.response.messageKey !== "noMeetings"}
      {#each [json.response.meetings?.meeting]
        .flat()
        .filter((m) => !m.isBreakout) as m}
        <div class="box">
          <Room {m} />
          {#each [json.response.meetings?.meeting]
            .flat()
            .filter((b) =>
              m.breakoutRooms?.breakout.includes(b.meetingID)
            ) as m}
            <div class="box">
              <Room {m} />
            </div>
          {/each}
        </div>
      {:else}
        Keine offenen Räume gefunden
      {/each}
    {:else if json?.response.returncode === "SUCCESS" && json?.response.messageKey === "noMeetings"}
      Zur Zeit sind keine Räume aktiv. Starte doch eine Konferenz …
    {:else}
      Einen gültigen Server und das Shared Secret angeben und es geht los. Es
      werden keine Daten an dritte Server übertragen.
      <br />
      Zur Sicherheit kann man das Network Tab in den Developer Tools beobachten…
    {/if}
  </section>
</div>
