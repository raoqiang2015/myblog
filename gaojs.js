function Person(name, age, job) {
  // ownProperties
  this.name = name;
  this.age = age;
  this.job = job;
  this.friends = ['a', 'd'];
}

Person.prototype = {
  construct: Person,
  sayHi() {
    alert(this.name);
  },
};

const person1 = new Person('raoqiang', 18, 'it1');
const person2 = new Person('raocheng', 20, 'it2');
