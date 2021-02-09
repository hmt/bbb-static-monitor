<script lang="ts">
  import { selected } from "./store";
  import parser from "fast-xml-parser";
  import sha1 from "jssha/dist/sha1";
  import Meeting from "./Meeting.svelte";
  import type { meeting, server } from "./types";
  import Banner from "./Banner.svelte";

  export let server: server
  export let status: string | undefined = undefined;
  let meetings: Array<meeting>;
  let json: { response: { meetings: { meeting: meeting | Array<meeting> } } };

  function getHash(message: string) {
    const hash = new sha1("SHA-1", "TEXT");
    hash.update(`getMeetings${message}`);
    return hash.getHash("HEX");
  }
  async function get_stats(): Promise<void> {
    if (!url) {
      json = null;
      status = undefined;
      return;
    }
    try {
      status = "laden";
      const res = await fetch(url);
      if (!res.ok) throw "Fehler beim Laden der Seite";
      const xml = await res.text();
      status = "ok";
      json = parser.parse(xml);
    } catch (e) {
      console.log("Server nicht erreichbar: ", e);
      json = null;
      status = `Fehler: ${e}`;
    }
  }

  $: url =
    server.host && server.secret
      ? `${server.host}/bigbluebutton/api/getMeetings?checksum=${getHash(
          server.secret
        )}`
      : undefined;
  $: server === $selected && get_stats();
  $: meetings =
    json && [json?.response.meetings?.meeting].flat().filter(Boolean);

  get_stats()
  setInterval(get_stats, server.interval * 1000);
</script>
{#if server === $selected}
  {#if meetings}
    <Banner {json} {meetings} {status} />
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
    <Banner {status} />
  {/if}
{/if}
