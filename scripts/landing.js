//Angular Sense Js.

//Try it now button functionality...
const signUpButtons = document.querySelectorAll('.engage-btn');
signUpButtons.forEach(signUpButton => {
  signUpButton.addEventListener('click', function(){
    document.location.href = 'loading.html';
  });
});