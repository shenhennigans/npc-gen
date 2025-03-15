<script>
import axios from 'axios';
import 'dotenv'
import _ from 'lodash';
import alignments from '../assets/data/alignments.json'
import traits from '../assets/data/traits.json'
export default {
    props: {
        world: {}
    },
    data() {
        return {
            showSettings: false,
            database : {
                "alignments" : alignments,
                "traits" : traits
            },
            generatedCharacter: {}
        }
    },
    methods: {
        selectAlignment(){
            return _.sample(this.database.alignments);
        },
        selectGender(){
            return this.weighted_random(this.world.data.genders);
        },
        selectRace(){
            return this.weighted_random(this.world.data.races);
        },
        selectSubRace(race){
            let subrace = null;
            if(race.available_subraces.length > 0){
                subrace = _.sample(race.available_subraces);
            }
            return subrace;
        },
        isPlaneTouched(){
            let pt_type = this.weighted_random(this.world.data.planetouched_states);
            return pt_type.name == 'plane-touched' ? true : false;
        },
        selectPlaneTouchedType(){
            return this.weighted_random(this.world.data.planetouched_states[0].available_planetouched_types);
            
        },
        selectAge(){
            return  this.weighted_random(this.world.data.ages);
        },
        selectRelationShipStatus(){
            return this.weighted_random(this.world.data.relationshipstatuses);
        },
        selectSocialClass(){
            return this.weighted_random(this.world.data.socialclasses);
        },
        selectOccupation(sclass){
            let occupation = null;
            if(sclass != null && sclass.available_occupations.length > 0){
                occupation = this.weighted_random(sclass.available_occupations)
            }
            return occupation;
        },
        selectTraits(){
            let traits = '';
            for(let i=0; i<3; i++){
                traits += _.sample(this.database.traits.personality)+", "
            }
            traits = traits.substring(0, traits.length - 2);
            return traits;

        },
        rollCharacter() {
            this.generatedCharacter = {};
            let rollForOccupation = true;
            let rollForSocialClass = true;
            let rollForRelationshipStatus = true;
            // GENERATE
            // Alignment
            let selectedAlignment = this.selectAlignment();
            // Gender
            let selectedGender = this.selectGender();
            // Race
            let selectedRace = this.selectRace();
            let selectedSubRace = this.selectSubRace(selectedRace);
            let isPlaneTouched = this.isPlaneTouched();
            let selectedPlaneTouchedRace = isPlaneTouched ? this.selectPlaneTouchedType() : null;
            // Age
            let selectedAge = this.selectAge();
            // Relationship
            let selectedRelationship = this.selectRelationShipStatus();
            // Social Class
            let selectedSocialClass = this.selectSocialClass();
            // Occupation
            let selectedOccupation = this.selectOccupation(selectedSocialClass);
            // Traits
            let selectedTraits = this.selectTraits();
            // BOOLS
            if(selectedSubRace != null && !selectedSubRace.occupation_allowed){rollForOccupation = false};
            if(selectedSubRace != null && !selectedSubRace.social_class_allowed){rollForSocialClass = false};
            if(!selectedAge.occupation_allowed){rollForOccupation = false}; 
            if(!selectedAge.relationship_status_allowed){rollForRelationshipStatus = false};
            if(selectedSocialClass!= null && selectedSocialClass.name == 'Minor Nobility' && selectedAge.name == 'juvenile'){rollForOccupation = false};

            // ASSIGN
            this.generatedCharacter.alignment = selectedAlignment.name;
            this.generatedCharacter.gender = selectedGender.name;
            this.generatedCharacter.race = selectedRace.name;
            this.generatedCharacter.subrace = selectedSubRace!= null ? selectedSubRace.name : null;
            this.generatedCharacter.plain_touched_type = isPlaneTouched ? selectedPlaneTouchedRace.name : null;
            this.generatedCharacter.age = selectedAge.name;
            this.generatedCharacter.familystatus = rollForRelationshipStatus ? selectedRelationship.name : null;
            this.generatedCharacter.socialclass = rollForSocialClass ? selectedSocialClass.name : null;
            this.generatedCharacter.occupation = rollForOccupation && selectedOccupation!=null ? selectedOccupation.name : null;
            this.generatedCharacter.traits = selectedTraits;

            // Name
            let request_url = this.makeNamesDBRequest(selectedGender)
            axios.get(request_url)
            .then(response => {
                this.generatedCharacter.name = response.data.names[0] + ' '+ response.data.names[1];
            })
            .catch(error =>{
                console.log(error);
                throw error;
            })
            // Send Event to parent
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
        makeNamesDBRequest(gender){
            let ndb_url = import.meta.env.VITE_NAMESDB_BASE_URL
            let ndb_apikey = import.meta.env.VITE_NAMESDB_API_KEY
            let request_url = ndb_url+'random.json?key='+ndb_apikey;
            if(gender.symbol != 'NB'){
                request_url += '&gender='+ gender.symbol;
            }
            request_url += '&number=1&randomsurname=yes'
            return request_url;
        }
    }
};

</script>
<template>
    <div class="wrapper">
        <button type="button" class="btn btn-dark" @click="rollCharacter"> Roll a character </button>
    </div>
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
