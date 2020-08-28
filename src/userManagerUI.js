import * as topBar from "./topBar.js"

let ui;

export default async function manageUI(){
  setUIVariables()
  const refreshing = refreshUser()
  userManager.addEventListener("currentUserChange", refreshUser)
  await refreshing;
  await topBar.init()
}

function setUIVariables(){
  ui = {
    user: {
      name: document.querySelector("#app-top-bar .user-name"),
      image: document.querySelector("#app-top-bar .user-photo")
    }
  }
}

async function refreshUser(){
    const user = await userManager.getCurrentUser()
    ui.user.name.innerText = await user.getS('name')||"Unnamed user"
    const image = await user.getS("image")||""
    if(image === "") {
      ui.user.image.src = (new URL("./images/anonymousUser.svg", import.meta.url)).href;
    } else{
      ui.user.image.src = image
    }
}
