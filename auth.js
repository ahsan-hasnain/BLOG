const path = window.location.pathname;
const registerbtn = document.getElementById('register');
const loginbtn = document.getElementById('login');
const currentHTMLFileName = window.location.pathname.split('/').pop();
  
        if(currentHTMLFileName === 'register.html'){
            registerbtn.addEventListener('click', function (e) {
                e.preventDefault();
                const username = document.getElementById('register-username').value;
                const password = document.getElementById('register-password').value;
                const user = {
                    username:username,
                    password:password
                }
                
                if(username !== "" && password !== ""){
                    fetch(`http://localhost:3000/users`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(user)
                    })
                    .then(() => {
                        alert('Registration successful. Please log in.');
                        window.location.href = 'login.html';
                        registerForm.reset();
                    });
                }else{
                    alert("All fields are required")
                }
                


               
                
               
                
              });
        }
    
  
        if(currentHTMLFileName === 'login.html'){
            loginbtn.addEventListener('click', function (e) {
                e.preventDefault();
                const username = document.getElementById('login-username').value;
                const password = document.getElementById('login-password').value;
                const user = {
                    username:username,
                    password:password
                }
                if(username !== "" && password !== ""){
                    fetch(`http://localhost:3000/users`)
                    .then(req=>req.json())
                    .then(users=>{
                        const isPassword = users.some((user)=>{
                            return user.password === password
                        })
                        const isUserName = users.some((user)=>{
                            return user.username === username
                        })
                       if(isUserName&&isPassword){
                        alert("user Logged in successfully")
                        localStorage.setItem("user", JSON.stringify(user))
                        window.location.href = 'index.html'
                       }else{
                        alert("invalid username or password")
                       }
                    })
        }
    })}