import * as alt from 'alt-shared';

export interface ConfirmDialog {
    title: string;
    message: string;
    showTime?: number;
}

export interface ConfirmDialogOptions extends ConfirmDialog {
    callback: (player: alt.BaseObject, result: boolean) => void;
    triggerNoOnTimeout?: boolean;
}

export const ConfirmDialogEvents = {
    toServer: {
        answer: 'confirmDialog:answer',
    },
    toWebview: {
        create: 'confirmDialog:create',
        destroy: 'confirmDialog:destroy',
    },
};
