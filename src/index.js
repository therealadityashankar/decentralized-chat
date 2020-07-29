wcrouter.addEventListener("routeLoad", async e => {
  if(e.detail.currentRoute.path === "/"){
    const main = await import("./pages/main/main.js");
    await main.load(e.detail.currentRoute)
  } else if(e.detail.currentRoute.path === "/add-chatee"){
    const addChatee = await import("./pages/add-chatee/index.js")
    addChatee.load(e.detail.currentRoute)
  }
})
