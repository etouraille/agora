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

export const truncateChar = (editor, start, stop ) => {
    let length = editor.getLength();
    let content = editor.getContents();
    let delta = [];

    if(start > length) {
        start = 0;
    }
    if(stop > length ) {
        stop = length;
    }
    delta.push({retain: 0, delete: start});
    delta.push({retain: Math.round(stop - start)});
    delta.push({delete: stop});
    if (delta.length > 0) editor.setContents(content.compose(new Delta(delta)));
}
