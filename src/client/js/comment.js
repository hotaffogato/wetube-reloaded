const videoContainer = document.getElementById("videoContainer")
const form = document.getElementById("commentForm")

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const content = textarea.value
  if(content === ""){
    return
  }
  textarea.value = ""
  
  const videoId = videoContainer.dataset.id
  try{
  await fetch(`/api/videos/${videoId}/comment`,{
    method:"POST",
    headers:{
      "Content-Type": "application/json",
    },
    body:JSON.stringify({content})
  })
  } catch (error) {
    console.log(error)
  }
  window.location.reload();
}

const commentRemove = document.getElementById("comment-remove")
const handleRemove = async (event) => {
  event.preventDefault()
  const {commentid:commentId, videoid:videoId} = event.target.dataset
  if(event.target === commentRemove){
    try{
      await fetch(`/api/videos/${videoId}/comment/${commentId}/delete`,{
      method:"DELETE",
      headers:{
        "Content-Type": "application/json",  
      },
    })
    } catch (error) {
      console.log(error)
    }
    window.location.reload();
  }
}

if(commentRemove){
  commentRemove.addEventListener("click", handleRemove)
}

form.addEventListener("submit", handleSubmit)
