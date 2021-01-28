<script>
  export let m;
</script>

<span class="is-size-4">
  {m.meetingName}
</span>
<span style="float:right">
  <span>{m.participantCount} Teilnehmer</span>
  <span>{m.voiceParticipantCount} Audio</span>
  <span>{m.videoCount} Video</span>
</span>
<ul>
  {#if m.attendees}
    {#each [m.attendees.attendee].flat() as a}
      <li>
				{a.fullName} – {@html a.role === "MODERATOR" ? "<b>Moderator</b>" : "Teilnehmer"}
				{#if a.isPresenter}
					<i class="material-icons has-text-link">slideshow</i>
				{/if}
				{#if a.isListeningOnly}
				<i class="material-icons">headset</i>
				{:else}
				<i class="material-icons" class:has-text-success={a.hasJoinedVoice} class:has-text-danger={!a.hasJoinedVoice}>{a.hasJoinedVoice ? "mic" : "mic_off"}</i>
				{/if}
        <i class="material-icons" class:has-text-success={a.hasVideo} class:has-text-danger={!a.hasVideo}>{a.hasVideo ? "videocam" : "videocam_off"}</i>
      </li>
    {/each}
  {/if}
</ul>
