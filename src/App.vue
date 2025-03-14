<script setup>
	import Controls from './components/Controls.vue'
	import CharacterOutput from './components/CharacterOutput.vue'
	import CharacterStory from './components/CharacterStory.vue'
	import HeaderComp from './components/Header.vue'
	import { reactive} from "vue";
	const state = reactive({ character: {}, showCharacter:false, showBackstory:false});
	function displayCharacter(char) {
				state.character = char;
				state.showCharacter = true;
				state.showBackstory = false;
	}
	function exportCharacter(char){
		state.character = char;
		if(state.character.backstory != null){
			state.character.backstory = sanitizeString(state.character.backstory);
		}
		let filename = `${state.character.name}-${state.character.race}-${state.character.class}-${Date.now()}`;
		let char_arr = [char];
		let output = convertToCSV(char_arr);
		//let output
		console.log(output);
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
	console.log(str);
    return str;
}
</script>

<template>
	
	
	<header>
		<v-icon name="gi-dice-twenty-faces-twenty" fill="#00BD7E" animation="float" speed="slow" scale="8"/>
		<div class="wrapper">
			<HeaderComp>
				<template #heading>DnD NPC Generator</template>
				<p>Make a rando</p>
			</HeaderComp>

			 <Controls @generated="displayCharacter"/>
		</div>
	</header>
	
	<main>
		<template v-if="state.showCharacter==true">
			<CharacterOutput :char="state.character" />
		</template>
		<template v-if="state.showCharacter==true">
			<CharacterStory :char="state.character" :showBackstory="state.showBackstory" @export="exportCharacter"/>
		</template>	
	</main>

	<footer class="blockquote-footer">
		by <cite>Alexandra & Maria Hennig</cite>
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
