import useWindowDimensions from "./useWindowDimensions";

const maxWidth = 400;

export default function useIsMobile() {

    const { height, width } = useWindowDimensions();

    return width <= maxWidth;

}
