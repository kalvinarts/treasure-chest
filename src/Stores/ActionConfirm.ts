import { makeAutoObservable } from 'mobx';

/**
 * This class will be used to show a confirm dialog before executing an action
 * @class ActionConfirm
 * @property {boolean} isOpen - This will mark the confirm dialog as open
 * @property {boolean} confirm - This will mark if the confirm dialog should be shown
 * @property {function} confirmCallback - This will be called when the confirm dialog is confirmed
 * @method triggerConfirm - This will trigger the confirm dialog
 * @method clearConfirm - This will clear the confirm dialog and call the confirmCallback
 */
class ActionConfirm {
  isOpen = false;
  confirm = false;
  confirmCallback = () => {};

  constructor() {
    makeAutoObservable(this);
  }

  triggerConfirm() {
    if (this.confirm) {
      this.isOpen = true;
    } else {
      this?.confirmCallback();
      this.confirmCallback = () => {};
    }
  }

  clearConfirm() {
    this.isOpen = false;
    this.confirm = false;
    this?.confirmCallback();
    this.confirmCallback = () => {};
  }
}

export default ActionConfirm;