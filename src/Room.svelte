<script>
  export let m
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
						<li>{a.fullName} – {a.role==='MODERATOR'? 'Moderator':'Teilnehmer'} {a.isPresenter ? '🖥':''} {a.isListeningOnly ? '🔈':'🔇'} {a.hasJoinedVoice ? '🎙':''} {a.hasVideo ? '📹': ''} </li>
					{/each}
					{/if}
				</ul>