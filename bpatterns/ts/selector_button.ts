import { PatternSelectorPopup } from './pattern_selector.js'

const selector = new PatternSelectorPopup(load_pattern_names) 
const load_menu_button = document.getElementById("load_in_pattern_button") as HTMLElement
load_menu_button.addEventListener('click', async () => {
  const name = await selector.open() // string | null
  if (name) {
    update_params(await load_pattern_config(name))
  }
})