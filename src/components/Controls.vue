<script>
import axios from 'axios';
import 'dotenv'
import Settings from './Settings.vue'
import _ from 'lodash';
import firstnames from '../assets/data/firstnames.json'
import alignments from '../assets/data/alignments.json'
import traits from '../assets/data/traits.json'
const dndAPIUrl = 'https://www.dnd5eapi.co/api/2014/';
export default {
    props: {
        world: {}
    },
    components:{
        Settings
    },
    data() {
        return {
            showSettings: false,
            database : {
                "firstNames" : firstnames,
                "alignments" : alignments,
                "traits" : traits
                
            },
            generatedCharacter: {}
        }
    },
    methods: {
        rollCharacter() {
            this.generatedCharacter = {};
            let rollForOccupation = true;
            let rollForSocialClass = true;
            // Generate Alignment
            this.generatedCharacter.alignment = _.sample(this.database.alignments).name;
            // Generate Gender
            let selectedGender = this.weighted_random(this.world.data.genders);
            this.generatedCharacter.gender = selectedGender.name;
            // Generate Name
            // random.json?key=ma621614110&gender=f&usage=celm
            let ndb_url = import.meta.env.VITE_NAMESDB_BASE_URL
            let ndb_apikey = import.meta.env.VITE_NAMESDB_API_KEY
            let gender_condition = selectedGender.symbol != 'NB' ? selectedGender.symbol : null;
            let request_url = ndb_url+'random.json?key='+ndb_apikey;
            if(gender_condition != null){
                request_url += '&gender='+ gender_condition;
            }
            request_url += '&number=1&randomsurname=yes'
            axios.get(ndb_url+'random.json?key='+ndb_apikey+'')
            .then(response => {
                let namesObj = JSON.parse(JSON.stringify(response));
                console.log(response.data)
                let firstName = response.data.names[0]
                let lastName = response.data.names[1]
                this.generatedCharacter.name = firstName + ' '+ lastName;
            });
           
            // let availableNames = [];
            // if(selectedGender.symbol != 'NB'){
            //     availableNames = this.database.firstNames.filter(function(el){
            //         return el.Gender == selectedGender.symbol;
            //     });
            // }
            // else{
            //     availableNames = this.database.firstNames;
            // }
            //this.generatedCharacter.name = _.sample(availableNames).Name;
            
            // Generate Race
            //this.generatedCharacter.race = _.sample(this.database.races).name;
            let selectedRace = this.weighted_random(this.world.data.races)
            this.generatedCharacter.race = selectedRace.name;
            // Generate Sub-Race
            this.generatedCharacter.subrace = null;
            if(selectedRace.available_subraces.length > 0){
                let selectedSubRace = _.sample(selectedRace.available_subraces);
                this.generatedCharacter.subrace = selectedSubRace.name;
                if(!selectedSubRace.occupation_allowed){rollForOccupation = false};
                if(!selectedSubRace.social_class_allowed){rollForSocialClass = false};
            }
            // Generate plan touched type
            let selectedPT_type = this.weighted_random(this.world.data.planetouched_states);
            console.log(selectedPT_type);
            if(selectedPT_type.name == 'plane-touched'){
                console.log('go')
                let selectedPTRace = this.weighted_random(selectedPT_type.available_planetouched_types).name;
                console.log(selectedPTRace)
                this.generatedCharacter.plain_touched_type = selectedPTRace;
                console.log(this.generatedCharacter)
            }
            
            // Generate Age
            let selectedAge = this.weighted_random(this.world.data.ages);
            this.generatedCharacter.age = selectedAge.name;
            if(!selectedAge.occupation_allowed){rollForOccupation = false}; 
            
            // Generate Family Status
            this.generatedCharacter.familystatus = selectedAge.relationship_status_allowed ? this.weighted_random(this.world.data.relationshipstatuses).name : 'Single';
            // Generate Social Class
            this.generatedCharacter.socialclass = null;
            this.generatedCharacter.occupation = null;
            if(rollForSocialClass){
                let selectedSocialClass = this.weighted_random(this.world.data.socialclasses)
                this.generatedCharacter.socialclass = selectedSocialClass.name;
                if(selectedSocialClass.name == 'Minor Nobility' && selectedAge.name == 'juvenile'){rollForOccupation = false};
                if(rollForOccupation && selectedSocialClass.available_occupations.length > 0){
                    // Generate Occupation
                    this.generatedCharacter.occupation = this.weighted_random(selectedSocialClass.available_occupations).name
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
