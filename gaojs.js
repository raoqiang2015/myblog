function Person(name,age,job){
  //ownProperties
  this.name = name;
  this.age = age;
  this.job = job;
  this.friends = ['a','d'];
}

Person.prototype = {
  construct: Person,
  sayHi: function(){
    alert(this.name);
  }
};

var person1 = new Person();
var person2 = new person();
