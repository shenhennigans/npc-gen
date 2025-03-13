<script>
import OpenAI from 'openai';
import 'dotenv';

export default {
    props: {
        char: {}
    },
    data() {
        return {
            
        }
    },
    methods: {
        generateBackstory : async(char) =>{
            let system_prompt= "You are a dungeons and dragons dungeon master describing a minor character or NPC. Be descriptive, add a little bit of backstory based on the given information.";
            let user_prompt= "Tell me about this character: "+char.name+" is a "+char.age+" "+char.gender+" "+char.subrace+" "+char.race+". As a "+char.class+", if they have work they work as a "+char.occupation+" and belong to the "+char.socialclass+". This character is "+char.familystatus+".";
            let api = new OpenAI({
                apiKey: import.meta.env.VITE_OPENAI_API_KEY,
                baseURL: import.meta.env.VITE_OPENAI_BASE_URL,
                dangerouslyAllowBrowser: true
            });
            completion = await api.chat.completions.create({
                model:import.meta.env.VITE_OPENAI_MODEL_ID,
                messages:[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                
            });
            console.log(completion.choices)
            response = completion.choices[0].message.content
            console.log(response)
        }
    }
}

</script>
<template>
    <div class="card text-center">
        <div class="card-header">
            Featured
        </div>
        <div class="card-body">
            <h5 class="card-title">{{ char.name }}</h5>
            <p class="card-text">{{ char.backstory }}</p>
            
            <button @click="generateBackstory(char)" class="btn btn-dark">Generate Backstory</button>
        </div>
        <div class="card-footer text-muted">
            2 days ago
        </div>
    </div>
</template>