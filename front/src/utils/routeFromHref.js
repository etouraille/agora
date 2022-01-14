const routeFromHref = (value) => {
    let match = value ? value.match(/https?:\/\/([^\/]*)\/(.*)$/) : window.location.href.match(/https?:\/\/([^\/]*)\/(.*)$/);
    return '/' + match[2];
}
export default routeFromHref;
