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
    const inputData = JSON.parse(data);
    const map = new Map();

    // Processing revenue Data 
    inputData.revenueData.forEach(ele => {
        if(ele.startDate){
            if(map.has(ele.startDate))
                map.set(ele.startDate,map.get(ele.startDate)+ele.amount);
            else 
                map.set(ele.startDate,ele.amount);
        }
    });

    // Processing expense Data 
    inputData.expenseData.forEach(ele => {
        if(ele.startDate){
            if(map.has(ele.startDate))
                map.set(ele.startDate,map.get(ele.startDate)-ele.amount);
            else 
                map.set(ele.startDate,-ele.amount);
            
            if(map.get(ele.startDate)==0)map.set(ele.startDate,0);
        }
    });


    let sortedKeys = Array.from(map.keys()).sort();

    let startTime=new Date(sortedKeys[0]);
    let endTime = new Date(sortedKeys[sortedKeys.length-1]);


    // Filing missing entries
    while(startTime<endTime){
        const timeString = startTime.toISOString();
        if(map.has(timeString)==false)map.set(timeString,0);
        startTime=new Date(startTime.getFullYear(), startTime.getMonth() + 1, startTime.getDate(), startTime.getHours(), startTime.getMinutes(), startTime.getSeconds());
    }

    sortedKeys = Array.from(map.keys()).sort();

    const balance = [];

    sortedKeys.forEach(key=>{
        const obj={};
        obj[`amount`]=map.get(key);
        obj["startDate"]=key;
        balance.push(obj);
    });

    const ans = JSON.stringify({balance}, null, 2); 

    console.log(ans);

  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});
