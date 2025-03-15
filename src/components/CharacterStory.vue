<script>
import OpenAI from 'openai';
import 'dotenv';
export default {
    props: {
        char: {}
    },
    data() {
        return {
            isLoading: false,
            showBackstory: false,
            system_prompt: `You are a dnd dm. Invent a backstory, quirks, mannerisms for this npc. Output in short sentences, each on new line.`
        }
    },
    methods: {
        async generateBackstory(){
            // controlling visibility
            this.showBackstory = false;
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
                max_tokens: 256
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
            this.showBackstory = true;
            // assigning open ai response to backstory variable
            this.char.backstory = completion.choices[0].message.content;
            
        },
        makePrompt(includeSystemPrompt, isShortVersion){
            let prompt = "";

            let hasSubRace = this.char.subrace != null;
            let hasPlaneTouch = this.char.plain_touched_type != null;
            let hasSocialClass = this.char.socialclass != null;
            let hasOccupation = this.char.occupation!= null;
            if(includeSystemPrompt){
                prompt += this.system_prompt;
            }
            if(isShortVersion){
                prompt += `${this.char.name},${this.char.age},${this.char.gender},${this.char.alignment},${this.char.traits}`
                if(hasPlaneTouch){
                    prompt += `${this.char.plain_touched_type} `;
                }
                if(hasSubRace){
                    prompt += `${this.char.subrace} `;
                }
                if(this.char.race != 'Other'){
                    prompt += `${this.char.race},`;
                }
                
                if(hasOccupation){
                    prompt += `${this.char.occupation},`;
                }
                if(hasSocialClass){
                    prompt += `${this.char.socialclass},`;
                }
                prompt += `${this.char.familystatus}.`;
                prompt =  prompt.substring(0, 141);
            }
            else{
                prompt += "\n";
                prompt += `${this.char.name} is a ${this.char.age} ${this.char.gender}`;
                if(hasSubRace){
                    prompt+= `${this.char.subrace} `;
                }
                prompt+= `${this.char.race}. Their alignment is ${this.char.alignment}`;
                if(hasOccupation){
                    prompt += `They work as a ${this.char.occupation}.`;
                }
                if(hasSocialClass){
                    prompt += `Their social status is ${this.char.socialclass}.`;
                }
                prompt += `They are ${this.char.familystatus}.`;
                prompt += `Others would describe them as ${this.char.traits}.`;
                
            }
            //console.log(prompt);
            return prompt;
        },
        requestExport(){
            this.$emit('export', this.char)
        },
        hideDetails(){
            this.showBackstory =false;
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
            <template v-if="showBackstory == true">
                <p class="card-text">
                    {{ char.backstory }}
                </p>
            </template>
        </div>
    </div>
</template>
<style scoped>
    .card-text{
        margin-top: 1.5rem;
        /* max-width: 80%; */
        white-space: pre-wrap;
        text-align: left;
    }
</style>