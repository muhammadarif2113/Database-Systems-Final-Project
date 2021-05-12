const host = 'http://localhost:3001';

const localStorageSession = localStorage.getItem('sessionId'); 
console.log(localStorageSession); 

if(!localStorageSession) {
    window.location.replace('http://localhost:3001'); 
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