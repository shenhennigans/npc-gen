<script>
import axios from 'axios';
import Settings from './Settings.vue'
import _ from 'lodash';
import socialclasses from '../assets/data/socialclasses.json'
import ages from '../assets/data/ages.json'
import genders from '../assets/data/genders.json'
import familystatuses from '../assets/data/familystatuses.json'
import subraces from '../assets/data/subraces.json'
import occupations from '../assets/data/occupations.json'
import firstnames from '../assets/data/firstnames.json'
import races from '../assets/data/races.json'
import classes from '../assets/data/classes.json'
import alignments from '../assets/data/alignments.json'
import traits from '../assets/data/traits.json'
const dndAPIUrl = 'https://www.dnd5eapi.co/api/2014/';
export default {
    components:{
        Settings
    },
    data() {
        return {
            showSettings: false,
            database : {
                "socialClasses" : socialclasses,
                "ages" : ages,
                "genders" : genders,
                "familyStatuses" : familystatuses,
                "subraces" : subraces,
                "races" : races,
                "firstNames" : firstnames,
                "classes" : classes,
                "alignments" : alignments,
                "traits" : traits,
                "occupations" : occupations,
                
            },
            generatedCharacter: {}
        }
    },
    methods: {
        rollCharacter() {
            let rollForOccupation = true;
            let rollForSocialClass = true;
            // Generate Class
            // this.generatedCharacter.class = _.sample(this.database.classes).name;
            // Generate Alignment
            this.generatedCharacter.alignment = _.sample(this.database.alignments).name;
            // Generate Gender
            let selectedGender = this.weighted_random(this.database.genders);
            this.generatedCharacter.gender = selectedGender.name;
            // Generate Name
            let availableNames = [];
            if(selectedGender.symbol != 'NB'){
                availableNames = this.database.firstNames.filter(function(el){
                    return el.Gender == selectedGender.symbol;
                });
            }
            else{
                availableNames = this.database.firstNames;
            }
            this.generatedCharacter.name = _.sample(availableNames).Name;
            
            // Generate Race
            this.generatedCharacter.race = _.sample(this.database.races).name;
            // Generate Sub-Race
            this.generatedCharacter.subrace = null;
            let that = this;
            let availableSubRaces = this.database.subraces.filter(function (el){
                return el.parent_race ==  that.generatedCharacter.race;
            });
            if(availableSubRaces.length > 0){
                let selectedSubRace = _.sample(availableSubRaces);
                this.generatedCharacter.subrace = selectedSubRace.name;
                if(!selectedSubRace.occupation_needed){rollForOccupation = false;}
                if(!selectedSubRace.social_class_needed){rollForSocialClass = false;}
            }
            // Generate Age
            let selectedAge = this.weighted_random(this.database.ages);
            this.generatedCharacter.age = selectedAge.name
            if(!selectedAge.occupation_needed){rollForOccupation = false;}
            // Generate Family Status
            this.generatedCharacter.familystatus = selectedAge.relationship_status_allowed ? this.weighted_random(this.database.familyStatuses).name : 'Single';
            // Generate Social Class
            this.generatedCharacter.socialclass = null;
            if(rollForSocialClass){
                let selectedSocialClass = this.weighted_random(this.database.socialClasses)
                this.generatedCharacter.socialclass = selectedSocialClass.name;
                if(!selectedSocialClass.occupation_needed){rollForOccupation = false;}
            }
            // Generate Occupation
            this.generatedCharacter.occupation = null;
            if(rollForOccupation){
                let that = this;
                let availableOccupations = this.database.occupations.filter(function (el){
                    return el.social_class ==  that.generatedCharacter.socialclass;
                });
                if(availableOccupations.length > 0){
                    this.generatedCharacter.occupation = this.weighted_random(availableOccupations).name
                }
            }
            // Generate Traits
            let selectedTraits = '';
            for(let i=0; i<3; i++){
                selectedTraits += _.sample(this.database.traits.personality)+", "
            }
            selectedTraits = selectedTraits.substring(0, selectedTraits.length - 2);
            this.generatedCharacter.traits = selectedTraits;
            
            
            this.$emit('generated', this.generatedCharacter)
        },
        weighted_random(objArray) {
            let weights = [];
            objArray.forEach(obj => {
                weights.push(obj.weight)
            });
            let i;
            for (i = 1; i < weights.length; i++)
            weights[i] += weights[i - 1];
            
            var random = Math.random() * weights[weights.length - 1];
            
            for (i = 0; i < weights.length; i++)
            if (weights[i] > random)
            break;
            
            return objArray[i];
        },
        enterSettings(){
            this.showSettings = true;
        },
        updateDatabase(db){
            this.database = db;
            this.showSettings = false;
        }
    }
    //   mounted () {
    //     axios.get(dndAPIUrl+'classes/').then(response => {
    //         this.dndClasses = JSON.parse(JSON.stringify(response))});
    //     axios.get(dndAPIUrl+'races/').then(response => {
    //         this.dndRaces = JSON.parse(JSON.stringify(response))});
    //   }
};

</script>
<template>
    <div class="wrapper">
        <button type="button" class="btn btn-dark" @click="rollCharacter"> Roll a character </button>
        <!-- <v-icon name="gi-settings-knobs" fill="#00BD7E" scale="1.5" @click="enterSettings"/> -->
    </div>
    <!-- <template v-if="showSettings==true">
        <Settings :database="database" @settingsupdate="updateDatabase" />  
    </template> -->
</template>
<style scoped>

    .wrapper{
        margin-bottom: 1rem;
    }

    button {
        margin-right: 0.5rem;
    }
    h1 {
        font-weight: 500;
        font-size: 2.6rem;
        position: relative;
        top: -10px;
    }

    h3 {
        font-size: 1.2rem;
    }

</style>
