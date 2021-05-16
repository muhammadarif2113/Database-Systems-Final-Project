//const host = 'http://localhost:3001'; //used when developing
const host = 'http://nbastorebutbetter.club'; //when in production 

//to get the local storage session from users in the checkout page

const localStorageSession = localStorage.getItem('sessionId'); 
console.log(localStorageSession); 
//if there is no localstorage info, redirect user to home page 
//security measure so any user cant access the thankyoucheckout page
if(!localStorageSession) {
    window.location.replace(host); 
}
//clear localstorage after a user successfully checks out
async function getSession(){
    const response = await axios.get(`${host}/checkout/session/${localStorageSession}`); 

    if(response.data.success){
        console.log("Clearing local Storage"); 
        localStorage.clear(); 
    } else {
        window.location.replace(host); 
    }
}

getSession()
