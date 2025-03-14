<script setup>
	import Controls from './components/Controls.vue'
	import CharacterOutput from './components/CharacterOutput.vue'
	import CharacterStory from './components/CharacterStory.vue'
	import HeaderComp from './components/Header.vue'
	import { reactive, ref} from "vue";
	//reactive components
	const state = reactive({ character: {}, showCharacter:false});
	const characterStoryRef = ref(null);
	// methods
	function displayCharacter(char) {
				state.character = char;
				state.showCharacter = true;
				characterStoryRef.value.hideDetails();
	}
	function exportCharacter(char){
		state.character = char;
		if(state.character.backstory != null){
			state.character.backstory = sanitizeString(state.character.backstory);
		}
		if(state.character.traits != null){
			state.character.traits = sanitizeString(state.character.traits);
		}
		let filename = `${state.character.name}-${state.character.race}-${state.character.alignment}-${Date.now()}`;
		let char_arr = [char];
		let output = convertToCSV(char_arr);
	
		var blob = new Blob([output], { type: 'text/csv;charset=utf-8;' });
		if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
		

	}
	function convertToCSV(arr) {
		const array = [Object.keys(arr[0])].concat(arr)

		return array.map(it => {
			return Object.values(it).toString();
		}).join('\n')
	}
	function sanitizeString(str) {
		if (str) {
			str = str.replace(/(\r\n|\n|\r|\s+|\t|&nbsp;)/gm,' ');
			str = str.replace(/"/g, '""');
			str = str.replace(/ +(?= )/g,'');
			if (str.match(/"|,/)) {
				str = '"' + str + '"';
			}
		} else {
			str = '';
		}
		//console.log(str);
		return str;
	}
</script>

<template>
	
	<header>
		<!-- Big Page Header Icon -->
		<v-icon name="gi-dice-twenty-faces-twenty" fill="#00BD7E" animation="float" speed="slow" scale="8"/>

		<div class="wrapper">
			<HeaderComp>
				<template #heading>DnD NPC Generator</template>
				<p>Quickly create NPCs for your stories and campaigns. Play and get inspired.</p>
			</HeaderComp>

			 <Controls @generated="displayCharacter"/>
		</div>
	</header>
	
	<main>
		<template v-if="state.showCharacter==true">
			<CharacterOutput :char="state.character" />
		</template>
		<template v-if="state.showCharacter==true">
			<CharacterStory :char="state.character"  ref="characterStoryRef" @export="exportCharacter"/>
		</template>	
	</main>

	<footer class="blockquote-footer">
		by <cite>Alexandra & Maria Hennig</cite>
	</footer>
</template>

<style scoped>
	header {
		line-height: 1.5;
		align-items: center;
	}


	@media (min-width: 1024px) {
		header {
			display: flex;
			place-items: center;
			padding-right: calc(var(--section-gap) / 2);
		}
		
		header .wrapper {
			display: flex;
			place-items: flex-start;
			flex-wrap: wrap;
			align-items: center;
		}
	}
</style>
