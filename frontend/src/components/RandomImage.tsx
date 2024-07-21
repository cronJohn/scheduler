import { createSignal, onMount, type Component } from 'solid-js';

const RandomImage: Component = () => {
    const [getImageIndex, setImageIndex] = createSignal<number>(0);
    const [getImageMeta, setImageMeta] = createSignal<string>("");


    onMount(async () => {
        const metadata: { [key: number]: string } = {
            0: "Chippi cat",
            1: "Side eye cat",
            2: "Caseoh cat"
        };  
        const randomIndex = Math.floor(Math.random() * Object.keys(metadata).length);

        setImageIndex(randomIndex);
        setImageMeta(metadata[randomIndex]);
    });

    return (
        <img src={`/assets/randomImages/${getImageIndex()}.webp`} alt={getImageMeta() || "Random Image"}
        class='rd-15px min-w-250px max-h-250px'/>
    );
};

export default RandomImage;
