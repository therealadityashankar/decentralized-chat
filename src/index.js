import * as main from "./pages/show-qr/index.js"
import * as addChatee from "./pages/add-qr/index.js"
import * as addFriend from "./pages/edit-friend/index.js"
import * as topBar from "./topBar.js"
import UserManager from "./userManager.js"
import manageUI from "./userManagerUI.js"

async function waitForUsersFunction(){
  window.userManager = new UserManager({storageName:"users-storage"})
  await new Promise(res =>
      document
        .querySelector("wc-route-base[file='/src/base.html']")
        .addEventListener("loadContentLoaded", res));
  await manageUI();
  await userManager.createDefaultUserIfNeeded()
}

const waitForUsers = waitForUsersFunction()
let stillWaiting = true

waitForUsers.then(() => {
  stillWaiting = false
})

async function waitInit(){
  if(stillWaiting) await waitForUsers
}

const wcroutes = document.getElementsByTagName("wc-route")

for(let wcroute of wcroutes){
  if(wcroute.path === "/show-qr"){
    wcroute.addEventListener("loadContentLoaded", async e => {
      await waitInit()
      await main.load(wcroute)
    })
  } else if(wcroute.path === "/add-qr"){
    wcroute.addEventListener("shownContentLoaded", async e => {
      await waitInit()
      await addChatee.show(wcroute)
    })

    wcroute.addEventListener("hidden", async e => {
      await waitInit()
      await addChatee.hide(wcroute)
    })
  } else if(wcroute.path === "/edit-friend/:username"){
    wcroute.addEventListener("load", async e => {
      await waitInit()
      await addFriend.load(e)
    })
  }
}
