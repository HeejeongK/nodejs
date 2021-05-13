var members = ['hee', 'jeong', 'best'];
console.log(members[1]);
var i = 0;
while(i < members.length){
    console.log('array', members[i]);
    i = i+1;
}


var roles = {
    'programer' : 'hee',
    'designer' : 'jeong',
    'manager' : 'best'
}
console.log(roles.designer);

for(var name in roles){
    console.log('object =>', name, 'value =>', roles[name]);
}
