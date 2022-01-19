const idFromRoute = (route) => {
    let match = route.match(/\/document\/(.*)$/);
    return match ? match[1]: null;
}
export default idFromRoute;
