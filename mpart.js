var M = {
    v: 'v',
    f: function(){
        console.log(this.v);
    }
}


module.exports = M;      
//우리가 만들고 있는 모듈인 M , M을 밖에서 사용할 수 있게 exports하겠다