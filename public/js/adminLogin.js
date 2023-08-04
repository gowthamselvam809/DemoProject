
function validateForm() {

    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();
    console.log(phone,password)
    

    if (phone === '' && password === '') {
      document.getElementById('phone').classList.add('is-invalid');
      document.getElementById('phoneFeedback').style.display = 'block';
      document.getElementById('password').classList.add('is-invalid');
      document.getElementById('passwordFeedback').style.display = 'block';
      return false;
    }
    else if (phone === '') {
      document.getElementById('phone').classList.add('is-invalid');
      document.getElementById('phoneFeedback').innerText = 'Phone number is required';
      document.getElementById('phoneFeedback').style.display = 'block';

      document.getElementById('password').classList.remove('is-invalid');
      document.getElementById('passwordFeedback').style.display = 'none';
      return false;
    }
    else if (password === '') {
      document.getElementById('password').classList.add('is-invalid');
      document.getElementById('passwordFeedback').style.display = 'block';
      document.getElementById('phone').classList.remove('is-invalid');
      document.getElementById('phoneFeedback').style.display = 'none';
      return false;
    }else if (phone.length != 10  ) {
      document.getElementById('phone').classList.add('is-invalid');
      document.getElementById('phoneFeedback').innerText = 'Phone number should be 10 digits.';
      document.getElementById('phoneFeedback').style.display = 'block';
      return false;
    } else if (password.length > 10) {
      document.getElementById('password').classList.add('is-invalid');
      document.getElementById('passwordFeedback').innerText = 'Password should be 10 characters or less.';
      document.getElementById('passwordFeedback').style.display = 'block';
      return false;
    }else{
    document.getElementById('phone').classList.remove('is-invalid');
    document.getElementById('phoneFeedback').style.display = 'none';
    document.getElementById('password').classList.remove('is-invalid');
    document.getElementById('passwordFeedback').style.display = 'none';
    
    $.post('/login',{
        phone : phone, 
        password : password
    },(data)=>{
      console.log(data)
      const invalid = document.getElementById('invalid')
        if(data.isValid){
          if(!data.isAdmin){
            invalid.innerText = "Consumer can't login here, Go Back"
          }else{
            console.log('im a admin')
            const sessionId = data.session;
            sessionStorage.setItem('sid',sessionId); 
            window.location.href = `/dashboard`
          }
          
        }else{
          invalid.innerText = "Invalid Credentials.."
        
        }
        
    })
    .error=(xhr)=>{
        console.log(xhr);
    };
    }
  }