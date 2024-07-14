export default async function getBufferFromFile(file: File): Promise<Buffer> {

    const fileReader = file.stream().getReader();
    const fileDataU8: number[] = [];

    while (true) {
        const { done, value } = await fileReader.read();

        if (done) break;
        // Convert value (Uint8Array) to an array before spreading
        fileDataU8.push(...Array.from(value));
    }

    // Create a Buffer from a Uint8Array created from fileDataU8
    return Buffer.from(new Uint8Array(fileDataU8));
}
