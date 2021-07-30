<script>
  import IPFS from 'ipfs';
	export let name;

  let ipfs;
  let info;

  onMount(async () => {
		ipfs = await IPFS.create();
	});
</script>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>

  {#if Object.keys(info) > 0}
    {#each Object.entries(info) as [name, value]}
      <p>{name}</p>
      <p>{value}</p>
    {/each}
	{:else}
		<!-- this block renders when photos.length === 0 -->
		<p>loading...</p>
  {/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
