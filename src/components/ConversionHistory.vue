<template>
    <div class="mainContainer">
        <div class="searchConatiner">
            <div class="searchInner">
                <div class="w100 searchMain">
                    <input v-model="searchLocation" v-on:keyup.enter="search(searchLocation, expSelected)" type="text" class=""  placeholder="Search for jobs near you (location , skills)" autocomplete="on" id="searchInput"/>
                    <select v-model="expSelected">
                        <option disabled value="">SELECT EXPERIENCE</option>
                        <option v-bind:value="0">FRESHER</option>
                        <option v-bind:value="1">1 - 3 YEARS</option>
                        <option v-bind:value="2">4 - 6 YEARS</option>
                        <option v-bind:value="3">7 - 9 YEARS</option>
                        <option v-bind:value="4">10 OR MORE YEARS</option>
                    </select>
                    <div class="btnDv">
                    <button class="btn new-btn" type="button" @click="search(searchLocation, expSelected)">
                        <span class="search-icon" >SEARCH</span>
                    </button>
                    
                    </div>
                    <div class="btnDvNew" v-if="alreadySearched">
                    <button class="btn new-btn" type="button" @click="Emptysearch()">
                        <span class="search-icon" >X</span>
                    </button>
                    </div>
                </div>
                
            </div>
        </div>
        <div class="jobConatiner">
            <div v-if="noSearchResults">
                <h3> TOTAL JOBS : {{totalCount}} </h3>
            </div>
            <div v-if="!noSearchResults"><h2>NO JOBS FOUND</h2></div>

            <div class="sorterDV" v-if="alreadySearched">
                    <span>SORT SEARCH RESULT BY: </span>
                    <div class="btnDv">
                    <button class="btn new-btn" type="button"  @click="sortjob('exp')">
                        <span class="search-icon">EXPERIENCE</span>
                    </button>
                    </div>
                    <div class="btnDv">
                    <button class="btn new-btn" type="button" @click="sortjob('companyname')">
                        <span class="search-icon">COMPANY</span>
                    </button>
                    </div>
                    <div class="btnDv">
                    <button class="btn new-btn" type="button" @click="sortjob('expiry')">
                        <span class="search-icon">EXPIRY</span>
                    </button>
                    </div>
            </div>
            
            <div class="jobCard" v-for="(job, index) in jobs" :key="index">
                <div class="jobImgDv">
                    <div class="jobName">{{job.companyname || 'Company Name Not Disclosed'}} , {{job.location || 'Location not disclosed'}}</div>
                    <div class="jobotherType">TITLE : {{job.title}}, {{job.type}}</div>
                    <div class="jobotherType">SKILLS: {{job.skills}}</div>
                    <div class="jobotherType">EXPERIENCE REQUIRED : {{job.experience}} years</div>
                    <div class="jobotherType">SALARY OFFERED : {{job.salary || 'Salary not disclosed'}}</div>
                    <div class="jobotherType">WILL EXPIRE IN : {{job.expiryDay || 'Last Date not disclosed'}} days</div>
                    <div class="jobBottom"><span class="timeSpan"><img alt="star image" src="./../assets/img/clock.svg" />{{job.startdate}} - {{job.enddate}}</span></div>
                    <div class="jobLinkDv">
                        <a :href="job.applyink" target="_blank" class="btn new-btn"><span class="search-icon">Click to apply</span></a>
                    </div>
               </div> 
            </div>
        </div>

    </div>
</template>

<script>
import AppConversionService from './../service/appConversionService';
import Utils from './../common/Utils';
import * as Constant from '../common/Constants';
import { publishEvent } from '../common/Observer';



