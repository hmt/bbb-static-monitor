<script lang="ts">
  import "bulma/css/bulma.css";
  import parser from "fast-xml-parser";
  import sha1 from "jssha/dist/sha1";

  import { url, server, secret, interval, status } from "./store";
  import Meeting from "./Meeting.svelte";
  import type { meeting } from "./types";

  import Banner from "./Banner.svelte";
  import Settings from "./Settings.svelte";

  let meetings: Array<meeting>;
  let json: { response: { meetings: { meeting: meeting | Array<meeting> } } };

  function getHash(message: string) {
    const hash = new sha1("SHA-1", "TEXT");
    hash.update(`getMeetings${message}`);
    return hash.getHash("HEX");
  }

  async function get_stats() {
    if (!$url) {
      json = null;
      return;
    }
    try {
      $status = 'laden';
      const res = await fetch($url);
      if (!res.ok) throw "Fehler beim Laden der Seite";
			const xml = await res.text();
			$status = 'ok'
      json = parser.parse(xml);
    } catch (e) {
      console.log("Server nicht erreichbar: ", e);
			json = null;
			$status = `Fehler: ${e}`
    }
  }
  $: $url =
    $server && $secret
      ? `${$server}/bigbluebutton/api/getMeetings?checksum=${getHash($secret)}`
      : undefined;
  $: console.log(json);
  $: $url && get_stats();
  $: meetings = json && [json?.response.meetings?.meeting].flat();

  setInterval(get_stats, $interval * 1000);
</script>

<div class="container">
	<Settings/>
  <section class="section">
    {#if meetings}
      <Banner {json} {meetings} />
      {#each meetings.filter((m) => !m.isBreakout) as meeting}
        <Meeting {meeting}>
          {#each meetings.filter((b) =>
            [meeting.breakoutRooms?.breakout].flat().includes(b.meetingID)
          ) as breakout}
            <Meeting meeting={breakout} />
          {/each}
        </Meeting>
      {/each}
    {:else}
      <Banner />
    {/if}
  </section>
</div>
