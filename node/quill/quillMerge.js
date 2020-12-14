const Delta = require("quill-delta");
const quillMerge = ( parentBody, childBody, index, length ) => {
    const parent = new Delta(JSON.parse(parentBody));
    const child = new Delta( JSON.parse(childBody) );
    const before = parent.slice(0, index );
    const content = child;
    const after = parent.slice(index + length , parent.length());
    let ret = before.concat(content );
    ret = ret.concat( after );
    return ret;
}
module.exports = {
    quillMerge,
}