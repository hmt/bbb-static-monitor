<script lang="ts">
  import "bulma/css/bulma.css";
  import parser from "fast-xml-parser";
  import sha1 from "jssha/dist/sha1";
  import Room from "./Room.svelte";

  let server: string;
  let secret: string;
  let json;

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
			json = null
			return;
		}
    try {
			const res = await fetch(url);
			if (!res.ok) throw 'Fehler beim Laden der Seite'
      const xml = await res.text();
      json = parser.parse(xml);
    } catch (e) {
			console.log("Server nicht erreichbar: ", e);
			json = null
    }
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
            placeholder="Server z.B. bbb.schule.de"
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
    </div>
  </div>
    {#if json?.response.returncode === "SUCCESS"}
      {#each json.response.meetings.meeting.filter((m) => !m.isBreakout) as m}
        <div class="box">
          <Room {m} />
          {#each json.response.meetings.meeting.filter((b) =>
            m.breakoutRooms?.breakout.includes(b.meetingID)
          ) as m}
            <div class="box">
              <Room {m} />
            </div>
          {/each}
        </div>
      {/each}
    {:else}
			Einen gültigen Server und das Shared Secret angeben und es geht los. Es werden keine Daten an dritte Server übertragen.
			<br>
			Zur Sicherheit kann man das Network Tab in den Developer Tools beobachten…
    {/if}
  </section>
</div>
