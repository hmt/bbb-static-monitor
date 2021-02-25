<script lang="ts">
  import type { metadata } from './types'
  export let meta: metadata;
  let active: boolean = false;
  const allowed = ['bbb-context-label', 'bbb-origin']
  const pass = (k: [string, string]) => allowed.find(a=>a===k[0])

  function clickOutside(node: HTMLElement, params: {enabled: boolean, cb: Function }) {
  const { enabled: initialEnabled, cb } = params
    const handleOutsideClick = ({ target }: MouseEvent) => {
      if (!node.contains(target as Node)) cb();
    };
    function update({enabled}: {enabled: boolean}) {
      if (enabled) {
        window.addEventListener('click', handleOutsideClick);
      } else {
        window.removeEventListener('click', handleOutsideClick);
      }
    }
    update({ enabled: initialEnabled });
    return {
      update,
      destroy() {
        window.removeEventListener( 'click', handleOutsideClick );
      }
    };
}
</script>
<div class="dropdown is-right" class:is-active={active} on:click={_=>active = !active} use:clickOutside={{ enabled: active, cb: () => active = false }}>
  <div class="dropdown-trigger">
    <span><i class="material-icons is-clickable">more_vert</i></span>
  </div>
  <div class="dropdown-menu" role="menu">
    <div class="dropdown-content">
      <!-- <div class="dropdown-item">
        <p>Raum schließen</p>
      </div>
      <hr class="dropdown-divider"> -->
      <div class="dropdown-item">
        <ul>
          {#each Object.entries(meta).filter(pass) as [k,v]}
          <li><b>{k}: </b>{v}</li>
          {:else} keine Moodle-Einträge
          {/each}
        </ul>
      </div>
    </div>
  </div>
</div>
