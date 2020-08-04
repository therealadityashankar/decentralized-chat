import * as main from "./pages/show-qr/index.js"
import * as addChatee from "./pages/add-qr/index.js"
import UserManager from "./userManager.js"

window.userManager = new UserManager()
userManager.createDefaultUser()

const wcroutes = document.getElementsByTagName("wc-route")

for(let wcroute of wcroutes){
  if(wcroute.path === "/"){
    wcroute.addEventListener("loadContentLoaded", async e => {
      await main.load(wcroute)
    })
  } else if(wcroute.path === "/add-qr"){
    wcroute.addEventListener("shownContentLoaded", async e => {
      await addChatee.show(wcroute)
    })

    wcroute.addEventListener("hidden", async e => {
      await addChatee.hide(wcroute)
    })
  }
}
