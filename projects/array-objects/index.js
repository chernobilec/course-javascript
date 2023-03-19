/* ДЗ 2 - работа с массивами и объектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами.
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array

 Пример:
   forEach([1, 2, 3], (el) => console.log(el)); // выведет каждый элемент массива
 */
function forEach(array, fn) {
  for (let i = 0; i < array.length; i++) {
    fn(array[i], i, array);
  }
  

  // for (const [ix, el] of array.entries()) {
  //   fn(el, ix, array);
  // }
}

forEach([1, 2, 3], (el) => console.log(el))

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами.
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array

 Пример:
   const newArray = map([1, 2, 3], (el) => el ** 2);
   console.log(newArray); // выведет [1, 4, 9]
 */
function map(array, fn) {
  const newArray = [];

  for(const [ix, el] of array.entries()) {
    let newEl = fn(el, ix, array)
    newArray.push(newEl)
  }

  return newArray;
  // console.log(newArray)
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами.
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array

 Пример:
   const sum = reduce([1, 2, 3], (all, current) => all + current);
   console.log(sum); // выведет 6
 */
function reduce(array, fn, initialValue) {
  let startInd = 0;
  let all = initialValue;

    if (initialValue === undefined) {
      startInd = 1;
      all = array[0];
    }

  for(let i = startInd; i < array.length; i++) {
    all = fn(all, array[i], i, array);
  }

return all

}

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   const keys = upperProps({ name: 'Сергей', lastName: 'Петров' });
   console.log(keys) // выведет ['NAME', 'LASTNAME']
 */
function upperProps(object) {
  let upperCase;
  upperCase = Object.keys(object).map(a => a.toUpperCase());

  return upperCase;
}

export { forEach, map, reduce, upperProps };