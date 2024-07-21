import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import "./config.js";
import { useConfirmDialog } from './api.js';

const Rebar = useRebar();
Rebar.useApi().register('confirm-dialog', useConfirmDialog);

alt.on('playerConnect', (player) => {
    Rebar.usePlayer(player).webview.show('ConfirmDialog', 'overlay');
});

declare global {
    interface ServerPlugin {
        'confirm-dialog': typeof useConfirmDialog;
    }
}
