import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { ConfirmDialogEvents, ConfirmDialogOptions } from '../shared/index.js';

const Rebar = useRebar();
const Keybinder = Rebar.useKeybinder();
const confirmDialogs: Map<string, {
    options: ConfirmDialogOptions;
    timer: number;
}> = new Map();

/**
 * Ask the player for a confirmation dialog.
 * Only one dialog can be active at a time.
 * 
 * @param {alt.Player} player The player to ask.
 * @returns The create and destroy functions.
 */
export function useConfirmDialog(player: alt.Player) {
    const defaultShowTime = Rebar.useConfig().getField('confirmDialogDefaultShowTime');
    const rPlayer = Rebar.usePlayer(player);
    const _id = rPlayer.character.getField('_id');

    /**
     * Create a confirmation dialog. Only one dialog can be active at a time.
     * @param {ConfirmDialogOptions} dialogOptions The options for the dialog.
     * @returns {boolean} True if the dialog was created. False if a dialog for this player already exists.
     */
    function create(dialogOptions: ConfirmDialogOptions): boolean {
        if (confirmDialogs.has(_id)) {
            return false;
        }
        dialogOptions.showTime = dialogOptions.showTime || defaultShowTime;
        confirmDialogs.set(_id, {
            options: dialogOptions,
            timer: alt.setTimeout(() => {
                if (dialogOptions.triggerNoOnTimeout) {
                    triggerResult(false);
                } else {
                    destroy();
                }
            }, dialogOptions.showTime),
        });
        const {callback, ...dialog} = dialogOptions;
        rPlayer.webview.emit(ConfirmDialogEvents.toWebview.create, dialog);
        return true;
    }

    /**
     * Trigger the result of the confirmation dialog.
     * @param {boolean} result The result of the dialog.
     * @returns {void}
     */
    function triggerResult(result: boolean): void {
        const dialog = confirmDialogs.get(_id);
        if (dialog) {
            dialog.options.callback(player, result);
            destroy();
        }
    }

    /**
     * Destroy the confirmation dialog.
     * @returns {void}
     */
    function destroy(): void {
        const dialog = confirmDialogs.get(_id);
        if (dialog) {
            if (dialog?.timer) alt.clearTimeout(dialog.timer);
            confirmDialogs.delete(_id);
        }
        rPlayer.webview.emit(ConfirmDialogEvents.toWebview.destroy);
    }

    return { create, triggerResult, destroy };
}

Keybinder.on(89, (player: alt.Player) => {
    const confirmDialog = useConfirmDialog(player);
    confirmDialog.triggerResult(true);
});

Keybinder.on(78, (player: alt.Player) => {
    const confirmDialog = useConfirmDialog(player);
    confirmDialog.triggerResult(false);
});
