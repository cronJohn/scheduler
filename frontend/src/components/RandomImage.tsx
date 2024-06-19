import { createSignal, onMount, type Component } from 'solid-js';

const RandomImage: Component = () => {
    const [getImageIndex, setImageIndex] = createSignal<number>(0);
    const [getImageMeta, setImageMeta] = createSignal<string>("");

    async function getImageMetadata(): Promise<any> {
        try {
            const response = await fetch('/assets/randomImages/metadata.json');
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching image metadata:', error);
            return null;
        }
    }

    onMount(async () => {
        const data = await getImageMetadata();
        if (data) {
            const keys = Object.keys(data);
            const randomIndex = Math.floor(Math.random() * keys.length);

            setImageIndex(randomIndex);
            setImageMeta(data[keys[randomIndex]]);
        }
    });

    return (
        <img src={`/assets/randomImages/${getImageIndex()}.webp`} alt={getImageMeta() || "Random Image"}
        class='rd-15px w-2/3 h-auto'/>
    );
};

export default RandomImage;
