import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TcpService } from '@common/config/tcp.config';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-request-message';
import { ProcessId } from '@common/decorators/processId.decorator';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { CreateProductRequestDto, ProductResponseDto } from '@common/interfaces/gateway/product';
import { ProductTcpResponse, CreateProductTcpRequest } from '@common/interfaces/tcp/product';
import { map } from 'rxjs';
import { Authorization } from '@common/decorators/authorize.decorator';
import { AuthorizedMetadata } from '@common/interfaces/tcp/authorize';
import { UserData } from '@common/decorators/user-data.decorator';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    @Inject(TcpService.PRODUCT_SERVICE)
    private readonly productClient: TcpClient,
  ) {}

  @Post('')
  @ApiOkResponse({ type: ResponseDto<ProductResponseDto> })
  @ApiOperation({ summary: 'Create a new product' })
  createProduct(@Body() body: CreateProductRequestDto, @ProcessId() processId: string) {
    return this.productClient
      .send<ProductTcpResponse, CreateProductTcpRequest>(TCP_REQUEST_MESSAGE.PRODUCT.CREATE, {
        data: body,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Get()
  @ApiOkResponse({ type: ResponseDto<ProductResponseDto[]> })
  @ApiOperation({ summary: 'Get list products' })
  @Authorization({ secured: true })
  getList(@ProcessId() processId: string, @UserData() userData: AuthorizedMetadata) {
    Logger.debug({ userData });

    return this.productClient
      .send<ProductTcpResponse[]>(TCP_REQUEST_MESSAGE.PRODUCT.GET_LIST, { processId })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
