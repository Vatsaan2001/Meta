function f1(){
fetch('https://dummyjson.com/products/1')
      .then(response => response.json())
      .then(json => console.log(json))
}