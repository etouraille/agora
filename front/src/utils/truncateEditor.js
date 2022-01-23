import Delta from "quill-delta";

export const firstChar = (editor, displayLength ) => {

    let length = editor.getLength();
    let content = editor.getContents();
    let delta = [];
    if (length <= displayLength) {
        displayLength = length;
    } else {
        delta.push({retain: displayLength})
        delta.push({delete: length - displayLength});
    }
    editor.setContents(content.compose(new Delta(delta)));
}

export const lastChar = ( editor, displayLength ) => {
    let length = editor.getLength();
    let content = editor.getContents();
    let delta = [];
    if (length <= displayLength) {
        displayLength = length;
    } else {
        delta.push({delete: length - displayLength});
    }
    editor.setContents(content.compose(new Delta(delta)));
}
