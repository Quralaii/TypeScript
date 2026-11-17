const xyz: string[] = ["apple", "banana", "cherry"];
console.log(xyz);    //выводит ["apple", "banana", "cherry"]
console.log(xyz.map(f => f.toUpperCase())); //map - проходит по каждому элементу и создает новый массив, здесь переводит в верхний регистр

xyz.push("orange"); //добавляет "orange"
console.log(xyz);    //выводит ["apple", "banana", "cherry", "orange"]
console.log(xyz.indexOf("banana")); //indexOf - ищет элемент и возвращает его индекс (banana)

xyz.splice(2, 1, "kiwi", "peach"); //удаляет 1 элемент начиная с индекса 2(cherry) и добавляет "kiwi" и "peach"
console.log(xyz);    //выводит ["apple", "banana", "kiwi", "peach", "orange"]
console.log(xyz.length);  // выводит 5
xyz.splice(0, xyz.length - 1); //удаляет 4 элемента начиная с индекса 0
console.log(xyz);   //выводит ["orange"]
xyz.unshift("mango"); //unshift - добавляет "mango" в начало
console.log(xyz);   // выводит ["mango", "orange"]

xyz.push("alice", "bob"); //добавляет alise и bob
console.log(xyz);   // выводит ["mango", "orange", "alice", "bob"]
console.log(xyz.shift()); // вернет "mango"
console.log(xyz); //выводит ["orange", "alice", "bob"]
console.log(Array.isArray(xyz)); //Array.isArray - проверяет, является ли значение массивом (true или false)


let abc:number = 3.14;  //тип числа 
console.log(abc);   //выводит 3.14
let def:string = (15).toString(); //тип строка, число 15 переводится в строку
console.log(def);   //выводит "15"
let bool:boolean = 1 < 2; //тип логического и сделает сравнение
console.log(bool);  //выводит true


                        //const на let
// const age = 18;
// age = 20;   //появляется ошибка, так как age объявлен как const и не может быть присвоен через =
// console.log(age);

let age = 18;
age = 20;   //можно присвоить новое значение, так как age объявлен как let
console.log(age);


                        //let на const

let name = "Ali";
name = "Ayan";   //можно присвоить новое значение, так как name объявлен как let
console.log(name);

// const name = "Ali";
// name = "Ayan";  //появляется ошибка, так как name объявлен как const и не может быть присвоен через =
// console.log(name);



