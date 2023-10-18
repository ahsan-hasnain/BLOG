const serverURL = 'http://localhost:3000/posts';
const currentHTMLFileName = window.location.pathname.split('/').pop();

    
        
const logoutBtn = document.getElementById("logout")
logoutBtn.addEventListener('click', ()=>{
    const confirmation = confirm("Are you sure to Logout")
    if(confirmation){
    localStorage.removeItem("user")}
}) 
// Function to fetch and display posts from the server
function displayPosts() {
    fetch(serverURL)
        .then(response => response.json())
        .then(posts => {
            const postsContainer = document.getElementById('posts');
            postsContainer.innerHTML = '';
            posts.forEach(post => {
                const postElement = document.createElement('div');
                const Comment =  []
                post.comments.forEach(comment => {
                    if(comment.comment !== undefined){
                        const commentBody = `<b>${comment.username}</b>: ${comment.comment} <br>`
                        Comment.push(commentBody)
                    }
                });
                const id = `element_${post.id}`
                postElement.innerHTML = `
                  <div class="postbox">
                    <p id="name"><i class="fa fa-user-circle-o"></i> ${post.username}</p>
                    <p id="post-content">${post.content}</p>
                    <div id= "post-footer">
                    <div class="like-comment-btn">
                    <p id="like-btn"> 
                    <i id="heart-btn"class="fa fa-heart" onclick="likePost(${post.id})"></i> ${post.likes.length}</p>
                    <i class="fa fa-commenting-o"></i>
                    </div>
                    <div class="comments">
                    <h3>Comments (${Comment.length})</h3>
                    <p>${Comment}</p>
                    <div id="send-comment">
                    <input type="text" class="comment" id="${id}" placeholder="Write a comment" autocomplete="off" required>
                    <button id="comment-btn" onclick="showcomments(${post.id})">send</button>
                    </div>
                    </div>
                    <p>${post.caption}</p>
                    </div>
                  </div>
                `;
                postsContainer.appendChild(postElement);
            });
        });
}

async function showcomments(postId){
    const id = `element_${postId}`
    const user = localStorage.getItem("user")
    const parsedUser = JSON.parse(user)
    const commentInput = document.getElementById(`${id}`).value;
    if(user===null||user===undefined){
        alert("plz login to write a comment")
    }else{
        if(commentInput===""){
            alert("write somethimg")
        }else{
            await  fetch(`${serverURL}/${postId}`)
            .then(response => response.json())
            .then(post => {
                post.comments.push({comment:commentInput, username:parsedUser.username});
         
           //  HTTP PUT request to update the post
                fetch(`${serverURL}/${postId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(post)
                })
                .then(() => {
                    displayPosts();
                });
            });
        }
    }
}
// Function to create a new post
function createPost(Event) {
    Event.preventDefault();
    const newPostcontent = document.getElementById('content').value;
    const newPostUser = document.getElementById('username').value;
    const newPostCaption = document.getElementById('caption').value;


    const post = {
        content:newPostcontent, 
        caption:newPostCaption, 
        username:newPostUser,
        likes:[],
        comments:[]
     }

   if(newPostCaption===""||newPostUser===""||newPostcontent===""){
    alert("All Fields are Reaquires")
   }else{
    fetch(serverURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    })
    .then(() => {
        displayPosts();
        newPostcontent.value = '';
        newPostUser.value = '';
        newPostCaption.value = '';
    });
   }
}

// Function to like a post
async function likePost(postId) {
    const user = localStorage.getItem("user")
    const parsedUser = JSON.parse(user)
   await  fetch(`${serverURL}/${postId}`)
   .then(response => response.json())
   .then(post => {
       // Send an HTTP PUT request to update the post
       if(post.likes.some(i=> i === parsedUser.username)){
        let index = post.likes.indexOf(parsedUser.username)
        if(index !== -1){
            post.likes.splice(index, 1)
        }
        fetch(`${serverURL}/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        })
        .then(() => {
            displayPosts(); // Refresh the post list after updating the likes
        });

       }else{
        post.likes.push(parsedUser.username);
        fetch(`${serverURL}/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        })
        .then(() => {
            displayPosts();
        });
        
       }
   });
} 

// Initial display of posts
displayPosts();

// Event listener for creating a new post
const createPostButton = document.getElementById('create-post');
createPostButton.addEventListener('click', createPost)
