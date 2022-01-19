const routeFromHref = (value) => {
    let match = value ? value.match(/https?:\/\/([^\/]*)\/(.*)$/) : window.location.href.match(/https?:\/\/([^\/]*)\/(.*)$/);
    return '/' + (match ? match[2]: null);
}
export default routeFromHref;
