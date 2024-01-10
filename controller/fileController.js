const { StatusCodes } = require("http-status-codes")
const FileSchema = require('../model/fileModel')
const User = require('../model/userModel')
const path = require('path')
const fs = require('fs')
const fileType = require('../util/fileExt')

// remove files
const removeTemp =  (filePath) => {
        fs.unlinkSync(filePath)
}

// upload - post + data
const uploadFile = async (req,res) => {
    try {
        const { product } = req.files
        // to get file extension
        // let fileExt = path.extname(product.name) 
        // return res.json({ fileExt, product })

        const id = req.userId

        // check the public folder if folder not exists create it
        const outPath = path.join(__dirname, '../public')
        if(!fs.existsSync(outPath)) {
            fs.mkdirSync(outPath, { recursive: true })
        }

        // no files are attched
        if(!req.files)
            return res.status(StatusCodes.NOT_FOUND).json({ msg: `No files to upload..`})
        
        // fetch user info
        let extUser = await User.findById({ _id: id }).select('-password')
        // if user id not found
            if(!extUser){
                removeTemp(product.tempFilePath)
                return res.status(StatusCodes.CONFLICT).json({ msg: `requested user id not found`})
            }
              

        // validate the file ext
        if(product.mimetype === fileType.docx || 
            product.mimetype === fileType.pptx || 
            product.mimetype === fileType.doc || 
            product.mimetype === fileType.ppt || 
            product.mimetype === fileType.pdf || 
            product.mimetype === fileType.png || 
            product.mimetype === fileType.jpg) {
            // store the file in physycial location
            await product.mv(path.resolve(__dirname, `../public/${product.name}`), async (err) => {
                if(err){
                    removeTemp(product.tempFilePath)
                    return res.status(StatusCodes.CONFLICT).json({ msg: err})
                }
                    // add file info to db collection
                let fileRes = await FileSchema.create({ user: extUser, info: product })
                    // final response
                res.status(StatusCodes.ACCEPTED).json({ msg: "File uploaded successfully", file: fileRes})
            }) 
        }else {
            removeTemp(product.tempFilePath)
            return res.status(StatusCodes.CONFLICT).json({ msg: `upload only .pdf,.doc,.docx,.ppt,.pptx,.png,.jpeg files`})
        }

    } catch (err) {
        removeTemp(product.tempFilePath)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err})
    }
}

// read all - get
const readAll = async (req,res) => {
    try {
        let files = await FileSchema.find({})
        res.status(StatusCodes.OK).json({ length: files.length, files  })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err})
    }
}

// read single - get + ref
const readSingle = async (req,res) => {
    try {
        res.json({ msg: "read single"})
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err})
    }
}

// delete - delete + ref
const deleteFile = async (req,res) => {
    try {
        res.json({ msg: "delete file"})
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err})
    }
}

module.exports = { uploadFile, readAll, readSingle, deleteFile }