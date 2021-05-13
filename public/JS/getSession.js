//const host = 'http://localhost:3001';
const host = 'http://nbastorebutbetter.club/products';


const localStorageSession = localStorage.getItem('sessionId'); 
console.log(localStorageSession); 

if(!localStorageSession) {
    window.location.replace(host); 
}

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