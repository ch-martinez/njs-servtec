import path from 'node:path'
import multer from "multer"
import { timeStamp } from './generate.mjs'
import fs from 'node:fs/promises'
import sharp from 'sharp'

//MemoryStorage
const memoryStorage = multer.memoryStorage()
export const memoryUpload = multer({ storage: memoryStorage })

//Funcion para guardar las imagenes en disco
export const saveImage = async (otk, image, i) => {
    try {
        const timestamp = timeStamp()
        const fileName = `${i}-${otk}__${timestamp}.jpeg`
        const uploadDir = await path.resolve(`.${process.env.DIR_ORDERS}/${otk}/images/`)
        const filePath = path.join(uploadDir, fileName)

        // Crear directorio de forma asíncrona (si no existe)
        await fs.mkdir(uploadDir, { recursive: true })

        // Procesar y guardar la imagen
        await sharp(image.buffer)
            .resize(300, 300)        // Redimensionar la imagen a 300x300
            .toFormat('jpeg')        // Convertir a JPEG
            .jpeg({ quality: 80 })   // Ajustar la calidad del JPEG
            .toFile(filePath)       // Guardar en disco

        return fileName
    } catch (error) {
        console.error('Error al guardar la imagen:', error.message)
        throw new Error('No se pudo procesar la imagen.')
    }
}