<script setup>
import PropertyItem from './PropertyItem.vue'
const props = defineProps(['char'])
</script>

<template>
    <div class="wrapper">
    <PropertyItem>
        <template #icon>
            <v-icon name="gi-character" fill="#00BD7E" animation="float" speed="slow" scale="2"/>
        </template>
        <template #heading>Name, Age & Gender </template>
        {{ char.name }}<br> {{ char.age }} {{ char.gender }}
    </PropertyItem>

    <PropertyItem>
        <template #icon>
            <v-icon name="gi-dna2" fill="#00BD7E" animation="float" speed="slow" scale="2"/>
        </template>
        <template #heading>Race</template>
        <template v-if="char.plain_touched_type != null">
            {{ char.plain_touched_type}} (<span v-if="char.subrace != null">{{ char.subrace }} </span><span v-if="char.subrace != null && char.race != 'Other'">&nbsp;</span><span v-if="char.race != 'Other'">{{ char.race }}</span>)
        </template>
        <template v-if="char.plain_touched_type == null">
            {{ char.subrace }} <span v-if="char.race != 'Other'">{{ char.race }}</span>
        </template>
        
    </PropertyItem>

    <PropertyItem>
        <template #icon>
            <v-icon name="gi-mesh-network" fill="#00BD7E" animation="float" speed="slow" scale="2"/>
        </template>
        <template #heading>Alignment & Traits </template>
        {{ char.alignment }} <br>
        {{ char.traits }}
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
            <v-icon name="gi-laurels" fill="#00BD7E" animation="float" speed="slow" scale="2"/>
        </template>
        <template #heading>Social Class</template>
        {{ char.socialclass }}
    </PropertyItem>

    <PropertyItem v-if="char.familystatus != null">
        <template #icon>
            <v-icon name="gi-charm" fill="#00BD7E" animation="float" speed="slow" scale="2"/>
        </template>
        <template #heading>Family Status</template>
        {{ char.familystatus }}
    </PropertyItem>
</div>
    
</template>

<style scoped>
    .wrapper{
        margin-bottom: 2rem;
    }
</style>