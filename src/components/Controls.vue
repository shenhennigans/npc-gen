<script>
import axios from 'axios';
import _ from 'lodash';
import socialclasses from '../assets/socialclasses.json'
import ages from '../assets/ages.json'
import genders from '../assets/genders.json'
import familystatuses from '../assets/familystatuses.json'
import subraces from '../assets/subraces.json'
import occupations from '../assets/occupations.json'
import firstnames from '../assets/firstnames.json'
const dndAPIUrl = 'https://www.dnd5eapi.co/api/2014/';
export default {
  data() {
    return {
        socialClassesJson : socialclasses,
        agesJson : ages,
        gendersJson: genders,
        familyStatusesJson : familystatuses,
        subracesJson : subraces,
        occupationsJson : occupations,
        firstNamesJson: firstnames,
        dndClasses: null,
        dndRaces: null,
        generatedCharacter: {}
    }
  },
  methods: {
    rollCharacter() {
        let rollForOccupation = true;
        let rollForSocialClass = true;
        // Generate Class
        this.generatedCharacter.class = _.sample(this.dndClasses.data.results).name;
        // Generate Gender
        let selectedGender = this.weighted_random(this.gendersJson);
        this.generatedCharacter.gender = selectedGender.name;
        // Generate Name
        let availableNames = [];
        if(selectedGender.symbol != 'NB'){
            availableNames = this.firstNamesJson.filter(function(el){
                return el.Gender == selectedGender.symbol;
            });
        }
        else{
            availableNames = this.firstNamesJson;
        }
        this.generatedCharacter.name = _.sample(availableNames).Name;
        // Generate Family Status
        this.generatedCharacter.familystatus = this.weighted_random(this.familyStatusesJson).name;
        // Generate Race
        this.generatedCharacter.race = _.sample(this.dndRaces.data.results).name;
        // Generate Sub-Race
        this.generatedCharacter.subrace = null;
        let that = this;
        let availableSubRaces = this.subracesJson.filter(function (el){
            return el.parent_race ==  that.generatedCharacter.race;
        });
        if(availableSubRaces.length > 0){
            let selectedSubRace = _.sample(availableSubRaces);
            this.generatedCharacter.subrace = selectedSubRace.name;
            if(!selectedSubRace.occupation_needed){rollForOccupation = false;}
            if(!selectedSubRace.social_class_needed){rollForSocialClass = false;}
        }
        // Generate Age
        let selectedAge = this.weighted_random(this.agesJson);
        this.generatedCharacter.age = selectedAge.name
        if(!selectedAge.occupation_needed){rollForOccupation = false;}
        // Generate Social Class
        this.generatedCharacter.socialclass = null;
        if(rollForSocialClass){
            let selectedSocialClass = this.weighted_random(this.socialClassesJson)
            this.generatedCharacter.socialclass = selectedSocialClass.name;
            if(!selectedSocialClass.occupation_needed){rollForOccupation = false;}
        }
        // Generate Occupation
        this.generatedCharacter.occupation = null;
        if(rollForOccupation){
            let that = this;
            let availableOccupations = this.occupationsJson.filter(function (el){
                return el.social_class ==  that.generatedCharacter.socialclass;
            });
            if(availableOccupations.length > 0){
                this.generatedCharacter.occupation = this.weighted_random(availableOccupations).name
            }
        }

      
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
    }
  },
  mounted () {
    axios.get(dndAPIUrl+'classes/').then(response => {
        this.dndClasses = JSON.parse(JSON.stringify(response))});
    axios.get(dndAPIUrl+'races/').then(response => {
        this.dndRaces = JSON.parse(JSON.stringify(response))});
  }
};

</script>
<template>
    <div>
        <button type="button" class="btn btn-dark" @click="rollCharacter"> Roll a character </button>
    </div>
    
</template>
<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
