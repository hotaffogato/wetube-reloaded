import { async } from "regenerator-runtime";
const videoContainer = document.getElementById("videoContainer")
const form = document.getElementById("commentForm");


const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const content = textarea.value
  if(content === ""){
    return
  }
  textarea.value = ""

  const videoId = videoContainer.dataset.id
  await fetch(`/api/videos/${videoId}/comment`,{
    method:"POST",
    headers:{
      "Content-Type": "application/json",
    },
    body:JSON.stringify({content})
  })
}

if(form){
    form.addEventListener("submit", handleSubmit)
}