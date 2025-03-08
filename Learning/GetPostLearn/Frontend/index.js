class Person{
    constructor(name,age,title){
        this.name = name;
        this.age = age;
        this.title = title;
    }
    talk(){
        console.log(`Hi...my name is ${this.name}`);
    }
}

class Student extends Person{
    constructor(name,age,title,marks){
        super(name,age,title)
        this.marks = marks;
    }
    showMark(){
        console.log(`${this.name} is the total marks is ${this.marks}`);
    }
}

let s1 = new Student("Prashant Raj", 24,'Chaurasiya', 90);

