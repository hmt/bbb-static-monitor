<script lang="ts">
  import type {Server} from './server'
  import {settings} from './store'
  export let server: Server;
  export let active: boolean
</script>

<div class="block" on:click >
  <div class="card">
    <header class="card-header" class:has-background-primary-light={active}>
      <p class="card-header-title">
        <span class="has-text-{$server.status}">●</span>&nbsp;{$server.name}
      </p>
        <div class="card-header-icon" aria-label="more options">
          <span class="icon">
            <i class="material-icons is-clickable has-text-grey" on:click={_=>$settings = true}>settings</i>
          </span>
        </div>
    </header>
    <div class="card-content">
      <div class="content">
        <nav class="level is-mobile">
          {#if $server.meetings}
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Räume</p>
                <p class="title">{$server.meetings.length}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Teilnehmer</p>
                <p class="title">
                  {$server.teilnehmer}
                </p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Audio</p>
                <p class="title">
                  {$server.audio}
                </p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Video</p>
                <p class="title">
                  {$server.video}
                </p>
              </div>
            </div>
          {:else if $server.status === 'success' && !$server.meetings}
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Es sind momentan keine Räume offen</p>
              </div>
            </div>
          {:else}
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Keine Verbindung zum Server</p>
              </div>
            </div>
          {/if}
        </nav>
      </div>
    </div>
  </div>
</div>
