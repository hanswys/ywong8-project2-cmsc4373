import { onClickHomeMenu, onClickMenu2Menu } from "./controller/menueventhandlers.js";
import { signinPageView } from "./view/signin_page.js";
import { attachAuthStateChangeObserver } from "./controller/firebase_auth.js";

// menu button handler 
document.getElementById('menu-home').onclick = onClickHomeMenu;
document.getElementById('menu-menu2').onclick = onClickMenu2Menu;

attachAuthStateChangeObserver();

signinPageView();