const routeFromHref = () => {
    let match = window.location.href.match(/https?:\/\/([^\/]*)\/(.*)$/);
    return '/' + match[2];
}
export default routeFromHref;