import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const config = Rebar.useConfig();


config.initFromEnv('confirmDialogDefaultShowTime', {
    type: 'number',
    default: 10 * 1000,
    env: 'CONFIRM_DIALOG_DEFAULT_SHOW_TIME',
    required: false,
});


declare global {
    namespace NodeJS {
        interface ProcessEnv {
            CONFIRM_DIALOG_DEFAULT_SHOW_TIME: string;
        }
    }
}

declare module '@Server/config/index.js' {
    interface Config {
        confirmDialogDefaultShowTime: number;
    }
}