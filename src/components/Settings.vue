<script>
import {Popover} from "bootstrap";
export default {
    name: 'Settings',
    props: {
        database: {}
    },
    data() {
        return {
            selectedTable : null,
            selectedTableName : null,
            selectedTotal : 100,
            isTotalSatisified : true,
            occupationTables : [],
            tabMapping: [
                {
                    "tabName" : "Gender",
                    "tableName" : "genders"
                },
                {
                    "tabName" : "Age",
                    "tableName" : "ages"
                },
                {
                    "tabName" : "Family Status",
                    "tableName" : "familyStatuses"
                },
                {
                    "tabName" : "Occupation",
                    "tableName" : "occupations"
                },
                {
                    "tabName" : "Social Class",
                    "tableName" : "socialClasses"
                },
                {
                    "tabName" : "Race",
                    "tableName" : "races"
                }
            ],
            activeTab : null
        }
    },
    methods: {
        openTable(event,tableName){
           
            this.selectedTable = this.database[tableName];
            this.selectedTableName = tableName;
            if(tableName == 'occupations'){
                this.occupationTables = [];
                let groupedTables = this.selectedTable.reduce((result, obj) => {
                    (result[obj.social_class] = result[obj.social_class] || []).push(obj);
                    return result;
                }, {});
                this.occupationTables = [groupedTables['Working Class'],groupedTables['Middle Class'],groupedTables['Minor Nobility']];
            }
            if(this.activeTab!= null){
                this.activeTab.className = 'nav-link';
            }
            event.target.className = 'nav-link active';
            this.activeTab = event.target;
        },
        updateSetting(event){
            let newValue = parseInt(event.target.value);
            let propertyName = event.target.id;
            this.selectedTotal = 0;
            this.selectedTable.forEach(el =>{
                if(el.name == propertyName){
                    el.weight = newValue;
                }
                this.selectedTotal += el.weight;
            });
            this.isTotalSatisified = this.selectedTotal == 100;
            this.database[this.selectedTable] = selectTable;
            
        },
        submitChanges(){
            this.$emit('settingsupdate', this.database);
        }
    }
}
</script>
<template>
    <ul class="nav nav-pills">
        <li class="nav-item" v-for="item in tabMapping">
            <a class="nav-link" @click="openTable($event,item.tableName)">{{ item.tabName }}</a>
        </li>
    </ul>
    <!-- Slider Form -->
    <form v-if="selectedTable!=null">
        <template v-if="selectedTableName!='occupations'">
            <template v-for="option in selectedTable">
                <div class="mb-3">
                    <label :for="option.name" class="form-label">{{ option.name }}</label>
                    <input type="range" class="form-range" :value="option.weight" min="0" max="100" step="1" aria-describedby="inputHelp" :id="option.name" @input="updateSetting">
                    <div id="inputHelp" class="form-text">{{ option.weight }}%</div>
                </div>
            </template>
        </template>
        <template v-if="selectedTableName=='occupations'">
            <template v-for="table in occupationTables">
                <template v-for="option in table">
                    <div class="mb-3">
                    <label :for="option.name" class="form-label">{{ option.name }}</label>
                    <input type="range" class="form-range" :value="option.weight" min="0" max="100" step="1" aria-describedby="inputHelp" :id="option.name" @input="updateSetting">
                    <div id="inputHelp" class="form-text">{{ option.weight }}%</div>
                </div>
                </template>
            </template>
        </template>
        <!-- Validation and Submit -->
        <div class="container text-center">
            <div class="row">
                <div class="col-6">
                    Total : {{ selectedTotal }}%
                </div>
                <div class="col-6">
                    <template v-if="isTotalSatisified==true">
                        <button type="button" class="btn btn-dark" @click="submitChanges"> Submit </button>
                    </template>
                    <template v-if="isTotalSatisified==false">
                        <button type="button" class="btn btn-dark" disabled> < must be 100 </button>
                    </template>
                </div>
            </div>
        </div>
    </form>
    
</template>
<style scoped>
.form-text{
    color: ghostwhite;
}
.nav-link{
    color: lightslategray;
}

.nav-pills .nav-link:focus,.nav-pills .nav-link:hover, .nav-pills .nav-link:before, .nav-pills .nav-link:after{
    border-color: none;
    border: none;
}

.nav-pills .nav-link.active, .nav-pills .show>.nav-link {
    color: var(--vt-c-highlight-color);
    background-color: var( --vt-c-divider-dark-2);
    
}
</style>