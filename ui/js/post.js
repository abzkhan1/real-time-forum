import { deletePost, likeDislike, editPost, addPostDisplay, viewComments } from './postInteraction.js'
import { noUserDisplay } from './profile.js'

const postButton = document.querySelector('.create-post-button')
postButton.addEventListener('click', () => {
  if (document.getElementsByClassName('profile-nav').value === '' || document.getElementsByClassName('profile-nav').value === undefined) {

    noUserDisplay()

  } else {
    postButton.disabled = true
    addPostDisplay()
  }
})

export function displayPosts() {
  fetch("http://localhost:8000/getPosts")
    .then(response => response.json())
    .then(response => {
      console.log(response)
      let postDiv
      let postContainer
      if (document.querySelector('.homepage') == undefined) {

        postDiv = document.createElement('div')
        postDiv.classList.add('homepage')

        const filterDiv = document.createElement('div')
        filterDiv.classList.add('post-filter-container')
        const postUserFilter = document.createElement('input')
        postUserFilter.type = "text"
        postUserFilter.classList.add('post-user-filter')
        postUserFilter.placeholder = "by User"
        filterDiv.appendChild(postUserFilter)

        postUserFilter.addEventListener('input', (evt) => {
          const postsInput = Array.from(document.querySelectorAll('.post')).filter(post =>
            post.childNodes[1].firstChild.textContent
              .toLocaleLowerCase()
              .includes(evt.target.value.trim().toLocaleLowerCase())
          )
          Array.from(document.querySelectorAll('.post')).some(r => {
            if (!postsInput.includes(r)) {
              r.style.display = "none"
            } else {
              r.style.display = "block"
            }
          })
          console.log(postsInput)
        })

        const postThreadFilter = document.createElement('input')
        postThreadFilter.type = "text"
        postThreadFilter.classList.add('post-thread-filter')
        postThreadFilter.placeholder = "by Thread"
        filterDiv.appendChild(postThreadFilter)

        postThreadFilter.addEventListener('input', (evt) => {
          const postsInput = Array.from(document.querySelectorAll('.post')).filter(post => {
            for (let t = 0; t < post.children.length; t++) {
              if (post.children[t].className == "post-thread-list") {
                if (post.children[t].children.length > 0) {
                  for (let thread = 0; thread < post.children[t].children.length; thread++) {
                    if (post.children[t].children[thread].textContent
                      .toLocaleLowerCase()
                      .includes(evt.target.value.trim().toLocaleLowerCase())) {
                      return post
                    }
                  }
                } else if (evt.target.value == "") {
                  return post
                }
              }
            }
          })

          Array.from(document.querySelectorAll('.post')).some(r => {
            if (!postsInput.includes(r)) {
              r.style.display = "none"
            } else {
              r.style.display = "block"
            }
          })
        })

        const postOrderFilter = document.createElement('button')
        postOrderFilter.type = "button"
        postOrderFilter.classList.add('post-order-filter')
        postOrderFilter.classList.add('descending')
        const orderIcon = document.createElement('img')
        orderIcon.src = "ui/img/order.png"
        orderIcon.classList.add('post-order-icon-descending')
        postOrderFilter.appendChild(orderIcon)

        postOrderFilter.addEventListener('click', () => {
          orderIcon.classList.toggle("post-order-icon-ascending")
          var posts = document.getElementsByClassName("post");
          var i = posts.length;
          while (i--)
            postContainer.appendChild(posts[i]);
        })



        filterDiv.appendChild(postOrderFilter)
        postDiv.appendChild(filterDiv)
        postContainer = document.createElement('div')
        postContainer.classList.add("post-container")

      } else {
        postDiv = document.querySelector(".homepage")
        postContainer = document.querySelector(".post-container")
      }
      postDiv.appendChild(postContainer)
      document.querySelector('body').appendChild(postDiv)

      for (let p = response.length - 1; p >= 0; p--) {
        createPost("view", response[p])
      }
    })
}

