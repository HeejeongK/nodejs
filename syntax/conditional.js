// nodejs console input parameters 검색해서 붙어옴! 그래서 test
var args = process.argv;
console.log(args[2]);

console.log('A');
console.log('B');
if(args[2] === '1'){
 console.log('C1');
}else{
 console.log('C2');
}
console.log('D');