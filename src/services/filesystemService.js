
export class FilesystemService extends FileService {
    constructor() {}
    createFile ( fileName, data, contentType, options){}
    getFileData (filename){}

}

var filesystemService = new FilesystemService();

module.exports = filesystemService;