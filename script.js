//features to add
//typing effect done
//animation of logo
//auto scroll feature done

const container = document.querySelector(".container")
const promptForm = document.querySelector(".prompt_form");
const promptInput = promptForm.querySelector(".prompt_input")
let userMsg = "";
const chatsContainer = document.querySelector(".chat_container")

const GEMINI_API_KEY = "AIzaSyDcYa-iElDEurTNIu4ELh2Jok5-nh_TdtA";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}` 
const chatHistory = [];

const stoplogoanimation=(geminiLogo)=>{
    geminiLogo.classList.remove("loading")
};
const scrolltoBottom = ()=>{
    container.scrollTo({top : container.scrollHeight, behavior : "smooth"});
}
const typingEffect = (responseData,botmsgText,geminiLogo)=>{

    botmsgText.textContent = "";
    const words = responseData.split(" ");
    let wordIndex = 0;

       const typingInterval = setInterval(()=>{
        if(wordIndex < words.length){
            stoplogoanimation(geminiLogo);
        botmsgText.textContent += (wordIndex===0?"":" ") + words[wordIndex++];
        scrolltoBottom();
       }
    
    else{
            clearInterval(typingInterval);
    }
},40)
}
const generateResponse = async(botmsgText,geminiLogo)=>{
    
    chatHistory.push({
        role : "user",
        parts : [{text : userMsg}]
    })
    try{
        const response = await fetch(API_URL,{
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({contents : chatHistory})
    });
    const data = await response.json();
    if(!response.ok){
        throw new Error(data.error.message);
    }
    console.log(data);
    const responseData = data.candidates[0].content.parts[0].text;
    typingEffect(responseData,botmsgText,geminiLogo);
    }
    catch(error){
        console.log(error);
    }
    
}



//handling form submission
const handleFormSubmit = (e) =>{
    e.preventDefault();
    userMsg = promptInput.value.trim();

    if(!userMsg) return;
    promptForm.reset();
//user msg handling
 const usermsgdiv = document.createElement('div');
 usermsgdiv.classList.add('message','user_message');
 const usermsgText = document.createElement('p');
 usermsgText.textContent = userMsg;
 usermsgText.classList.add("message_text");
 usermsgdiv.appendChild(usermsgText);
 chatsContainer.appendChild(usermsgdiv);
 scrolltoBottom();
  
//bot message handling
setTimeout(()=>{

    const botmsgdiv = document.createElement('div');
    const geminiLogo = document.createElement('img');
    geminiLogo.src=`gemini-chatbot-logo.svg`;
    geminiLogo.classList.add("avatar","loading");
    botmsgdiv.appendChild(geminiLogo);
    botmsgdiv.classList.add("message","bot_message");
    const botmsgText = document.createElement('p');
    botmsgText.textContent = `Just a second...`;
    botmsgText.classList.add("message_text");
    botmsgdiv.appendChild(botmsgText);
    chatsContainer.appendChild(botmsgdiv);
    scrolltoBottom();
    generateResponse(botmsgText,geminiLogo);
   
},600)
}
promptForm.addEventListener('submit',handleFormSubmit);