export default {
   
    data() {
        return {
            searchLocation:'',
            jobs: [],
            expSelected:'',
            noSearchResults:false,
            alreadySearched:false,
            totalCount: 0,
            searchExp : [],
        }
    },
     components: {
        //Pagination
    },
    created() {
        this.fetchTransactions();
    },
    mounted(){
              
    },
    methods: { 
        onChange(event, location, exp) {
            console.log(this.expSelected);
            this.search(location, exp)
           // this.expSelected = event.target.value;
        },

        sortjob(sortText){
            sortText == 'exp' ? sortText='experience': sortText=='companyname'? sortText='companyname':sortText='expiry';
           if(sortText == 'experience'){
            this.jobs.sort((a,b)=>(a.experience - b.experience));
           }else if(sortText == 'companyname'){
                this.jobs.sort(function(a, b) {
                    var companyA = a.companyname.toUpperCase().split(' ').join();
                    var companyB = b.companyname.toUpperCase().split(' ').join();
                    console.log(companyA, companyB);
                    return (companyA < companyB) ? -1 : (companyA > companyB) ? 1 : 0;
                });

               this.jobs.sort((a, b) => (a.companyname > b.companyname) ? 1 : -1)
           }else{
                this.jobs.sort((a,b)=>(a.expiryDay - b.expiryDay));
           }
            
        },

        fetchTransactions() {
            publishEvent(Constant.SHOW_LOADER);
            AppConversionService.getJobs()
                .then(response => {
                    console.log(response)
                    this.jobs = response.data.jobsfeed;
                    this.totalCount = response.data.jobsfeed.length;
                    if(this.totalCount > 0){
                        this.noSearchResults = true;
                    }
                    for(let i =0;i<this.jobs.length;i++){
                        let expiryDay = Utils.calculateExpiry(this.jobs[i].enddate)
                        this.jobs[i].expiryDay = expiryDay;
                    }
                    localStorage.setItem('jobs', JSON.stringify(this.jobs));
                    publishEvent(Constant.HIDE_LOADER);
                })
                .catch(error => {
                    publishEvent(Constant.HIDE_LOADER);
                });
        },

        search(location, exp) {
            let searchResults = []
            let searchLocation = location.toLowerCase();
            this.jobs = JSON.parse(localStorage.getItem('jobs'));
            switch (exp) {
                case 0:
                   this.searchExp.push(0);
                    break;
                case 1:
                    this.searchExp = [...Constant.AEXP];
                    break;
                case 2:
                    this.searchExp = [...Constant.BEXP];
                    break;
                case 3:
                    this.searchExp = [...Constant.CEXP];
                    break;
                case 4:
                    this.searchExp = [...Constant.DEXP];
                    break;
                default:
                    this.searchExp = [];
                    break;    
            }
            
            if (location != '' || exp !='') {

                this.alreadySearched = true;

                if(location != '' && exp ==''){
                    for (let i = 0; i < this.jobs.length; i++) {
                        let skills = this.jobs[i].skills.split(', ');
                        let newLocation = this.jobs[i].location.toLowerCase().search(searchLocation);
                        let abc = skills.filter(skill => skill.toLowerCase().indexOf(searchLocation) > -1);
                        if (newLocation > -1 || abc.length > 0 ) {
                            searchResults.push(this.jobs[i]);
                        }
                    }
                }
                else if(location == '' && exp !=''){
                    for (let i = 0;i < this.jobs.length; i++) {
                        for(let j = 0;j < this.searchExp.length;j++){
                            let newexp = this.jobs[i].experience == this.searchExp[j] ? true : false;
                            if (newexp == true) {
                                searchResults.push(this.jobs[i]);
                            }
                        }
                        
                    }
                }
                else{
                    for (let i = 0; i < this.jobs.length; i++) {
                            let newLocation = this.jobs[i].location.toLowerCase().search(searchLocation);
                            let skills = this.jobs[i].skills.split(', ');
                            let abc = skills.filter(skill => skill.toLowerCase().indexOf(searchLocation) > -1);
                            //let newexp = false;
                            for(let j = 0;j < this.searchExp.length; j++){
                               let newexp = this.jobs[i].experience == this.searchExp[j] ? true : false;
                                if(newexp == true){
                                     searchResults.push(this.jobs[i]);
                                }
                            }
                            if (newLocation > -1 || abc.length > 0) {
                                searchResults.push(this.jobs[i]);
                            }
                        }
                }
                this.totalCount = searchResults.length;
                this.noSearchResults = (searchResults.length == 0) ? false : true;
                this.jobs = [...searchResults];
            } else {
                this.Emptysearch();
                return;
            }
            
            
      },

      Emptysearch() {
          this.searchLocation = '';
          this.expSelected = '';
           if (this.searchLocation != '' || this.expSelected != '') {} else {
            this.noSearchResults = true;
            this.alreadySearched = false;
            this.searchExp = [];
            this.jobs = JSON.parse(localStorage.getItem('jobs'));
            this.totalCount = this.jobs.length;
            }
        },
      
        
    },
    computed:{
        
    }
}
</script>

<style lang="scss" scoped>
.mainContainer {width:100%;
   .searchConatiner{background:url(./../assets/img/bg.jpg) no-repeat;background-position:100% 50%;width:100%;height:250px;background-size:cover;position:relative;
    .searchInner{position:absolute;top:50%;left:50%;transform: translate(-50%,-50%);min-width:60%;}
    .searchMain{position:relative;}
    input{width:48%;border: unset;margin-right:3%;}
    select{width:30%;border: unset;margin-right:3%;-webkit-appearance: menulist;appearance: menulist;height:64px;}
    .btnDv{display: inline-block;width:12%;}
    
    .searchResultDv{margin-top: 20px;background: lightgrey;padding: 10px;
        span{display:inline-block;background: #fff;padding:2px 4px;margin-right:4px;
        .close{margin:0 2px; cursor:pointer; color: grey;}}
    }
    .btnDvNew{display: inline-block;width:4%;}
    

   }
   .sorterDV{
        .btnDv{.new-btn{width:100%;}}
        }
   .jobConatiner{
       width:90%;padding:2% 5%;
       .jobCard{box-shadow: 0 6px 14px 6px rgba(0, 0, 0, 0.08); width:42%;padding:2%;margin:2%;display:inline-block;
           .jobImgDv{width:90%;img{width:110px;height:110px;}
               .jobName{font-size:16px;line-height:18px;font-weight:bold;margin-bottom:10px;}
               .jobotherType{font-size:13px;}
               .jobBottom{font-size:14px;margin-top:10px;
                .timeSpan{display:inline-block;width:100%; img{width:16px;height:16px;vertical-align:-3px;padding-right:4px;}}
               }
           }
           .jobLinkDv{margin: 40px 0 20px 0;
               a{text-decoration: none;
               &:hover{text-decoration: none;}}
            }
       }
       .sorterDV{margin-bottom:20px;width:100%;
       .btnDv{display: inline-block;width:12%;padding-left:20px;}
       }
   }
}
</style>
