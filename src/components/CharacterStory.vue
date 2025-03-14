<script>
import OpenAI from 'openai';
import 'dotenv';
export default {
    props: {
        char: {},
        showBackstory: Boolean
    },
    data() {
        return {
            isLoading: false,
            showBackstoryBool: this.showBackstory,
            system_prompt: `You are a dnd dungeon master describing a minor character. Be concise, add some backstory based on the given information.`
        }
    },
    methods: {
        async generateBackstory(){
            // controlling visibility
            this.showBackstoryBool = false;
            this.isLoading = true;
            // generating prompt
            let user_prompt= this.makePrompt(false,true);
            // initiating connection to open ai
            let api = new OpenAI({
                apiKey: import.meta.env.VITE_OPENAI_API_KEY,
                baseURL: import.meta.env.VITE_OPENAI_BASE_URL,
                dangerouslyAllowBrowser: true
            });
            // making api call to open ai
            let completion = await api.chat.completions
            .create({
                model:import.meta.env.VITE_OPENAI_MODEL_ID,
                messages:[
                    {"role": "system", "content": this.system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                max_tokens: 256,
            })
            // error handling
            .catch(async (err) => {
                if (err instanceof OpenAI.APIError) {
                    this.isLoading = false;
                    console.log('ERROR --- Request Id: '+err.request_id);
                    console.log('ERROR --- Status: '+err.status); // 400
                    console.log('ERROR --- Name: '+err.name); // BadRequestError
                    console.log('ERROR --- Headers: '+JSON.stringify(err.headers)); // {server: 'nginx', ...}
                    if(err.status == 429){
                        this.char.backstory = "Sorry, all out of AI tokens for the hour. Try again soon.";
                    }
                    else{
                        this.char.backstory = "Sorry, something went wrong with this query. Try again."
                    }
                } else {
                    this.isLoading = false;
                    this.char.backstory = "Sorry, something went wrong with this query. Try again."
                    throw err;
                }
                this.char.backstory += "\n";
                this.char.backstory += "Or, you could try this prompt in a LLM of your choice to generate a backstory: ";
                this.char.backstory += "\n";
                this.char.backstory += this.makePrompt(true,false);
            });
            // controlling visibility
            this.isLoading = false;
            this.showBackstoryBool = true;
            // assigning open ai response to backstory variable
            this.char.backstory = completion.choices[0].message.content;
            //console.log(this.char.backstory);
            
        },
        makePrompt(includeSystemPrompt, isShortVersion){
            let prompt = "";
            if(includeSystemPrompt){
                prompt += this.system_prompt;
            }
            if(isShortVersion){
                prompt += `${this.char.name},${this.char.age},${this.char.gender},${this.char.subrace} ${this.char.race},${this.char.class}.`;
                if(this.char.occupation!= null){
                    prompt += `they work as a ${this.char.occupation},`;
                }
                if(this.char.socialclass!= null){
                    prompt += `their social status is ${this.char.socialclass}.`;
                }
                prompt += `They are ${this.char.familystatus}.`;
                prompt =  prompt.substring(0, 130);
            }
            else{
                prompt += "\n";
                prompt += `${this.char.name} is a ${this.char.age} ${this.char.gender} ${this.char.subrace} ${this.char.race}.`;
                if(this.char.occupation!= null){
                    prompt += `They work as a ${this.char.occupation}.`;
                }
                if(this.char.socialclass!= null){
                    prompt += `Their social status is ${this.char.socialclass}.`;
                }
                prompt += `They are ${this.char.familystatus}.`;
            }
            //console.log(prompt);
            return prompt;
        },
        requestExport(){
            this.$emit('export', this.char)
        }
    }
}

</script>
<template>
    <div class="container text-center">
        <div class="row">
            <div class="col-5">
                <button @click="generateBackstory(char)" class="btn btn-dark">Generate Backstory</button>
            </div>
            <div class="col-2">
                <template v-if="isLoading == true">
                    <div class="spinner-grow text-secondary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </template>
            </div>
            <div class="col-5">
                <button @click="requestExport(char)" class="btn btn-dark">Export Character</button>
            </div>
        </div>
        <div class="row">
            <template v-if="showBackstoryBool == true">
                <p class="card-text">{{ char.backstory }}</p>
            </template>
        </div>
    </div>
</template>
<style scoped>
    .card-text{
        margin-top: 1.5rem;
    }
</style>