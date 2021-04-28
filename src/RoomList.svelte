<script lang="ts">
  import Meeting from "./Meeting.svelte";
  import type { Server } from "./server";
  import type { meeting } from "./types";
  import { chart } from "svelte-apexcharts";
  export let server: Server;

  let meetings: meeting[];
  $: meetings = $server?.meetings;
</script>

{#if $server.options}
  <div use:chart={$server.options} />
{:else}
  <div class="notification is-primary">
    Richte den BBB-Server über das Zahnrad ein, damit hier die Raumübersicht erscheint. Weitere Server lassen sich über das + hinzufügen.
  </div>
{/if}
{#if meetings}
  {#each meetings.filter((m) => !m.isBreakout) as meeting}
    <Meeting {meeting}>
      {#each meetings.filter((b) =>
        [meeting.breakoutRooms?.breakout].flat().includes(b.meetingID)
      ) as breakout}
        <Meeting meeting={breakout} />
      {/each}
    </Meeting>
  {:else}
    <div class="notification is-info">
      Zur Zeit keine Räume geöffnet auf diesem Server. Mach doch mal wieder eine
      Videokonferenz!
    </div>
  {/each}
{/if}
