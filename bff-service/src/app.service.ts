import {CACHE_MANAGER, HttpStatus, Inject, Injectable, Scope} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import axios, {AxiosRequestConfig} from 'axios';
import { Cache } from 'cache-manager';

@Injectable({ scope: Scope.REQUEST })
export class AppService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}
  async getResponceFromBackend() {
    console.log('originalUrl', this.request.originalUrl);
    console.log('method', this.request.method);
    console.log('body', this.request.body);

    const recipient = this.request.originalUrl.split('/')[1];
    console.log('recipient', recipient);

    const recipientUrl = process.env[recipient];
    console.log('recipientUrl', recipientUrl);

    if (this.request.originalUrl === '/products' && this.request.method === 'GET') {
      const productsListFromCache = await this.cacheManager.get('productsList');
      console.log('cache status', !!productsListFromCache)
      if (productsListFromCache) {
        return {status: HttpStatus.OK, data: productsListFromCache}
      }
    }

    if (recipientUrl) {
      const axiosConfig: AxiosRequestConfig = {
        //@ts-ignore
        method: this.request.method,
        url: `${recipientUrl}${this.request.originalUrl}`,
        ...(Object.keys(this.request.body || {}).length > 0 && {data: this.request.body})
      }
      console.log('axiosConfig', axiosConfig)

      try {
        const response = await axios(axiosConfig)
        if (this.request.originalUrl === '/products' &&
          this.request.method === 'GET' &&
          !await this.cacheManager.get('productsList')) {
          await this.cacheManager.set('productsList', response.data, { ttl: 120 });
          console.log('cache set')
        }
        return {status: response.status, data: response.data}
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response
          return {status: status, data}
        } else {
          return {status: HttpStatus.INTERNAL_SERVER_ERROR, data: {message: 'Internal server error'}}
        }
      }
    } else {
      return {status: HttpStatus.BAD_GATEWAY, data: {message: 'Cannot process request'}}
    }
  }
}
