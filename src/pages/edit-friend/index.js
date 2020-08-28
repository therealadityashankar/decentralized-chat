const ui = {};

export async function load(e){
  await e.detail.waitForContent()
  getUI(e.detail.wcroute)
  ui.nameInput.value = "something"
}

const getUI = (wcroute) => {
  ui.nameInput = wcroute.querySelector('.name-input input')
}
