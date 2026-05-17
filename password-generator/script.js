let lengthSlider=document.getElementById("lengthSlider");
let lengthValue=document.getElementById("lengthValue");


lengthValue.textContent=lengthSlider.value;
lengthSlider.addEventListener('input',()=>{
    lengthValue.textContent = lengthSlider.value;
});

let passBox = document.getElementById("passBox");
let lowercase = document.getElementById("Lowercase");
let uppercase = document.getElementById("Uppercase");
let numbers = document.getElementById("Numbers");
let symbols = document.getElementById("Symbols");
let btn = document.getElementById("btn");



btn.addEventListener('click',()=>{
    passBox.value=generatePassword();
    evaluateStrength(passBox.value);
});

let lowerchars = "abcdefghijklmnopqrstuvwxyz";
let upperchars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let allNumbers = "0123456789";
let allSymbols = "~!@#$%^&*-+";


function generatePassword(){
    let genPassword = "";
    let allChars = "";
    allChars += lowercase.checked ? lowerchars : "";
    allChars += uppercase.checked ? upperchars : "";
    allChars += numbers.checked ? allNumbers : "";
    allChars += symbols.checked ? allSymbols : "";
    
if(allChars.length === 0){
    alert("Select at least one option");
    return "";
}
    
for(i=0;i < lengthSlider.value;i++){
   
 genPassword += allChars.charAt(Math.floor(Math.random()*allChars.length));

 i++;
 
}
return genPassword;

}


let copyIcon = document.getElementById("copyIcon");

 copyIcon.addEventListener('click',()=>{

     if(passBox.value != "" || passBox.value.length >=1){
    navigator.clipboard.writeText(passBox.value);
    
    // Show feedback
    let originalText = copyIcon.innerText;
    copyIcon.innerText = "✓";
    copyIcon.style.color = "#27ae60";
    copyIcon.title = "Copied!";
   
     }
    setTimeout(()=>{
        copyIcon.innerHTML = "content_copy";
        copyIcon.style.color = "#000";
        copyIcon.title = "";
    },2000)
     
});

function evaluateStrength(password) {
    let strengthLabel = document.getElementById("strengthLabel");
    let strengthBar = document.getElementById("strengthBar");
    
    if (password.length === 0) {
        strengthLabel.textContent = "Strength: None";
        strengthBar.className = "strengthBar";
        return;
    }
    
    let label = "";
    let className = "";
    
    if (password.length <= 4) {
        label = "Strength: Weak";
        className = "strengthBar weak";
    } else if (password.length <= 8) {
        label = "Strength: Medium";
        className = "strengthBar medium";
    } else {
        label = "Strength: Strong";
        className = "strengthBar strong";
    }
    
    strengthLabel.textContent = label;
    strengthBar.className = className;
}
