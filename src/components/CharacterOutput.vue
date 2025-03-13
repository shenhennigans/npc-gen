<script setup>
import PropertyItem from './PropertyItem.vue'
// import DocumentationIcon from './icons/IconDocumentation.vue'
// import ToolingIcon from './icons/IconTooling.vue'
// import EcosystemIcon from './icons/IconEcosystem.vue'
// import CommunityIcon from './icons/IconCommunity.vue'
// import SupportIcon from './icons/IconSupport.vue'

// import { GiDwarfHelmet } from "oh-vue-icons/icons"; // dwarf
// import { GiElfHelmet } from "oh-vue-icons/icons"; // elf
// import { GiBarbarian } from "oh-vue-icons/icons"; // barbarian

// import { GiCharm } from "oh-vue-icons/icons"; // family status
// import { GiStabbedNote } from "oh-vue-icons/icons"; // class
// import { GiBarbedSun } from "oh-vue-icons/icons"; // race
// import { GiOpenTreasureChest } from "oh-vue-icons/icons"; // social class
// import { GiPencilRuler } from "oh-vue-icons/icons"; // occupation
// import { GiCharacter } from "oh-vue-icons/icons"; // name age gender




const props = defineProps(['char'])
</script>


<template>
    
    <PropertyItem>
        <template #icon>
            <v-icon name="gi-character" fill="#00BD7E" animation="float" speed="slow" scale="2"/>
        </template>
        <template #heading>Name, Age & Gender </template>
        {{ char.name }}<br> {{ char.age }} {{ char.gender }}
    </PropertyItem>
    <PropertyItem>
        <template #icon>
            <v-icon name="gi-barbed-sun" fill="#00BD7E" animation="float" speed="slow" scale="2"/>
        </template>
        <template #heading>Race</template>
        {{ char.subrace }} {{ char.race }}
    
    </PropertyItem>
    <PropertyItem>
        <template #icon>
            <v-icon name="gi-stabbed-note" fill="#00BD7E" animation="float" speed="slow" scale="2"/>
        </template>
        <template #heading>Class</template>
        {{ char.class }}
    
    </PropertyItem>
    <PropertyItem v-if="char.occupation != null">
        <template #icon>
            <v-icon name="gi-pencil-ruler" fill="#00BD7E" animation="float" speed="slow" scale="2"/>
        </template>
        <template #heading>Occupation</template>
        {{ char.occupation }}
    
    </PropertyItem>
    
    <PropertyItem v-if="char.socialclass != null">
        <template #icon>
            <v-icon name="gi-open-treasure-chest" fill="#00BD7E" animation="float" speed="slow" scale="2"/>
        </template>
        <template #heading>Social Class</template>
        {{ char.socialclass }}
    
    </PropertyItem>
    <PropertyItem>
        <template #icon>
            <v-icon name="gi-charm" fill="#00BD7E" animation="float" speed="slow" scale="2"/>
        </template>
        <template #heading>Family Status</template>
        {{ char.familystatus }}
    
    </PropertyItem>
    
</template>