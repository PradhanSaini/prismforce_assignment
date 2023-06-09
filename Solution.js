const fs = require('fs');
const path = require('path');

// Define the path to the JSON file
const filePath = path.join(__dirname, '1-input.json');


// Read the JSON file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  try {
    // Parse the JSON data
    const jsonData = JSON.parse(data);
    const hashmap = new Map();

    // Processing revenue Data 
    jsonData.revenueData.forEach(ele => {
        if(ele.startDate){
            if(hashmap.has(ele.startDate))
                hashmap.set(ele.startDate,hashmap.get(ele.startDate)+ele.amount);
            else 
                hashmap.set(ele.startDate,ele.amount);
        }
    });

    // Processing expense Data 
    jsonData.expenseData.forEach(ele => {
        if(ele.startDate){
            if(hashmap.has(ele.startDate))
                hashmap.set(ele.startDate,hashmap.get(ele.startDate)-ele.amount);
            else 
                hashmap.set(ele.startDate,-ele.amount);
            
            if(hashmap.get(ele.startDate)==0)hashmap.set(ele.startDate,0);
        }
    });


    let sortedKeys = Array.from(hashmap.keys()).sort();

    let startTime=new Date(sortedKeys[0]);
    let endTime = new Date(sortedKeys[sortedKeys.length-1]);


    // Filing missing entries
    while(startTime<endTime){
        const timeString = startTime.toISOString();
        if(hashmap.has(timeString)==false)hashmap.set(timeString,0);
        startTime=new Date(startTime.getFullYear(), startTime.getMonth() + 1, startTime.getDate(), startTime.getHours(), startTime.getMinutes(), startTime.getSeconds());
    }

    sortedKeys = Array.from(hashmap.keys()).sort();

    const balance = [];

    sortedKeys.forEach(key=>{
        const obj={};
        obj[`amount`]=hashmap.get(key);
        obj["startDate"]=key;
        balance.push(obj);
    });

    const ans = JSON.stringify({balance}, null, 2); 

    console.log(ans);

  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});
