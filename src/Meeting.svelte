<script lang="ts">
  import type { meeting } from './types'
  export let meeting: meeting;
</script>

<div class="box" class:has-background-primary-light={!meeting.isBreakout} class:has-background-warning-light={meeting.isBreakout}>
  <span class="is-size-4">
    {#if meeting.recording}
      <i class="material-icons has-text-danger" alt="Aufnahme">stop</i>
    {/if}
    {meeting.meetingName}
  </span>
  <span style="float:right">
    <span>{meeting.participantCount} Teilnehmer</span>
    <span>{meeting.voiceParticipantCount} Audio</span>
    <span>{meeting.videoCount} Video</span>
  </span>
  <ul>
    {#if meeting.attendees}
      {#each [meeting.attendees.attendee].flat() as a}
        <li>
          {a.fullName} – {@html a.role === "MODERATOR"
            ? "<b>Moderator</b>"
            : "Teilnehmer"}
          {#if a.isPresenter}
            <i class="material-icons has-text-link">slideshow</i>
          {/if}
          {#if a.isListeningOnly}
            <i class="material-icons">headset</i>
          {:else}
            <i
              class="material-icons"
              class:has-text-success={a.hasJoinedVoice}
              class:has-text-danger={!a.hasJoinedVoice}
              >{a.hasJoinedVoice ? "mic" : "mic_off"}</i
            >
          {/if}
          <i
            class="material-icons"
            class:has-text-success={a.hasVideo}
            class:has-text-danger={!a.hasVideo}
            >{a.hasVideo ? "videocam" : "videocam_off"}</i
          >
        </li>
      {/each}
    {:else}
      In diesem Raum sind keine Teilnehmer
    {/if}
  </ul>
  <slot />
</div>
