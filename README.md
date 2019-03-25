# smallapp

## Project setup
npm install

### Compiles and hot-reloads for development
npm run serve

### Compiles and minifies for production (will create a 'dist' folder and this folder can be deployed on prod)
npm run build

### Run your tests
npm run test

### Lints and fixes files
npm run lint

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



### ASSSUMPTIONS MADE

Have done a complete project setup and hence added some extra scss and js files that could be used for bigger project

Since the data isnt consistent in many api response for job listing, the sorting and searching are effected for those columns (eg : salary not mentioned)

Sorting is done on items that were searched based on location, experience, and/or skills

So sorting is visible only after you search through jobs object

For sorting experience, the drop down value of 10 years and more is upto 15years

Select experience drop down isnt dynamic , but could be made if one gets data for total experince data in api response


