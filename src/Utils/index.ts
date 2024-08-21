import { keccak256 } from 'web3-utils';

import birdPng from '../assets/pngs/bird.png';
import lionPng from '../assets/pngs/lion.png';
import fullmoonPng from '../assets/pngs/full-moon.png';
import pandaPng from '../assets/pngs/panda.png';
import rocketPng from '../assets/pngs/rocket.jpg';
import rosePng from '../assets/pngs/white-rose.png';
import butterFly from '../assets/pngs/butterfly.png';
import egypt from '../assets/pngs/egypt.png';
import lotus from '../assets/pngs/lotus.png';
import machu from '../assets/pngs/machu.png';
import taj from '../assets/pngs/taj.png';

const images = [birdPng, lionPng, fullmoonPng, pandaPng, rocketPng, rosePng, butterFly, egypt, lotus, machu, taj]

export default class Utils {

    static generateByte64Id(id = '') {
        let randomHex = id;
        //let randomHex = Crypto.randomBytes(32).toString('hex');
        let generatedId = keccak256(randomHex);
        return generatedId;
    }

    static generateDocID(cardname: string, src: string) {
        // if (!cardname || !src) {
        //     return Promise.reject("Unable to generate docID, Reason: Invalid parameters")
        // }
        let docMessage = `${cardname}${src}`
        let docID = Utils.generateByte64Id(docMessage)
        return docID;
    }

    // Function to shuffle an array using the Fisher-Yates algorithm
    static shuffleArray = <T>(array: T[]): T[] => {
        let currentIndex = array.length;
        let randomIndex: number;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    };
    static getDynamicGrid = (totalGrids: number): { src: string, key: string, _id: string }[][] => {
        // Determine the number of rows and columns based on totalGrids
        const rows = Math.floor(Math.sqrt(totalGrids));
        const columns = Math.ceil(totalGrids / rows);

        // Check if we have an even number of cells
        if (totalGrids % 2 !== 0) {
            throw new Error('Grid must have an even number of cells to create pairs.');
        }
        // Create an array of image objects to use in the grid
        const numCells = rows * columns;
        // Check if we have an even number of cells
        if (numCells % 2 !== 0) {
            throw new Error('Grid must have an even number of cells to create pairs.');
        }
        let imageObjects = images.flatMap(img => [{ src: img }, { src: img }]);
        // Ensure there are enough pairs to fill the grid
        const pairsNeeded = numCells / 2;
        // If not enough images are provided, duplicate or fill with placeholder images
        while (imageObjects.length < pairsNeeded * 2) {
            imageObjects = imageObjects.concat(imageObjects); // Duplicate existing images
        }

        // Ensure the image objects array is exactly the right length
        imageObjects = imageObjects.slice(0, pairsNeeded * 2);
        const extendedImageObjects = this.shuffleArray(imageObjects).slice(0, pairsNeeded * 2);

        // Shuffle the image objects to randomize their order
        const shuffledImageObjects = this.shuffleArray(extendedImageObjects);
        return Array.from({ length: rows }, (_, rowIndex) =>
            Array.from({ length: columns }, (_, colIndex) => {
                const imageIndex = (rowIndex * columns + colIndex);
                return {
                    src: shuffledImageObjects[imageIndex].src || '',
                    key: `card${rowIndex}${colIndex}`,
                    _id: this.generateDocID(`card${rowIndex}${colIndex}`, shuffledImageObjects[imageIndex].src)
                }
            })
        );
    }
}