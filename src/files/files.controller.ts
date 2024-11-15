import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Public } from 'src/decorator/customize';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api/v1/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Public()
  @Post('/upload')
  @UseInterceptors(FileInterceptor('fileUpload'))
  uploadFile(@UploadedFile(
    // validate upload file
    new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: /^(jpg|jpeg|application\/pdf|image\/png|doc|docx)$/i
    })
    .addMaxSizeValidator({
      maxSize: 100 * 1024 * 1024
    })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    })
  ) file: Express.Multer.File) {
    return {
      message: 'Upload single file successfully',
      fileName: file.filename
    }
  }
}
