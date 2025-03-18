<script>
import flavouroptions from '@/assets/data/namesusage.json'
export default {
    data() {
        return {
            flavouroptions : flavouroptions,
            selectedOption: null
        }
    },
    methods: {
        handleOptionSelect(event){
            let selectedValue = event.target.options[event.target.selectedIndex].value;
            this.$emit('optionSelected', selectedValue);
        }
    }
}

</script>
<template>
    <div class="wrapper" data-bs-theme="dark">
        Current name flavour: &nbsp;
        <form>
            <select class="form-select form-select-sm" aria-label="Default select example" @change="handleOptionSelect">
            <option value = "any" selected>Any</option>
            <option v-for="option in flavouroptions" :value="option.Code">{{option.Full}}</option>
        </select>
        </form>
    </div>
</template>
<style scoped>
    .wrapper{
        margin-bottom: 0.8rem;
    }
</style>