export function createPost(action, newPost) {
  let postContainer = document.querySelector(".post-container")

  //create post holder
  const post = document.createElement('div')
  post.classList.add("post")

  // create add post ID
  const postID = document.createElement('input')
  postID.type = "hidden"
  postID.name = "postID"
  postID.value = newPost["post-id"]
  post.appendChild(postID)

  // post Author
  const postAuthorDiv = document.createElement('div')
  postAuthorDiv.classList.add('post-author-container')
  //create img for dp
  const postAuthor = document.createElement('h2')
  postAuthor.classList.add('post-author')
  postAuthor.innerHTML = newPost["author"]
  postAuthorDiv.appendChild(postAuthor)
  post.appendChild(postAuthorDiv)

  //time
  const postDateAndTime = new Date(newPost["post-time"])
  const postTime = document.createElement('p')
  postTime.classList.add('post-time')
  postTime.innerHTML = postDateAndTime.toLocaleString()
  post.appendChild(postTime)

  const postImageDiv = document.createElement('div')
  postImageDiv.classList.add('post-image-container')

  //image
  if (newPost['post-image'] !== '') {
    const postImage = document.createElement('img')
    postImage.classList.add('post-image-display')
    postImage.style.display = 'none'
    postImage.onload = () => {
      postImage.style.display = 'block'
    }
    postImage.src = newPost['post-image']
    postImageDiv.appendChild(postImage)
    post.appendChild(postImageDiv)
  }

  //text
  if (newPost['post-text-content'] !== '') {
    const postText = document.createElement('h3')
    postText.classList.add('post-text-content')
    postText.innerHTML = newPost['post-text-content']
    post.appendChild(postText)
  }

  const postThreadList = document.createElement('div')
  postThreadList.classList.add('post-thread-list')
  post.appendChild(postThreadList)

  if (newPost['post-threads'] != '') {
    let threadSplit = newPost['post-threads'].split('#')
    let removeEmptyThread = threadSplit.filter(thread => thread != '')
    removeEmptyThread.forEach((thread, i) => {
      if (i < removeEmptyThread.length - 1) {
        const postThreads = document.createElement('p')
        postThreads.innerHTML = '#' + thread.slice(0, - 1)
        postThreadList.appendChild(postThreads)
      } else {
        const postThreads = document.createElement('p')
        postThreads.innerHTML = '#' + thread
        postThreadList.appendChild(postThreads)
      }
    });
  }

  const postInteractionDiv = document.createElement('div')
  postInteractionDiv.classList.add('post-interaction')

  const likeButton = document.createElement('button')
  likeButton.classList.add('post-like-button')
  const likeNumber = document.createElement('p')
  likeNumber.innerHTML = newPost['post-likes']
  likeButton.setAttribute('id', postID.value)
  const likeIcon = document.createElement('img')
  likeIcon.src = "ui/img/like.png"
  likeIcon.classList.add('post-like-icon')
  likeButton.appendChild(likeNumber)
  likeButton.appendChild(likeIcon)
  postInteractionDiv.appendChild(likeButton)

  const dislikeButton = document.createElement('button')
  dislikeButton.classList.add('post-dislike-button')
  const dislikeNumber = document.createElement('p')
  dislikeNumber.innerHTML = newPost['post-dislikes']
  dislikeButton.setAttribute('id', postID.value)
  const dislikeIcon = document.createElement('img')
  dislikeIcon.src = "ui/img/dislike.png"
  dislikeIcon.classList.add('post-dislike-icon')
  dislikeButton.appendChild(dislikeNumber)
  dislikeButton.appendChild(dislikeIcon)
  postInteractionDiv.appendChild(dislikeButton)

  likeButton.addEventListener('click', () => {
    if (document.getElementsByClassName('profile-nav').value === '' || document.getElementsByClassName('profile-nav').value === undefined || document.getElementsByClassName('profile-nav').value === undefined) {
      noUserDisplay()
    } else {
      likeDislike(likeNumber, dislikeNumber, likeButton.id, "l")
    }
  })

  dislikeButton.addEventListener('click', () => {
    if (document.getElementsByClassName('profile-nav').value === '' || document.getElementsByClassName('profile-nav').value === undefined) {
      noUserDisplay()
    } else {
      likeDislike(likeNumber, dislikeNumber, likeButton.id, "d")
    }
  })

  const commentButton = document.createElement('button')
  commentButton.classList.add('post-comment-button')
  commentButton.setAttribute('id', postID.value)
  const commentIcon = document.createElement('img')
  commentIcon.src = "ui/img/comment.png"
  commentIcon.classList.add('post-comment-icon')
  commentButton.appendChild(commentIcon)
  postInteractionDiv.appendChild(commentButton)

  commentButton.addEventListener('click', () => {
    viewComments(commentButton.id)
  })

  if (newPost['author'] == document.getElementsByClassName('profile-nav').value) {

    const editButton = document.createElement('button')
    editButton.classList.add('post-edit-button')
    editButton.setAttribute('id', postID.value)
    const editIcon = document.createElement('img')
    editIcon.src = "ui/img/edit.png"
    editIcon.classList.add('post-edit-icon')
    editButton.appendChild(editIcon)
    postInteractionDiv.appendChild(editButton)

    editButton.addEventListener('click', () => {
      // const currentPost = editButton.parentNode.parentNode
      editPost(editButton.id)
    })


    const deletePostButton = document.createElement('button')
    deletePostButton.classList.add('post-delete-post-button')
    deletePostButton.setAttribute('id', postID.value)
    const deletePostIcon = document.createElement('img')
    deletePostIcon.src = "ui/img/deletePost.png"
    deletePostIcon.classList.add('post-delete-post-icon')
    deletePostButton.appendChild(deletePostIcon)
    postInteractionDiv.appendChild(deletePostButton)

    deletePostButton.addEventListener('click', () => {
      if (document.getElementsByClassName('profile-nav').value === '' || document.getElementsByClassName('profile-nav').value === undefined) {
        noUserDisplay()
      } else {
        deletePost(deletePostButton.id)
      }
    })

  }
  post.appendChild(postInteractionDiv)
  //if profile value !='' add like, dislike, edit and comment buttons
  if (action == "add") {
    let currentPosts = document.querySelectorAll('.post')
    postContainer.insertBefore(post, currentPosts[0])
  } else {
    postContainer.appendChild(post)
  }

}