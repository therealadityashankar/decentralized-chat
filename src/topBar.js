const elements = {}

export function init(){
  elements.goBack = document.querySelector("#app-top-bar .go-back")
  elements.goBack.addEventListener("click", e => {
    window.history.back();
  })
  wcrouter.addEventListener("routeChange", showGoBackIfCorrectRoute)
  showGoBackIfCorrectRoute()
}

function showGoBackIfCorrectRoute(){
  if(wcrouter.currentRoute.path === "/"){
    elements.goBack.classList.add("invisible")
  } else{
    elements.goBack.classList.remove("invisible")
  }
}
