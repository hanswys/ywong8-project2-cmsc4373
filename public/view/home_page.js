import { currentUser } from "../controller/firebase_auth.js";
import { root } from "./element.js";
import { protectedView } from "./protected_view.js";
import { onClickCreateButton } from "../controller/home_controller.js";

let inventoryList = null;

export async function homePageView() {
    if (!currentUser) {
        root.innerHTML = await protectedView();
        return;
    }

    const response = await fetch('/view/templates/home_page_template.html',
        { cache: 'no-store' });
    const divWrapper = document.createElement('div');
    divWrapper.innerHTML = await response.text();
    divWrapper.classList.add('m-4', 'p-4')

    // const form = divWrapper.querySelector('form');
    // form.onsubmit = onSubmitCalcForm;
    divWrapper.querySelector('#form-create').onsubmit = onClickCreateButton;
    let homeRoot = divWrapper.querySelector('#home-root');


    root.innerHTML = '';
    root.appendChild(divWrapper);

    
    // if (inventoryList == null) {
    //     homeRoot.innerHTML = '<h2>Loading ...</h2>'
    //     try {
    //         inventoryList = await getPhotoMemoList(currentUser.uid);
    //     } catch (e) {
    //         homeRoot.innerHTML = '';
    //         console.log('failed to read: ', e);
    //         alert('Failed to get photomemo list: ' + JSON.stringify(e));
    //         return;
    //     }
    // }

    // if (inventoryList.length == 0) {
    //     homeRoot.innerHTML = '<h2>No photomemo has been added!</h2>'
    //     return;

    // }

    // homeRoot.innerHTML = '';
    // inventoryList.forEach(p => {
    //     const cardView = createPhotoMemoView(p);
    //     homeRoot.appendChild(cardView);
    // }); 
}