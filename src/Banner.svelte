<script lang="ts">
  import type { meeting } from "./types";
  import { settings } from "./store";
  export let json: object;
  export let meetings: meeting[];
</script>

<nav
  class="level is-mobile notification"
  class:is-info={json}
  class:is-warning={!json}
>
  {#if json && meetings.length}
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Räume</p>
        <p class="title">{meetings.length}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Teilnehmer</p>
        <p class="title">
          {meetings.reduce((sum, m) => sum + m.participantCount, 0)}
        </p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Audio</p>
        <p class="title">
          {meetings.reduce((sum, m) => sum + m.voiceParticipantCount, 0)}
        </p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Video</p>
        <p class="title">
          {meetings.reduce((sum, m) => sum + m.videoCount, 0)}
        </p>
      </div>
    </div>
  {:else if json && !meetings.length}
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Es sind momentan keine Räume offen. Mach doch mal wieder eine BBB-Konferenz!</p>
      </div>
    </div>
  {:else}
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Es besteht noch keine Verbindung zum Server</p>
      </div>
    </div>
  {/if}
  <div class="level-item has-text-centered">
    <div>
      <p class="heading">&nbsp;</p>
      <p class="title">
        <i
          class="material-icons is-clickable"
          style="font-size: 3rem"
          on:click={(_) => ($settings = true)}>settings</i
        >
      </p>
    </div>
  </div>
</nav>
