const videoContainer = document.getElementById("videoContainer")
const form = document.getElementById("commentForm")

const handleSubmit = async (event) => {
  event.preventDefault();
  console.log(event.target)
  const textarea = form.querySelector("textarea");
  const content = textarea.value
  if(content === ""){
    return
  }
  textarea.value = ""
  
  const videoId = videoContainer.dataset.id
  const response = await fetch(`/api/videos/${videoId}/comment`,{
    method:"POST",
    headers:{
      "Content-Type": "application/json",
    },
    body:JSON.stringify({content})
  })
  console.log(response)
  // window.location.reload();
}

// const handleDelete = async (event) => {
//   console.log("comment js handle delete is run")
//   event.preventDefault();
//   const {id : commentId} = event.target.dataset
//   const videoId = videoContainer.dataset.id
//   const response = await fetch(`/api/videos/${videoId}/comment/${commentId}/delete`,{
//     method:"GET",
//     headers:{
//       "Content-Type": "application/json",
//     },
//   })
//   console.log("response : ",response)
//   // window.location.reload()
// }

// const deleteCommentBtn = document.getElementById("comment-remove")
// deleteCommentBtn.addEventListener("click", handleDelete)

form.addEventListener("submit", handleSubmit)
