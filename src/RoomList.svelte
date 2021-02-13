<script lang="ts">
  import Meeting from './Meeting.svelte'
  import type { Server } from './server'
  import type {meeting} from './types'
  export let server: Server

  let meetings: meeting[] 
  $: meetings = $server?.meetings
</script>

  {#if meetings}
    {#each meetings.filter((m) => !m.isBreakout) as meeting}
      <Meeting {meeting}>
        {#each meetings.filter((b) =>
          [meeting.breakoutRooms?.breakout].flat().includes(b.meetingID)
        ) as breakout}
          <Meeting meeting={breakout} />
        {/each}
      </Meeting>
    {:else} Zur Zeit keine Räume geöffnet auf diesem Server. Mach doch mal wieder eine Videokonferenz!
    {/each}
  {/if}