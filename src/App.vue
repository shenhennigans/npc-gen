<script setup>
	import Controls from './components/Controls.vue'
	import CharacterOutput from './components/CharacterOutput.vue'
	import CharacterStory from './components/CharacterStory.vue'
	import { reactive} from "vue";
	const state = reactive({ character: {}, showCharacter:false});
	function displayCharacter(char) {
				state.character = char;
				state.showCharacter = true;
	}
</script>


<template>
	<header>
		<v-icon name="gi-deadly-strike" fill="#00BD7E" animation="float" speed="slow" scale="8"/>
		<div class="wrapper">
			 <Controls @generated="displayCharacter"/>
		</div>
	</header>
	
	<main>
		<template v-if="state.showCharacter==true">
			<CharacterOutput :char="state.character" />
		</template>
	</main>
	<footer>
		<!-- <template v-if="state.showCharacter==true">
			<CharacterStory :char="state.character" />
		</template>	 -->
	</footer>
</template>

<style scoped>
	header {
		line-height: 1.5;
	}

	.logo {
		display: block;
		margin: 0 auto 2rem;
	}

	@media (min-width: 1024px) {
		header {
			display: flex;
			place-items: center;
			padding-right: calc(var(--section-gap) / 2);
		}
		
		.logo {
			margin: 0 2rem 0 0;
		}
		
		header .wrapper {
			display: flex;
			place-items: flex-start;
			flex-wrap: wrap;
		}
	}
</style>
