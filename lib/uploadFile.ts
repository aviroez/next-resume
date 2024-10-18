import fs from 'fs'
import path from 'path'
import { format } from 'date-fns';
import generateSlug from './generateSlug';

const uploadDir = process.env.UPLOAD_DIR ?? "uploads"
const UPLOAD_DIR = path.resolve(uploadDir);

export function getUploadDir() {
    return uploadDir;
}

export async function uploadFile(file: Blob) {  
    try {
        const directory = getUploadDir();
        const buffer = Buffer.from(await file.arrayBuffer());
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR);
        }

        const fileName = (file as File).name;
        const extension = path.parse(fileName).ext;

        const rename = generateSlug(path.parse(fileName).name)
        const curtime = format(new Date(), 'yyyyMMdd_HHmmss')
        const renameFullName = `${rename}_${curtime}${extension.toLowerCase()}`

        fs.writeFileSync(
            path.resolve(UPLOAD_DIR, renameFullName),
            buffer
        );
        return {fileName: renameFullName, directory, success: true};
    } catch (err: unknown) {
        console.log(err)
        return {success: false, error: err};
    }
  }