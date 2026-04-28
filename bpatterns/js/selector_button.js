var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PatternSelectorPopup } from './pattern_selector.js';
const selector = new PatternSelectorPopup(load_pattern_names);
const load_menu_button = document.getElementById("load_in_pattern_button");
load_menu_button.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    const name = yield selector.open(); // string | null
    if (name) {
        update_params(yield load_pattern_config(name));
    }
}));
