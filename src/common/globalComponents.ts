import MsButton from '../components/base/ms-button/MsButton.vue';
import MsModal from '../components/base/ms-modal/MsModal.vue';
import MsDatepicker from '../components/base/ms-datepicker/MsDatepicker.vue';
import MsInput from '../components/base/ms-input/MsInput.vue';
import MsTextArea from '../components/base/ms-textarea/MsTextArea.vue';
import MsSelect from '../components/base/ms-select/MsSelect.vue';
import MsCheckbox from '../components/base/ms-checkbox/MsCheckbox.vue';
import type { App } from 'vue';


export const globalComponents = (app: App<Element>) => {
    app.component('MsButton', MsButton);
    app.component('MsModal', MsModal);
    app.component('MsDatepicker', MsDatepicker);
    app.component('MsInput', MsInput);
    app.component('MsTextArea', MsTextArea);
    app.component('MsSelect', MsSelect);
    app.component('MsCheckbox', MsCheckbox);
};