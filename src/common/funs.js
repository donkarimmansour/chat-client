import { Host } from "./apiEndPoints"

const ImageVIEW = (img) => {
    return `${Host.BACKEND}${Host.PREFIX}/file/get-single-file/${img}/view`
}

const ImageDOWNLOAD = (img) => {
    return `${Host.BACKEND}${Host.PREFIX}/file/get-single-file/${img}/download`
}



export {ImageVIEW , ImageDOWNLOAD }   