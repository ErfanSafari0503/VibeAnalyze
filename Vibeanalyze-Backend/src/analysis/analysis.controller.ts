import { Controller, Get, Post, Body, Param, Delete, StreamableFile, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { AnalysisService } from './services/analysis.service';
import { createReadStream, promises } from 'fs';
import { basename, extname, join } from 'path';
import { lookup } from 'mime-types';

@ApiTags('analysis')
@Controller('analysis')
export class AnalysisController {

  constructor(private readonly analysisService: AnalysisService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new analysis' })
  @ApiResponse({
    status: 201,
    description: 'Analysis created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid URL or format' })
  @ApiBody({ type: CreateAnalysisDto })
  create(@Body() createAnalysisDto: CreateAnalysisDto) {
    return this.analysisService.create(createAnalysisDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get analysis by ID' })
  @ApiParam({ name: 'id', description: 'Analysis ID' })
  @ApiResponse({
    status: 200,
    description: 'Analysis found',
  })
  @ApiResponse({ status: 404, description: 'Analysis not found' })
  findOne(@Param('id') id: string) {
    return this.analysisService.findOne(id);
  }

  @Get(':id/post')
  @ApiOperation({ summary: 'Get post for an analysis' })
  @ApiParam({ name: 'id', description: 'Analysis ID' })
  @ApiResponse({
    status: 200,
    description: 'post retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Analysis not found' })
  post(@Param('id') id: string) {
    return this.analysisService.post(id);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments for an analysis' })
  @ApiParam({ name: 'id', description: 'Analysis ID' })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Analysis not found' })
  comments(@Param('id') id: string) {
    return this.analysisService.comments(id);
  }

  @Get('thumbnails/:filename')
  @ApiOperation({ summary: 'Get a thumbnail by filename' })
  @ApiParam({ name: 'filename', description: 'Name of the thumbnail file' })
  @ApiResponse({
    status: 200,
    description: 'Thumbnail retrieved successfully',
    schema: { type: 'string', format: 'binary' },
  })
  @ApiResponse({ status: 404, description: 'Thumbnail file not found' })
  async getThumbnail(@Param('filename') filename: string): Promise<StreamableFile> {

    const safeFilename = basename(filename);

    const filePath = join(process.env.THUMBNAIL_DIRECTORY_PATH, safeFilename);

    try {

      await promises.access(filePath, promises.constants.R_OK);

      const mimeType = lookup(extname(safeFilename)) || 'application/octet-stream';

      const stream = createReadStream(filePath);

      return new StreamableFile(stream, {
        type: mimeType,
        disposition: `inline; filename="${safeFilename}"`,
      });
    } catch (error) {
      throw new NotFoundException('Thumbnail file not found');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel an analysis' })
  @ApiParam({ name: 'id', description: 'Analysis ID' })
  @ApiResponse({ status: 200, description: 'Analysis cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Analysis not found' })
  remove(@Param('id') id: string) {
    return this.analysisService.remove(id);
  }
}
