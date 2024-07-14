
export default async function getBufferFromFile(file: File): Buffer {

    // get reader from File
    const fileReader = file.stream().getReader();
    const fileDataU8: number[] = [];

    // read the file
    while (true){
    const {done,value} = await fileReader.read();

    if (done) break;
        fileDataU8.push(...value);
    }

    return Buffer.from(fileDataU8, 'binary');
}