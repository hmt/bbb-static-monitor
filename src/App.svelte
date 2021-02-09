<script lang="ts">
  import "bulma/css/bulma.css";
  import Server from "./Server.svelte";
  import { server_list, selected } from "./store";
</script>

<div class="container">
  <div class="tabs">
    <ul>
      {#each $server_list as s}
        <li class:is-active={$selected === s}>
          <!-- svelte-ignore a11y-missing-attribute -->
          <a on:click={(_) => ($selected = s)}
            >{s.name || "Namenloser Server"}</a
          >
        </li>
      {/each}
      <li>
        <!-- svelte-ignore a11y-missing-attribute -->
        <a>
          <i
            class="material-icons is-clickable"
            on:click={server_list.add}>add</i
          >
        </a>
      </li>
    </ul>
  </div>
  <Server />
</div>
