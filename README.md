# Confirm Dialog for Rebar

The Confirm Dialog plugin provides a way to display a confirmation dialog and handle the user's response. The plugin also has a timeout feature and the option to trigger a "NO" response on it.

## Installation

1. [Download](https://github.com/floydya/rebar-confirm-dialog/archive/refs/heads/main.zip) the repo.
2. Put the directory into `src/plugins` folder of your Rebar project.
3. That's all, folks!

## Usage

```typescript
const useConfirmDialog = Rebar.useApi().get('confirm-dialog');

const created = useConfirmDialog(player).create({
    title: 'Hello',
    message: 'Do you want to continue?',
    callback: (player: alt.Player, result: boolean) => {
        if (result) {
            // User pressed Y.
        } else {
            // User pressed N.
        }
    },
    showTime: 10 * 1000, // 10 seconds
});

// This will let you know if confirmation dialog was created for player.
// The only scenario, when you can get `false` - player already has an active dialog.
console.log(created);

useConfirmDialog(player).create({
    title: 'Hello',
    message: 'Any other message',
    callback: (player: alt.Player, result: boolean) => {
        if (result) {
            console.log("Player answered 'YES'");
        } else {
            console.log("Player answered 'NO' or dialog timed out.");
        }
    },
    // By default, it will just destroy the dialog,
    // but if you want to trigger "NO" result, use this:
    triggerNoOnTimeout: true,
});
```

### Default dialog show time could be configured with ENV variable:

```
CONFIRM_DIALOG_DEFAULT_SHOW_TIME=15000
```

> [!NOTE]
> By default it equals to 10 seconds(10000).
