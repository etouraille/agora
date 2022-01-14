const idFromRoute = (route) => {
    let match = route.match(/\/document\/(.*)$/);
    return match[1];
}
export default idFromRoute;
