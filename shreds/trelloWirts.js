// The trello checklist items go in here
var list = [

];

var newList = [];

for (let item of list) {
    newList.push(item.name);
}

console.log(JSON.stringify(newList));
