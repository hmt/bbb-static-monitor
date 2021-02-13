<script lang="ts">
  import "bulma/css/bulma.css";
  import Widget from "./Widget.svelte";
  import RoomList from "./RoomList.svelte";
  import Settings from './Settings.svelte'
  import { server_list, selected } from "./store";
</script>

<div class="container">
  <div class="section">
    <div class="columns">
      <div class="column is-one-third">
        {#each $server_list as server}
          <Widget {server} on:click={_=>$selected = server} active={$selected === server}></Widget>
        {/each}
        <button class="button is-fullwidth" on:click={server_list.add}>
          <i class="material-icons">add</i>
        </button>
      </div>
      <div class="column"><RoomList server={$selected} /></div>
    </div>
  </div>
</div>
<Settings />