// https://www.learnwithjason.dev/blog/get-form-values-as-json

//handle sign up form data
const form = document.querySelector('.sign-up-form');
form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
    event.preventDefault(); //prevents page from refreshing
    const data = new FormData(event.target);
    const values = Object.fromEntries(data.entries())

    fetch("http://localhost:8000/signup",{
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(values),
    })
    // .then((response)=>response.json())
    .then((response)=>console.log(response))
    // console.log({ values });
    // return false
}