export function prettifyKeyboardShortcut(input: string) {
  return input
    .split("+")
    .join("")
    .replace("Command", "⌘")
    .replace("Shift", "⇧")
    .replace("Control", "⌃")
    .replace("Enter", "↩")
    .toUpperCase();
}
